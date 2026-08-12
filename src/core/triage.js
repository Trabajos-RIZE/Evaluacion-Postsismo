/**
 * MÓDULO: Triage
 * Descripción: Motor de evaluación - Aplica reglas de triage a datos de inspección
 * Responsabilidad: Evaluar condiciones observadas y emitir nivel (P1-P4, NR)
 * HITO: 2 (En HITO 1, solo estructura)
 * Estado: STUB - Interfaz definida, implementación en HITO 2
 */

const TriageModule = (() => {
  'use strict';

  /**
   * Evalúa los datos de inspección contra las reglas de triage
   * IMPLEMENTAR EN HITO 2: Lógica de motor de reglas
   *
   * @param {Object} assessment - Datos de inspección capturados
   * @param {Object} rules - Reglas de triage (config/rules/triage.json)
   * @returns {Object} {
   *   result_code: 'P1'|'P2'|'P3'|'P4'|'NR',
   *   reasons: Array<{rule_id, reason}>,
   *   rule_version: '1.0',
   *   timestamp: ISOString
   * }
   */
  function evaluateAssessment(assessment, rules) {
    console.log('[Triage] Evaluando inspección (STUB)');
    console.log('[Triage] Datos recibidos:', assessment);
    console.log('[Triage] Versión de reglas:', rules.schema_version);

    // STUB: Devolver NR (no evaluable) por ahora
    // IMPLEMENTAR EN HITO 2: Lógica real de motor de reglas
    return {
      result_code: 'NR',
      reasons: [{
        rule_id: 'R-NR-001',
        reason: 'Motor de evaluación no implementado todavía. Implementación en HITO 2.'
      }],
      rule_version: rules.schema_version,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Valida si el resultado es válido según prioridad
   * @param {string} resultCode - Código de resultado (P1-P4, NR)
   * @returns {boolean}
   */
  function isValidResult(resultCode) {
    const VALID_RESULTS = ['P1', 'P2', 'P3', 'P4', 'NR'];
    return VALID_RESULTS.includes(resultCode);
  }

  /**
   * Obtiene el color del nivel para UI
   * @param {string} level - P1, P2, P3, P4 o NR
   * @returns {string} Color CSS
   */
  function getLevelColor(level) {
    const colors = {
      'P1': '#28a745', // Verde
      'P2': '#ffc107', // Amarillo
      'P3': '#ff9800', // Naranja
      'P4': '#dc3545', // Rojo
      'NR': '#6c757d'  // Gris
    };
    return colors[level] || '#6c757d';
  }

  /**
   * Obtiene descripción del nivel en español
   * @param {string} level - P1, P2, P3, P4 o NR
   * @returns {string}
   */
  function getLevelDescription(level) {
    const descriptions = {
      'P1': 'Sin indicios relevantes observados',
      'P2': 'Revisión recomendada',
      'P3': 'Restricción de uso / Evaluación técnica prioritaria',
      'P4': 'Peligro de colapso / No habitable',
      'NR': 'No evaluable'
    };
    return descriptions[level] || 'Desconocido';
  }

  return {
    evaluateAssessment,
    isValidResult,
    getLevelColor,
    getLevelDescription
  };
})();
