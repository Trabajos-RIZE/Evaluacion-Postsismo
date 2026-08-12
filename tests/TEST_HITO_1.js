/**
 * PRUEBAS - HITO 1
 * Validación de la arquitectura modular y estructura base
 * EJECUTAR: Abre la consola del navegador (F12) y verifica los logs
 */

const Test = (() => {
  'use strict';

  const tests = [];
  let passedCount = 0;
  let failedCount = 0;

  /**
   * Registra y ejecuta una prueba
   */
  function assert(testName, condition, message = '') {
    const result = condition ? '✓ PASS' : '✗ FAIL';
    const testEntry = {
      name: testName,
      passed: condition,
      message
    };
    tests.push(testEntry);

    if (condition) {
      passedCount++;
      console.log(`[TEST] ✓ ${testName}`);
    } else {
      failedCount++;
      console.error(`[TEST] ✗ ${testName}`, message);
    }
  }

  /**
   * Pruebas de módulos disponibles
   */
  function testModulesLoaded() {
    console.log('\n=== PRUEBAS DE MÓDULOS DISPONIBLES ===\n');
    
    assert('ConfigModule existe', typeof ConfigModule !== 'undefined');
    assert('TriageModule existe', typeof TriageModule !== 'undefined');
    assert('StorageModule existe', typeof StorageModule !== 'undefined');
    assert('ExportModule existe', typeof ExportModule !== 'undefined');
    assert('GPSModule existe', typeof GPSModule !== 'undefined');
    assert('PhotosModule existe', typeof PhotosModule !== 'undefined');
    assert('AIContextModule existe', typeof AIContextModule !== 'undefined');
    assert('FormModule existe', typeof FormModule !== 'undefined');
    assert('App existe', typeof App !== 'undefined');
  }

  /**
   * Pruebas de interfaz de Config
   */
  function testConfigInterface() {
    console.log('\n=== PRUEBAS DE CONFIG ===\n');
    
    assert('ConfigModule.load es función', typeof ConfigModule.load === 'function');
    assert('ConfigModule.loadJurisdiction es función', typeof ConfigModule.loadJurisdiction === 'function');
    assert('ConfigModule.loadRules es función', typeof ConfigModule.loadRules === 'function');
  }

  /**
   * Pruebas de interfaz de Triage
   */
  function testTriageInterface() {
    console.log('\n=== PRUEBAS DE TRIAGE ===\n');
    
    assert('TriageModule.evaluateAssessment es función', typeof TriageModule.evaluateAssessment === 'function');
    assert('TriageModule.isValidResult es función', typeof TriageModule.isValidResult === 'function');
    assert('TriageModule.getLevelColor es función', typeof TriageModule.getLevelColor === 'function');
    assert('TriageModule.getLevelDescription es función', typeof TriageModule.getLevelDescription === 'function');
  }

  /**
   * Pruebas de interfaz de Storage
   */
  function testStorageInterface() {
    console.log('\n=== PRUEBAS DE STORAGE ===\n');
    
    assert('StorageModule.initDatabase es función', typeof StorageModule.initDatabase === 'function');
    assert('StorageModule.saveReport es función', typeof StorageModule.saveReport === 'function');
    assert('StorageModule.loadReport es función', typeof StorageModule.loadReport === 'function');
    assert('StorageModule.listReports es función', typeof StorageModule.listReports === 'function');
    assert('StorageModule.deleteReport es función', typeof StorageModule.deleteReport === 'function');
  }

  /**
   * Pruebas de interfaz de Export
   */
  function testExportInterface() {
    console.log('\n=== PRUEBAS DE EXPORT ===\n');
    
    assert('ExportModule.exportJSON es función', typeof ExportModule.exportJSON === 'function');
    assert('ExportModule.exportGeoJSON es función', typeof ExportModule.exportGeoJSON === 'function');
    assert('ExportModule.exportCSV es función', typeof ExportModule.exportCSV === 'function');
    assert('ExportModule.downloadFile es función', typeof ExportModule.downloadFile === 'function');
  }

  /**
   * Pruebas de interfaz de GPS
   */
  function testGPSInterface() {
    console.log('\n=== PRUEBAS DE GPS ===\n');
    
    assert('GPSModule.getCurrentPosition es función', typeof GPSModule.getCurrentPosition === 'function');
    assert('GPSModule.isAccuracyAcceptable es función', typeof GPSModule.isAccuracyAcceptable === 'function');
    assert('GPSModule.convertToMagnaSirgas es función', typeof GPSModule.convertToMagnaSirgas === 'function');
    assert('GPSModule.getReverseGeocoding es función', typeof GPSModule.getReverseGeocoding === 'function');
  }

  /**
   * Pruebas de interfaz de Photos
   */
  function testPhotosInterface() {
    console.log('\n=== PRUEBAS DE PHOTOS ===\n');
    
    assert('PhotosModule.REQUIRED_PHOTOS es número', typeof PhotosModule.REQUIRED_PHOTOS === 'number');
    assert('PhotosModule.REQUIRED_PHOTOS = 3', PhotosModule.REQUIRED_PHOTOS === 3);
    assert('PhotosModule.capturePhoto es función', typeof PhotosModule.capturePhoto === 'function');
    assert('PhotosModule.savePhoto es función', typeof PhotosModule.savePhoto === 'function');
    assert('PhotosModule.loadPhoto es función', typeof PhotosModule.loadPhoto === 'function');
    assert('PhotosModule.listPhotos es función', typeof PhotosModule.listPhotos === 'function');
    assert('PhotosModule.hasRequiredPhotos es función', typeof PhotosModule.hasRequiredPhotos === 'function');
  }

  /**
   * Pruebas de interfaz de AI Context
   */
  function testAIContextInterface() {
    console.log('\n=== PRUEBAS DE AI CONTEXT ===\n');
    
    assert('AIContextModule.prepareContext es función', typeof AIContextModule.prepareContext === 'function');
    assert('AIContextModule.detectInconsistencies es función', typeof AIContextModule.detectInconsistencies === 'function');
    assert('AIContextModule.suggestMissingData es función', typeof AIContextModule.suggestMissingData === 'function');
    assert('AIContextModule.normalizeObservations es función', typeof AIContextModule.normalizeObservations === 'function');
    assert('AIContextModule.generateAIPrompt es función', typeof AIContextModule.generateAIPrompt === 'function');
  }

  /**
   * Pruebas de interfaz de Form
   */
  function testFormInterface() {
    console.log('\n=== PRUEBAS DE FORM ===\n');
    
    assert('FormModule.initialize es función', typeof FormModule.initialize === 'function');
    assert('FormModule.renderStep es función', typeof FormModule.renderStep === 'function');
    assert('FormModule.validateStep es función', typeof FormModule.validateStep === 'function');
    assert('FormModule.getFormData es función', typeof FormModule.getFormData === 'function');
    assert('FormModule.nextStep es función', typeof FormModule.nextStep === 'function');
    assert('FormModule.previousStep es función', typeof FormModule.previousStep === 'function');
    assert('FormModule.reset es función', typeof FormModule.reset === 'function');
  }

  /**
   * Pruebas de interfaz de App
   */
  function testAppInterface() {
    console.log('\n=== PRUEBAS DE APP ===\n');
    
    assert('App.initialize es función', typeof App.initialize === 'function');
    assert('App.getState es función', typeof App.getState === 'function');
    assert('App.logAction es función', typeof App.logAction === 'function');
  }

  /**
   * Prueba de valores de nivel de triage
   */
  function testTriageLevels() {
    console.log('\n=== PRUEBAS DE NIVELES DE TRIAGE ===\n');
    
    assert('TriageModule.isValidResult("P1")', TriageModule.isValidResult('P1'));
    assert('TriageModule.isValidResult("P2")', TriageModule.isValidResult('P2'));
    assert('TriageModule.isValidResult("P3")', TriageModule.isValidResult('P3'));
    assert('TriageModule.isValidResult("P4")', TriageModule.isValidResult('P4'));
    assert('TriageModule.isValidResult("NR")', TriageModule.isValidResult('NR'));
    assert('TriageModule.isValidResult("INVALID") = false', !TriageModule.isValidResult('INVALID'));

    assert('Color P1 es verde', TriageModule.getLevelColor('P1') === '#28a745');
    assert('Color P4 es rojo', TriageModule.getLevelColor('P4') === '#dc3545');
  }

  /**
   * Ejecuta todas las pruebas
   */
  function runAll() {
    console.clear();
    console.log('%c╔════════════════════════════════════════════════════╗', 'color: #1a472a; font-weight: bold');
    console.log('%c║  SUITE DE PRUEBAS - HITO 1                         ║', 'color: #1a472a; font-weight: bold');
    console.log('%c║  Arquitectura Modular y Estructura Base            ║', 'color: #1a472a; font-weight: bold');
    console.log('%c╚════════════════════════════════════════════════════╝', 'color: #1a472a; font-weight: bold');

    testModulesLoaded();
    testConfigInterface();
    testTriageInterface();
    testStorageInterface();
    testExportInterface();
    testGPSInterface();
    testPhotosInterface();
    testAIContextInterface();
    testFormInterface();
    testAppInterface();
    testTriageLevels();

    // Resumen
    console.log('\n=== RESUMEN ===\n');
    console.log(`✓ Pruebas exitosas: ${passedCount}`);
    console.log(`✗ Pruebas fallidas: ${failedCount}`);
    console.log(`📊 Total: ${tests.length}`);

    if (failedCount === 0) {
      console.log('\n%c✅ TODOS LOS TESTS PASARON', 'color: #28a745; font-weight: bold; font-size: 14px');
    } else {
      console.log(`\n%c⚠️ ${failedCount} TESTS FALLARON`, 'color: #dc3545; font-weight: bold; font-size: 14px');
    }

    console.log('\n📝 Detalles de pruebas:');
    console.table(tests);

    return {
      total: tests.length,
      passed: passedCount,
      failed: failedCount,
      tests
    };
  }

  return {
    runAll
  };
})();

// Ejecutar pruebas cuando la página carga
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ejecutar pruebas después de que los módulos estén listos
    setTimeout(() => Test.runAll(), 500);
  });
} else {
  // Si el documento ya está listo
  setTimeout(() => Test.runAll(), 500);
}
