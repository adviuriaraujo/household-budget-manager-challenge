const { DespesaServices } = require('../services');

const despesaServices = new DespesaServices();

class DespesaController {
    static async pegaTodasDespesas(req, res, next) {
        try {
            const todasDespesas = await despesaServices.pegaTodosRegistros();
            return res.status(200).json(todasDespesas);
        } catch (erro) {
            next(erro);
        }
    }
}

module.exports = { DespesaController };
