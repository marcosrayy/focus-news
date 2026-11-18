const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.FOCUS_TEST_URL||'http://localhost:3000';
const origin=new URL(base).origin;
const access=fs.readFileSync('.focus-admin-access.local.txt','utf8');
const password=access.match(/Senha: (.+)/)[1].trim();
let cookie='';let document;let original;let changed=false;
async function call(path,options={}) {
 const response=await fetch(base+path,{...options,headers:{...options.headers,...(cookie?{Cookie:cookie}:{}),Origin:origin},signal:AbortSignal.timeout(120000)});
 return response;
}
async function publish(content,revision=document.revision){const r=await call('/api/admin/focus',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({content,revision})});const result=await r.json();assert.equal(r.status,200,JSON.stringify(result));document=result;changed=true;return result}
function headings(html){return [...html.matchAll(/<h[12][^>]*>(.*?)<\/h[12]>/gs)].map(m=>m[1].replace(/<[^>]+>/g,'').replace(/\d+/g,'#')).join('|')}
(async()=>{
 const unauth=await call('/api/admin/focus');assert.equal(unauth.status,401);
 assert.equal((await call('/api/admin/focus/upload',{method:'POST'})).status,401);
 assert.equal((await call('/api/admin/focus',{method:'PUT'})).status,401);
 const page=await fetch(base+'/admin/focus',{redirect:'manual'});assert.equal(page.status,307);assert.match(page.headers.get('location'),/login/);
 const login=await call('/api/admin/focus/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});assert.equal(login.status,200,await login.clone().text());cookie=login.headers.get('set-cookie').split(';')[0];assert.match(login.headers.get('set-cookie'),/HttpOnly/i);assert.match(login.headers.get('set-cookie'),/SameSite=strict/i);
 const admin=await call('/admin/focus');assert.equal(admin.status,200);const adminHtml=await admin.text();for(const label of ['Salvar e publicar','Banners','Cards','Galeria','Prévia'])assert.ok(adminHtml.includes(label),label);
 document=await (await call('/api/admin/focus')).json();original=structuredClone(document.content);console.log('PASS: protected admin page and session.');
 const outside=['/','/dev','/tecnologia','/startups','/economia','/ia','/business','/inovacao','/trade'];const before={};
 for(const route of outside){const r=await call(route);assert.equal(r.status,200,route);before[route]=headings(await r.text());}console.log('PASS: baseline captured for 9 other pages.');
 const foreign=await fetch(base+'/api/admin/focus',{method:'PUT',headers:{Cookie:cookie,Origin:'https://outside.example','Content-Type':'application/json'},body:'{}'});assert.equal(foreign.status,403);
 const invalid=structuredClone(document.content);invalid.cards[0].link='javascript:alert(1)';assert.equal((await call('/api/admin/focus',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:invalid,revision:document.revision})})).status,400);
 const svg=new FormData();svg.set('file',new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'],{type:'image/svg+xml'}),'test.svg');assert.equal((await call('/api/admin/focus/upload',{method:'POST',body:svg})).status,400);
 const oversized=new FormData();oversized.set('file',new Blob([new Uint8Array(5*1024*1024+1)],{type:'image/png'}),'large.png');assert.equal((await call('/api/admin/focus/upload',{method:'POST',body:oversized})).status,400);
 const upload=new FormData();upload.set('file',new Blob([fs.readFileSync('public/workshop.jpg')],{type:'image/jpeg'}),'../../do-not-use-name.jpg');const uploadResponse=await call('/api/admin/focus/upload',{method:'POST',body:upload});assert.equal(uploadResponse.status,201,await uploadResponse.clone().text());const {url}=await uploadResponse.json();const media=await call(url);assert.equal(media.status,200);assert.equal(media.headers.get('content-type'),'image/webp');assert.ok((await media.arrayBuffer()).byteLength>0);
 let content=structuredClone(document.content);const staleRevision=document.revision;
 content.banners.reverse();content.banners[0].image=url;content.banners[0].mobileImage=url;content.banners[0].title='FOCUS-CMS-BANNER-TEST';content.banners[1].active=false;await publish(content);
 let focusHtml=await (await call('/focus')).text();assert.ok(focusHtml.includes('FOCUS-CMS-BANNER-TEST'));assert.ok(focusHtml.includes(url));assert.ok(!focusHtml.includes('alt="'+content.banners[1].title+'"'));
 const stale=await call('/api/admin/focus',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({content,revision:staleRevision})});assert.equal(stale.status,409,await stale.text());
 content=structuredClone(document.content);content.cards.unshift({...content.cards[0],id:'test-card',title:'FOCUS-CMS-CARD-TEST',text:'Texto publicado na validação',image:url,link:'https://example.com/focus-test'});await publish(content);
 focusHtml=await (await call('/focus')).text();assert.ok(focusHtml.includes('FOCUS-CMS-CARD-TEST'));assert.ok(focusHtml.includes('https://example.com/focus-test'));assert.ok(focusHtml.includes('Texto publicado na validação'));
 content=structuredClone(document.content);content.gallery.unshift({...content.gallery[0],id:'test-photo',src:url,label:'FOCUS-CMS-GALLERY-TEST',alt:'FOCUS-CMS-GALLERY-TEST'});await publish(content);
 focusHtml=await (await call('/focus')).text();assert.ok(focusHtml.includes('FOCUS-CMS-GALLERY-TEST'));const fresh=await(await call('/api/admin/focus')).json();assert.deepEqual(fresh.content,document.content);
 for(const route of outside){const r=await call(route);assert.equal(r.status,200);const html=await r.text();assert.equal(headings(html),before[route],route+' headings changed');assert.ok(!html.includes('FOCUS-CMS-CARD-TEST'),route);assert.ok(!html.includes('FOCUS-CMS-GALLERY-TEST'),route);assert.ok(!html.includes('FOCUS-CMS-BANNER-TEST'),route);}
 console.log('PASS: login, protected page/API/upload, cross-origin rejection, invalid URL/type/size, image upload, banner/card/gallery publication, conflict, reload persistence, and isolation across 9 other pages.');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{
 if(changed&&original){try{await publish(original);assert.deepEqual((await(await call('/api/admin/focus')).json()).content,original);console.log('PASS: original content restored after validation.')}catch(e){console.error('RESTORE FAILED',e);process.exitCode=1}}
 if(cookie){const token=cookie;await call('/api/admin/focus/session',{method:'DELETE'});const denied=await fetch(base+'/api/admin/focus',{headers:{Cookie:token}});assert.equal(denied.status,401);console.log('PASS: logout revokes the server session.');}
});
