/**
 * MÓDULO: AI Context
 * Descripción: Prepara contexto de datos para asistencia de IA
 * Responsabilidad: Normalizar lenguaje, detectar inconsistencias, sugerir datos faltantes
 * HITO: 8 (En HITO 1, solo estructura)
 * Estado: STUB - Interfaz definida, implementación en HITO 8
 * Regla: IA NO puede modificar result_code, certificar habitabilidad ni eliminar evidencia
 */

const AIContextModule = (() => {
  'use strict';

  /**
   * Prepara un reporte para análisis de IA
   * IMPLEMENTAR EN HITO 8: Normalizar datos, estructurar contexto
   * @param {Object} report - Reporte de inspección
   * @returns {Object} Contexto estructurado para IA
   */
  function prepareContext(report) {
    console.log('[AIContext] Preparando contexto para IA (STUB)');
    // IMPLEMENTAR EN HITO 8
    return {
      report_id: report.id,
      jurisdiction: report.jurisdiction,
      building_data: null,
      observations: null,
      photos_count: 0,
      result_code: report.result_code, // NO MODIFICAR
      reasons: report.reasons // NO ELIMINAR
    };
  }

  /**
   * Detecta inconsistencias en los datos del reporte
   * IMPLEMENTAR EN HITO 8
   * @param {Object} report
   * @returns {Array} Listado de inconsistencias detectadas
   */
  function detectInconsistencies(report) {
    console.log('[AIContext] Detectando inconsistencias (STUB)');
    // IMPLEMENTAR EN HITO 8
    return [];
  }

  /**
   * Sugiere campos faltantes o incompletos
   * IMPLEMENTAR EN HITO 8
   * @param {Object} report
   * @returns {Array} Campos sugeridos
   */
  function suggestMissingData(report) {
    console.log('[AIContext] Sugiriendo datos faltantes (STUB)');
    // IMPLEMENTAR EN HITO 8
    return [];
  }

  /**
   * Normaliza lenguaje de observaciones
   * IMPLEMENTAR EN HITO 8
   * @param {string} text
   * @returns {string} Texto normalizado
   */
  function normalizeObservations(text) {
    console.log('[AIContext] Normalizando observaciones (STUB)');
    // IMPLEMENTAR EN HITO 8
    return text;
  }

  /**
   * Genera prompt para IA manteniendo integridad de resultado
   * IMPLEMENTAR EN HITO 8
   * IMPORTANTE: El prompt NUNCA debe permitir que IA modifique result_code
   * @param {Object} report
   * @returns {string} Prompt estructurado
   */
  function generateAIPrompt(report) {
    console.log('[AIContext] Generando prompt para IA (STUB)');
    // IMPLEMENTAR EN HITO 8
    // GUARDRAIL: Incluir en el prompt: "NO MODIFIQUES result_code"
    return `
Analiza este reporte de inspección post-sismo.
RESTRICCIÓN CRÍTICA: NO MODIFIQUES result_code=${report.result_code}
Puedes:
- Sugerir datos faltantes
- Detectar inconsistencias
- Normalizar lenguaje
No puedes:
- Cambiar el nivel de triage
- Certificar habitabilidad
- Eliminar evidencia
    `.trim();
  }

  return {
    prepareContext,
    detectInconsistencies,
    suggestMissingData,
    normalizeObservations,
    generateAIPrompt
  };
})();
