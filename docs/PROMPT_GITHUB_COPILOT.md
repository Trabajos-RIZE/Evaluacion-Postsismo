# PROMPT MAESTRO PARA GITHUB COPILOT

Lee primero `docs/MASTER_SPEC.md`.

NO generes toda la aplicación de una vez. Trabaja por hitos, prueba y conserva las interfaces.

HITO 1: arquitectura + configuración Cali + triage.json.
HITO 2: motor puro `evaluateAssessment(data,rules)` con pruebas; devuelve level,reasons,ruleVersion.
HITO 3: IndexedDB para reportes y fotos.
HITO 4: UI móvil por pasos.
HITO 5: GPS, precisión y cámara; jamás coordenadas falsas.
HITO 6: JSON/CSV/GeoJSON para QGIS.
HITO 7: PWA/offline.
HITO 8: asistencia IA sin modificar result_code.
HITO 9: API + PostgreSQL/PostGIS + sincronización y auditoría.

Cada respuesta debe indicar: archivos modificados, cómo probar, pruebas ejecutadas y siguiente hito.

Reglas: nunca certificar habitabilidad; peligro inmediato detiene inspección; incertidumbre => NR; conservar evidencia.
