/**
 * MÓDULO: Export
 * Descripción: Exportador de reportes (JSON, CSV, GeoJSON)
 * Responsabilidad: Generar archivos exportables para QGIS y análisis
 * HITO: 6 (En HITO 1, solo estructura)
 * Estado: STUB - Interfaz definida, implementación en HITO 6
 */

const ExportModule = (() => {
  'use strict';

  /**
   * Exporta un reporte a JSON
   * IMPLEMENTAR EN HITO 6
   * @param {Object} report - Reporte de inspección
   * @returns {string} JSON string
   */
  function exportJSON(report) {
    console.log('[Export] Exportando a JSON (STUB)');
    // IMPLEMENTAR EN HITO 6
    return JSON.stringify(report, null, 2);
  }

  /**
   * Exporta un reporte a GeoJSON
   * Formato compatible con QGIS y sistemas de información geográfica
   * IMPLEMENTAR EN HITO 6
   * @param {Object} report - Reporte con coordenadas GPS
   * @returns {string} GeoJSON string
   */
  function exportGeoJSON(report) {
    console.log('[Export] Exportando a GeoJSON (STUB)');
    // IMPLEMENTAR EN HITO 6
    return JSON.stringify({
      type: 'FeatureCollection',
      features: []
    });
  }

  /**
   * Exporta un reporte a CSV
   * IMPLEMENTAR EN HITO 6
   * @param {Object} report - Reporte de inspección
   * @returns {string} CSV string
   */
  function exportCSV(report) {
    console.log('[Export] Exportando a CSV (STUB)');
    // IMPLEMENTAR EN HITO 6
    return '';
  }

  /**
   * Descarga un archivo en el navegador
   * IMPLEMENTAR EN HITO 6
   * @param {string} content - Contenido del archivo
   * @param {string} filename - Nombre del archivo
   * @param {string} mimeType - Tipo MIME
   */
  function downloadFile(content, filename, mimeType = 'text/plain') {
    console.log('[Export] Descargando archivo:', filename, '(STUB)');
    // IMPLEMENTAR EN HITO 6
  }

  return {
    exportJSON,
    exportGeoJSON,
    exportCSV,
    downloadFile
  };
})();

// ====== COMPONENTE PERICIAL: EXPORTADOR DE INFORME TÉCNICO EN PDF (jsPDF) ======
window.generarInformePDF = function() {
    // 1. Verificar si la librería jsPDF está cargada globalmente en el sistema
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        alert("Error Técnico: La librería jsPDF no se ha terminado de cargar en el navegador. Por favor, espere un momento o verifique su conexión.");
        return;
    }

    // 2. Capturar dinámicamente los datos reales del formulario y componentes de la UI
    const coordenadasInput = document.getElementById('coordenadas-input') || document.getElementById('coordenadas');
    const sistemaSelect = document.getElementById('sistema-constructivo-select') || document.getElementById('sistema-constructivo');
    const patologiaSelect = document.getElementById('patologia-select') || document.getElementById('patologia');
    const nivelDanoSelect = document.getElementById('nivel-daño-select') || document.getElementById('nivel-dano');
    const verdictBadge = document.getElementById('verdict-badge');
    const verdictText = document.getElementById('verdict-text');

    const coordenadas = coordenadasInput ? coordenadasInput.value : 'No georreferenciado';
    const sistema = sistemaSelect && sistemaSelect.value ? sistemaSelect.options[sistemaSelect.selectedIndex].text : 'No especificado';
    const patologia = patologiaSelect && patologiaSelect.value ? patologiaSelect.options[patologiaSelect.selectedIndex].text : 'No especificada';
    const dano = nivelDanoSelect && nivelDanoSelect.value ? nivelDanoSelect.options[nivelDanoSelect.selectedIndex].text : 'No especificado';
    const veredicto = verdictText ? verdictText.textContent : 'Sin veredicto emitido';
    const colorHex = verdictBadge ? window.getComputedStyle(verdictBadge).backgroundColor : 'rgb(108, 117, 125)';

    // 3. Inicializar el documento PDF en formato estándar A4
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Encabezado Institucional del Reporte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("INFORME PERICIAL DE EVALUACIÓN POST-SISMO", 15, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Protocolo Oficial de Gestión del Riesgo - Formulario de Inspección Rápida", 15, 26);
    doc.line(15, 28, 195, 28); // Línea divisoria superior

    // Bloque 1: Ubicación Espacial y Georreferenciación
    doc.setFont("helvetica", "bold");
    doc.text("1. DATOS DE GEORREFERENCIACIÓN Y UBICACIÓN", 15, 36);
    doc.setFont("helvetica", "normal");
    doc.text(`Coordenadas de Captura (GPS): ${coordenadas}`, 20, 42);

    // Bloque 2: Diagnóstico de la Inspección de Ingeniería
    doc.setFont("helvetica", "bold");
    doc.text("2. DIAGNÓSTICO TÉCNICO ESTRUCTURAL", 15, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Sistema Constructivo Evaluado: ${sistema}`, 20, 58);
    doc.text(`Patología Crítica Detectada: ${patologia}`, 20, 64);
    doc.text(`Nivel de Daño Estructural: ${dano}`, 20, 70);

    // Bloque 3: Veredicto Pericial y Habitabilidad (Recuadro de Color)
    doc.line(15, 76, 195, 76);
    doc.setFont("helvetica", "bold");
    doc.text("3. DICTAMEN DE HABITABILIDAD (TRIAGE SÍSMICO)", 15, 84);
    
    // Dibujar un recuadro visual del color del semáforo para el informe oficial
    doc.setFillColor(colorHex);
    doc.rect(15, 88, 180, 12, "F");
    
    // Imprimir el veredicto en texto dentro o debajo del recuadro
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`ESTADO: ${veredicto.toUpperCase()}`, 20, 95);

    // Pie de página y fecha de emisión pericial
    doc.setTextColor(108, 117, 125);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.line(15, 110, 195, 110);
    doc.text(`Fecha y Hora de Emisión Electrónica: ${new Date().toLocaleString()}`, 15, 116);
    doc.text("Documento técnico preliminar generado en campo. Válido para comisiones de emergencia.", 15, 121);

    // 4. Forzar la descarga del documento PDF en el dispositivo del evaluador
    doc.save(`Reporte_Sismo_${Date.now()}.pdf`);
};

