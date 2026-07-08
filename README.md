# Pietro Monteiro Landing Page

Landing page estática em HTML, CSS e JavaScript puro para GitHub Pages, com foco em captação responsável via WhatsApp para soluções jurídicas relacionadas ao universo CAC.

## Estrutura

- `index.html`
  Página principal, SEO, schema, FAQ visível, hero, serviços, quiz, especialista, parceria, autoridade com depoimentos, atendimento nacional, FAQ, CTA final, footer e botões flutuantes.
- `css/style.css`
  Tema premium azul-marinho com detalhes dourados, layout mobile-first, hero em duas colunas também no mobile, carrosséis, mapa nacional estilizado, chatbot, animações e responsividade.
- `js/main.js`
  Tracking `dataLayer`, quiz, chatbot, carrossel, reveal animations, counters e preloader.
- `assets/`
  Logos, fotos e ícones usados na landing.

## Assets usados

- `assets/logo-pietro-monteiro.webp`
  Logo principal usada na navbar, preloader, watermark do hero, watermark da seção especialista, favicon e footer.
- `assets/pietro-hero.webp`
  Foto principal do hero.
- `assets/pietro-specialist.webp`
  Foto principal da seção especialista.
- `assets/logo-mil-armas-rj.webp`
  Logo da seção de parceria Mil Armas RJ.
- `assets/google-icon.webp`
  Ícone visual para destacar os dados públicos do Mil Armas na seção de parceria.

## Onde trocar assets

- Navbar / preloader / watermark / favicon:
  [index.html](C:/Users/pedro/Documents/André Fernandes LP/index.html)
  Procure por `logo-pietro-monteiro.webp`.
- Hero:
  Procure por `pietro-hero.webp`.
- Seção especialista:
  Procure por `pietro-specialist.webp`.
- Parceria Mil Armas:
  Procure por `logo-mil-armas-rj.webp`.
- Open Graph / Twitter image:
  Atualize as metas no `<head>` em [index.html](C:/Users/pedro/Documents/André Fernandes LP/index.html).

## Onde alterar links

- WhatsApp principal:
  [js/main.js](C:/Users/pedro/Documents/André Fernandes LP/js/main.js)
  Constante `WHATSAPP_URL`.
- Instagram do Pietro:
  [js/main.js](C:/Users/pedro/Documents/André Fernandes LP/js/main.js)
  Constante `INSTAGRAM_URL`.
- Instagram do Mil Armas:
  [js/main.js](C:/Users/pedro/Documents/André Fernandes LP/js/main.js)
  Constante `PARTNER_INSTAGRAM_URL`.

Os links no HTML também já apontam para esses destinos e são sincronizados novamente pelo JS.

## Como funciona o WhatsApp

O projeto usa `https://wa.me/message/GRJNWYSXDF64D1` como link principal de contato.

Como esse formato não usa número direto, as mensagens personalizadas:

- continuam preparadas no JS via `data-prepared-message`;
- aparecem visualmente no quiz quando o usuário conclui as respostas;
- podem ser migradas facilmente para URL com `text=` no futuro, caso um número completo seja informado.

## Tracking e dataLayer

Eventos mantidos:

- `click_whatsapp`
- `click_instagram`
- `service_click`
- `quiz_start`
- `quiz_answer`
- `quiz_submit`
- `chatbot_open`
- `chatbot_close`
- `chatbot_question_click`
- `chatbot_whatsapp_click`
- `faq_open`

Evento adicionado:

- `click_partner_instagram`
- `authority_carousel_interaction`
- `testimonial_carousel_interaction`

Contrato enviado:

- `event`
- `service_name`
- `cta_location`
- `link_url`
- `question_id`
- `quiz_step`
- `quiz_question`
- `quiz_answer`
- `page_type`

## Como testar o dataLayer

1. Abra a landing localmente.
2. No console do navegador, rode:

```js
window.dataLayer
```

3. Clique nos CTAs, responda o quiz, abra o chatbot e expanda o FAQ.
4. Verifique os objetos empurrados para o array.

## SEO

Arquivos/locais relevantes:

- `<title>`, descrição, canonical, OG e Twitter:
  [index.html](C:/Users/pedro/Documents/André Fernandes LP/index.html)
- Schema `LegalService` e `FAQPage`:
  [index.html](C:/Users/pedro/Documents/André Fernandes LP/index.html)
- `robots.txt`:
  [robots.txt](C:/Users/pedro/Documents/André Fernandes LP/robots.txt)
- `sitemap.xml`:
  [sitemap.xml](C:/Users/pedro/Documents/André Fernandes LP/sitemap.xml)

## URL final do projeto

URL configurada atualmente:

- `https://pedroh99p-bot.github.io/pietromonteiroadv/`

Se a URL pública mudar, atualize:

- `canonical`
- `og:url`
- `og:image`
- `twitter:image`
- schema `@id`, `url`, `image`
- `robots.txt`
- `sitemap.xml`

## Publicação no GitHub Pages

1. Envie o branch para o repositório remoto.
2. No GitHub, abra `Settings > Pages`.
3. Configure a origem para o branch principal (`main`) e a raiz do repositório.
4. Aguarde a publicação.

## Servidor local simples

Com Python:

```powershell
C:\Users\pedro\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 8000
```

Depois acesse:

```text
http://127.0.0.1:8000/
```
