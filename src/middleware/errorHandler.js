function errorHandler(error, req, res, next) {
    let status = 500;
    console.error(error)
    if (error.name === 'ParametroInvalidoError') status = 400;
    if(error.name === 'NaoEncontradoError') status = 404;
    return res
        .status(status)
        .json({ erro: error.name, mensagem: error.message || 'Erro interno do servidor' });
}

module.exports = { errorHandler };
