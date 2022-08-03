const { Router } = require('express');
const { DespesaController } = require('../controllers');

const router = Router();

router
    .get('/despesas', DespesaController.pegaTodasDespesas)
    .get('/despesas/:id', DespesaController.pegaUmaDespesa)
    .post('/despesas', DespesaController.cadastraDespesa)
    .put('/despesas/:id', DespesaController.atualizaDespesa)
    .delete('/despesas/:id', DespesaController.removeDespesa)

module.exports = router;