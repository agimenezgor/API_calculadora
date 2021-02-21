function setPrintMessage(supplierConditioning, supplierRemaining){
    if(supplierConditioning > supplierRemaining){
        return 'No tienes suficiente espacio para realizar el pedido';
    }
    return "Pedido calculado correctamente";
}

module.exports = setPrintMessage;