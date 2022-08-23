const { ReceitaServices } = require('../services');
const { validaParametrosObrigatorios } = require('../validations/');

const receitaServices = new ReceitaServices();

class ReceitaController {
    static async opcoes(req, res, next) {
        const headersPermitidos = ['Accept','Content-Type', 'Access-Control-Allow-Origin'];
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        res.set('Access-Control-Allow-Headers', headersPermitidos)
        res.status(204)
        res.end()
    }
    static async pegaTodasReceitas(req, res, next) {
        try {
            const parametrosDeBusca = receitaServices.validaBusca(req.query);
            const todasReceitas = await receitaServices.pegaTodosRegistros(parametrosDeBusca);
            return res.status(200).json(todasReceitas);
        } catch (erro) {
            next(erro);
        }
    }
    static async pegaReceitasPorMes(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['ano', 'mes']);
            const parametrosDeBusca = receitaServices.validaBusca({ mensal: req.params });
            const receitasPorMes = await receitaServices.pegaTodosRegistros(parametrosDeBusca);
            return res.status(200).json(receitasPorMes);
        } catch (erro) {
            next(erro);
        }
    }
    static async pegaUmaReceita(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['id']);
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
        validaParametrosObrigatorios(novaReceita, ['descricao', 'valor', 'data']);
        novaReceita.descricao = novaReceita.descricao.toLowerCase();
        await receitaServices.verificaReceitasDuplicadas(novaReceita);
        const novaReceitaCadastrada = await receitaServices.criaRegistro(novaReceita);
        return res.status(201).json(novaReceitaCadastrada);
       } catch (erro) {
        next(erro);
       } 
    }
    static async atualizaReceita(req, res, next) {
        try {
            validaParametrosObrigatorios({ ...req.params, ...req.body }, ['id', ...Object.keys(req.body)]);
            const { id } = req.params;
            const dadosAtualizados = req.body;
            if (dadosAtualizados.hasOwnProperty('descricao')) {
                dadosAtualizados.descricao = dadosAtualizados.descricao.toLowerCase();
            }
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
            return res.status(200).json(receitaAtualizada);
        } catch (erro) {
           next(erro); 
        }
    }
    static async removeReceita(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['id']);
            const { id } = req.params;
            await receitaServices.removeRegistro(id);
            return res.status(200).json({ mensagem: `Receita de id ${id} removida com sucesso!` });
        } catch (erro) {
            next(erro);
        }
    }
};

module.exports = { ReceitaController };