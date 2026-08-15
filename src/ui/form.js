/**
 * SURVEY STEPS NAVIGATION & MATERIAL FILTER LOGIC (MODULE VERSION)
 * Ecosistema Triage Sísmico Cali v3.7 - Hito 5 Production - MODO DESARROLLO LIBRE
 */
const FormModule = (() => {
    let currentStep = 1;
    const totalSteps = 4;

        function initialize() {
        console.log('[FormModule] Inicializando componentes del formulario...');
        showStep(currentStep);
        
        // Blindaje contra nulos
        document.querySelectorAll('input[name="constructionSystem"]').forEach(radio => {
            radio.addEventListener('change', handleMaterialFilter);
        });
        
        // Oyentes seguros para los checkboxes críticos fijos en HTML
        document.querySelectorAll('.critical-alerts-grid input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', runLiveTriageUI);
        });

        // GPS Refresh
        const btnGPS = document.getElementById('btn-refresh-gps');
        if (btnGPS) btnGPS.addEventListener('click', () => {
            if (window.GPSModule) window.GPSModule.getCurrentPosition();
        });
    }

        function showStep(step) {
        document.querySelectorAll('.step-container').forEach((container, index) => {
            if (index + 1 === step) {
                container.classList.remove('hidden');
                container.classList.add('active');
            } else {
                container.classList.add('hidden');
                container.classList.remove('active');
            }
        });
        
        // Actualizar botones de navegación
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        
        if (btnPrev) btnPrev.disabled = (step === 1);
        if (btnNext) {
            btnNext.innerText = (step === totalSteps) ? 'Finalizar' : 'Siguiente →';
        }

        const currentStepDisplay = document.getElementById('current-step');
        if (currentStepDisplay) currentStepDisplay.innerText = step;

        updateIndicators(step);
    }

    function updateIndicators(step) {
        document.querySelectorAll('.step-badge').forEach((badge) => {
            const badgeStep = parseInt(badge.getAttribute('data-step'));
            badge.classList.remove('active');
            if (badgeStep === step) {
                badge.classList.add('active');
            } else if (badgeStep < step) {
                badge.style.backgroundColor = 'var(--color-secondary)';
                badge.style.color = 'white';
            } else {
                badge.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                badge.style.color = 'white';
            }
        });
    }

    /**
     * MODIFICACIÓN CRÍTICA: Modo de navegación libre y no limitante para emergencias.
     * Alerta en consola si faltan datos para auditoría, pero NUNCA bloquea el avance del usuario.
     */
    function validateStep(step) {
        if (step === 1) {
            const evaluator = document.getElementById('evaluator-name')?.value?.trim();
            const address = document.getElementById('structure-address')?.value?.trim();
            const lat = document.getElementById('gps-latitude')?.value;
            
            if (!evaluator || !address || !lat || lat.includes('...')) {
                console.warn("[Validación Paso 1] Alerta: Campos vacíos detectados.");
            }
        }
        if (step === 2) {
            const material = document.querySelector('input[name="constructionSystem"]:checked')?.value;
            if (!material) {
                console.warn("[Validación Paso 2] Alerta: No se seleccionó sistema constructivo.");
            }
        }
        return true;
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                console.log(`[Form] Avanzando con éxito al paso: ${currentStep}`);
            }
        }
    }

    function previousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            console.log(`[Form] Retrocediendo con éxito al paso: ${currentStep}`);
        }
    }

        function handleMaterialFilter() {
        const materialSelected = document.querySelector('input[name="constructionSystem"]:checked')?.value;
        const container = document.getElementById('pathologies-container');
        
        if (!container) return;
        container.innerHTML = ''; // Limpiar

        if (!materialSelected) return;

        // Definición de patologías según sistema (NSR-10)
        const pathologies = {
            'REINFORCED_CONCRETE': [
                { id: 'c_1', label: 'Grietas en X en columnas', desc: 'Falla frágil por cortante' },
                { id: 'c_2', label: 'Trituración de concreto en nudos', desc: 'Pérdida de capacidad de carga' },
                { id: 'c_3', label: 'Acero de refuerzo expuesto/pandeado', desc: 'Falla estructural severa' }
            ],
            'MASONRY': [
                { id: 'm_1', label: 'Grietas diagonales en muros', desc: 'Falla por cortante en mampostería' },
                { id: 'm_2', label: 'Desprendimiento de unidades', desc: 'Pérdida de integridad del muro' }
            ],
            'ADOBE_WOOD': [
                { id: 'b_1', label: 'Separación de muros en esquinas', desc: 'Falta de confinamiento' },
                { id: 'b_2', label: 'Grietas verticales de gran apertura', desc: 'Inestabilidad de muros de tierra' }
            ]
        };

        const list = pathologies[materialSelected] || [
            { id: 'o_1', label: 'Grietas generales en estructura', desc: 'Daño visible' },
            { id: 'o_2', label: 'Desprendimiento de acabados', desc: 'Riesgo no estructural' }
        ];

        list.forEach(p => {
            const label = document.createElement('label');
            label.className = 'checkbox-option';
            label.innerHTML = `
                <input type="checkbox" name="damages" value="${p.id}" id="${p.id}">
                <span class="checkbox-label">
                    <strong>${p.label}</strong>
                    <small>${p.desc}</small>
                </span>
            `;
            label.querySelector('input').addEventListener('change', runLiveTriageUI);
            container.appendChild(label);
        });
        
        runLiveTriageUI();
    }

    function runLiveTriageUI() {
        if (typeof window.TriageModule !== 'undefined') {
            const selectedDamages = Array.from(document.querySelectorAll('input[name="damages"]:checked')).map(cb => cb.value);
            const assessment = {
                damages: {}
            };
            
            // Llenar el objeto de daños para el motor de triage
            document.querySelectorAll('input[name="damages"]').forEach(cb => {
                assessment.damages[cb.value] = cb.checked ? 'YES' : 'NO';
            });

            const result = window.TriageModule.evaluateAssessment(assessment, { schema_version: "1.0" });
            const badge = document.getElementById('verdict-badge');
            const code = document.getElementById('verdict-code');
            const action = document.getElementById('verdict-action');
            
            if (badge && code && action) {
                code.innerText = result.result_code;
                action.innerText = window.TriageModule.getRequiredAction(result.result_code);
                
                // Extraer emoji del nivel (🔴, 🟠, 🟡, 🟢, ⚪)
                const emoji = result.level.split(' ')[0];
                const text = result.level.split(' ').slice(1).join(' ');
                
                badge.innerHTML = `<span class="verdict-emoji">${emoji}</span> <span class="verdict-text">${text}</span>`;
                
                // Estilo según nivel
                if (result.level.includes('🔴')) badge.style.borderColor = 'var(--color-danger)';
                else if (result.level.includes('🟠')) badge.style.borderColor = 'var(--color-warning)';
                else if (result.level.includes('🟡')) badge.style.borderColor = 'var(--color-p3)';
                else if (result.level.includes('🟢')) badge.style.borderColor = 'var(--color-success)';
                else badge.style.borderColor = '#dee2e6';
            }
        }
    }

    function reset() {
        currentStep = 1;
        const sismoForm = document.getElementById('sismoForm');
        if (sismoForm) sismoForm.reset();
        showStep(currentStep);
        handleMaterialFilter();
        console.log('[Form] Formulario reiniciado por completo.');
    }

    return {
        initialize: initialize,
        nextStep: nextStep,
        previousStep: previousStep,
        reset: reset
    };
})();

// Inicializar y amarrar eventos al cargar el archivo
document.addEventListener('DOMContentLoaded', () => {
    FormModule.initialize();
    
        // Amarre manual inmediato de los botones por ID y clase para evitar fallas
    const btnSiguiente = document.getElementById('btn-next');
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', (e) => {
            e.preventDefault();
            FormModule.nextStep();
        });
    }

    const btnAnterior = document.getElementById('btn-prev');
    if (btnAnterior) {
        btnAnterior.addEventListener('click', (e) => {
            e.preventDefault();
            FormModule.previousStep();
        });
    }

    window.nextStep = FormModule.nextStep;
    window.previousStep = FormModule.previousStep;
});
