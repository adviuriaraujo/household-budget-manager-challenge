const { Op } = require('sequelize');
const Services = require('./Services');
const { ParametroInvalidoError } = require('../errors');

class DespesaServices extends Services {
    constructor(){
        super('Despesas');
    }
    async verificaDespesasDuplicadas({ descricao, data }, id = null){
        const despesasComMesmaDescricao = await super.pegaTodosRegistros({
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
