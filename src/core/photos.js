/**
 * MÓDULO: Photos
 * Descripción: Gestión de fotografías de inspección
 * Responsabilidad: Capturar y almacenar evidencia fotográfica en IndexedDB
 * HITO: 5 (En HITO 1, solo estructura)
 * Estado: STUB - Interfaz definida, implementación en HITO 5
 * Regla: Usar IndexedDB (blob), no localStorage (base64)
 */

const PhotosModule = (() => {
  'use strict';

  const REQUIRED_PHOTOS = 3; // Mínimo de fotos obligatorias

  /**
   * Captura una foto desde la cámara
   * IMPLEMENTAR EN HITO 5: Usar getUserMedia o input[type=file]
   * @returns {Promise<Blob>} Blob de la imagen
   */
  async function capturePhoto() {
    console.log('[Photos] Capturando foto (STUB)');
    // IMPLEMENTAR EN HITO 5
    return null;
  }

  /**
   * Guarda una foto con metadatos
   * IMPLEMENTAR EN HITO 5: Guardar en IndexedDB
   * @param {Blob} photoBlob - Archivo de imagen
   * @param {string} reportId - ID del reporte
   * @param {string} type - Tipo: 'fachada', 'interior', 'daño'
   * @returns {Promise<string>} photo_id
   */
  async function savePhoto(photoBlob, reportId, type) {
    console.log('[Photos] Guardando foto en IndexedDB (STUB)');
    console.log('[Photos] Tipo:', type);
    // IMPLEMENTAR EN HITO 5
    return `photo_${Date.now()}`;
  }

  /**
   * Carga una foto por ID
   * IMPLEMENTAR EN HITO 5
   * @param {string} photoId
   * @returns {Promise<Blob>}
   */
  async function loadPhoto(photoId) {
    console.log('[Photos] Cargando foto:', photoId, '(STUB)');
    // IMPLEMENTAR EN HITO 5
    return null;
  }

  /**
   * Lista fotos asociadas a un reporte
   * IMPLEMENTAR EN HITO 5
   * @param {string} reportId
   * @returns {Promise<Array>} Listado de fotos
   */
  async function listPhotos(reportId) {
    console.log('[Photos] Listando fotos del reporte:', reportId, '(STUB)');
    // IMPLEMENTAR EN HITO 5
    return [];
  }

  /**
   * Valida si el reporte tiene el mínimo de fotos
   * @param {string} reportId
   * @returns {Promise<boolean>}
   */
  async function hasRequiredPhotos(reportId) {
    const photos = await listPhotos(reportId);
    return photos.length >= REQUIRED_PHOTOS;
  }

  /**
   * Elimina una foto
   * IMPLEMENTAR EN HITO 5
   * @param {string} photoId
   * @returns {Promise<boolean>}
   */
  async function deletePhoto(photoId) {
    console.log('[Photos] Eliminando foto:', photoId, '(STUB)');
    // IMPLEMENTAR EN HITO 5
    return true;
  }

  return {
    REQUIRED_PHOTOS,
    capturePhoto,
    savePhoto,
    loadPhoto,
    listPhotos,
    hasRequiredPhotos,
    deletePhoto
  };
})();
