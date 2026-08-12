/**
 * MÓDULO: Config
 * Descripción: Cargador de configuración jurisdiccional y reglas de triage
 * Responsabilidad: Cargar y validar config/jurisdictions/*.json y config/rules/triage.json
 * HITO: 1
 * Estado: STUB - Estructura lista para implementación en HITO 2
 */

const ConfigModule = (() => {
  'use strict';

  // Configuración de Cali (hardcoded por ahora, se puede extender)
  const DEFAULT_JURISDICTION = {
    id: 'cali-co',
    name: 'Santiago de Cali',
    country: 'Colombia',
    language: 'es-CO',
    institutional: [
      'Secretaría de Gestión del Riesgo de Emergencias y Desastres',
      'IDESC',
      'SATIC'
    ],
    standards: [
      'NSR-10 y modificaciones vigentes',
      'AIS/IDIGER — metodología post-sismo, sujeto a validación institucional'
    ],
    emergency_message: 'Si existe peligro inmediato, no ingrese. Active la ruta local de emergencias.'
  };

  // Reglas de triage (versión 1.0)
  const DEFAULT_RULES = {
    schema_version: '1.0',
    priority: ['P4', 'P3', 'P2', 'P1', 'NR'],
    rules: [
      // P4 - Peligro inmediato
      { rule_id: 'R-P4-001', condition: 'partial_collapse', level: 'P4', reason: 'Colapso parcial observado.' },
      { rule_id: 'R-P4-002', condition: 'column_crush', level: 'P4', reason: 'Aplastamiento/desprendimiento crítico en columna.' },
      { rule_id: 'R-P4-003', condition: 'column_displaced', level: 'P4', reason: 'Desplazamiento/inclinación de columna.' },
      { rule_id: 'R-P4-004', condition: 'tilt', level: 'P4', reason: 'Inclinación global de la edificación.' },
      { rule_id: 'R-P4-005', condition: 'loss_support', level: 'P4', reason: 'Pérdida de apoyo observada.' },
      { rule_id: 'R-P4-006', condition: 'gas', level: 'P4', reason: 'Olor o fuga de gas.' },
      { rule_id: 'R-P4-007', condition: 'fire', level: 'P4', reason: 'Incendio o evidencia reciente.' },
      { rule_id: 'R-P4-008', condition: 'electric', level: 'P4', reason: 'Peligro eléctrico inmediato.' },
      // P3 - Restricción / Evaluación técnica prioritaria
      { rule_id: 'R-P3-001', condition: 'column_diag_crack', level: 'P3', reason: 'Daño visible en columna requiere evaluación.' },
      { rule_id: 'R-P3-002', condition: 'column_steel', level: 'P3', reason: 'Acero de columna expuesto/deformado.' },
      { rule_id: 'R-P3-003', condition: 'beam_diag_crack', level: 'P3', reason: 'Daño visible en viga.' },
      { rule_id: 'R-P3-004', condition: 'wall_diag', level: 'P3', reason: 'Daño visible en muro estructural.' },
      { rule_id: 'R-P3-005', condition: 'wall_out_plane', level: 'P3', reason: 'Muro estructural desplazado/abombado.' },
      { rule_id: 'R-P3-006', condition: 'foundation_damage', level: 'P3', reason: 'Daño visible en cimentación.' },
      { rule_id: 'R-P3-007', condition: 'settlement', level: 'P3', reason: 'Asentamiento visible.' },
      { rule_id: 'R-P3-008', condition: 'landslide', level: 'P3', reason: 'Deslizamiento/talud inestable.' },
      { rule_id: 'R-P3-009', condition: 'masonry_out_plane', level: 'P3', reason: 'Mampostería desplazada.' },
      { rule_id: 'R-P3-010', condition: 'facade_fall', level: 'P3', reason: 'Elemento de fachada con riesgo de caída.' },
      // P2 - Revisión recomendada
      { rule_id: 'R-P2-001', condition: 'ground_cracks', level: 'P2', reason: 'Grietas nuevas observadas en terreno.' },
      { rule_id: 'R-P2-002', condition: 'masonry_diag', level: 'P2', reason: 'Grietas diagonales en mampostería.' }
    ]
  };

  /**
   * Carga la configuración de jurisdicción
   * IMPLEMENTAR EN HITO 2: cargar desde archivo JSON
   * @returns {Promise<Object>} Configuración de jurisdicción
   */
  async function loadJurisdiction() {
    try {
      console.log('[Config] Cargando configuración de jurisdicción: Cali');
      return DEFAULT_JURISDICTION;
    } catch (error) {
      console.error('[Config] Error al cargar jurisdicción:', error);
      throw error;
    }
  }

  /**
   * Carga las reglas de triage
   * IMPLEMENTAR EN HITO 2: cargar desde archivo JSON
   * @returns {Promise<Object>} Reglas de triage
   */
  async function loadRules() {
    try {
      console.log('[Config] Cargando reglas de triage v' + DEFAULT_RULES.schema_version);
      return DEFAULT_RULES;
    } catch (error) {
      console.error('[Config] Error al cargar reglas:', error);
      throw error;
    }
  }

  /**
   * Obtiene toda la configuración
   * @returns {Promise<Object>} { jurisdiction, rules }
   */
  async function load() {
    const [jurisdiction, rules] = await Promise.all([
      loadJurisdiction(),
      loadRules()
    ]);

    return { jurisdiction, rules };
  }

  return {
    load,
    loadJurisdiction,
    loadRules
  };
})();
