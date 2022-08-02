function errorHandler(error, req, res, next) {
    let status = 500;
    console.error(error)
    if (error.name === 'ParametroInvalidoError') status = 400;
    return res
        .status(status)
        .json({ erro: error.name || 'Erro interno do servidor', mensagem: error.message });
}

module.exports = { errorHandler };
