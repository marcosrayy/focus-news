# Administração da aba Focus

O painel fica em `/admin/focus` (também acessível por `/admin`). É exclusivo para banners, cards de **Próximos eventos / Workshops & treinamentos** e **Galeria & cobertura**. Indicadores, timeline, ticker e notícias das outras abas não são editados por ele.

## Acesso

Execute `node scripts/setup-focus-admin.cjs` na raiz do aplicativo e reinicie o Next.js. A senha aleatória fica em `.focus-admin-access.local.txt`, ignorado pelo Git. O servidor recebe apenas `FOCUS_ADMIN_PASSWORD_HASH` em `.env.local`. Nenhuma senha padrão é aceita. Para produção, configure essa variável no ambiente do host e entregue a senha por um canal privado. Não publique o arquivo de acesso. A troca do hash invalida as sessões anteriores.

As páginas administrativas verificam a sessão no servidor; leitura administrativa, publicação e upload também exigem sessão. Cookies são HttpOnly e SameSite=Strict (Secure em HTTPS), expiram em oito horas e são revogados ao sair. Operações de escrita exigem Origin igual ao servidor. Há limite persistente de tentativas de login. O acesso usa uma única credencial de administração, pois o Focus News não tinha usuários, papéis ou autenticação para reaproveitar.

## Editar e publicar

Escolha Banners, Cards ou Galeria. Selecione um item para editar e use as setas para mudar a ordem. Cards podem ser movidos entre eventos e workshops; cada seção mantém a ordem relativa do painel. Uploads aceitam JPEG, PNG e WebP de até 5 MB e 25 milhões de pixels. O servidor decodifica e converte para WebP, com lado máximo de 2400 px; nomes de arquivos enviados nunca são usados como caminhos. Para os banners, envie arte desktop e mobile (4:5) separadamente.

A prévia dos cards usa os mesmos componentes da página pública. **Salvar e publicar** publica as três áreas juntas. Editar ou enviar arquivos não muda a página pública. Remover um item só o remove da aba Focus após a publicação; não apaga arquivos originais que possam ser usados em outras páginas. Os uploads são imutáveis e não substituem arquivos compartilhados. Uploads não usados permanecem armazenados; não há exclusão automática de mídia.

Ao sair ou recarregar com alterações pendentes, o navegador pede confirmação. O rascunho é mantido somente na sessão aberta do editor. Publicações concorrentes retornam conflito (409), sem substituir a versão mais recente; recarregue antes de editar novamente.

## Armazenamento e implantação

Reaproveita o transporte REST Redis/Upstash de `utils/storage.ts`, com namespace separado `focus-news:focus-cms:*`. As mesmas variáveis `KV_REST_API_URL` / `KV_REST_API_TOKEN` ou `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` ativam armazenamento remoto. Nesse modo, documento, sessões, limite de login e imagens são persistidos no Redis. Imagens são servidas em `/api/focus/media/[id]` sem permitir paths fornecidos pelo cliente. Preveja espaço para mídia e uploads não utilizados.

Sem Redis, os mesmos registros são gravados em `data/focus-cms/`, com troca atômica do documento e lock de publicação. Esse diretório precisa ser gravável e estar em volume persistente. O modo local é para **um host**; em serverless ou múltiplas instâncias, configure Redis. O conteúdo original migrado está em `config/focus-defaults.json` e só é usado antes da primeira publicação. Falhas no armazenamento geram erro, sem substituir conteúdo salvo por defaults silenciosamente.

Faça backup de `data/focus-cms/` no modo local, ou do namespace Redis no modo remoto. A página `/focus` é dinâmica e lê a última publicação a cada acesso; publicar também revalida apenas essa rota. Outras abas e seus componentes compartilhados não recebem a configuração da Focus.

## Validação

`node --test tests/focus-cms.cjs` valida schema, publicação com conflito e persistência local, sessão/revogação, limites de upload e isolamento de referências. `node tests/focus-cms-flow.cjs` testa o servidor local configurado (porta 3000 ou `FOCUS_TEST_URL`): acesso negado sem sessão, login, uploads, publicação em cada área, leitura após recarga, comparação das outras abas e restauração do conteúdo anterior. As credenciais são lidas apenas do arquivo de acesso local, sem impressão em logs.
