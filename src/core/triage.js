/**
 * MODULE: Triage Engine
 * Description: Post-earthquake structural triage assessment motor
 * HITO: 2 - Core implementation with strict dominance rules
 * Principles:
 *   1. Critical damage (C1) dominates all lower levels
 *   2. Uncertainty (NO_SABE) in C1/C2 blocks green lights -> forces engineer inspection
 *   3. Full traceability with reason codes for audit
 */

const TriageModule = (() => {
  'use strict';

  /**
   * Severity categories mapped to Colombian NSR-10 standards
   * C1: Critical - Immediate life safety threat
   * C2: High - Significant structural damage
   * C3: Medium - Non-structural or minor damage
   * P4: Low - No evident damage
   * NR: Undetermined - Cannot assess due to incomplete data
   */
  const CRITICAL_C1_CONDITIONS = [
    'partial_collapse',      // Colapso parcial
    'total_collapse',        // Colapso total
    'column_crush',          // Trituración de nudos
    'column_displaced',      // Inclinación de columna
    'tilt',                  // Inclinación global
    'loss_support',          // Pérdida de apoyo
    'gas',                   // Fuga de gas
    'fire',                  // Incendio
    'electric'               // Peligro eléctrico
  ];

  const HIGH_C2_CONDITIONS = [
    'column_diag_crack',     // Grietas diagonales en columna
    'column_steel',          // Acero expuesto
    'beam_diag_crack',       // Grietas diagonales en viga
    'wall_diag',             // Grietas diagonales en muro
    'wall_out_plane',        // Muro desplazado/abombado
    'foundation_damage',     // Daño en cimentación
    'settlement',            // Asentamiento
    'landslide',             // Deslizamiento de ladera
    'masonry_diag',          // Grietas en X en mampostería
    'masonry_out_plane',     // Mampostería desplazada
    'facade_fall'            // Riesgo de caída de fachada
  ];

  const MEDIUM_C3_CONDITIONS = [
    'minor_crack',           // Grietas menores
    'debris',                // Escombros
    'suspended_hazard',      // Riesgo suspendido
    'ground_cracks',         // Grietas en terreno
    'hvac_damage',           // Daño en HVAC
    'partition_damage'       // Daño en tabiquería
  ];

  /**
   * Core evaluation function
   * Applies hierarchical rules with strict precedence:
   * 1. Check for uncertainty (NO_SABE) in critical fields -> NR (UNDETERMINED)
   * 2. Check for C1 critical conditions -> P1 (PREVENTIVE_EVACUATION)
   * 3. Check for C2 high-severity conditions -> P2 (PRIORITY_INSPECTION)
   * 4. Check for C3 medium-severity conditions -> P3 (RESTRICTED_USE)
   * 5. Default to P4 (NO_EVIDENT_DAMAGE) if no damage found
   *
   * @param {Object} assessment - Inspection assessment data
   * @param {Object} assessment.damages - Key-value pairs {condition: "YES"|"NO"|"NO_SABE"}
   * @param {Object} rules - Triage rules configuration (from config/rules/triage.json)
   * @returns {Object} {
   *   level: String ("🔴 P1" | "🟠 P2" | "🟡 P3" | "🟢 P4" | "⚪ NR"),
   *   result_code: String ("PREVENTIVE_EVACUATION" | "PRIORITY_INSPECTION" | "RESTRICTED_USE" | "NO_EVIDENT_DAMAGE" | "UNDETERMINED_INCERTIDUMBRE"),
   *   requiresTechnicalInspection: Boolean,
   *   reasons: Array<{condition: String, found: Boolean, severity: String}>,
   *   rule_version: String,
   *   timestamp: String (ISO)
   * }
   */
  function evaluateAssessment(assessment, rules) {
    const startTime = new Date().toISOString();
    const reasons = [];
    let hasUndeterminedC1 = false;
    let hasUndeterminedC2 = false;
    let foundC1 = false;
    let foundC2 = false;
    let foundC3 = false;

    // Normalize input
    const damages = assessment.damages || {};

    // ===== PHASE 1: Check for uncertainty in CRITICAL fields =====
    // If C1 or C2 are marked as NO_SABE, we cannot proceed with confidence
    for (const condition of CRITICAL_C1_CONDITIONS) {
      const value = damages[condition];
      if (value === 'NO_SABE' || value === undefined) {
        hasUndeterminedC1 = true;
        reasons.push({
          condition: condition,
          found: 'UNCERTAIN',
          severity: 'C1_UNCERTAINTY'
        });
      }
    }

    for (const condition of HIGH_C2_CONDITIONS) {
      const value = damages[condition];
      if (value === 'NO_SABE' || value === undefined) {
        hasUndeterminedC2 = true;
        reasons.push({
          condition: condition,
          found: 'UNCERTAIN',
          severity: 'C2_UNCERTAINTY'
        });
      }
    }

    // If uncertainty in C1 or C2, return NR immediately (block all green lights)
    if (hasUndeterminedC1 || hasUndeterminedC2) {
      return {
        level: '⚪ NR',
        result_code: 'UNDETERMINED_INCERTIDUMBRE',
        requiresTechnicalInspection: true,
        reasons: reasons,
        rule_version: rules.schema_version || '1.0',
        timestamp: startTime
      };
    }

    // ===== PHASE 2: Check for C1 conditions (CRITICAL) =====
    for (const condition of CRITICAL_C1_CONDITIONS) {
      if (damages[condition] === 'YES') {
        foundC1 = true;
        reasons.push({
          condition: condition,
          found: true,
          severity: 'C1_CRITICAL'
        });
      }
    }

    if (foundC1) {
      return {
        level: '🔴 P1',
        result_code: 'PREVENTIVE_EVACUATION',
        requiresTechnicalInspection: true,
        reasons: reasons,
        rule_version: rules.schema_version || '1.0',
        timestamp: startTime
      };
    }

    // ===== PHASE 3: Check for C2 conditions (HIGH) =====
    for (const condition of HIGH_C2_CONDITIONS) {
      if (damages[condition] === 'YES') {
        foundC2 = true;
        reasons.push({
          condition: condition,
          found: true,
          severity: 'C2_HIGH'
        });
      }
    }

    if (foundC2) {
      return {
        level: '🟠 P2',
        result_code: 'PRIORITY_INSPECTION',
        requiresTechnicalInspection: true,
        reasons: reasons,
        rule_version: rules.schema_version || '1.0',
        timestamp: startTime
      };
    }

    // ===== PHASE 4: Check for C3 conditions (MEDIUM) =====
    for (const condition of MEDIUM_C3_CONDITIONS) {
      if (damages[condition] === 'YES') {
        foundC3 = true;
        reasons.push({
          condition: condition,
          found: true,
          severity: 'C3_MEDIUM'
        });
      }
    }

    if (foundC3) {
      return {
        level: '🟡 P3',
        result_code: 'RESTRICTED_USE',
        requiresTechnicalInspection: true,
        reasons: reasons,
        rule_version: rules.schema_version || '1.0',
        timestamp: startTime
      };
    }

    // ===== PHASE 5: Default to P4 (NO DAMAGE) =====
    return {
      level: '🟢 P4',
      result_code: 'NO_EVIDENT_DAMAGE',
      requiresTechnicalInspection: false,
      reasons: [{
        condition: 'NO_DAMAGES',
        found: true,
        severity: 'P4_SAFE'
      }],
      rule_version: rules.schema_version || '1.0',
      timestamp: startTime
    };
  }

  /**
   * Validates if assessment data contains all required fields
   * @param {Object} assessment - Assessment data to validate
   * @returns {Object} {valid: Boolean, errors: Array<String>}
   */
  function validateAssessmentData(assessment) {
    const errors = [];

    if (!assessment) {
      errors.push('Assessment object is null or undefined');
      return { valid: false, errors };
    }

    if (!assessment.damages || typeof assessment.damages !== 'object') {
      errors.push('Assessment.damages must be a valid object');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Gets the risk level description (Spanish)
   * @param {String} level - Assessment level (P1-P4, NR)
   * @returns {String}
   */
  function getLevelDescription(level) {
    const descriptions = {
      '🔴 P1': 'Preventive evacuation - immediate life safety threat',
      '🟠 P2': 'Priority inspection - significant structural damage',
      '🟡 P3': 'Restricted use - non-structural damage or debris',
      '🟢 P4': 'No evident damage - building appears safe',
      '⚪ NR': 'Undetermined - incomplete assessment data'
    };
    return descriptions[level] || 'Unknown level';
  }

  /**
   * Gets action required based on result code
   * @param {String} resultCode - Result code from evaluation
   * @returns {String}
   */
  function getRequiredAction(resultCode) {
    const actions = {
      'PREVENTIVE_EVACUATION': 'Evacuate immediately. Engineer inspection required.',
      'PRIORITY_INSPECTION': 'Restrict building access. Schedule engineer inspection within 24 hours.',
      'RESTRICTED_USE': 'Restrict building use. Engineer inspection required.',
      'NO_EVIDENT_DAMAGE': 'Building appears safe. Normal use allowed.',
      'UNDETERMINED_INCERTIDUMBRE': 'Incomplete data. Engineer inspection required to determine safety.'
    };
    return actions[resultCode] || 'No action specified';
  }

  return {
    evaluateAssessment,
    validateAssessmentData,
    getLevelDescription,
    getRequiredAction,
    // Export condition arrays for testing
    CRITICAL_C1_CONDITIONS,
    HIGH_C2_CONDITIONS,
    MEDIUM_C3_CONDITIONS
  };
})();

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TriageModule;
}
