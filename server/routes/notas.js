const express = require('express');
const router = express.Router();
const notaController = require('../controllers/nota.controller');

/**
 * POST /api/notas/emitir
 * Emite NF-e e retorna PDF
 */
router.post('/emitir', notaController.emitirNota);

/**
 * GET /api/notas/historico
 * Lista todas notas emitidas
 */
router.get('/historico', notaController.listarHistorico);

/**
 * GET /api/notas/:eventoId/pdf
 * Busca PDF de nota específica
 */
router.get('/:eventoId/pdf', notaController.buscarPDFNota);

module.exports = router;