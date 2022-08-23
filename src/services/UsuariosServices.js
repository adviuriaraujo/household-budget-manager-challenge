const bcrypt = require('bcrypt');
const Services = require('./Services');
const database = require('../models');
const { ParametroInvalidoError, NaoEncontradoError } = require('../errors');

class UsuariosServices extends Services {
    constructor(){
        super('Usuarios')
    }
    async gerarHash(senha) {
        const custoHash = 12;
        return bcrypt.hash(senha, custoHash);
    }
    async pegaTodosRegistros(where ={}) {
        return database[this.nomeDoModelo].findAll(
            {
                attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt'],
                where: {...where},
            }
        );
    }
    async pegaUmRegistro(id) {
        const registroEncontrado = database[this.nomeDoModelo].findOne(
            {
                attributes: ['id', 'nome', 'email', 'createdAt', 'updatedAt'],
                where: { id: id},
            }
        );
        if (!registroEncontrado) throw new NaoEncontradoError(id);
        return registroEncontrado;
    }
    async removeRegistro(id) {
        const registroEncontrado = await database[this.nomeDoModelo].findOne({
            attributes: ['id', 'nome', 'email'],
            where: { id: id }
        });
        if (!registroEncontrado) throw new NaoEncontradoError(id);
        return database[this.nomeDoModelo].destroy({ where: { id: id } });
    }
}

module.exports = { UsuariosServices };
