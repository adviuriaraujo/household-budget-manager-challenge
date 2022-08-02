const { ReceitaServices } = require('../services');
const receitaServices = new ReceitaServices();

class ReceitaController {
    static async pegaTodasReceitas(req, res, next) {
        try {
            const todasReceitas = await receitaServices.pegaTodosRegistros();
            return res.status(200).json(todasReceitas);
        } catch (erro) {
            next(erro);
        }
    }
    static async cadastraReceita(req, res, next) {
       const novaReceita = req.body;
       try {
        await receitaServices.verificaReceitasDuplicadas(novaReceita);
        const novaReceitaCadastrada = await receitaServices.criaRegistro(novaReceita);
        return res.status(201).json(novaReceitaCadastrada);
       } catch (erro) {
        next(erro);
       } 
    }
};

module.exports = { ReceitaController };