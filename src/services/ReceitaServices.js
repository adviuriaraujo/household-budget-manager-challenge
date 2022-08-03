const { Op } = require('sequelize');
const Services = require('./Services');
const { ParametroInvalidoError } = require('../errors');

class ReceitaServices extends Services {
    constructor() {
        super('Receitas');
    }
    async verificaReceitasDuplicadas({ descricao, data }, id = null){
        const receitasComMesmaDescricao = await super.pegaTodosRegistros({
            [Op.and]: [
                { descricao: descricao },
                { id: { [Op.not]: id }}
            ]
        });
        const mesDaReceita = data.substring(5,7);
        const receitasDuplicadas = receitasComMesmaDescricao.filter(({data}) => data.substring(5,7) === mesDaReceita);
        if (receitasDuplicadas.length > 0) throw new ParametroInvalidoError('Esta receita já existe para este mês!');
    }
}

module.exports = { ReceitaServices };
