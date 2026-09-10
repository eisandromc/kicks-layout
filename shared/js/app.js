/**
 * Aplicacao compartilhada da loja KICKS.
 *
 * Objetivos deste arquivo:
 * 1. Carregar os produtos do catalogo (window.PRODUTOS).
 * 2. Renderizar listagens, detalhes e resumos.
 * 3. Controlar favoritos e carrinho com localStorage.
 * 4. Montar o checkout e abrir o WhatsApp com o pedido pronto.
 *
 * Observacao didatica:
 * Este JavaScript e mantido em um unico arquivo compartilhado para que as
 * cinco versoes tenham exatamente a mesma logica. O que muda entre as
 * implementacoes e a camada de apresentacao (HTML + CSS), nao o comportamento.
 *
 * Convencao: nomes de variaveis, arrays e funcoes em portugues. Os seletores
 * `data-*` e as classes CSS sao o "contrato" com o HTML/CSS e ficam iguais.
 */
(function () {
    'use strict';

    var configLoja = window.CONFIG_LOJA || {};
    var produtos = window.PRODUTOS || [];

    var CHAVES_ARMAZENAMENTO = {
        carrinho: 'kicks-carrinho',
        favoritos: 'kicks-favoritos',
        cupom: 'kicks-cupom',
        perfil: 'kicks-perfil'
    };

    /**
     * Atalhos para consulta do DOM.
     */
    function selecionar(seletor, contexto) {
        return (contexto || document).querySelector(seletor);
    }

    function selecionarTodos(seletor, contexto) {
        return Array.from((contexto || document).querySelectorAll(seletor));
    }

    /**
     * Sanitiza strings antes de injetar no HTML.
     */
    function escaparHtml(valor) {
        return String(valor)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Formatacao de moeda em Real.
     */
    function formatarDinheiro(valor) {
        return new Intl.NumberFormat(configLoja.localidade || 'pt-BR', {
            style: 'currency',
            currency: configLoja.moeda || 'BRL'
        }).format(valor || 0);
    }

    /**
     * Helpers de localStorage.
     */
    function lerJson(chave, padrao) {
        try {
            return JSON.parse(localStorage.getItem(chave)) || padrao;
        } catch (erro) {
            return padrao;
        }
    }

    function salvarJson(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    function obterCarrinho() {
        return lerJson(CHAVES_ARMAZENAMENTO.carrinho, []);
    }

    function definirCarrinho(carrinho) {
        salvarJson(CHAVES_ARMAZENAMENTO.carrinho, carrinho);
        atualizarContadorCarrinho();
    }

    function obterFavoritos() {
        return lerJson(CHAVES_ARMAZENAMENTO.favoritos, []);
    }

    function definirFavoritos(favoritos) {
        salvarJson(CHAVES_ARMAZENAMENTO.favoritos, favoritos);
    }

    function obterCupom() {
        return localStorage.getItem(CHAVES_ARMAZENAMENTO.cupom) || '';
    }

    /**
     * Aviso (toast) simples para feedback visual.
     */
    function mostrarAviso(mensagem, tipo) {
        var aviso = document.createElement('div');
        aviso.className = 'toast' + (tipo ? ' toast-' + tipo : '');
        aviso.textContent = mensagem;
        document.body.appendChild(aviso);

        requestAnimationFrame(function () {
            aviso.classList.add('is-visible');
        });

        window.setTimeout(function () {
            aviso.classList.remove('is-visible');
            window.setTimeout(function () {
                aviso.remove();
            }, 250);
        }, 2400);
    }

    /**
     * Favoritos.
     */
    function ehFavorito(produtoId) {
        return obterFavoritos().indexOf(produtoId) !== -1;
    }

    function alternarFavorito(produtoId) {
        var favoritos = obterFavoritos();
        var indice = favoritos.indexOf(produtoId);

        if (indice === -1) {
            favoritos.push(produtoId);
            definirFavoritos(favoritos);
            mostrarAviso('Produto adicionado aos favoritos.');
            return true;
        }

        favoritos.splice(indice, 1);
        definirFavoritos(favoritos);
        mostrarAviso('Produto removido dos favoritos.');
        return false;
    }

    /**
     * Carrinho.
     */
    function montarChaveItem(produtoId, tamanho, cor) {
        return [produtoId, tamanho, cor].join('::');
    }

    function adicionarAoCarrinho(produtoId, tamanho, cor, quantidade) {
        var qtd = Math.max(1, Number(quantidade || 1));
        var carrinho = obterCarrinho();
        var chave = montarChaveItem(produtoId, tamanho, cor);
        var existente = carrinho.find(function (item) {
            return item.chave === chave;
        });

        if (existente) {
            existente.qtd += qtd;
        } else {
            carrinho.push({
                chave: chave,
                id: produtoId,
                tamanho: tamanho,
                cor: cor,
                qtd: qtd
            });
        }

        definirCarrinho(carrinho);
        mostrarAviso('Produto adicionado ao carrinho.');
    }

    function atualizarContadorCarrinho() {
        var total = obterCarrinho().reduce(function (soma, item) {
            return soma + item.qtd;
        }, 0);

        selecionarTodos('[data-cart-count]').forEach(function (elemento) {
            elemento.textContent = String(total);
        });
    }

    /**
     * Cria o card de produto usado em listagens e favoritos.
     * O coracao do botao de favorito e sempre preenchido (branco); a classe
     * `is-active` clareia o fundo quando o item ja esta favoritado.
     */
    function montarCardProduto(produto) {
        var favorito = ehFavorito(produto.id);
        return [
            '<article class="product-card">',
            '  <a class="product-image-link" href="produto.html?id=' + produto.id + '">',
            '      <img class="product-image" src="' + escaparHtml(produto.imagem) + '" alt="' + escaparHtml(produto.nome) + '">',
            '  </a>',
            '  <div class="product-card-body">',
            '      <p class="product-meta">' + escaparHtml(produto.marca) + ' &middot; ' + escaparHtml(produto.selo) + '</p>',
            '      <h3><a href="produto.html?id=' + produto.id + '">' + escaparHtml(produto.nome) + '</a></h3>',
            '      <p class="product-category">' + escaparHtml(produto.categoria) + '</p>',
            '      <div class="product-rating">&#9733; ' + produto.avaliacao + ' <span>(' + produto.numeroAvaliacoes + ' avaliacoes)</span></div>',
            '      <div class="price-row"><strong>' + formatarDinheiro(produto.preco) + '</strong> <del>' + formatarDinheiro(produto.precoAntigo) + '</del></div>',
            '      <div class="card-actions">',
            '          <button class="btn btn-primary add-card" type="button" data-add data-id="' + produto.id + '">Adicionar</button>',
            '          <button class="btn btn-icon' + (favorito ? ' is-active' : '') + '" type="button" data-fav data-id="' + produto.id + '" aria-pressed="' + favorito + '" aria-label="Favoritar produto">&#9829;</button>',
            '      </div>',
            '  </div>',
            '</article>'
        ].join('');
    }

    /**
     * Liga os eventos de adicionar ao carrinho e favoritar nos cards.
     */
    function ligarEventosDoCard(contexto) {
        selecionarTodos('[data-add]', contexto).forEach(function (botao) {
            botao.addEventListener('click', function () {
                var produtoId = Number(botao.getAttribute('data-id'));
                var produto = produtos.find(function (item) {
                    return item.id === produtoId;
                });

                if (produto) {
                    adicionarAoCarrinho(produto.id, produto.tamanhos[0], produto.cores[0], 1);
                }
            });
        });

        selecionarTodos('[data-fav]', contexto).forEach(function (botao) {
            botao.addEventListener('click', function () {
                var produtoId = Number(botao.getAttribute('data-id'));
                var ativo = alternarFavorito(produtoId);
                botao.classList.toggle('is-active', ativo);
                botao.setAttribute('aria-pressed', String(ativo));
            });
        });
    }

    /**
     * Home: produtos em destaque.
     */
    function renderizarDestaques() {
        var alvo = selecionar('[data-product-list="featured"]');
        if (!alvo) {
            return;
        }

        var destaques = produtos.filter(function (item) {
            return item.destaque;
        });

        alvo.innerHTML = destaques.map(montarCardProduto).join('');
        ligarEventosDoCard(alvo);
    }

    /**
     * Catalogo completo com busca, filtro e ordenacao.
     */
    function renderizarCatalogo() {
        var alvo = selecionar('[data-product-list="catalog"]');
        if (!alvo) {
            return;
        }

        var campoBusca = selecionar('[data-filter-q]');
        var seletorCategoria = selecionar('[data-filter-category]');
        var seletorOrdem = selecionar('[data-filter-sort]');
        var rotuloContagem = selecionar('[data-catalog-count]');
        var parametros = new URLSearchParams(window.location.search);

        if (campoBusca && parametros.get('q')) {
            campoBusca.value = parametros.get('q');
        }
        if (seletorCategoria && parametros.get('categoria')) {
            seletorCategoria.value = parametros.get('categoria');
        }

        function aplicarFiltros() {
            var resultado = produtos.slice();
            var termo = (campoBusca ? campoBusca.value : '').trim().toLowerCase();
            var categoria = seletorCategoria ? seletorCategoria.value : '';
            var ordenacao = seletorOrdem ? seletorOrdem.value : 'featured';

            if (termo) {
                resultado = resultado.filter(function (item) {
                    return [item.nome, item.marca, item.categoria, item.descricao].join(' ').toLowerCase().indexOf(termo) !== -1;
                });
            }

            if (categoria) {
                resultado = resultado.filter(function (item) {
                    return item.categoria === categoria;
                });
            }

            if (ordenacao === 'price-asc') {
                resultado.sort(function (a, b) { return a.preco - b.preco; });
            } else if (ordenacao === 'price-desc') {
                resultado.sort(function (a, b) { return b.preco - a.preco; });
            } else if (ordenacao === 'rating-desc') {
                resultado.sort(function (a, b) { return b.avaliacao - a.avaliacao; });
            } else if (ordenacao === 'name-asc') {
                resultado.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
            }

            alvo.innerHTML = resultado.length
                ? resultado.map(montarCardProduto).join('')
                : '<section class="empty-state"><h2>Nenhum produto encontrado</h2><p>Tente outro termo, categoria ou ordenacao.</p></section>';

            if (rotuloContagem) {
                rotuloContagem.textContent = resultado.length + ' produto' + (resultado.length === 1 ? '' : 's');
            }

            ligarEventosDoCard(alvo);
        }

        [campoBusca, seletorCategoria, seletorOrdem].filter(Boolean).forEach(function (campo) {
            campo.addEventListener(campo.tagName === 'INPUT' ? 'input' : 'change', aplicarFiltros);
        });

        aplicarFiltros();
    }

    /**
     * Pagina de favoritos.
     */
    function renderizarFavoritos() {
        var alvo = selecionar('[data-favorites]');
        if (!alvo) {
            return;
        }

        var favoritos = produtos.filter(function (item) {
            return ehFavorito(item.id);
        });

        alvo.innerHTML = favoritos.length
            ? favoritos.map(montarCardProduto).join('')
            : '<section class="empty-state"><h2>Nenhum favorito ainda</h2><p>Use o coracao nos produtos para montar sua lista.</p><a class="btn btn-primary" href="produtos.html">Explorar catalogo</a></section>';

        ligarEventosDoCard(alvo);
    }

    /**
     * Pagina de detalhes do produto.
     */
    function renderizarDetalheProduto() {
        var alvo = selecionar('[data-product-detail]');
        if (!alvo) {
            return;
        }

        var parametros = new URLSearchParams(window.location.search);
        var produtoId = Number(parametros.get('id') || 1);
        var produto = produtos.find(function (item) {
            return item.id === produtoId;
        }) || produtos[0];

        alvo.innerHTML = [
            '<section class="detail-media">',
            '   <img src="' + escaparHtml(produto.imagem) + '" alt="' + escaparHtml(produto.nome) + '">',
            '</section>',
            '<section class="detail-info">',
            '   <p class="eyebrow">' + escaparHtml(produto.marca) + ' &middot; ' + escaparHtml(produto.categoria) + '</p>',
            '   <h1>' + escaparHtml(produto.nome) + '</h1>',
            '   <p class="rating">&#9733; ' + produto.avaliacao + ' <span>(' + produto.numeroAvaliacoes + ' avaliacoes)</span></p>',
            '   <p class="detail-description">' + escaparHtml(produto.descricao) + '</p>',
            '   <p class="detail-price"><strong>' + formatarDinheiro(produto.preco) + '</strong> <del>' + formatarDinheiro(produto.precoAntigo) + '</del></p>',
            '   <section class="selector">',
            '       <h2>Tamanho</h2>',
            '       <div class="choice-list" data-size-choices>' + produto.tamanhos.map(function (tamanho, indice) { return '<button type="button" class="choice' + (indice === 0 ? ' active' : '') + '" data-value="' + tamanho + '">' + tamanho + '</button>'; }).join('') + '</div>',
            '   </section>',
            '   <section class="selector">',
            '       <h2>Cor</h2>',
            '       <div class="choice-list" data-color-choices>' + produto.cores.map(function (cor, indice) { return '<button type="button" class="choice' + (indice === 0 ? ' active' : '') + '" data-value="' + escaparHtml(cor) + '">' + escaparHtml(cor) + '</button>'; }).join('') + '</div>',
            '   </section>',
            '   <section class="purchase-row">',
            '       <label class="qty-field" for="product-qty">Quantidade</label>',
            '       <input id="product-qty" data-product-qty type="number" min="1" max="10" value="1">',
            '       <button class="btn btn-primary btn-large" data-detail-add type="button">Adicionar ao carrinho</button>',
            '       <button class="btn btn-secondary" data-detail-fav type="button">' + (ehFavorito(produto.id) ? '&#9829; Favoritado' : '&#9825; Favoritar') + '</button>',
            '   </section>',
            '   <section class="feature-section">',
            '       <h2>Diferenciais</h2>',
            '       <ul class="feature-list">' + produto.diferenciais.map(function (diferencial) { return '<li>' + escaparHtml(diferencial) + '</li>'; }).join('') + '</ul>',
            '   </section>',
            '</section>'
        ].join('');

        var tamanhoSelecionado = produto.tamanhos[0];
        var corSelecionada = produto.cores[0];

        selecionarTodos('[data-size-choices] .choice', alvo).forEach(function (botao) {
            botao.addEventListener('click', function () {
                selecionarTodos('[data-size-choices] .choice', alvo).forEach(function (item) {
                    item.classList.remove('active');
                });
                botao.classList.add('active');
                tamanhoSelecionado = botao.getAttribute('data-value');
            });
        });

        selecionarTodos('[data-color-choices] .choice', alvo).forEach(function (botao) {
            botao.addEventListener('click', function () {
                selecionarTodos('[data-color-choices] .choice', alvo).forEach(function (item) {
                    item.classList.remove('active');
                });
                botao.classList.add('active');
                corSelecionada = botao.getAttribute('data-value');
            });
        });

        var botaoAdicionar = selecionar('[data-detail-add]', alvo);
        var botaoFavorito = selecionar('[data-detail-fav]', alvo);
        var campoQuantidade = selecionar('[data-product-qty]', alvo);

        if (botaoAdicionar) {
            botaoAdicionar.addEventListener('click', function () {
                adicionarAoCarrinho(produto.id, tamanhoSelecionado, corSelecionada, campoQuantidade ? campoQuantidade.value : 1);
            });
        }

        if (botaoFavorito) {
            botaoFavorito.addEventListener('click', function () {
                var ativo = alternarFavorito(produto.id);
                botaoFavorito.innerHTML = ativo ? '&#9829; Favoritado' : '&#9825; Favoritar';
            });
        }
    }

    /**
     * Totais financeiros do carrinho.
     */
    function calcularTotais(carrinho) {
        var subtotal = carrinho.reduce(function (soma, item) {
            var produto = produtos.find(function (candidato) {
                return candidato.id === item.id;
            });
            return soma + (produto ? produto.preco * item.qtd : 0);
        }, 0);

        var cupom = obterCupom();
        var regra = configLoja.cupons ? configLoja.cupons[cupom] : null;
        var desconto = 0;

        if (regra && regra.tipo === 'porcentagem') {
            desconto = subtotal * (regra.valor / 100);
        }

        var frete = (subtotal === 0 || subtotal >= configLoja.limiteFreteGratis || (regra && regra.tipo === 'frete'))
            ? 0
            : Number(configLoja.valorFrete || 0);

        return {
            subtotal: subtotal,
            desconto: desconto,
            frete: frete,
            total: Math.max(0, subtotal - desconto + frete),
            cupom: cupom
        };
    }

    function montarResumoHtml(totais) {
        return [
            '<div class="summary-line"><span>Subtotal</span><strong>' + formatarDinheiro(totais.subtotal) + '</strong></div>',
            '<div class="summary-line"><span>Desconto</span><strong>-' + formatarDinheiro(totais.desconto) + '</strong></div>',
            '<div class="summary-line"><span>Frete</span><strong>' + (totais.frete === 0 ? 'Gratis' : formatarDinheiro(totais.frete)) + '</strong></div>',
            '<div class="summary-line total"><span>Total</span><strong>' + formatarDinheiro(totais.total) + '</strong></div>'
        ].join('');
    }

    /**
     * Pagina do carrinho.
     */
    function renderizarCarrinho() {
        var alvoItens = selecionar('[data-cart-items]');
        var alvoResumo = selecionar('[data-cart-summary]');
        if (!alvoItens || !alvoResumo) {
            return;
        }

        function alterarQuantidade(chave, delta) {
            var carrinho = obterCarrinho();
            var alvo = carrinho.find(function (item) {
                return item.chave === chave;
            });

            if (alvo) {
                alvo.qtd += delta;
                if (alvo.qtd <= 0) {
                    carrinho = carrinho.filter(function (item) {
                        return item.chave !== chave;
                    });
                }
                definirCarrinho(carrinho);
                renderizar();
            }
        }

        function removerItem(chave) {
            definirCarrinho(obterCarrinho().filter(function (item) {
                return item.chave !== chave;
            }));
            renderizar();
        }

        function renderizar() {
            var carrinho = obterCarrinho();

            alvoItens.innerHTML = carrinho.length
                ? carrinho.map(function (item) {
                    var produto = produtos.find(function (candidato) {
                        return candidato.id === item.id;
                    });

                    if (!produto) {
                        return '';
                    }

                    return [
                        '<article class="cart-item" data-key="' + escaparHtml(item.chave) + '">',
                        '   <img src="' + escaparHtml(produto.imagem) + '" alt="' + escaparHtml(produto.nome) + '">',
                        '   <section class="cart-item-info">',
                        '       <h3><a href="produto.html?id=' + produto.id + '">' + escaparHtml(produto.nome) + '</a></h3>',
                        '       <p>' + escaparHtml(item.cor) + ' &middot; Tam. ' + escaparHtml(item.tamanho) + '</p>',
                        '       <strong>' + formatarDinheiro(produto.preco) + '</strong>',
                        '   </section>',
                        '   <section class="qty-control">',
                        '       <button type="button" data-dec aria-label="Diminuir quantidade">&#8722;</button>',
                        '       <span>' + item.qtd + '</span>',
                        '       <button type="button" data-inc aria-label="Aumentar quantidade">+</button>',
                        '   </section>',
                        '   <button class="link-danger" type="button" data-remove>Remover</button>',
                        '</article>'
                    ].join('');
                }).join('')
                : '<section class="empty-state"><h2>Seu carrinho esta vazio</h2><p>Escolha um produto e ele aparecera aqui.</p><a class="btn btn-primary" href="produtos.html">Ver produtos</a></section>';

            var totais = calcularTotais(carrinho);
            alvoResumo.innerHTML = montarResumoHtml(totais);

            selecionarTodos('[data-key]', alvoItens).forEach(function (linha) {
                var chave = linha.getAttribute('data-key');
                selecionar('[data-inc]', linha).addEventListener('click', function () {
                    alterarQuantidade(chave, 1);
                });
                selecionar('[data-dec]', linha).addEventListener('click', function () {
                    alterarQuantidade(chave, -1);
                });
                selecionar('[data-remove]', linha).addEventListener('click', function () {
                    removerItem(chave);
                });
            });

            var botaoCheckout = selecionar('[data-go-checkout]');
            if (botaoCheckout) {
                botaoCheckout.classList.toggle('disabled', !carrinho.length);
                botaoCheckout.setAttribute('aria-disabled', String(!carrinho.length));
            }
        }

        var formCupom = selecionar('[data-coupon-form]');
        if (formCupom) {
            formCupom.addEventListener('submit', function (evento) {
                evento.preventDefault();
                var campo = selecionar('[data-coupon-input]', formCupom);
                var cupom = (campo ? campo.value : '').trim().toUpperCase();

                if (configLoja.cupons && configLoja.cupons[cupom]) {
                    localStorage.setItem(CHAVES_ARMAZENAMENTO.cupom, cupom);
                    mostrarAviso('Cupom ' + cupom + ' aplicado com sucesso.');
                } else {
                    localStorage.removeItem(CHAVES_ARMAZENAMENTO.cupom);
                    mostrarAviso('Cupom invalido.', 'error');
                }

                renderizar();
            });
        }

        renderizar();
    }

    /**
     * Pagina de checkout.
     */
    function renderizarCheckout() {
        var resumo = selecionar('[data-checkout-review]');
        var formulario = selecionar('[data-checkout-form]');
        if (!resumo || !formulario) {
            return;
        }

        var carrinho = obterCarrinho();
        if (!carrinho.length) {
            resumo.innerHTML = '<section class="empty-state"><h2>Carrinho vazio</h2><a class="btn btn-primary" href="produtos.html">Escolher produtos</a></section>';
            formulario.style.display = 'none';
            return;
        }

        var totais = calcularTotais(carrinho);

        resumo.innerHTML = [
            '<section class="checkout-products">',
            carrinho.map(function (item) {
                var produto = produtos.find(function (candidato) {
                    return candidato.id === item.id;
                });
                return [
                    '<article class="checkout-mini">',
                    '   <span>' + item.qtd + '&times; ' + escaparHtml(produto.nome) + '<small>Tam. ' + escaparHtml(item.tamanho) + ' &middot; ' + escaparHtml(item.cor) + '</small></span>',
                    '   <strong>' + formatarDinheiro(produto.preco * item.qtd) + '</strong>',
                    '</article>'
                ].join('');
            }).join(''),
            '</section>',
            montarResumoHtml(totais)
        ].join('');

        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();
            if (!formulario.reportValidity()) {
                return;
            }

            var dados = Object.fromEntries(new FormData(formulario).entries());

            var textoItens = carrinho.map(function (item) {
                var produto = produtos.find(function (candidato) {
                    return candidato.id === item.id;
                });

                return '• ' + item.qtd + 'x ' + produto.nome
                    + ' | Tam. ' + item.tamanho
                    + ' | ' + item.cor
                    + ' | ' + formatarDinheiro(produto.preco * item.qtd);
            }).join('\n');

            var endereco = dados.street + ', ' + dados.number
                + (dados.complement ? ' - ' + dados.complement : '')
                + ' - ' + dados.district
                + ' - ' + dados.city + '/' + dados.state
                + ' - CEP ' + dados.cep;

            var mensagem = 'Ola! Quero finalizar este pedido na ' + configLoja.nomeLoja + ':\n\n'
                + textoItens + '\n\n'
                + 'Subtotal: ' + formatarDinheiro(totais.subtotal) + '\n'
                + 'Desconto: ' + formatarDinheiro(totais.desconto) + '\n'
                + 'Frete: ' + (totais.frete === 0 ? 'Gratis' : formatarDinheiro(totais.frete)) + '\n'
                + 'TOTAL: ' + formatarDinheiro(totais.total) + '\n\n'
                + 'Cliente: ' + dados.name + '\n'
                + 'Telefone: ' + dados.phone + '\n'
                + 'Endereco: ' + endereco + '\n'
                + 'Pagamento: ' + dados.payment + '\n'
                + 'Observacoes: ' + (dados.notes || '-');

            var numero = String(configLoja.numeroWhatsapp || '').replace(/\D/g, '');
            if (numero.length < 12) {
                mostrarAviso('Configure o numero do WhatsApp em shared/js/store-config.js.', 'error');
                return;
            }

            window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem), '_blank', 'noopener');
        });
    }

    /**
     * Pagina de conta com armazenamento local demonstrativo.
     */
    function renderizarConta() {
        var formulario = selecionar('[data-account-form]');
        if (!formulario) {
            return;
        }

        var perfil = lerJson(CHAVES_ARMAZENAMENTO.perfil, {});
        ['name', 'email', 'phone'].forEach(function (nomeCampo) {
            if (formulario.elements[nomeCampo] && perfil[nomeCampo]) {
                formulario.elements[nomeCampo].value = perfil[nomeCampo];
            }
        });

        var status = selecionar('[data-account-status]');
        if (status) {
            status.textContent = perfil.name
                ? 'Perfil local de ' + perfil.name
                : 'Nenhum perfil salvo neste navegador.';
        }

        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();
            if (!formulario.reportValidity()) {
                return;
            }

            var dados = Object.fromEntries(new FormData(formulario).entries());
            salvarJson(CHAVES_ARMAZENAMENTO.perfil, dados);
            if (status) {
                status.textContent = 'Perfil local de ' + dados.name;
            }
            mostrarAviso('Dados da conta salvos neste navegador.');
        });

        var botaoLimpar = selecionar('[data-account-clear]');
        if (botaoLimpar) {
            botaoLimpar.addEventListener('click', function () {
                localStorage.removeItem(CHAVES_ARMAZENAMENTO.perfil);
                formulario.reset();
                if (status) {
                    status.textContent = 'Nenhum perfil salvo neste navegador.';
                }
                mostrarAviso('Dados locais da conta apagados.');
            });
        }
    }

    /**
     * Comportamentos globais da interface.
     */
    function ligarEventosGlobais() {
        atualizarContadorCarrinho();

        selecionarTodos('[data-menu-toggle]').forEach(function (botao) {
            botao.addEventListener('click', function () {
                var nav = selecionar('[data-mobile-nav]');
                if (nav) {
                    nav.classList.toggle('is-open');
                    botao.setAttribute('aria-expanded', String(nav.classList.contains('is-open')));
                }
            });
        });

        selecionarTodos('[data-global-search]').forEach(function (formulario) {
            formulario.addEventListener('submit', function (evento) {
                evento.preventDefault();
                var campo = selecionar('input', formulario);
                var termo = campo ? campo.value.trim() : '';
                window.location.href = 'produtos.html' + (termo ? '?q=' + encodeURIComponent(termo) : '');
            });
        });

        selecionarTodos('[data-newsletter]').forEach(function (formulario) {
            formulario.addEventListener('submit', function (evento) {
                evento.preventDefault();
                var campo = selecionar('input[type="email"]', formulario);
                if (campo && campo.checkValidity()) {
                    mostrarAviso('Cadastro realizado. Voce recebera novidades da KICKS.');
                    formulario.reset();
                } else if (campo) {
                    campo.reportValidity();
                }
            });
        });

        selecionarTodos('[data-contact-form]').forEach(function (formulario) {
            formulario.addEventListener('submit', function (evento) {
                evento.preventDefault();
                if (formulario.reportValidity()) {
                    mostrarAviso('Mensagem registrada para demonstracao.');
                    formulario.reset();
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        ligarEventosGlobais();
        renderizarDestaques();
        renderizarCatalogo();
        renderizarFavoritos();
        renderizarDetalheProduto();
        renderizarCarrinho();
        renderizarCheckout();
        renderizarConta();
    });
})();
