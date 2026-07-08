# Landing page — Lorena Silva

Landing page estática, mobile-first e sem build para GitHub Pages. O projeto usa apenas HTML, CSS e JavaScript nativos, com foco em captação via WhatsApp, SEO básico, tracking em `dataLayer` e performance em telas pequenas.

## Estrutura

```text
index.html
css/style.css
js/main.js
assets/
  logo-lorena-silva.webp
  lorena-hero.webp
  lorena-specialist.webp
  combate-urbano-logo.webp
robots.txt
sitemap.xml
```

## Executar localmente

O `index.html` funciona diretamente no navegador, mas o ideal é usar um servidor estático simples na raiz do projeto.

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

- `assets/logo-lorena-silva.webp`: logo redonda principal usada em navbar, preloader, watermarks e favicon.
- `assets/lorena-hero.webp`: imagem recortada com fundo transparente usada no hero.
- `assets/lorena-specialist.webp`: retrato usado na seção especialista e Open Graph.
- `assets/combate-urbano-logo.webp`: logo institucional da seção Clube de Tiro Combate Urbano.

Se algum nome ou extensão mudar, atualize as referências em `index.html`.

## Onde alterar contatos e links

### WhatsApp

O número principal está centralizado em `js/main.js`:

```js
const WHATSAPP_NUMBER = '5534992524138';
```

Mensagens padrão também ficam em `js/main.js`:

- `DEFAULT_WHATSAPP_MESSAGE`
- `CHATBOT_WHATSAPP_MESSAGE`

Mensagens específicas de botões podem ser alteradas direto no HTML com `data-whatsapp-message`.

### Instagram da Lorena

Atualize em:

- `index.html`: links com classe `.js-instagram`
- `js/main.js`: constante `INSTAGRAM_URL`

### Instagram do Clube

Atualize em:

- `index.html`: links com classe `.js-club-instagram`
- `js/main.js`: constante `CLUB_INSTAGRAM_URL`

## SEO e URLs finais

As URLs finais atuais usam a rota esperada do GitHub Pages:

- `https://pedroh99p-bot.github.io/lorenasilvadespachante/`

Se isso mudar, atualize:

- `index.html`: canonical, Open Graph, Twitter e JSON-LD
- `robots.txt`
- `sitemap.xml`

O favicon atual usa a própria logo redonda. Se você trocar o favicon ou a imagem de Open Graph, ajuste o `<head>` em `index.html`.

## Schema

O projeto usa:

- `ProfessionalService` sem endereço inventado
- `FAQPage` baseado nas perguntas visíveis na landing

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
- `click_club_instagram`
- `service_click`
- `faq_open`
- `quiz_start`
- `quiz_answer`
- `quiz_submit`
- `chatbot_open`
- `chatbot_close`
- `chatbot_question_click`
- `chatbot_whatsapp_click`

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

- `https://pedroh99p-bot.github.io/lorenasilvadespachante/`

## Checklist antes de publicar

- Validar a composição do hero em iPhone pequeno e Android narrow.
- Conferir se a logo do clube está com destaque institucional, não promocional.
- Revisar o Open Graph em compartilhamento real.
- Confirmar os dados de autoridade exibidos na página.
- Revisar contraste em brilho alto no mobile.
- Ativar GTM apenas quando o ID final estiver definido.
- Criar as páginas finais de Política de Privacidade e Termos de Uso antes de campanhas pagas.
