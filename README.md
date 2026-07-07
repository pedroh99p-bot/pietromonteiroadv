# Landing page — André Fernandes Documentalista

Landing page estática, mobile-first e sem processo de build. O projeto usa somente HTML, CSS e JavaScript nativos e pode ser publicado diretamente no GitHub Pages.

## Estrutura

```text
index.html
css/style.css
js/main.js
assets/
  placeholder-logo.svg
  placeholder-andre-hero.svg
  placeholder-andre-especialista.svg
  placeholder-map.svg
robots.txt
sitemap.xml
```

## Executar localmente

O `index.html` funciona diretamente no navegador. Para reproduzir o comportamento do GitHub Pages, é preferível iniciar um servidor estático na raiz do projeto:

```powershell
python -m http.server 8000
```

Depois acesse:

- `http://localhost:8000/`
- `http://localhost:8000/?servico=visto`
- `http://localhost:8000/?servico=veicular`

## Publicar no GitHub Pages

1. Envie os arquivos para a branch principal do repositório.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Selecione a branch principal e a pasta `/ (root)`.
5. Salve e aguarde a URL de publicação.
6. Atualize canonical, Open Graph, schema, `robots.txt` e `sitemap.xml` com essa URL.

Todos os caminhos internos são relativos e funcionam em repositórios publicados como subdiretório no GitHub Pages.

## Substituir os assets

- `assets/placeholder-logo.svg`: logo principal e favicon.
- `assets/placeholder-andre-hero.svg`: foto recortada usada no hero. Preserve uma proporção próxima de 5:6 e fundo transparente.
- `assets/placeholder-andre-especialista.svg`: foto da seção do especialista. Preserve proporção próxima de 8:9.
- `assets/placeholder-map.svg`: imagem estática do mapa. Pode ser trocada por WebP otimizado.

Se o nome ou a extensão dos arquivos mudar, atualize as referências em `index.html` e `css/style.css`. Mantenha `width` e `height` nas tags de imagem para evitar mudanças de layout.

## Configurar Google Tag Manager

Em `index.html`, procure por `GTM-XXXXXXX`. Há dois blocos comentados:

1. script do GTM no `<head>`;
2. iframe `noscript` no fim do `<body>`.

Substitua o ID e descomente os dois blocos. O site inicializa `window.dataLayer` uma única vez em `js/main.js` e expõe estas funções:

```js
trackEvent(eventName, eventParams)
buildWhatsAppUrl(message)
```

Eventos implementados:

- `click_whatsapp`
- `click_call`
- `click_routes`
- `switch_visto`
- `switch_veicular`
- `service_click`
- `quiz_start`
- `quiz_answer`
- `quiz_submit`
- `review_click`
- `faq_open`

### Testar eventos no console

1. Abra a página e as ferramentas de desenvolvedor.
2. No Console, execute `window.dataLayer` para ver todos os eventos.
3. Antes de uma interação, execute `window.dataLayer.length`.
4. Clique no elemento que deseja testar.
5. Execute `window.dataLayer.at(-1)` para inspecionar o último evento.

Depois de ativar o GTM, use também o modo Preview do Tag Assistant para validar variáveis e acionadores.

## Itens que exigem substituição

### URL final e canonical

Procure por `https://SEU-DOMINIO.com/` em:

- `index.html`;
- `robots.txt`;
- `sitemap.xml`.

Atualize também `og:url`, `og:image`, `twitter:image`, `@id`, `url` e `image` do JSON-LD.

### Google Maps

Em `index.html`, procure pelo comentário `TODO: substituir pelo link curto oficial do Google Maps`. Troque o link de pesquisa pelo link confirmado do Google Business Profile ou pela URL de rotas.

### Avaliações

Procure pelo comentário `PLACEHOLDERS` em `index.html`. Substitua os três textos provisórios apenas por avaliações reais, verificadas e autorizadas. Confirme também a nota e a quantidade atual de avaliações.

`aggregateRating` foi intencionalmente omitido do schema. Não o adicione sem validar a origem e a conformidade dos dados com as diretrizes do Google.

### Política de Privacidade e Termos

Os links do rodapé ainda são placeholders. Crie os documentos finais antes de ativar tags publicitárias e publicar campanhas.

## Contextos de campanha

A URL define o contexto inicial e tem prioridade sobre `sessionStorage`:

- `?servico=visto`
- `?servico=veicular`

Sem parâmetro, a última escolha da sessão é usada; se não houver escolha, o modo inicial é `visto`.

## Checklist antes de publicar

- Inserir logo e fotos finais otimizadas.
- Confirmar nome empresarial, endereço, telefone e Instagram.
- Confirmar nota e quantidade de avaliações.
- Inserir link direto das avaliações e link oficial de rotas.
- Trocar todas as URLs placeholder.
- Criar Política de Privacidade e Termos de Uso.
- Inserir GTM e configurar consentimento conforme a estratégia jurídica/LGPD.
- Validar os eventos no Tag Assistant.
- Revisar a elegibilidade das campanhas na política de documentos e serviços governamentais do Google Ads.
- Testar em aparelhos reais, principalmente em 4G e telas pequenas.
- Executar Lighthouse e validar dados estruturados antes da indexação.
