/**
 * SURVEY STEPS NAVIGATION & MATERIAL FILTER LOGIC (MODULE VERSION)
 * Ecosistema Triage Sísmico Cali v3.7 - Hito 5 Production
 */

const FormModule = (() => {
    let currentStep = 1;
    const totalSteps = 4;

    function initialize() {
        showStep(currentStep);
        document.getElementById('sistema').addEventListener('change', handleMaterialFilter);
        
        // Oyentes para los checkboxes del semáforo
        const checkboxes = document.querySelectorAll('#panelPatologias input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', runLiveTriageUI);
        });

        // Configuración de botones Siguiente / Anterior
        document.querySelectorAll('.btn-submit, button[type="submit"]').forEach(btn => {
            if(btn.innerText.includes("Guardar") || btn.innerText.includes("Registro")) {
                // Evitar que el submit recargue si no es el paso final
            }
        });
    }

    function showStep(step) {
        for (let i = 1; i <= totalSteps; i++) {
            // Buscar por fieldset secuencial (1, 2, 3, 4)
            const viewField = document.querySelector(`fieldset:nth-of-type(${i})`);
            if (viewField) {
                if (i === step) {
                    viewField.classList.remove('hidden');
                } else {
                    viewField.classList.add('hidden');
                }
            }
        }
        updateIndicators(step);
    }

    function updateIndicators(step) {
        const indicators = document.querySelectorAll('.step-indicator, header span, .indicator-circle, .step-indicator-item');
        indicators.forEach((circle, index) => {
            if (index + 1 === step) {
                circle.style.backgroundColor = '#1e3a8a';
                circle.style.color = '#ffffff';
            } else if (index + 1 < step) {
                circle.style.backgroundColor = '#10b981';
                circle.style.color = '#ffffff';
            } else {
                circle.style.backgroundColor = '#cbd5e1';
                circle.style.color = '#0f172a';
            }
        });
    }

    function validateStep(step) {
        if (step === 1) {
            const evaluator = document.getElementById('idEvaluador').value.trim();
            const address = document.getElementById('direccion').value.trim();
            if (!evaluator || !address) {
                alert("Por favor, ingrese el nombre del evaluador y la dirección antes de continuar.");
                return false;
            }
        }
        if (step === 2) {
            const material = document.getElementById('sistema').value;
            if (!material) {
                alert("Debe seleccionar un sistema constructivo para abrir las patologías correspondientes.");
                return false;
            }
        }
        return true;
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                console.log(`[Form] Avanzando al paso: ${currentStep}`);
            }
        }
    }

    function previousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            console.log(`[Form] Retrocediendo al paso: ${currentStep}`);
        }
    }

    function handleMaterialFilter() {
        const materialSelected = document.getElementById('sistema').value;
        const subPanels = document.querySelectorAll('.panel-especifico');
        const mainPanelPatologias = document.getElementById('panelPatologias');

        subPanels.forEach(p => p.classList.add('hidden'));

        if (!materialSelected) {
            mainPanelPatologias.classList.add('hidden');
            return;
        }

        mainPanelPatologias.classList.remove('hidden');

        if (materialSelected === "Porticos Concreto") {
            document.getElementById('opcionesConcreto')?.classList.remove('hidden');
        } else if (materialSelected === "Mamposteria Confinada") {
            document.getElementById('opcionesConfinada')?.classList.remove('hidden');
        } else if (materialSelected === "Mamposteria Informal") {
            document.getElementById('opcionesInformal')?.classList.remove('hidden');
        } else if (materialSelected === "Bahareque Tapia") {
            document.getElementById('opcionesBahareque')?.classList.remove('hidden');
        }
        
        runLiveTriageUI();
    }

    function runLiveTriageUI() {
        if (typeof window.evaluateAssessment === 'function') {
            const simulatedData = {
                g_colapso: document.getElementById('g_colapso')?.checked || false,
                g_fema: document.getElementById('g_fema')?.checked || false,
                g_geotecnia: document.getElementById('g_geotecnia')?.checked || false,
                c_1: document.getElementById('c_1')?.checked || false,
                c_2: document.getElementById('c_2')?.checked || false,
                c_3: document.getElementById('c_3')?.checked || false,
                m_1: document.getElementById('m_1')?.checked || false,
                m_2: document.getElementById('m_2')?.checked || false,
                i_1: document.getElementById('i_1')?.checked || false,
                i_2: document.getElementById('i_2')?.checked || false,
                b_1: document.getElementById('b_1')?.checked || false,
                b_2: document.getElementById('b_2')?.checked || false
            };
            
            const reportAssessment = window.evaluateAssessment(simulatedData, { version: "1.0-UI" });
            const displayBox = document.getElementById('triageDisplay');
            
            if (displayBox) {
                displayBox.innerText = reportAssessment.level;
                if (reportAssessment.level.includes("🔴")) {
                    displayBox.style.backgroundColor = "#ef4444"; displayBox.style.color = "#ffffff";
                } else if (reportAssessment.level.includes("🟠")) {
                    displayBox.style.backgroundColor = "#f97316"; displayBox.style.color = "#ffffff";
                } else if (reportAssessment.level.includes("🟡")) {
                    displayBox.style.backgroundColor = "#eab308"; displayBox.style.color = "#0f172a";
                } else {
                    displayBox.style.backgroundColor = "#10b981"; displayBox.style.color = "#ffffff";
                }
            }
        }
    }

    function reset() {
        currentStep = 1;
        document.getElementById('sismoForm').reset();
        showStep(currentStep);
        handleMaterialFilter();
        console.log('[Form] Formulario reiniciado por completo.');
    }

    // Exponer las funciones para enlazarlas con los botones del HTML
    return {
        initialize: initialize,
        nextStep: nextStep,
        previousStep: previousStep,
        reset: reset
    };
})();

// Inicializar el stepper automáticamente al cargar el archivo
document.addEventListener('DOMContentLoaded', () => {
    FormModule.initialize();
    
    // Vincular botones HTML de Siguiente/Anterior al módulo global si index.html los llama de forma externa
    window.nextStep = FormModule.nextStep;
    window.previousStep = FormModule.previousStep;
});
