class NaoEncontradoError extends Error {
    constructor(id) {
        const mensagem = `O registro de id ${id} não foi encontrado!`
        super(mensagem);
        this.name = 'NaoEncontradoError'
    }
}

module.exports = { NaoEncontradoError };
