const { Router } = require('express');
const { ReceitaController } = require('../controllers');

const router = Router();

router
    .get('/receitas', ReceitaController.pegaTodasReceitas)
    .get('/receitas/:id', ReceitaController.pegaUmaReceita)
    .post('/receitas', ReceitaController.cadastraReceita)
    .put('/receitas/:id', ReceitaController.atualizaReceita)
    .delete('/receitas/:id', ReceitaController.removeReceita)

module.exports = router;
