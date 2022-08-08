const { Op } = require('sequelize');
const Services = require('./Services');
const { ParametroInvalidoError } = require('../errors');

class ReceitaServices extends Services {
    constructor() {
        super('Receitas');
    }
    validaBuscaDeReceitas(parametrosDeRequisicao) {
        const listaDeParametros = Object.keys(parametrosDeRequisicao);
        const parametrosDeBusca = {};
        const adicionaParametros = {
            descricao: () => {
                parametrosDeBusca.descricao = {
                    [Op.like]: `%${parametrosDeRequisicao.descricao.toLowerCase()}%`
                };
            },
            mensal: () => {
                const { ano, mes } = parametrosDeRequisicao.mensal;
                parametrosDeBusca.data = {
                    [Op.gte]: `${ano}-${mes}-01`,
                    [Op.lt]: `${ano}-${Number(mes) + 1}-01`
                };
            },
        };
        if (listaDeParametros.length > 0) {
            listaDeParametros.forEach(parametro => adicionaParametros[parametro]());
        }
        return parametrosDeBusca;
    }
    async verificaReceitasDuplicadas({ descricao, data }, id = null){
        const receitasComMesmaDescricao = await super.pegaTodosRegistros({
            [Op.and]: [
                { descricao: descricao },
                { id: { [Op.not]: id }}
            ]
        });
        const mesDaReceita = data.substring(0,7);
        const receitasDuplicadas = receitasComMesmaDescricao.filter(({data}) => data.substring(0,7) === mesDaReceita);
        if (receitasDuplicadas.length > 0) throw new ParametroInvalidoError('Esta receita já existe para este mês!');
    }
}

module.exports = { ReceitaServices };
