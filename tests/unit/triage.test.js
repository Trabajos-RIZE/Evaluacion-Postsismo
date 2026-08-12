/**
 * TEST SUITE: Triage Engine Unit Tests
 * HITO: 2 - Validate strict dominance rules and uncertainty handling
 * Framework: Vanilla JavaScript assertions (no external dependencies)
 * 
 * Test Cases:
 *   1. C1 dominance: Single critical condition overrides all "NO" answers
 *   2. C2 dominance: High severity conditions trigger P2
 *   3. Uncertainty handling: NO_SABE in C1/C2 forces NR
 *   4. Safe building: All "NO" answers -> P4
 */

// Simple assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ Assertion failed: ${message}\n   Expected: ${expected}\n   Actual: ${actual}`);
  }
  console.log(`✓ ${message}`);
}

function assertTrue(condition, message) {
  assert(condition === true, message);
}

function assertFalse(condition, message) {
  assert(condition === false, message);
}

/**
 * UNIT TEST: C1 Dominance
 * Rule: A single critical condition (C1) marked "YES" must return 🔴 P1
 * Scenario: All damages are "NO" except one critical condition
 */
function testC1Dominance_ColumnCrush() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      // All critical C1 conditions are NO
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'YES',      // <-- Single YES in C1
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      // All C2 conditions are NO
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'NO',
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      // All C3 conditions are NO
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '🔴 P1', 'Level must be P1 for critical column crush');
  assertEqual(result.result_code, 'PREVENTIVE_EVACUATION', 'Result code must be PREVENTIVE_EVACUATION');
  assertTrue(result.requiresTechnicalInspection, 'Technical inspection required for P1');
  assert(result.reasons.some(r => r.condition === 'column_crush'), 'Must document column_crush reason');
}

/**
 * UNIT TEST: C1 Dominance - Tilt
 * Rule: Inclination of building marked "YES" must return 🔴 P1
 */
function testC1Dominance_TiltIncline() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'YES',              // <-- Global inclination detected
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'NO',
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '🔴 P1', 'Level must be P1 for global tilt');
  assertEqual(result.result_code, 'PREVENTIVE_EVACUATION', 'Result code must be PREVENTIVE_EVACUATION');
  assertTrue(result.requiresTechnicalInspection, 'Technical inspection required');
  assert(result.reasons.some(r => r.condition === 'tilt'), 'Must document tilt reason');
}

/**
 * UNIT TEST: C2 Dominance - Exposed Steel
 * Rule: Exposed steel in structural element marked "YES" must return 🟠 P2
 */
function testC2Dominance_ExposedSteel() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      // All C1 conditions are NO
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      // C2: Single YES
      'column_diag_crack': 'NO',
      'column_steel': 'YES',      // <-- Exposed steel
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'NO',
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '🟠 P2', 'Level must be P2 for exposed steel');
  assertEqual(result.result_code, 'PRIORITY_INSPECTION', 'Result code must be PRIORITY_INSPECTION');
  assertTrue(result.requiresTechnicalInspection, 'Technical inspection required');
  assert(result.reasons.some(r => r.condition === 'column_steel'), 'Must document column_steel reason');
}

/**
 * UNIT TEST: C2 Dominance - Landslide
 * Rule: Landslide marked "YES" must return 🟠 P2
 */
function testC2Dominance_Landslide() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'YES',         // <-- Landslide detected
      'masonry_diag': 'NO',
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '🟠 P2', 'Level must be P2 for landslide');
  assertEqual(result.result_code, 'PRIORITY_INSPECTION', 'Result code must be PRIORITY_INSPECTION');
  assertTrue(result.requiresTechnicalInspection, 'Technical inspection required');
}

/**
 * UNIT TEST: C2 Dominance - Masonry X-Cracks
 * Rule: Diagonal cracks in masonry marked "YES" must return 🟠 P2
 */
function testC2Dominance_MasonryDiagonalCracks() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'YES',      // <-- X-cracks in masonry
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '🟠 P2', 'Level must be P2 for masonry diagonal cracks');
  assertEqual(result.result_code, 'PRIORITY_INSPECTION', 'Result code must be PRIORITY_INSPECTION');
}

/**
 * UNIT TEST: Uncertainty Handling - NO_SABE in C1
 * Rule: If any C1 condition is marked "NO_SABE" or omitted, 
 *       return 🔘 NR to force engineer inspection
 * Business Logic: We CANNOT assume "NO" when data is missing
 */
function testUncertainty_C1_NoSabe() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'NO_SABE',  // <-- Uncertain about masonry cracks
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '⚪ NR', 'Level must be NR when C2 has NO_SABE');
  assertEqual(result.result_code, 'UNDETERMINED_INCERTIDUMBRE', 'Result code must be UNDETERMINED_INCERTIDUMBRE');
  assertTrue(result.requiresTechnicalInspection, 'Technical inspection mandatory for undetermined');
}

/**
 * UNIT TEST: Uncertainty Handling - Missing C1 field
 * Rule: If C1 field is undefined (not provided), treat as uncertainty
 */
function testUncertainty_C1_Undefined() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      // masonry_diag: OMITTED (undefined)
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '⚪ NR', 'Level must be NR when C2 is undefined');
  assertEqual(result.result_code, 'UNDETERMINED_INCERTIDUMBRE', 'Result code must be UNDETERMINED_INCERTIDUMBRE');
}

/**
 * UNIT TEST: C3 Dominance (Non-Structural Damage)
 * Rule: If all C1 and C2 are "NO", but C3 has "YES", return 🟡 P3
 */
function testC3Dominance_Debris() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'NO',
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'YES',           // <-- Non-structural debris
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '🟡 P3', 'Level must be P3 for non-structural debris');
  assertEqual(result.result_code, 'RESTRICTED_USE', 'Result code must be RESTRICTED_USE');
  assertTrue(result.requiresTechnicalInspection, 'Technical inspection required');
}

/**
 * UNIT TEST: Safe Building - All NO
 * Rule: If all conditions are "NO", return 🟢 P4 (safe)
 */
function testSafeBuilding_AllNo() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'NO',
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.level, '🟢 P4', 'Level must be P4 when no damage found');
  assertEqual(result.result_code, 'NO_EVIDENT_DAMAGE', 'Result code must be NO_EVIDENT_DAMAGE');
  assertFalse(result.requiresTechnicalInspection, 'No technical inspection required for P4');
}

/**
 * UNIT TEST: Empty/Null Assessment
 * Rule: Validate that empty assessment is handled gracefully
 */
function testEmptyAssessment() {
  const rules = { schema_version: '1.0' };
  const assessment = {
    damages: {}
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  // With empty damages, all C1/C2 conditions are undefined = uncertainty
  assertEqual(result.level, '⚪ NR', 'Level must be NR for empty assessment');
  assertEqual(result.result_code, 'UNDETERMINED_INCERTIDUMBRE', 'Result code must be UNDETERMINED_INCERTIDUMBRE');
}

/**
 * UNIT TEST: Rule Version Traceability
 * Rule: Result must include rule schema version for audit trail
 */
function testRuleVersionTraceability() {
  const rules = { schema_version: '2.1' };
  const assessment = {
    damages: {
      'partial_collapse': 'NO',
      'total_collapse': 'NO',
      'column_crush': 'NO',
      'column_displaced': 'NO',
      'tilt': 'NO',
      'loss_support': 'NO',
      'gas': 'NO',
      'fire': 'NO',
      'electric': 'NO',
      'column_diag_crack': 'NO',
      'column_steel': 'NO',
      'beam_diag_crack': 'NO',
      'wall_diag': 'NO',
      'wall_out_plane': 'NO',
      'foundation_damage': 'NO',
      'settlement': 'NO',
      'landslide': 'NO',
      'masonry_diag': 'NO',
      'masonry_out_plane': 'NO',
      'facade_fall': 'NO',
      'minor_crack': 'NO',
      'debris': 'NO',
      'suspended_hazard': 'NO',
      'ground_cracks': 'NO',
      'hvac_damage': 'NO',
      'partition_damage': 'NO'
    }
  };

  const result = TriageModule.evaluateAssessment(assessment, rules);

  assertEqual(result.rule_version, '2.1', 'Rule version must match input rules');
  assert(result.timestamp, 'Timestamp must be recorded for audit');
}

/**
 * TEST RUNNER
 */
function runAllTests() {
  const tests = [
    // C1 Dominance Tests
    { name: 'C1 Dominance - Column Crush', fn: testC1Dominance_ColumnCrush },
    { name: 'C1 Dominance - Global Tilt', fn: testC1Dominance_TiltIncline },
    
    // C2 Dominance Tests
    { name: 'C2 Dominance - Exposed Steel', fn: testC2Dominance_ExposedSteel },
    { name: 'C2 Dominance - Landslide', fn: testC2Dominance_Landslide },
    { name: 'C2 Dominance - Masonry X-Cracks', fn: testC2Dominance_MasonryDiagonalCracks },
    
    // Uncertainty Tests
    { name: 'Uncertainty - C2 NO_SABE', fn: testUncertainty_C1_NoSabe },
    { name: 'Uncertainty - C2 Undefined', fn: testUncertainty_C1_Undefined },
    
    // C3 and P4 Tests
    { name: 'C3 Dominance - Debris', fn: testC3Dominance_Debris },
    { name: 'Safe Building - All NO', fn: testSafeBuilding_AllNo },
    
    // Edge Cases
    { name: 'Empty Assessment', fn: testEmptyAssessment },
    { name: 'Rule Version Traceability', fn: testRuleVersionTraceability }
  ];

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TRIAGE ENGINE - UNIT TEST SUITE (HITO 2)');
  console.log('═══════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n📋 Test: ${test.name}`);
      console.log('─'.repeat(60));
      test.fn();
      passed++;
    } catch (error) {
      console.error(`${error.message}`);
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  ✅ Passed: ${passed} | ❌ Failed: ${failed} | Total: ${tests.length}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  return failed === 0;
}

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    // Export individual tests for selective execution
    testC1Dominance_ColumnCrush,
    testC1Dominance_TiltIncline,
    testC2Dominance_ExposedSteel,
    testC2Dominance_Landslide,
    testC2Dominance_MasonryDiagonalCracks,
    testUncertainty_C1_NoSabe,
    testUncertainty_C1_Undefined,
    testC3Dominance_Debris,
    testSafeBuilding_AllNo,
    testEmptyAssessment,
    testRuleVersionTraceability
  };
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests();
}
