# KICKS — 04 · Bootstrap

A mesma loja construída com os **componentes do Bootstrap 5** (via CDN). O
layout inteiro é feito com o que o framework oferece; o `assets/css/style.css`
é uma camada **fina de customização** (~520 linhas), não uma folha de estilo
completa.

Cor da versão: **roxo** (`--brand: #6D28D9`).

---

## 1. O que vem de cada lugar

| Camada | Onde | O que faz |
| --- | --- | --- |
| **Bootstrap 5.3** | CDN no `<head>` (CSS) e antes de `</body>` (bundle JS) | navbar, `container`, `row`/`col-*`, `card`, `btn`, `form-control`/`form-select`, `input-group`, `badge`, `accordion`, utilitários (`d-flex`, `gap-*`, `py-*`, `text-bg-dark`…) |
| **`assets/css/style.css`** | local (~520 linhas) | tema roxo · tipografia do hero · **estilo dos blocos gerados pelo JavaScript** · extras (ícones, botão "voltar", favorito) |

Nada do Bootstrap foi copiado para o projeto e **não há `<style>`** nos HTMLs.

## 2. Componentes do Bootstrap usados na marcação

- **Cabeçalho** — `<nav class="navbar navbar-expand-lg ...">` com
  `.navbar-brand`, `.navbar-toggler` (`data-bs-toggle="collapse"`),
  `.navbar-nav`/`.nav-link`, `.input-group` para a busca e `.badge` no carrinho.
  O menu mobile é o **collapse nativo do Bootstrap** (JS do bundle).
- **Hero / seções** — `.container` + `.row` + `.col-lg-6` / `row-cols-*`.
- **Cartões** — `.card` (categorias, promoções, formulários, sidebar do
  carrinho/checkout), `.card.text-bg-dark` na promo escura.
- **Formulários** — `.form-control`, `.form-select`, `.form-label`, `.btn`,
  grid `.row g-3` + `.col-md-*`.
- **FAQ** — `.accordion` / `.accordion-item` / `.accordion-collapse`
  (`data-bs-toggle="collapse"`, `data-bs-parent`).
- **Rodapé** — `.row` + `.col-*`, `.list-unstyled`, `.link-light`.

## 3. Tema roxo — o que o `style.css` precisa sobrescrever

O CDN do Bootstrap traz as cores dos componentes "assadas" (Sass em build).
Mudar `--bs-primary` sozinho não recolore os botões. Então:

```css
:root { --brand: #6D28D9; --bs-primary: var(--brand); --bs-body-color: var(--brand); }

.btn-primary {                     /* recolore o botão via suas variáveis */
    --bs-btn-bg: var(--brand);
    --bs-btn-hover-bg: var(--brand-dark);
    /* … */
}
.text-bg-dark { background-color: var(--brand) !important; }  /* aviso, promo, rodapé */
.form-control:focus, .accordion-button:not(.collapsed) { /* tira o azul do foco */ }
```

## 4. O que o JavaScript gera — e por que o CSS entra

O `shared/js/app.js` monta os cards, o detalhe do produto, os itens do
carrinho, o resumo do checkout e o toast com classes próprias
(`.product-card`, `.choice`, `.qty-control`, `.summary-line`, `.checkout-mini`,
`.empty-state`, `.toast`…). O Bootstrap **não tem componentes para isso**,
então o `style.css` os estiliza — usando as próprias variáveis do Bootstrap
(`--bs-border-color`, `--bs-tertiary-bg`, `--bs-secondary-color`) para manter a
consistência. Os botões que o JS cria já usam `.btn .btn-primary` (Bootstrap).

## 5. Responsividade

Vem dos breakpoints do Bootstrap (`col-lg-*`, `row-cols-md-*`, `navbar-expand-lg`).
O `style.css` só define a grade dos blocos dinâmicos com `repeat(auto-fill, …)`.

## 6. Compartilhado

`shared/js/app.js` (identificadores em português, sem depender do Bootstrap JS),
catálogo `window.PRODUTOS` em `shared/data/produtos.js`, imagens reais em
`shared/images/`.

## 7. Executar

```bash
python -m http.server 8080
```

`http://localhost:8080/04-bootstrap/` — **precisa de internet** (CDN).

## 8. Para discutir em aula

- Grade de 12 colunas, `row-cols-*`, breakpoints.
- Componentes JS do Bootstrap (collapse, accordion) via `data-bs-*`.
- Como customizar cor num build de CDN (variáveis `--bs-*` por componente).
- Fronteira "componente do framework" × "CSS que só o app precisa".
