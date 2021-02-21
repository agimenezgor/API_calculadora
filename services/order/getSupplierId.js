const findUser = require("../findUser")
async function getSupplierId(req, res){
    //Buscamos el id del usuario
    let token = req.headers.authorization.split(' ')[1];
    let userId = await findUser(token, res);

    // Devolvemos el id del proveedor
    return userId + req.params.number;
}
module.exports = getSupplierId;