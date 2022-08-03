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
    static async pegaUmaReceita(req, res, next) {
        try {
            const { id } = req.params;
            const receitaDetalhada = await receitaServices.pegaUmRegistro(id);
            return res.status(200).json(receitaDetalhada);
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
    static async atualizaReceita(req, res, next) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;
            const receitaCadastrada = await receitaServices.pegaUmRegistro(id);
            if (dadosAtualizados.data && dadosAtualizados.descricao) {
                await receitaServices.verificaReceitasDuplicadas(dadosAtualizados, id);
            }
            if (dadosAtualizados.data && !dadosAtualizados.descricao) {
                await receitaServices.verificaReceitasDuplicadas({
                    descricao: receitaCadastrada.descricao,
                    data: dadosAtualizados.data,
                }, id);
            }
            if (!dadosAtualizados.data && dadosAtualizados.descricao) {
                await receitaServices.verificaReceitasDuplicadas({
                    descricao: dadosAtualizados.descricao,
                    data: receitaCadastrada.data,
                }, id);
            }
            await receitaServices.atualizaRegistro(dadosAtualizados, id);
            const receitaAtualizada = await receitaServices.pegaUmRegistro(id);
            return res.status(200).json(receitaAtualizada)
        } catch (erro) {
           next(erro) 
        }
    }
};

module.exports = { ReceitaController };