const { DespesaServices } = require('../services');
const { validaParametrosObrigatorios } = require('../validations/');

const despesaServices = new DespesaServices();

class DespesaController {
    static async pegaTodasDespesas(req, res, next) {
        try {
            const parametrosDeBusca = despesaServices.validaBuscaDeDespesas(req.query);
            const todasDespesas = await despesaServices.pegaTodosRegistros(parametrosDeBusca);
            return res.status(200).json(todasDespesas);
        } catch (erro) {
            next(erro);
        }
    }

    static async pegaDespesasPorMes(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['ano', 'mes']);
            const { ano, mes } = req.params;
            const despesasPorMes = await despesaServices.pegaRegistrosPorMes(ano, mes);
            return res.status(200).json(despesasPorMes);
        } catch (erro) {
            next(erro);
        }
    }

    static async pegaUmaDespesa(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['id']);
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
            if (!novaDespesa.categoria) novaDespesa.categoria = 'Outras';
            validaParametrosObrigatorios(novaDespesa, ['descricao', 'valor', 'data', 'categoria']);
            novaDespesa.descricao = novaDespesa.descricao.toLowerCase();
            await despesaServices.verificaDespesasDuplicadas(novaDespesa);
            const novaDespesaCadastrada = await despesaServices.criaRegistro(novaDespesa);
            return res.status(201).json(novaDespesaCadastrada);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizaDespesa(req, res, next) {
        try {
            validaParametrosObrigatorios({ ...req.params, ...req.body }, ['id', ...Object.keys(req.body)]);
            const { id } = req.params;
            const dadosAtualizados = req.body;
            if (dadosAtualizados.hasOwnProperty('descricao')) {
                dadosAtualizados.descricao = dadosAtualizados.descricao.toLowerCase();
            }
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
            validaParametrosObrigatorios(req.params, ['id']);
            const { id } = req.params;
            await despesaServices.removeRegistro(id);
            return res.status(200).json({ mensagem: `Despesa de id ${id} removida com sucesso!` })
        } catch (erro) {
            next(erro);
        }
    }
}

module.exports = { DespesaController };
