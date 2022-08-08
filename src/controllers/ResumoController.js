const { ReceitaServices, DespesaServices } = require('../services');
const { validaParametrosObrigatorios } = require('../validations/');
// TODO: RECEITA -DESPESA E DESPESA POR CATEGORIA

const receitaServices = new ReceitaServices();
const despesaServices = new DespesaServices();

class ResumoController {
    static async pegaResumoDoMes(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['ano', 'mes']);
            const parametrosDeBusca = receitaServices.validaBusca({ mensal: req.params });
            const receitaTotalNoMes = (await receitaServices.somaValores(parametrosDeBusca)).toFixed(2);
            const despesaTotalNoMes = (await despesaServices.somaValores(parametrosDeBusca)).toFixed(2);
            return res.status(200).json({receita: receitaTotalNoMes, despesa: despesaTotalNoMes});
        } catch (erro) {
            next(erro);
        }
    }
}

module.exports = { ResumoController };
