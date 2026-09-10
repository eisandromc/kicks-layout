# KICKS — 01 · CSS Clássico

Layout construído **sem Flexbox e sem CSS Grid**. Só recursos que já existiam
antes de 2015: `float`, `display: inline-block`, `display: table` / `table-cell`,
larguras em `%`, `vertical-align` e `clearfix`. É a versão que mostra *por que*
Grid e Flexbox foram inventados.

Paleta: **vinho**. `--primary: #7A2430` e, no mesmo tom, `--ink` e `--dark`
(`--ink: var(--primary)`). `--primary-dark: #591a22` é o botão de favorito.

---

## 1. Como o `style.css` está dividido

- **Base compartilhada** (linhas 1 → ~1090): tokens, tipografia e todos os
  componentes. Essa base **não contém** `display:flex` nem `display:grid` —
  justamente para não "trapacear" nesta versão.
- **Seção `VERSÃO 01`** (final do arquivo): todo o mecanismo de layout clássico.

Comece a leitura pelo comentário `/* VERSÃO 01 - CSS CLÁSSICO */`.

## 2. Três ferramentas, três papéis

| Recurso | Onde é usado | Por quê |
| --- | --- | --- |
| `display: table` / `table-cell` | cabeçalho | células distribuem a largura sozinhas e **ignoram o espaço em branco** entre as tags |
| `float` | colunas grandes (hero, promo, carrinho, checkout, detalhe, rodapé) | tira o elemento do fluxo e o "encosta" num lado |
| `inline-block` | listas de itens (categorias, cards, benefícios, stats, filtros) | mantém itens lado a lado respeitando `width` em `%` |

Todo container que usa `float` recebe um **clearfix** para recuperar a altura:

```css
.hero-layout::after,
.promo-layout::after,
/* … */
.cart-item::after {
    content: '';
    display: table;
    clear: both;
}
```

Sem isso, o pai de elementos flutuados "colapsa" (altura zero).

## 3. Cabeçalho com `display: table`

```css
.header-shell {
    display: table;          /* a largura vem de .container */
    table-layout: auto;
}
.header-shell > * {
    display: table-cell;     /* logo | nav | busca | ações */
    vertical-align: middle;
}
.brand-area,
.header-actions { width: 1%; white-space: nowrap; }  /* encolhe ao conteúdo */
.header-search  { width: 34%; }
.main-navigation { white-space: nowrap; }             /* nav sempre em 1 linha */
```

Por que `table` e não `inline-block` aqui? Porque `inline-block` **conta o
espaço em branco** entre as tags do HTML (cada quebra de linha vira ~4px). Com
quatro colunas somando ~100%, esses pixels invisíveis empurram a última para
baixo. `table-cell` não tem esse problema.

O botão "Menu" é filho direto de `.header-shell`; a regra `> *` o transformaria
em célula, então ele é escondido com `.header-shell .menu-btn { display: none }`
e só reaparece no mobile.

## 4. Hero, promo, carrinho, checkout: colunas com `float`

```css
.hero-copy, .hero-figure { width: 48%; }
.hero-copy   { float: left; }
.hero-figure { float: right; }
```

Duas colunas de 48% (+ 4% de respiro no meio), uma para cada lado. O mesmo
padrão vale para os dois blocos de promoção, para `.cart-main` (64%) /
`.cart-sidebar` (32%) e para `.checkout-review` (35%) / `.checkout-form-shell`
(61%).

## 5. Listas responsivas: `inline-block` + `%` + o truque do `font-size: 0`

```css
.category-list, .product-grid, .benefit-list,
.catalog-filters, .checkout-grid, .hero-stats {
    font-size: 0;            /* mata o espaço em branco entre <li>/<div> */
}
.category-list > li { font-size: 15px; width: 19%; margin-right: 1%; }
.product-grid > .product-card { font-size: 15px; width: 31.6%; margin-right: 2%; }
.product-grid .product-card:nth-child(3n) { margin-right: 0; }  /* fecha a linha */
```

Repare no trabalho manual: escolher `width` + `margin` que somem ≤ 100%,
zerar a margem do último de cada linha com `:nth-child`, e ainda anular o
espaço entre tags. Em Grid isso seria `grid-template-columns: repeat(3, 1fr)` +
`gap`. **Essa é a lição da pasta.**

## 6. Item do carrinho sem Flex/Grid

`img` com `width: 120px`, `.cart-item-info` com `width: calc(100% - 320px)`,
`.qty-control` com `width: 90px` — todos `inline-block; vertical-align: top`.
O alinhamento depende de larguras explícitas que precisam "fechar a conta".

As linhas do resumo (`.summary-line`) voltam a `display: block` para que o
`<strong>` do preço possa `float: right` numa linha de largura total.

## 7. Responsividade

Um único breakpoint (`max-width: 960px`) desliga o layout:

```css
@media (max-width: 960px) {
    .header-shell { display: block; }
    .main-navigation { display: none; }          /* recolhe; abre com .is-open */
    .brand-area, .hero-copy, .cart-main, /* … */ {
        float: none;
        width: 100%;
        display: block;
    }
}
```

Tudo que era coluna vira pilha. A ordem visual acompanha a ordem do HTML —
outro motivo para a marcação já estar semanticamente correta.

## 8. Onde a cor entra

Nada é `#000`. O `:root` define `--primary: #7A2430` e faz
`--ink: var(--primary)` e `--dark: var(--primary)` — texto, títulos, cabeçalho,
`.promo-dark`, rodapé e o botão "voltar" ficam **no mesmo tom vinho** dos CTAs.
`--primary-dark` (um degrau mais escuro) veste o botão de favorito. Trocar a
identidade = editar o `:root`.

### Detalhe de bug corrigido — `<figure>`

`.hero-figure` é um `<figure>`, e o navegador dá a ele `margin: 1em 40px` por
padrão. Com `width: 48%` + 40px de cada lado, a figura não cabia ao lado da
`.hero-copy` (float-left 48%) e "caía" para baixo. A base agora tem
`figure { margin: 0 }`.

## 9. HTML semântico

`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<figure>`,
`<form>`/`<label>`/`<input>`, `<footer>`, `<ul>`/`<li>`. `<div>` só quando não
há elemento com significado e o agrupamento é puramente visual. Sem `<style>`,
sem atributo `style`.

## 10. JavaScript e imagens (compartilhados)

`../shared/js/app.js` (catálogo, favoritos, carrinho, cupons, checkout,
WhatsApp) e as fotos `../shared/images/product-01..12.png`, ligadas pelo
catálogo `window.PRODUTOS` em `../shared/data/produtos.js`. Variáveis, arrays e
funções do JS estão **em português** (`montarCardProduto`,
`adicionarAoCarrinho`, `calcularTotais`…); os `data-*` e as classes CSS não.

## 11. Executar

```bash
python -m http.server 8080
```

`http://localhost:8080/01-css-classico/`

## 12. Para discutir em aula

- Por que `float` **não** foi criado para diagramar páginas?
- O que exatamente o `clearfix` conserta?
- Por que `inline-block` precisa do `font-size: 0`?
- Reescreva `.product-grid` em Grid e conte quantas linhas de CSS somem.
