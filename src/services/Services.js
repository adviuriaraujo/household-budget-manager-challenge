const database = require('../models');
class Services {
    constructor(nomeDoModelo){
        this.nomeDoModelo = nomeDoModelo
    }
    async pegaTodosRegistros(where = {}) {
        return database[this.nomeDoModelo].findAll({ where: {...where} });
    }
    async criaRegistro(dados) {
        return database[this.nomeDoModelo].create(dados);
    }
}

module.exports = Services;
