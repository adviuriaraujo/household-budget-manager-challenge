const bodyParser = require('body-parser');
const receitas = require('./receitaRoutes');
const despesas = require('./despesaRoutes');
const resumo = require('./resumoRoutes');
const { errorHandler, cors, contentType } = require('../middleware');

module.exports = app => {
    app.use(
        contentType.set,
        cors.origin,
        bodyParser.json(),
        receitas,
        despesas,
        resumo,
        errorHandler,
    )
};