# KICKS — 02 · CSS Grid

Layout com **CSS Grid** como mecanismo principal. Demonstra grade
bidimensional, colunas explícitas, `fr`, `repeat()`, `gap` e reorganização
responsiva sem tocar no HTML. Para o contraste ficar nítido, esta versão
**evita `display: flex`** no CSS local.

Paleta: **preto / grafite** (`--primary: #111111`) — a "cor" desta versão é o
próprio preto, então ela funciona como referência neutra das demais.

---

## 1. Divisão do `style.css`

- **Base compartilhada** (sem `flex` e sem `grid`).
- **Seção `VERSÃO 02`**: aqui quase tudo vira grade. Um único bloco liga
  `display: grid; gap: 20px` em ~17 seletores; o resto são as
  `grid-template-columns`.

## 2. Cabeçalho: 4 trilhas nomeadas pela função

```css
.header-shell {
    display: grid;
    grid-template-columns: auto 1fr minmax(260px, 360px) auto;
    align-items: center;
}
```

- `auto` → logo (ocupa só o que precisa);
- `1fr` → navegação (fica com a sobra);
- `minmax(260px, 360px)` → busca (nunca menor que 260, nunca maior que 360);
- `auto` → ações do carrinho.

A navegação interna também é grade, mas em **fluxo de coluna**:

```css
.nav-list { display: grid; grid-auto-flow: column; justify-content: start; gap: 16px; }
```

## 3. Hero e detalhe do produto: duas colunas iguais

```css
.hero-layout   { grid-template-columns: 1fr 1fr; align-items: center; }
.product-detail{ grid-template-columns: 1fr 1fr; align-items: start;  }
```

`1fr 1fr` = 50% / 50% **descontando o `gap` automaticamente** — sem
`calc(50% - Xpx)`. No detalhe usamos `align-items: start` para o texto (mais
alto) não empurrar a imagem para o meio da linha.

## 4. Listas: `repeat()` em vez de contas

```css
.hero-stats    { grid-template-columns: repeat(3, 1fr); }
.category-list { grid-template-columns: repeat(5, 1fr); }
.benefit-list  { grid-template-columns: repeat(5, 1fr); text-align: center; }
.product-grid  { grid-template-columns: repeat(3, 1fr); gap: 20px; }
```

Compare com a versão clássica: aqui não há `width` por item, `margin-right`,
`:nth-child(3n)` nem `font-size: 0`. A distribuição é **declarativa**.

## 5. Formulários também são grade

```css
.catalog-toolbar { grid-template-columns: 1fr auto; align-items: end; } /* filtros | contador */
.catalog-filters { grid-template-columns: repeat(3, 1fr); }              /* busca|categoria|ordem */
.checkout-grid   { grid-template-columns: repeat(2, 1fr); }
.field-group-wide { grid-column: 1 / -1; }                               /* ocupa a linha toda */
```

`grid-column: 1 / -1` ("da primeira até a última linha") é a forma limpa de
dizer *full width* dentro da grade — usado no campo "Rua" e em "Observações".

## 6. Carrinho e checkout: pesos diferentes por coluna

```css
.cart-layout     { grid-template-columns: 2fr 1fr; }        /* lista maior que o resumo */
.checkout-layout { grid-template-columns: 0.95fr 1.25fr; }  /* formulário maior que o resumo */
.cart-item       { display: grid; grid-template-columns: 120px 1fr auto auto; align-items: center; }
```

`fr` aceita fração quebrada (`0.95fr`, `1.25fr`) para ajuste fino. No item do
carrinho, misturamos unidade fixa (`120px` para a foto), `1fr` (descrição) e
`auto` (quantidade e "remover").

## 7. Responsividade: a grade "desliga" em uma regra

```css
@media (max-width: 960px) {
    .header-shell, .hero-layout, .product-detail, .cart-layout,
    .checkout-layout, .checkout-grid, .footer-grid, .cart-item {
        grid-template-columns: 1fr;   /* tudo em coluna única */
    }
    .nav-list { grid-auto-flow: row; }
}
```

O HTML não muda — só a definição das trilhas.

## 8. Cor

`:root` mantém tudo em preto: `--primary: #111111` e `--ink`/`--dark` no mesmo
tom (`var(--primary)`); `--primary-dark: #000` no botão de favorito. As demais
versões só trocam esse bloco (vinho, marinho, verde-água, roxo).

## 9. Compartilhado

HTML semântico (`header`, `nav`, `main`, `section`, `article`, `aside`,
`figure`, `form`, `footer`); lógica em `../shared/js/app.js` (identificadores em
português); catálogo `window.PRODUTOS` em `../shared/data/produtos.js`; imagens
reais em `../shared/images/`.

## 10. Executar

```bash
python -m http.server 8080
```

`http://localhost:8080/02-css-grid/`

## 11. Para discutir em aula

- Diferença entre **trilha**, **linha da grade** e **célula**.
- `fr` vs `%`: por que `1fr 1fr` + `gap` não estoura e `50% + 50% + gap` estoura.
- `repeat(3, 1fr)` vs `repeat(auto-fit, minmax(…, 1fr))` — quando usar cada um.
- Quando **Grid** ganha de **Flexbox** (resposta curta: layout em 2 eixos).
