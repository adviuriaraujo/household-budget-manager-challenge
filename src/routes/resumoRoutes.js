const { Router } = require('express');
const { ResumoController } = require('../controllers');

const router = Router();

router
    .options('/*', ResumoController.opcoes)
    .get('/resumo/:ano/:mes', ResumoController.pegaResumoDoMes)

module.exports = router;
