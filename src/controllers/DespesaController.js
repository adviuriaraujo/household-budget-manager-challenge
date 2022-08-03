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

    static async pegaUmaDespesa(req, res, next) {
        try {
            const { id } = req.params;
            const despesaDetalhada = await despesaServices.pegaUmRegistro(id);
            return res.status(200).json(despesaDetalhada);
        } catch (erro) {
            next(erro);
        }
    }

    static async cadastraDespesa(req, res, next) {
        try {
            const novaDespesa = req.body;
            await despesaServices.verificaDespesasDuplicadas(novaDespesa);
            const novaDespesaCadastrada = await despesaServices.criaRegistro(novaDespesa);
            return res.status(201).json(novaDespesaCadastrada);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizaDespesa(req, res, next) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;
            const despesaCadastrada = await despesaServices.pegaUmRegistro(id);
            if (dadosAtualizados.data && dadosAtualizados.descricao) {
                await despesaServices.verificaDespesasDuplicadas(dadosAtualizados, id);
            }
            if (dadosAtualizados.data && !dadosAtualizados.descricao) {
                await despesaServices.verificaDespesasDuplicadas({
                    descricao: despesaCadastrada.descricao,
                    data: dadosAtualizados.data,
                }, id);
            }
            if (!dadosAtualizados.data && dadosAtualizados.descricao) {
                await despesaServices.verificaDespesasDuplicadas({
                    descricao: dadosAtualizados.descricao,
                    data: despesaCadastrada.data,
                }, id);
            }
            await despesaServices.atualizaRegistro(dadosAtualizados, id);
            const despesaAtualizada = await despesaServices.pegaUmRegistro(id);
            return res.status(200).json(despesaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async removeDespesa(req, res, next) {
        try {
            const { id } = req.params;
            await despesaServices.removeRegistro(id);
            return res.status(200).json({ mensagem: `Despesa de id ${id} removida com sucesso!` })
        } catch (erro) {
            next(erro);
        }
    }
}

module.exports = { DespesaController };
