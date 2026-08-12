/**
 * MÓDULO: GPS
 * Descripción: Geolocalización y captura de coordenadas
 * Responsabilidad: Obtener coordenadas GPS con validación de precisión
 * HITO: 5 (En HITO 1, solo estructura)
 * Estado: STUB - Interfaz definida, implementación en HITO 5
 * Regla: Jamás generar coordenadas falsas. Si no se obtienen, retornar null.
 */

const GPSModule = (() => {
  'use strict';

  /**
   * Obtiene la posición actual del dispositivo
   * IMPLEMENTAR EN HITO 5: Usar Geolocation API
   * @returns {Promise<{lat: number, lon: number, accuracy: number, timestamp: number}>}
   */
  async function getCurrentPosition() {
    console.log('[GPS] Obteniendo posición actual (STUB)');
    // IMPLEMENTAR EN HITO 5
    // Regla: Si no se puede obtener, retornar null, NO fabricar coordenadas
    return null;
  }

  /**
   * Valida la precisión de la coordenada
   * IMPLEMENTAR EN HITO 5
   * @param {number} accuracy - Precisión en metros (del Geolocation API)
   * @returns {boolean} true si la precisión es aceptable
   */
  function isAccuracyAcceptable(accuracy) {
    const ACCEPTABLE_ACCURACY_METERS = 20; // Máximo aceptable
    console.log('[GPS] Validando precisión:', accuracy, 'metros (STUB)');
    // IMPLEMENTAR EN HITO 5
    return accuracy <= ACCEPTABLE_ACCURACY_METERS;
  }

  /**
   * Convierte de WGS84 a MAGNA-SIRGAS (EPSG:9377)
   * IMPLEMENTAR EN HITO 5: Usar biblioteca proj4.js si es necesario
   * @param {number} lat - Latitud WGS84
   * @param {number} lon - Longitud WGS84
   * @returns {Object} { x, y } en CTM12
   */
  function convertToMagnaSirgas(lat, lon) {
    console.log('[GPS] Convirtiendo a MAGNA-SIRGAS (STUB)');
    // IMPLEMENTAR EN HITO 5
    return { x: null, y: null };
  }

  /**
   * Obtiene la dirección inversa desde coordenadas (reverse geocoding)
   * IMPLEMENTAR EN HITO 5: Si es necesario en contexto de emergencia
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<string>} Dirección aproximada
   */
  async function getReverseGeocoding(lat, lon) {
    console.log('[GPS] Obteniendo dirección inversa (STUB)');
    // IMPLEMENTAR EN HITO 5
    return null;
  }

  return {
    getCurrentPosition,
    isAccuracyAcceptable,
    convertToMagnaSirgas,
    getReverseGeocoding
  };
})();
