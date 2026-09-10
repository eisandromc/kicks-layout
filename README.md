# KICKS Store — cinco implementações da mesma loja

A mesma loja de tênis, construída **cinco vezes**, mudando só a **camada de
apresentação (CSS)**. HTML semântico, dados e JavaScript são compartilhados —
assim dá para comparar, lado a lado, como cada técnica resolve o mesmo layout.

Abra `index.html` na raiz para escolher uma versão.

## Estrutura

```text
KICKS_Store/
├── index.html                  seletor das 5 versões (usa assets/selector.css)
├── assets/selector.css
├── shared/                      tudo que NÃO muda entre as versões
│   ├── data/produtos.js        catálogo — window.PRODUTOS (12 produtos)
│   ├── images/                  hero-product.png, product-01..12.png (fotos reais)
│   ├── js/
│   │   ├── app.js               regra de negócio (catálogo, carrinho, checkout…)
│   │   └── store-config.js      window.CONFIG_LOJA — WhatsApp, cupons, frete grátis
│   └── layouts/
│       ├── DESIGN_SYSTEM.md     tokens, paleta por versão, arquitetura do CSS
│       └── layout-base-kicks.png   mockup de referência
├── 01-css-classico/   float / inline-block / table — SEM flex e SEM grid
├── 02-css-grid/       CSS Grid como mecanismo principal
├── 03-css-flex/       Flexbox como mecanismo principal
├── 04-bootstrap/      componentes do Bootstrap 5 (CDN); style.css só customiza
└── 05-tailwind/       utilitários do Tailwind (CDN); style.css só customiza
```

Cada versão tem as **11 páginas**: `index`, `produtos`, `produto`, `favoritos`,
`carrinho`, `checkout`, `conta`, `sobre`, `contato`, `faq`, `politicas`.

## Como o CSS de cada versão é organizado

**Versões 01, 02 e 03 (CSS puro)** — `assets/css/style.css` tem duas partes:

1. **Base compartilhada** (idêntica nas três, exceto o `:root`): tokens, reset,
   tipografia, cabeçalho, hero, cards, botões, promoções, benefícios,
   newsletter, rodapé, páginas internas, toast e o botão fixo "voltar".
   Não usa `display:flex` nem `display:grid` (para a versão 01 continuar fiel).
2. **Seção `VERSÃO 0X`** no fim: só o mecanismo de layout da técnica.

**Versões 04 (Bootstrap) e 05 (Tailwind)** — o layout inteiro vem dos
**componentes / utilitários da própria biblioteca**, escritos direto no HTML
(navbar, row/col, card, form-control, accordion no Bootstrap; `flex`, `grid`,
`gap-*`, `bg-[var(--brand)]`, `lg:*` no Tailwind). O `style.css` dessas duas
pastas é **enxuto (~520 linhas)** e faz só:
- o **tema de cor** (`--brand`);
- o **acabamento dos blocos que o JavaScript compartilhado gera** (cards,
  detalhe do produto, carrinho, checkout, toast) — que o framework não alcança
  porque não tem classes próprias para eles;
- pequenos extras (ícones de benefício, botão "voltar", favorito).

O `README.md` de cada pasta detalha isso.

## Paleta: cada versão veste a loja INTEIRA com a sua cor

Onde o mockup de referência é "preto", a versão usa a **sua** cor.

| Pasta | Técnica | Cor | Token que muda |
| --- | --- | --- | --- |
| `01-css-classico` | float / inline-block / table | **vinho** `#7A2430` | `:root` (`--primary` = `--ink` = `--dark`) |
| `02-css-grid` | CSS Grid | **preto** `#111111` | `:root` |
| `03-css-flex` | Flexbox | **azul-marinho** `#0F2747` | `:root` |
| `04-bootstrap` | componentes do Bootstrap 5 | **roxo** `#6D28D9` | `--brand` + overrides `--bs-*` |
| `05-tailwind` | utilitários do Tailwind | **verde** `#0F766E` | `--brand` (usado em `bg-[var(--brand)]` …) |

Nas versões 01-03, `--ink` e `--dark` são `var(--primary)` (mesmo tom dos
CTAs) e `--primary-dark` (um degrau mais escuro) veste o botão de favorito.
Trocar a identidade de qualquer versão é editar só o `:root` do `style.css`.

## Recursos comuns a todas as páginas

- **`<title>` com o nome do estilo**: `Clássico - Home | KICKS`,
  `Grid - Produtos | KICKS`, `Flex - Carrinho | KICKS`…
- **Campo de busca** desenhado como uma pílula única, com o botão "Buscar"
  embutido (`position: absolute` dentro de `position: relative` — funciona em
  qualquer técnica).
- **Barra de benefícios** no rodapé da home com ícones SVG inline
  (`stroke: currentColor`, então herdam o tom da versão).
- **Botão de favorito** nos cards: coração branco preenchido (`♥`) sobre um
  fundo `--primary-dark` (um degrau mais escuro que o botão "Adicionar", que é
  `--primary`); quando o item está favoritado a classe `.is-active` clareia o
  fundo para `--primary`.
- **Botão fixo "voltar"** preso à direita da tela em toda página interna;
  recolhido mostra só a seta `←` e, no hover/foco, desliza revelando "Versões".
  Sempre aponta para `../index.html`.

## Dados e comportamento (compartilhados)

Todos os identificadores do JavaScript (variáveis, arrays, funções) estão **em
português**. Já os seletores `data-*` e as classes CSS são o "contrato" com o
HTML/CSS e permanecem iguais.

- `shared/data/produtos.js` — `window.PRODUTOS`, array de 12 produtos com chaves
  em português (`nome`, `marca`, `categoria`, `preco`, `precoAntigo`,
  `avaliacao`, `cores`, `tamanhos`, `descricao`, `diferenciais`, `destaque`,
  `imagem`…).
- `shared/js/app.js` — `renderizarDestaques`, `renderizarCatalogo`,
  `adicionarAoCarrinho`, `calcularTotais`, `renderizarCheckout` etc.
  Destaques, busca, filtros, favoritos, carrinho, cupons, resumo financeiro,
  conta local (localStorage) e a mensagem de pedido para o WhatsApp.
- `shared/js/store-config.js` — `window.CONFIG_LOJA`. Troque `numeroWhatsapp`
  para `55 + DDD + número`.

## Regras do projeto

1. HTML semântico; sem `<style>` e sem atributo `style` nos HTMLs.
2. CSS externo e separado por versão; JavaScript compartilhado.
3. CSS e JS legíveis, identados, não minificados e comentados.
4. Imagens reais dos produtos em `shared/images`, ligadas pelo catálogo.
5. Cada pasta tem um `README.md` focado na explicação do CSS daquela técnica.

## Executar

Na raiz do projeto:

```bash
python -m http.server 8080
```

Depois abra `http://localhost:8080`. As versões 04 e 05 precisam de internet
(Bootstrap / Tailwind via CDN).
