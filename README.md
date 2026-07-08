# Landing page — Amaro Consultoria e Toxicológico

Landing page estática, mobile-first e sem build para GitHub Pages. O projeto usa apenas HTML, CSS e JavaScript nativos, com foco em conversão via WhatsApp, SEO local, performance em iPhone/Android e tracking em `dataLayer`.

## Estrutura

```text
index.html
css/style.css
js/main.js
assets/
  logo-amaro.webp
  amaro-hero.webp
  amaro-specialist.webp
  google-icon.webp
robots.txt
sitemap.xml
```

## Executar localmente

O `index.html` funciona direto no navegador, mas o ideal é usar um servidor estático simples na raiz.

Exemplos:

```powershell
python -m http.server 8000
```

ou

```powershell
npx serve .
```

Depois acesse:

- `http://localhost:8000/`

## Assets atuais

- `assets/logo-amaro.webp`: logo principal usada em navbar, preloader, watermarks, favicon e blocos institucionais.
- `assets/amaro-hero.webp`: imagem recortada com fundo transparente usada no hero.
- `assets/amaro-specialist.webp`: retrato usado na seção institucional da Amaro e no Open Graph.
- `assets/google-icon.webp`: ícone usado na seção Google e nos cards de avaliações.

Se algum nome ou extensão mudar, atualize as referências em `index.html`.

## Onde alterar contatos e links

### WhatsApp

O número principal está centralizado em `js/main.js`:

```js
const WHATSAPP_NUMBER = '5521965960143';
```

Mensagens padrão também ficam em `js/main.js`:

- `DEFAULT_WHATSAPP_MESSAGE`
- `CHATBOT_WHATSAPP_MESSAGE`

Mensagens específicas podem ser alteradas direto no HTML com `data-whatsapp-message`.

### Instagram

Atualize em:

- `index.html`: links com classe `.js-instagram`
- `js/main.js`: constante `INSTAGRAM_URL`

### Google

O link do botão “Ver no Google” está em:

- `index.html`: botão com classe `.js-review`
- `js/main.js`: constante `GOOGLE_URL`

### Endereço

Atualize em:

- `index.html`: seção `#localizacao`, rodapé e `iframe` do mapa
- `js/main.js`: constante `ROUTES_URL`
- `index.html`: JSON-LD no `<head>`

## SEO e URLs finais

A URL esperada para GitHub Pages é:

- `https://pedroh99p-bot.github.io/amarodespachante/`

Se isso mudar, atualize:

- `index.html`: canonical, Open Graph, Twitter e JSON-LD
- `robots.txt`
- `sitemap.xml`

O favicon atual usa a própria logo da Amaro. Se você trocar o favicon ou a imagem de Open Graph, ajuste o `<head>` em `index.html`.

## Schema

O projeto usa:

- `LocalBusiness` com nome, telefone, endereço e horário informado
- `FAQPage` baseado nas perguntas visíveis na página

Não há `aggregateRating` no schema.

## Tracking / dataLayer

O site inicializa `window.dataLayer` em `js/main.js` e expõe:

```js
trackEvent(eventName, eventParams)
buildWhatsAppUrl(message)
```

Eventos atuais:

- `click_whatsapp`
- `click_instagram`
- `click_routes`
- `service_click`
- `faq_open`
- `quiz_start`
- `quiz_answer`
- `quiz_submit`
- `chatbot_open`
- `chatbot_close`
- `chatbot_question_click`
- `chatbot_whatsapp_click`
- `review_click`

### Testar eventos no console

1. Abra a página com DevTools.
2. Rode `window.dataLayer`.
3. Execute uma interação.
4. Rode `window.dataLayer.at(-1)` para inspecionar o último evento.

## Publicar no GitHub Pages

1. Envie os arquivos para a branch `main`.
2. No GitHub, abra `Settings > Pages`.
3. Em `Build and deployment`, selecione `Deploy from a branch`.
4. Escolha `main` e a pasta `/ (root)`.
5. Salve e aguarde a publicação.

URL esperada:

- `https://pedroh99p-bot.github.io/amarodespachante/`

## Checklist antes de publicar

- Validar a composição do hero em iPhone pequeno e Android narrow.
- Confirmar visual do bloco Google e consistência dos cards de avaliações.
- Testar mapa, botão de rotas e link do Google em aparelho real.
- Revisar compartilhamento do Open Graph.
- Confirmar dados exibidos na página com o cliente.
- Ativar GTM só quando o ID final estiver definido.
- Criar páginas reais de Política de Privacidade e Termos de Uso antes de campanhas pagas.
