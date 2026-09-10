/**
 * Configuracao compartilhada da loja.
 * Ajuste principalmente `numeroWhatsapp` para o fluxo de finalizacao do pedido.
 */
window.CONFIG_LOJA = {
    nomeLoja: 'KICKS',
    moeda: 'BRL',
    localidade: 'pt-BR',
    numeroWhatsapp: '5551999999999',
    limiteFreteGratis: 299,
    valorFrete: 29.9,
    cupons: {
        KICKS10: {
            tipo: 'porcentagem',
            valor: 10,
            descricao: '10% de desconto no subtotal'
        },
        FRETEGRATIS: {
            tipo: 'frete',
            valor: 0,
            descricao: 'Frete gratis'
        }
    }
};
