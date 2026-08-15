/**
 * ECOSYSTEM CENTRAL DIRECTOR & ORCHESTRATOR LAYER
 * Ecosistema Triage Sísmico Cali v3.7 - Hito 5 Production
 */
const App = (() => {
 
    // Almacenamiento temporal del registro actual en memoria antes de guardarlo en base de datos
    let currentRecordPhotos = { f1: null, f2: null, f3: null };

        function initialize() {
        console.log('[App] Sistema inicializado. Conectando sensores estructurales...');
        
        // Enlazar los disparadores asincrónicos para procesar los archivos de la cámara en sitio
        setupPhotoListeners();

        // Enlazar botones institucionales de la barra inferior con protección contra nulos (Paso 4)
        try {
            const btnSave = document.getElementById('btn-save-record');
            if (btnSave) btnSave.addEventListener('click', handleFormSubmit);
            
            const btnPDF = document.getElementById('btn-generate-pdf');
            if (btnPDF) btnPDF.addEventListener('click', generateOfficialPDFReport);
            
            const btnExportar = document.getElementById('btn-export-geojson');
            if (btnExportar) btnExportar.addEventListener('click', triggerGeoJsonExport);
            
            const btnLimpiar = document.getElementById('btn-clear-local');
            if (btnLimpiar) btnLimpiar.addEventListener('click', purgeLocalHistory);
        } catch (error) {
            console.warn('[App] Error al enlazar controles:', error);
        }
        
        // Carga inicial del contador de registros
        refreshCounterDisplay();
    }

    function setupPhotoListeners() {
        const photoInputs = [
            { id: 'photo-1', key: 'f1', preview: 'photo-1-preview' },
            { id: 'photo-2', key: 'f2', preview: 'photo-2-preview' },
            { id: 'photo-3', key: 'f3', preview: 'photo-3-preview' }
        ];

        photoInputs.forEach(input => {
            const el = document.getElementById(input.id);
            if (el) {
                el.addEventListener('change', async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const compressed = await window.optimizarYConvertirImagen(e.target.files[0]);
                        currentRecordPhotos[input.key] = compressed;
                        
                        // Renderizar preview en el contenedor del HTML
                        const previewDiv = document.getElementById(input.preview);
                        if (previewDiv && compressed) {
                            previewDiv.innerHTML = `<img src="${compressed}" style="width:100%; height:100%; object-fit:cover;">`;
                        }
                    }
                });
            }
        });
    }

    async function handleFormSubmit(e) {
        if (e) e.preventDefault();
        
        const lat = document.getElementById('gps-latitude').value;
        const lon = document.getElementById('gps-longitude').value;
        const targetDictamen = document.getElementById('verdict-code').innerText;

        // Estructura pericial normalizada para auditoría
        const payload = {
            id_inspeccion: "REPORTE-CALI-" + Date.now(),
            timestamp: new Date().toLocaleString(),
            evaluador: document.getElementById('evaluator-name').value,
            cargo_perito: document.getElementById('evaluator-title').value,
            tarjeta_profesional: document.getElementById('evaluator-license').value || "NO REGISTRADA",
            direccion_oficial: document.getElementById('structure-address').value,
            coor_lat: parseFloat(lat),
            coor_lon: parseFloat(lon),
            sistema_constructivo: document.querySelector('input[name="constructionSystem"]:checked')?.value || "OTHER",
            dictamen_seguridad: targetDictamen,
            observaciones_campo: document.getElementById('observations').value || "Sin observaciones.",
            evidencias_fotograficas: {
                img_general: currentRecordPhotos.f1,
                img_ampliada: currentRecordPhotos.f2,
                img_detalle: currentRecordPhotos.f3
            }
        };

        console.log('[App] Guardando registro:', payload);
        
        // Guardar de forma robusta en la IndexedDB asíncrona (Hito 3)
        if (window.DatabaseModule && typeof window.DatabaseModule.saveAssessment === 'function') {
            try {
                await window.DatabaseModule.saveAssessment(payload);
                alert("¡Registro guardado con éxito!");
                refreshCounterDisplay();
                if(window.FormModule) window.FormModule.reset();
            } catch (error) {
                console.error("[App] Falló el resguardo en IndexedDB:", error);
                alert("Error al guardar en base de datos local.");
            }
        } else {
            // Fallback simple si no hay DatabaseModule (para pruebas)
            let reports = JSON.parse(localStorage.getItem('r_sismo_cali') || '[]');
            reports.push(payload);
            localStorage.setItem('r_sismo_cali', JSON.stringify(reports));
            alert("Guardado en LocalStorage (Modo Fallback)");
            refreshCounterDisplay();
            if(window.FormModule) window.FormModule.reset();
        }
    }

    async function generateOfficialPDFReport() {
        if (typeof window.generarInformePDF === 'function') {
            // Ejecutar el motor de impresión pericial nativo blindado
            window.generarInformePDF();
        } else {
            alert("Librería de impresión jsPDF en espera de carga.");
        }
    }

    async function triggerGeoJsonExport() {
        if (window.DatabaseModule && typeof window.DatabaseModule.getAllAssessments === 'function') {
            try {
                const registros = await window.DatabaseModule.getAllAssessments();
                if(registros.length === 0) {
                    alert("No existen registros guardados localmente en este dispositivo para compilar la capa vectorial.");
                    return;
                }
                
                // Compilación estricta bajo estándar cartográfico OGC WGS84
                const geojson = {
                    type: "FeatureCollection",
                    crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                    features: registros.map(r => ({
                        type: "Feature",
                        geometry: { type: "Point", coordinates: [r.coor_lon, r.coor_lat] },
                        properties: {
                            id_inspeccion: r.id_inspeccion,
                            fecha_censo: r.timestamp,
                            evaluador: r.evaluador,
                            cargo: r.cargo_perito,
                            tarjeta: r.tarjeta_profesional,
                            direccion: r.direccion_oficial,
                            sistema_constructivo: r.sistema_constructivo,
                            dictamen_triage: r.dictamen_seguridad,
                            observaciones: r.observaciones_campo,
                            advertencia_crs_oficial: "EPSG:9377 - MAGNA-SIRGAS Origen Nacional / CTM12 (IGAC Colombia)",
                            b64_foto_general: r.evidencias_fotograficas.img_general,
                            b64_foto_ampliada: r.evidencias_fotograficas.img_ampliada,
                            b64_foto_detalle: r.evidencias_fotograficas.img_detalle
                        }
                    }))
                };
                
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `CAPA_SISMO_CALI_CTM12_${Date.now()}.geojson`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                console.log("[App] Capa SIG exportada con éxito.");
            } catch (err) {
                alert("Error al extraer base cartográfica.");
            }
        }
    }

    async function refreshCounterDisplay() {
        const displayCounter = document.getElementById('reportCount');
        if (!displayCounter) return;
        if (window.DatabaseModule && typeof window.DatabaseModule.getAllAssessments === 'function') {
            try {
                const totalRecords = await window.DatabaseModule.getAllAssessments();
                displayCounter.innerText = `Reportes almacenados en base de datos local: ${totalRecords.length}`;
            } catch (e) {
                displayCounter.innerText = "Historial local activo offline";
            }
        }
    }

    async function purgeLocalHistory() {
        if (confirm("🚨 ADVERTENCIA DE CONTROL: ¿Está completamente seguro de purgar el historial y vaciar la base de datos local de este equipo? Esta acción no se puede deshacer y borrará la evidencia fotográfica recolectada.")) {
            if (window.DatabaseModule && typeof window.DatabaseModule.clearAllAssessments === 'function') {
                await window.DatabaseModule.clearAllAssessments();
                localStorage.removeItem('r_sismo_cali');
                alert("Base de datos purgada de forma exitosa.");
                refreshCounterDisplay();
                resetEcosystemForm();
            }
        }
    }

    function resetEcosystemForm() {
        currentRecordPhotos = { f1: null, f2: null, f3: null };
        if(window.FormModule && typeof window.FormModule.reset === 'function') {
            window.FormModule.reset();
        }
        
        // Limpiar contenedores de miniaturas físicas si existen
        document.querySelectorAll('.thumbnail-preview-container').forEach(c => c.innerHTML = '');
        
        // Relanzar obtención del GPS para el siguiente predio
        if(window.obtenerGPSOpciones) window.obtenerGPSOpciones();
    }

    return {
        initialize: initialize,
        refreshCounter: refreshCounterDisplay
    };
})();

// Detectar soporte PWA e inicializar orquestación
document.addEventListener('DOMContentLoaded', () => {
    App.initialize();
});