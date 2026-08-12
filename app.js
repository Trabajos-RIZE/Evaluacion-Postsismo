/**
 * APLICACIÓN PRINCIPAL - Evaluación Post-Sismo
 * ============================================================================
 * Orquestador de módulos
 * HITO: 1
 * Estado: STUB de inicialización
 */

const App = (() => {
  'use strict';

  let appState = {
    jurisdiction: null,
    rules: null,
    currentReport: null,
    isInitialized: false
  };

  /**
   * Inicializa la aplicación
   */
  async function initialize() {
    console.log('🚀 Inicializando Evaluación Post-Sismo');
    
    try {
      // 1. Cargar configuración
      console.log('[App] Paso 1: Cargando configuración...');
      const config = await ConfigModule.load();
      appState.jurisdiction = config.jurisdiction;
      appState.rules = config.rules;

      console.log('[App] ✓ Jurisdicción:', appState.jurisdiction.name);
      console.log('[App] ✓ Reglas v' + appState.rules.schema_version);

      // 2. Inicializar almacenamiento
      console.log('[App] Paso 2: Inicializando almacenamiento...');
      await StorageModule.initDatabase();
      console.log('[App] ✓ IndexedDB listo');

      // 3. Inicializar interfaz
      console.log('[App] Paso 3: Inicializando interfaz...');
      await FormModule.initialize();
      console.log('[App] ✓ Interfaz lista');

      appState.isInitialized = true;
      console.log('[App] ✅ Aplicación inicializada correctamente');

      // Mostrar estado en la consola
      console.table({
        Versión: 'HITO 1',
        Jurisdicción: appState.jurisdiction.name,
        'Reglas de triage': appState.rules.schema_version,
        Modo: 'Offline-First PWA',
        Almacenamiento: 'IndexedDB + localStorage'
      });

    } catch (error) {
      console.error('[App] ❌ Error durante inicialización:', error);
      showError(error.message);
    }
  }

  /**
   * Muestra un mensaje de error en la UI
   */
  function showError(message) {
    const container = document.getElementById('form-container');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger">
          <strong>Error de inicialización:</strong> ${message}
        </div>
        <p class="text-muted">Verifica la consola del navegador para más detalles.</p>
      `;
    }
  }

  /**
   * Obtiene el estado actual
   */
  function getState() {
    return { ...appState };
  }

  /**
   * Registra una acción del usuario (para auditoría)
   */
  function logAction(action, details = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${action}`, details);
    // IMPLEMENTAR EN HITO 9: Guardar para auditoría
  }

  // Ciclo de vida
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[App] DOM cargado, inicializando...');
    initialize();
  });

  // Detectar soporte PWA
  if ('serviceWorker' in navigator) {
    console.log('[App] Service Worker soportado');
    // IMPLEMENTAR EN HITO 7: Registrar service worker
  }

  // Permitir acceso a módulos globales (para debugging)
  window.DebugModules = {
    Config: ConfigModule,
    Triage: TriageModule,
    Storage: StorageModule,
    Export: ExportModule,
    GPS: GPSModule,
    Photos: PhotosModule,
    AI: AIContextModule,
    Form: FormModule,
    App: App
  };

  return {
    initialize,
    getState,
    logAction
  };
})();
