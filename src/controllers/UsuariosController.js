const { UsuariosServices } = require('../services');
const { validaParametrosObrigatorios } = require('../validations/');

const usuariosServices = new UsuariosServices();

class UsuariosController {
    static async opcoes(req, res, next) {
        const headersPermitidos = ['Accept','Content-Type', 'Access-Control-Allow-Origin'];
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        res.set('Access-Control-Allow-Headers', headersPermitidos)
        res.status(204)
        res.end()
    }

    static async pegaTodosUsuarios(req, res, next) {
        try {
            const todosUsuarios = await usuariosServices.pegaTodosRegistros();
            return res.status(200).json(todosUsuarios);
        } catch (erro) {
            next(erro)
        }
    }

    static async pegaUmUsuario(req, res, next) {
        try {
            validaParametrosObrigatorios(req.params, ['id']);
            const { id } = req.params;
            const usuarioDetalhado = await usuariosServices.pegaUmRegistro(id);
            return res.status(200).json(usuarioDetalhado);
        } catch (erro) {
            next(erro)
        }
    }

    static async cadastraUsuario(req, res, next) {
        try {
            const novoUsuario = req.body;
            validaParametrosObrigatorios(novoUsuario, ['nome', 'email', 'senha']);
            novoUsuario.senha = await usuariosServices.gerarHash(novoUsuario.senha);
            const novoUsuarioCriado = await usuariosServices.criaRegistro(novoUsuario);
            return res.status(201).json(novoUsuarioCriado);
        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = { UsuariosController };
