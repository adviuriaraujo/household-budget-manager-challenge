const bodyParser = require('body-parser');
const receitas = require('./receitaRoutes');
const { errorHandler } = require('../middleware');

module.exports = app => {
    app.use(
        bodyParser.json(),
        receitas,
        errorHandler,
    )
};