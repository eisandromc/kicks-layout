# KICKS — 03 · Flexbox

Layout com **Flexbox** como mecanismo principal: eixo principal / transversal,
`flex-grow` / `flex-shrink` / `flex-basis`, `flex-wrap` e `align-items`. Para o
contraste ficar claro, esta versão **evita `display: grid`** no CSS local.

Paleta: **azul-marinho**. `--primary: #0F2747`, com `--ink` e `--dark` no mesmo
tom (`var(--primary)`); `--primary-dark: #0a1a31` no botão de favorito.

---

## 1. Divisão do `style.css`

- **Base compartilhada** (sem `flex` e sem `grid`).
- **Seção `VERSÃO 03`**: um bloco liga `display: flex; gap: 20px` em ~23
  seletores; o resto ajusta `flex:` e `align-items:` de cada área.

## 2. A propriedade `flex` em uma frase

`flex: <grow> <shrink> <basis>` — respectivamente: *quanto cresço na sobra*,
*quanto encolho na falta*, *meu tamanho inicial*. Quase todo ajuste desta
versão é escolher esses três números.

## 3. Cabeçalho

```css
.header-shell { align-items: center; }   /* .d-flex vem da base do container */
.main-navigation { flex: 1 1 auto; }     /* fica com a sobra */
.header-search   { flex: 0 1 360px; }    /* parte de 360px, pode encolher, não cresce */
.nav-list { display: flex; flex-wrap: wrap; gap: 18px; }
```

`gap` substitui a soma de `margin` entre os links.

## 4. Hero: dois itens que crescem e encolhem juntos

```css
.hero-copy, .hero-figure { flex: 1 1 320px; min-width: 0; }
```

Ambos partem de 320px e dividem a sobra igualmente → ~50% cada no desktop.
O `min-width: 0` é essencial: por padrão um flex item **não encolhe abaixo do
tamanho do seu conteúdo**, e a imagem interna tem `width: 100%`. Sem
`min-width: 0`, uma coluna "trava" larga e a outra cai para baixo.

## 5. Cards: `flex-wrap` faz a quebra automática

```css
.product-grid { display: flex; flex-wrap: wrap; gap: 20px; }
.product-card {
    flex: 0 1 calc(33.333% - 14px);  /* ~1/3 da linha, NÃO cresce */
    min-width: 240px;
}
```

`flex-grow: 0` é proposital: numa última linha incompleta (5 destaques = 3 + 2)
os cards restantes ficam **alinhados à esquerda** no tamanho normal, em vez de
esticarem para preencher a linha.

## 6. Distribuição dinâmica (stats e benefícios)

```css
.hero-stats li, .benefit-list li { flex: 1 1 140px; }
```

Base mínima de 140px, mas todos crescem igualmente para ocupar a linha —
a marca registrada do Flexbox.

## 7. Promoções e rodapé

```css
.promo-dark, .promo-light { flex: 1 1 320px; }   /* 2 colunas, sem grade 2D */
.footer-column            { flex-basis: 200px; } /* 4 colunas cabem: 4·200 + gaps < 1200 */
.footer-column:first-child{ flex-basis: 280px; } /* a coluna "KICKS" um pouco maior */
```

## 8. Carrinho e checkout: pesos com `flex-grow`

```css
.cart-main   { flex: 2 1 640px; }   /* recebe 2× a sobra */
.cart-sidebar{ flex: 1 1 320px; }
.checkout-form-shell { flex: 1.8 1 460px; }  /* formulário maior que o resumo */
.checkout-review     { flex: 1 1 300px; }
.cart-layout, .checkout-layout { align-items: flex-start; } /* colunas alinhadas ao topo */
```

O item do carrinho precisa de largura fixa na foto:

```css
.cart-item img { flex: 0 0 120px; width: 120px; height: 120px; object-fit: cover; }
.cart-item-info { flex: 1 1 auto; min-width: 0; }
```

De novo o `min-width: 0` / largura fixa para o item não "estourar" a linha.

## 9. Responsividade: `flex-direction: column`

```css
@media (max-width: 960px) {
    .header-shell, .hero-layout, .cart-layout, .checkout-layout, .cart-item {
        flex-direction: column;
        align-items: stretch;
    }
    .product-card { flex-basis: 100%; }
}
```

Trocar o eixo principal de `row` para `column` empilha tudo.

## 10. Cor

`:root` define `--primary: #0F2747` e `--ink: var(--primary)` /
`--dark: var(--primary)` — todo "preto" do mockup vira marinho, **no mesmo tom**
dos CTAs. `--primary-dark` (mais escuro) veste o botão de favorito; os cinzas
claros ganham um leve tom azulado.

## 11. Compartilhado

HTML semântico; `../shared/js/app.js` (variáveis e funções em português);
catálogo `window.PRODUTOS` em `../shared/data/produtos.js`; imagens reais em
`../shared/images/`.

## 12. Executar

```bash
python -m http.server 8080
```

`http://localhost:8080/03-css-flex/`

## 13. Para discutir em aula

- `flex: 1 1 0` vs `flex: 1 1 auto` vs `flex: 0 1 auto`.
- Por que `min-width: 0` conserta overflow em coluna com imagem.
- `flex-wrap` vs `grid` `auto-fill/auto-fit`: onde cada um brilha.
- `justify-content` (eixo principal) × `align-items` (eixo transversal).
