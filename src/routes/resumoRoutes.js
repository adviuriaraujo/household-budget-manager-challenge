const { Router } = require('express');
const { ResumoController } = require('../controllers');

const router = Router();

router
    .get('/resumo/:ano/:mes', ResumoController.pegaResumoDoMes)

module.exports = router;
