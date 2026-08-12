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

        // Enlazar botones institucionales de la barra inferior del Paso 4
        document.getElementById('sismoForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('btnGenerarPDF').addEventListener('click', generateOfficialPDFReport);
        document.getElementById('btnExportar').addEventListener('click', triggerGeoJsonExport);
        document.getElementById('btnLimpiar').addEventListener('click', purgeLocalHistory);
        
        // Carga inicial del contador de registros
        refreshCounterDisplay();
    }

    function setupPhotoListeners() {
        const f1Input = document.getElementById('foto1');
        const f2Input = document.getElementById('foto2');
        const f3Input = document.getElementById('foto3');

        if(f1Input) f1Input.addEventListener('change', async (e) => {
            if(e.target.files && e.target.files.length > 0) {
                currentRecordPhotos.f1 = await window.optimizarYConvertirImagen(e.target.files[0]);
                if(window.renderizarMiniatura) window.renderizarMiniatura(currentRecordPhotos.f1, 'foto1');
            }
        });

        if(f2Input) f2Input.addEventListener('change', async (e) => {
            if(e.target.files && e.target.files.length > 0) {
                currentRecordPhotos.f2 = await window.optimizarYConvertirImagen(e.target.files[0]);
                if(window.renderizarMiniatura) window.renderizarMiniatura(currentRecordPhotos.f2, 'foto2');
            }
        });

        if(f3Input) f3Input.addEventListener('change', async (e) => {
            if(e.target.files && e.target.files.length > 0) {
                currentRecordPhotos.f3 = await window.optimizarYConvertirImagen(e.target.files[0]);
                if(window.renderizarMiniatura) window.renderizarMiniatura(currentRecordPhotos.f3, 'foto3');
            }
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const gpsValue = document.getElementById('gps').value.split(',');
        const targetDictamen = document.getElementById('triageDisplay').innerText;

        // Estructura pericial normalizada para auditoría
        const payload = {
            id_inspeccion: "REPORTE-CALI-" + Date.now(),
            timestamp: new Date().toLocaleString(),
            evaluador: document.getElementById('idEvaluador').value,
            cargo_perito: document.getElementById('profesion').value,
            tarjeta_profesional: document.getElementById('matricula').value || "NO REGISTRADA",
            direccion_oficial: document.getElementById('direccion').value,
            coor_lat: parseFloat(gpsValue[0]) || 3.451649,
            coor_lon: parseFloat(gpsValue[1]) || -76.532049,
            sistema_constructivo: document.getElementById('sistema').value,
            dictamen_seguridad: targetDictamen,
            observaciones_campo: document.getElementById('notas').value || "Sin observaciones particulares registradas.",
            evidencias_fotograficas: {
                img_general: currentRecordPhotos.f1,
                img_ampliada: currentRecordPhotos.f2,
                img_detalle: currentRecordPhotos.f3
            }
        };

        // Guardar de forma robusta en la IndexedDB asíncrona (Hito 3)
        if (window.DatabaseModule && typeof window.DatabaseModule.saveAssessment === 'function') {
            try {
                await window.DatabaseModule.saveAssessment(payload);
                alert("¡Excelente! El peritaje estructural ha sido guardado con éxito en la base de datos local offline de este dispositivo.");
                refreshCounterDisplay();
                resetEcosystemForm();
            } catch (error) {
                console.error("[App] Falló el resguardo en IndexedDB:", error);
                // Fallback de contingencia a LocalStorage si la base de datos se bloquea
                let fallbackArray = JSON.parse(localStorage.getItem('r_sismo_cali')) || [];
                fallbackArray.push(payload);
                localStorage.setItem('r_sismo_cali', JSON.stringify(fallbackArray));
                alert("Guardado en búfer alternatvo local por precaución.");
                refreshCounterDisplay();
                resetEcosystemForm();
            }
        } else {
            alert("Capa de persistencia ausente en el DOM.");
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
    

