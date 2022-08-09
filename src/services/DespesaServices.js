const { Op } = require('sequelize');
const Services = require('./Services');
const database = require('../models');
const { ParametroInvalidoError, NaoEncontradoError } = require('../errors');

class DespesaServices extends Services {
    constructor(){
        super('Despesas');
    }
    async pegaTodosRegistros(where = {}) {
        return database[this.nomeDoModelo].findAll(
            {
                attributes: ['descricao', 'valor', 'data', 'categoria'],
                where: {...where},
            }
        );
    }
    async pegaUmRegistro(id) {
        const registroEncontrado = await database[this.nomeDoModelo].findOne({
            attributes: ['descricao', 'valor', 'data', 'categoria'],
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
            attributes: ['descricao', 'valor', 'data', 'categoria'],
            where: { id: id }
        });
        if (!registroEncontrado) throw new NaoEncontradoError(id);
        return database[this.nomeDoModelo].destroy({ where: { id: id } });
    }
    async verificaDespesasDuplicadas({ descricao, data }, id = null){
        const despesasComMesmaDescricao = await this.pegaTodosRegistros({
            [Op.and]: [
                { descricao: descricao },
                { id: { [Op.not]: id }}
            ]
        });
        console
        const mesDaDespesa = data.substring(0,7);
        const despesasDuplicadas = despesasComMesmaDescricao.filter(({data}) => data.substring(0,7) === mesDaDespesa);
        if (despesasDuplicadas.length > 0) throw new ParametroInvalidoError('Esta despesa já existe para este mês!');
    }
    async somaCategorias(categorias, where = {}) {
        const somaCategorias = {};
        const despesasNoMes = await database[this.nomeDoModelo].findAll({
            attributes: ['valor', 'categoria'],
            where: {...where},
        });
        categorias.forEach(categoria => {
            const despesasNaCategoria = despesasNoMes
            .filter(despesa => despesa.categoria === categoria)
            .map(despesa => despesa.valor)
            .reduce( (despesaAnterior, despesaSeguinte) => despesaAnterior + despesaSeguinte, 0)
            somaCategorias[categoria] = despesasNaCategoria.toFixed(2);
        });
        return somaCategorias;
    }
}

module.exports = { DespesaServices };
