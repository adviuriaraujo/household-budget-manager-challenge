const { Op } = require('sequelize');
const Services = require('./Services');
const database = require('../models');
const { ParametroInvalidoError, NaoEncontradoError } = require('../errors');

class DespesaServices extends Services {
    constructor(){
        super('Despesas');
    }
    validaBuscaDeDespesas(parametrosDeRequisicao) {
        const listaDeParametros = Object.keys(parametrosDeRequisicao);
        const parametrosDeBusca = {};
        const adicionaParametros = {
            descricao: () => {
                parametrosDeBusca.descricao = {
                    [Op.like]: `%${parametrosDeRequisicao.descricao.toLowerCase()}%`
                };
            },
        };
        if (listaDeParametros.length > 0) {
            listaDeParametros.forEach(parametro => adicionaParametros[parametro]());
        }
        return parametrosDeBusca;
    }
    async pegaTodosRegistros(where = {}) {
        return database[this.nomeDoModelo].findAll(
            {
                attributes: ['descricao', 'valor', 'data', 'categoria'],
                where: {...where},
            }
        );
    }
    async pegaRegistrosPorMes(ano, mes) {
        return database[this.nomeDoModelo].findAll(
            {
                attributes: ['descricao', 'valor', 'data', 'categoria'],
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
}

module.exports = { DespesaServices };
