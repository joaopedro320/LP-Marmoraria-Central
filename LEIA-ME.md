# Marmoraria Central | Landing Page

Pacote pronto para deploy estático na Vercel (sem build step).

## Estrutura
```
index.html
css/style.css
js/main.js
img/            41 imagens WebP otimizadas (nenhuma repetida entre seções)
robots.txt
sitemap.xml
vercel.json
```

## Deploy
1. Suba a pasta inteira num repositório ou arraste na Vercel.
2. Framework Preset: **Other**. Build Command: vazio. Output Directory: `.`
3. Aponte o domínio e troque as URLs `https://www.marmorariacentral.com.br/` no `index.html` (canonical, OG, sitemap, JSON-LD) e no `sitemap.xml` e `robots.txt`.

## O que precisa ser trocado antes de publicar
| Onde | O quê |
|---|---|
| `index.html` (head e noscript) | `GTM-XXXXXXX` pelo container real do Google Tag Manager |
| `js/main.js` | `ENDPOINT` pelo link da implantação do Google Apps Script |
| `index.html` seção Alcance | `src` do iframe pelo embed oficial do Google Maps (Compartilhar > Incorporar um mapa, com `pb=`) |
| `index.html` seção Avaliações | link do botão pelo link curto real do perfil do Google Meu Negócio |
| `index.html` JSON-LD e rodapé | endereço completo, CEP e CNPJ (vieram em branco no briefing) |
| Ano de fundação | A logo diz DESDE 1984 e o briefing dizia 1986. A copy usa "quatro décadas" e "40+ anos" para não contradizer nenhum dos dois. Confirmar com o cliente |


## Eventos enviados ao dataLayer
- `clique_whatsapp` com `origem` (header, hero, material-quartzito, portfolio, rodape, flutuante)
- `envio_formulario` com `material` e `ambiente`

## Fluxo do formulário
Botão fica desabilitado até todos os campos obrigatórios estarem válidos. No envio: grava no Apps Script (`no-cors`) e redireciona para `wa.me/554197980740` com o resumo do lead na mensagem. Há um timeout de 3,5s que garante o redirecionamento mesmo se a planilha falhar.

## Decisões de conteúdo
- Quartzito e quartzo aparecem primeiro e com selo de destaque, conforme o briefing.
- Nenhuma foto ou menção a material de baixo valor agregado.
- Seção "Qual material usar em cada ambiente" mais bloco de tendências, que era o tema obrigatório.
- Avaliações reais exibidas individualmente, sem exibir contagem total nem nota agregada (o GMN tem poucas avaliações hoje).
- Tabela comparativa em HTML real, para ser extraída por buscadores e por IAs generativas.
