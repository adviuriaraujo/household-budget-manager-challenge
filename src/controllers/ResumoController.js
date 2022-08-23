const { ReceitaServices, DespesaServices } = require('../services');
const { validaParametrosObrigatorios } = require('../validations/');

const receitaServices = new ReceitaServices();
const despesaServices = new DespesaServices();

class ResumoController {
    static async opcoes(req, res, next) {
        const headersPermitidos = ['Accept','Content-Type', 'Access-Control-Allow-Origin'];
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        res.set('Access-Control-Allow-Headers', headersPermitidos)
        res.status(204)
        res.end()
    }
    static async pegaResumoDoMes(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['ano', 'mes']);
            const parametrosDeBusca = receitaServices.validaBusca({ mensal: req.params });
            const receitaTotalNoMes = (await receitaServices.somaValores(parametrosDeBusca)).toFixed(2);
            const despesaTotalNoMes = (await despesaServices.somaValores(parametrosDeBusca)).toFixed(2);
            const saldoFinalNoMes = (receitaTotalNoMes - despesaTotalNoMes).toFixed(2);
            const categorias = [
                'Alimentação',
                'Saúde',
                'Moradia',
                'Transporte',
                'Educação',
                'Lazer',
                'Imprevistos',
                'Outras',
            ];
            const somaCategorias = await despesaServices.somaCategorias(categorias, parametrosDeBusca);
            const resumoDoMes = {
                receita: receitaTotalNoMes,
                despesa: despesaTotalNoMes,
                saldo: saldoFinalNoMes,
                categorias: somaCategorias,
            };
            return res.status(200).json(resumoDoMes);
        } catch (erro) {
            next(erro);
        }
    }
}

module.exports = { ResumoController };
