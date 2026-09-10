# KICKS — 05 · Tailwind CSS

A mesma loja construída com **utilitários do Tailwind CSS** (via CDN,
`@tailwindcss/browser@4`). O layout das páginas estáticas é 100% classes
utilitárias no HTML; o `assets/css/style.css` é uma camada **fina** (~520
linhas) só de customização.

Cor da versão: **verde** (`--brand: #0F766E`).

---

## 1. O que vem de cada lugar

| Camada | Onde | O que faz |
| --- | --- | --- |
| **Tailwind v4** | `<script>` no `<head>` | todo o layout estático: `flex`, `grid`, `gap-*`, `px-*`, `rounded-*`, `text-*`, `bg-[color:var(--brand)]`, `sm:*` / `lg:*` … |
| **`assets/css/style.css`** | local (~520 linhas) | 1) o token `--brand` (verde) · 2) uma classe de **componente** `.btn` (padrão que se repete) · 3) o estilo dos blocos **gerados pelo JavaScript** · 4) extras |

Não há `<style>` nos HTMLs.

## 2. A cor como token, usada nos utilitários

O Tailwind v4 via CDN não lê `@theme` de um `<link>` externo. Então a cor fica
como custom property no `style.css` e é consumida por **valores arbitrários**
na marcação:

```css
:root { --brand: #0F766E; --brand-dark: #0a544e; --ink: #0c2e2b; }
```
```html
<div class="bg-[color:var(--brand)] text-white">…</div>
<a  class="text-[color:var(--brand)] underline">Ver todas</a>
<input class="border border-[color:var(--line)] focus:border-[color:var(--brand)]">
```

## 3. `.btn` — o único "componente" extraído

Botão é o padrão que mais se repete (no HTML estático **e** no HTML gerado pelo
JS). Em vez de repetir 8 utilitários toda vez, existe uma classe de componente:

```css
.btn { display:inline-flex; align-items:center; border-radius:.85rem; padding:.8rem 1.4rem; font-weight:700; }
.btn-primary { background: var(--brand); color:#fff; }
.btn-secondary { background:#fff; border:1px solid var(--line); }
```

Extrair uma classe quando o padrão se repete é a recomendação da própria
documentação do Tailwind.

## 4. O que o JavaScript gera — e por que o CSS entra

O `shared/js/app.js` monta cards, detalhe do produto, itens do carrinho,
resumo do checkout e o toast com classes semânticas (`.product-card`,
`.choice`, `.qty-control`, `.summary-line`, `.checkout-mini`, `.empty-state`,
`.toast`…). Como o JS **não emite utilitários**, o `style.css` estiliza esses
blocos. É a maior parte do arquivo — e é legítimo: são os componentes que o
utility-first não consegue alcançar pelo HTML.

## 5. Menu mobile

Usa o mesmo hook do projeto: `data-menu-toggle` alterna `.is-open` em
`[data-mobile-nav]`. Uma regra (sem camada, então vence o `hidden` do Tailwind)
mostra a nav:

```css
@media (max-width: 1023px) { .main-nav.is-open { display: block; } }
```

## 6. Responsividade

Variantes do Tailwind na marcação (`sm:`, `md:`, `lg:`, `lg:grid-cols-2`,
`lg:flex-row`) + a media query acima para o menu.

## 7. Compartilhado

`shared/js/app.js` (identificadores em português), catálogo `window.PRODUTOS`
em `shared/data/produtos.js`, imagens reais em `shared/images/`.

## 8. Executar

```bash
python -m http.server 8080
```

`http://localhost:8080/05-tailwind/` — **precisa de internet** (CDN).

## 9. Para discutir em aula

- Utility-first: HTML "verboso" × zero CSS morto.
- Valores arbitrários (`bg-[color:var(--brand)]`) e quando usá-los.
- Quando **extrair** um punhado de utilitários para uma classe de componente.
- Camadas de cascata: por que uma regra sem `@layer` vence um utilitário.
