const { Router } = require('express');
const { ReceitaController } = require('../controllers');

const router = Router();

router
    .get('/receitas', ReceitaController.pegaTodasReceitas)
    .post('/receitas', ReceitaController.cadastraReceita)

module.exports = router;
