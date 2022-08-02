class ParametroInvalidoError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'ParametroInvalidoError';
    }
}

module.exports = { ParametroInvalidoError };
