const { Op } = require('sequelize');
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
    async pegaRegistrosPorMes(ano, mes) {
        return database[this.nomeDoModelo].findAll(
            {
                attributes: ['descricao', 'valor', 'data'],
                where: {
                    data: {
                        [Op.gte]: `${ano}-${mes}-01`,
                        [Op.lt]: `${ano}-${Number(mes) + 1}-01`
                    }
                }
            }
        )
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
    async removeRegistro(id) {
        const registroEncontrado = await database[this.nomeDoModelo].findOne({
            attributes: ['descricao', 'valor', 'data'],
            where: { id: id }
        });
        if (!registroEncontrado) throw new NaoEncontradoError(id);
        return database[this.nomeDoModelo].destroy({ where: { id: id } });
    }
}

module.exports = Services;
