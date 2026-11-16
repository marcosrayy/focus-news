const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const vm=require('node:vm');
const ts=require('typescript');
const crypto=require('node:crypto');
const root=process.cwd();
function loadEnvironment(env={},overrides={}) {
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'focus-cms-test-'));
 const cache=new Map();let cookie;
 function load(name) {
  if(name in overrides)return overrides[name];
  if(name==='server-only')return {};
  if(name==='next/headers')return {cookies:async()=>({get:()=>cookie?{value:cookie}:undefined})};
  if(!name.startsWith('@/'))return require(name);
  let file=path.join(root,name.slice(2));
  if(!path.extname(file))file+='.ts';
  if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  vm.runInNewContext(code,{module,exports:module.exports,require:load,process:{cwd:()=>directory,env},Buffer,URL,console,Date,setTimeout,clearTimeout});
  return module.exports;
 }
 return {load,setCookie:value=>cookie=value,cleanup:()=>fs.rmSync(directory,{recursive:true,force:true})};
}
test('publication persists atomically, rejects stale edits and isolates other storage',async()=>{
 const context=loadEnvironment();
 try {
  const store=context.load('@/lib/focus-store');const initial=await store.readFocusDocument();
  assert.equal(initial.revision,0);
  const content=JSON.parse(JSON.stringify(initial.content));content.cards[0].title='Evento publicado';
  const saved=await store.publishFocus(content,0);assert.equal(saved.revision,1);
  assert.equal((await store.readFocusDocument()).content.cards[0].title,'Evento publicado');
  await assert.rejects(()=>store.publishFocus(content,0),store.PublishConflict);
  assert.equal((await store.readFocusDocument()).revision,1);
  await assert.rejects(()=>store.writeFocusRecord('../news_db',{}));
 }finally{context.cleanup()}
});
test('schema rejects script URLs, unexpected scopes and duplicate IDs',()=>{
 const context=loadEnvironment();try{const {focusContentSchema,defaultFocusContent}=context.load('@/lib/focus-content');
 for(const patch of [c=>c.cards[0].link='javascript:alert(1)',c=>c.gallery[0].src='//evil.test/x.png',c=>c.cards[0].image='/../.env',c=>c.otherTab={},c=>c.cards.push(c.cards[0])]){const c=JSON.parse(JSON.stringify(defaultFocusContent));patch(c);assert.equal(focusContentSchema.safeParse(c).success,false)}
 }finally{context.cleanup()}
});
test('sessions require valid credentials, expire, and are revoked on logout',async()=>{
 const salt='a'.repeat(32);const password='temporary-test-password';const hash=crypto.scryptSync(password,salt,64).toString('hex');
 const context=loadEnvironment({FOCUS_ADMIN_PASSWORD_HASH:`${salt}:${hash}`});try{const auth=context.load('@/lib/focus-auth');
 assert.equal(auth.verifyPassword('wrong'),false);assert.equal(auth.verifyPassword(password),true);
 assert.equal(await auth.isAdmin(),false);const token=await auth.newSession();context.setCookie(token);assert.equal(await auth.isAdmin(),true);
 await auth.endSession();assert.equal(await auth.isAdmin(),false);
 const expired=await auth.newSession();context.setCookie(expired);const store=context.load('@/lib/focus-store');const key='session-'+crypto.createHash('sha256').update(expired).digest('hex');const record=await store.readFocusRecord(key);await store.writeFocusRecord(key,{...record,expires:Date.now()-1});assert.equal(await auth.isAdmin(),false);
 assert.equal(auth.sameOrigin(new Request('http://localhost/api',{headers:{origin:'https://evil.test'}})),false);
 assert.equal(auth.sameOrigin(new Request('http://localhost/api',{headers:{origin:'http://localhost'}})),true);
 for(let i=0;i<10;i++)assert.equal(await auth.loginAllowed(),true);assert.equal(await auth.loginAllowed(),false);
 }finally{context.cleanup()}
});
test('body reader enforces actual size even without Content-Length',async()=>{
 const context=loadEnvironment();try{const {boundedBody}=context.load('@/lib/focus-http');
 assert.equal((await boundedBody(new Request('http://localhost',{method:'POST',body:'abc'}),3)).toString(),'abc');
 await assert.rejects(()=>boundedBody(new Request('http://localhost',{method:'POST',body:'abcd'}),3),/TOO_LARGE/);
 }finally{context.cleanup()}
});
test('only Focus page consumes the CMS document',()=>{
 const pages=fs.readdirSync('app',{withFileTypes:true}).filter(entry=>entry.isDirectory()&&!['focus','admin'].includes(entry.name));
 for(const page of pages){const file=path.join('app',page.name,'page.tsx');if(fs.existsSync(file))assert.doesNotMatch(fs.readFileSync(file,'utf8'),/readFocusDocument/)}
 assert.match(fs.readFileSync('app/focus/page.tsx','utf8'),/readFocusDocument/);
});

test('remote mode uses separate keys and compare-and-swap without local fallback',async()=>{
 const records=new Map();
 const transport={REMOTE_ENABLED:true,remoteCommand:async command=>{
  const [operation,key,...args]=command;
  if(operation==='GET')return records.get(key)||null;
  if(operation==='SET'){records.set(key,args[0]);return 'OK'}
  if(operation==='EVAL'){
   const [,name,revision,document]=args;
   if(key.includes("local current=")){const saved=JSON.parse(records.get(name)||'{"revision":0}');if(saved.revision!==revision)return 0;records.set(name,document);return 1}
   const count=Number(records.get(name)||0)+1;records.set(name,count);return count;
  }
  throw new Error('Unexpected command');
 }};
 const context=loadEnvironment({}, {'@/utils/storage':transport});
 try{const store=context.load('@/lib/focus-store');const initial=await store.readFocusDocument();const saved=await store.publishFocus(initial.content,0);assert.equal(saved.revision,1);await assert.rejects(()=>store.publishFocus(initial.content,0),store.PublishConflict);assert.equal((await store.readFocusDocument()).revision,1);assert.ok(records.has('focus-news:focus-cms:published'));assert.ok(!records.has('focus-news:articles'));for(let i=0;i<10;i++)assert.equal(await store.consumeLoginAttempt(),true);assert.equal(await store.consumeLoginAttempt(),false);
 transport.remoteCommand=async()=>{throw new Error('Redis unavailable')};await assert.rejects(()=>store.readFocusDocument(),/Redis unavailable/);
 }finally{context.cleanup()}
});
