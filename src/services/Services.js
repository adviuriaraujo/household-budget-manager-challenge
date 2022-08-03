const database = require('../models');
const { NaoEncontradoError } = require('../errors');

class Services {
    constructor(nomeDoModelo){
        this.nomeDoModelo = nomeDoModelo
    }
    async pegaTodosRegistros(where = {}) {
        return database[this.nomeDoModelo].findAll(
            {
                attributes: ['descricao', 'valor', 'data'],
                where: {...where},
            }
        );
    }
    async pegaUmRegistro(id) {
        const registroEncontrado = await database[this.nomeDoModelo].findOne({
            attributes: ['descricao', 'valor', 'data'],
            where: { id: id }
        });
        if (!registroEncontrado) throw new NaoEncontradoError(id);
        return registroEncontrado;
    }
    async criaRegistro(dados) {
        return database[this.nomeDoModelo].create(dados);
    }
    async atualizaRegistro(dadosAtualizados, id) {
        return database[this.nomeDoModelo].update(dadosAtualizados, { where: { id: id } });
    }
}

module.exports = Services;
