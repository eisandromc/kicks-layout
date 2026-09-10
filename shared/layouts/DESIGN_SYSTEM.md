# Design System KICKS

Referência visual: `layout-base-kicks.png` (mesma pasta).

## Conceito visual
- Loja minimalista, foco total no produto.
- Estrutura fiel ao mockup, mas **cada versão veste a loja inteira com a sua
  cor**: onde o mockup é "preto", a versão Flex fica azul-marinho, a Tailwind
  fica roxa, etc.
- Tipografia sem serifa (Inter), títulos grandes com tracking negativo e peso.
- Cards com cantos suaves, áreas respiradas, sombras discretas só em interação.
- Hierarquia: aviso > cabeçalho > hero > catálogo > blocos de apoio > rodapé.

## Tokens fundamentais (bloco `:root` de cada `style.css`)
| Token | Valor | Uso |
| --- | --- | --- |
| `--primary` | **cor da versão** | CTAs, selo do carrinho, `.choice` ativo |
| `--ink` | `var(--primary)` | texto, títulos, cabeçalho, campo de busca |
| `--dark` | `var(--primary)` | barra de aviso, `.promo-dark`, rodapé |
| `--primary-dark` | um degrau mais escuro que `--primary` | fundo do botão de favorito |
| `--ink-soft` | tom médio da mesma cor | links da navegação |
| `--muted` | cinza com leve matiz | texto secundário |
| `--line` / `--line-strong` | tons muito claros da cor | bordas |
| `--soft` / `--soft-2` | quase branco, leve matiz | fundos de seção, cards de imagem |
| `--ring` | `rgba(<primary>, ~0.16)` | halo de foco em inputs |
| `--radius-sm/–/lg/pill` | `10 / 16 / 24 / 999px` | raios padrão |
| `--container` / `--gutter` | `1200px` / `24px` | largura e margem lateral |

Escala de espaçamento: `--space-1..6` = `8 / 16 / 24 / 32 / 48 / 72px`.
As seções usam `clamp()` para respiro responsivo.

## Paleta por versão
| Versão | Técnica de layout | Cor da versão | `--primary-dark` (favorito) |
| --- | --- | --- | --- |
| `01-css-classico` | float / inline-block / table, **sem flex e sem grid** | `#7A2430` vinho | `#591a22` |
| `02-css-grid` | CSS Grid (evita `display:flex`) | `#111111` preto | `#000000` |
| `03-css-flex` | Flexbox (evita `display:grid`) | `#0F2747` azul-marinho | `#0a1a31` |
| `04-bootstrap` | **componentes do Bootstrap 5** | `#6D28D9` roxo | `#561fac` |
| `05-tailwind` | **utilitários do Tailwind** | `#0F766E` verde | `#0a544e` |

Nas versões 01–03, `--primary` = `--ink` = `--dark` (mesmo tom). Nas versões
04 e 05 a cor mora em `--brand` e é aplicada via `--bs-*` (Bootstrap) ou
`bg-[var(--brand)]` (Tailwind).

A camada de **apresentação** muda entre as pastas; **dados, imagens e
JavaScript de negócio são compartilhados** (`shared/`).

## Arquitetura do CSS por versão

### Versões 01, 02, 03 — CSS puro
1. **Base compartilhada** (idêntica entre as três, exceto o `:root`): tokens,
   reset, tipografia, cabeçalho, hero, cards, botões, promo, benefícios,
   newsletter, rodapé, páginas internas, toast e o botão fixo "voltar". Não usa
   `display:flex` nem `display:grid`, para não quebrar a proposta da versão 01.
   - O campo de busca é uma pílula única com o botão embutido, feita só com
     `position`.
   - `figure { margin: 0 }` reseta a margem que o navegador dá a `<figure>`.
2. **Seção "VERSÃO 0X"** ao final: apenas o mecanismo de layout (colunas do
   cabeçalho, hero, catálogo, carrinho, checkout e rodapé).

### Versões 04, 05 — framework
O layout inteiro é feito com componentes/utilitários da biblioteca, no HTML.
O `style.css` (~520 linhas) faz só: o token de cor, o acabamento dos blocos
que o `shared/js/app.js` gera (cards, detalhe, carrinho, checkout, toast — o
framework não tem classes para eles) e pequenos extras. Ver o README de cada
pasta.

## JavaScript e dados (compartilhados, em português)
- `shared/data/produtos.js` → `window.PRODUTOS` (chaves `nome`, `marca`,
  `categoria`, `preco`, `precoAntigo`, `avaliacao`, `numeroAvaliacoes`, `selo`,
  `cores`, `tamanhos`, `descricao`, `diferenciais`, `destaque`, `imagem`).
- `shared/js/store-config.js` → `window.CONFIG_LOJA` (`nomeLoja`, `moeda`,
  `numeroWhatsapp`, `limiteFreteGratis`, `valorFrete`, `cupons`).
- `shared/js/app.js` → funções `selecionar`, `formatarDinheiro`,
  `montarCardProduto`, `renderizarCatalogo`, `adicionarAoCarrinho`,
  `calcularTotais`, `renderizarCheckout`, `ligarEventosGlobais`, etc.
- Os seletores `data-*` e as classes CSS são o contrato com o HTML/CSS e
  **não** foram traduzidos.

## Estrutura compartilhada de páginas
Home · Produtos · Produto · Favoritos · Carrinho · Checkout · Conta · Sobre ·
Contato · FAQ · Políticas.

## Regras educacionais do projeto
- HTML semântico, sem `<style>` nem atributo `style`.
- CSS externo, separado por versão, comentado e não minificado.
- JavaScript compartilhado, comentado, não minificado e com nomes em português.
- Imagens reais dos produtos em `shared/images`.
