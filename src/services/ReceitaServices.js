const Services = require('./Services');
const { ParametroInvalidoError } = require('../errors');

class ReceitaServices extends Services {
    constructor() {
        super('Receitas');
    }
    async verificaReceitasDuplicadas({ descricao, data }){
        const receitasComMesmaDescricao = await super.pegaTodosRegistros({ descricao });
        const mesDaReceita = data.substring(5,7);
        const receitasDuplicadas = receitasComMesmaDescricao.filter(({data}) => data.substring(5,7) === mesDaReceita);
        if (receitasDuplicadas.length > 0) throw new ParametroInvalidoError('Esta receita já existe para este mês!');
    }
}

module.exports = { ReceitaServices };
