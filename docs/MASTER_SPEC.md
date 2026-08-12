# RED POST-SISMO — ESPECIFICACIÓN MAESTRA V1

## Objetivo
PWA móvil, open source, local-first y georreferenciada para captura rápida post-sismo. Cali es la primera configuración; otras localidades se agregan por configuración.

## Seguridad
NO certifica seguridad, habitabilidad ni estabilidad. Solo TRIAGE:
P1 = sin indicios relevantes observados
P2 = revisión recomendada
P3 = restricción/evaluación técnica prioritaria
P4 = peligro/no ingresar
NR = no evaluable

Nunca mostrar “HABITABLE” como conclusión profesional.

## Flujo
0 seguridad del evaluador
1 identificación
2 GPS + precisión + dirección
3 uso, pisos, sistema estructural, modificaciones
4 entorno/geotecnia
5 estructura
6 mampostería/no estructural
7 servicios/peligros secundarios
8 fotografías
9 observaciones objetivas
10 motor de reglas
11 guardado local
12 JSON/CSV/GeoJSON
13 contexto para IA
14 sincronización futura API/PostGIS

## Arquitectura
config/jurisdictions/cali.json
config/rules/triage.json
src/core/triage.js
src/core/storage.js
src/core/export.js
src/core/gps.js
src/core/photos.js
src/core/ai-context.js
src/ui/
tests/

No mezclar reglas, almacenamiento y UI en un único script.

## Reglas
P4>P3>P2>P1>NR. Reglas explícitas, versionadas y auditables. No usar conteo de grietas. No inventar coordenadas. Si no es seguro inspeccionar => NR.

## Fotos
IndexedDB, no localStorage con base64. Guardar photo_id, report_id, fecha, tipo y blob.

## QGIS
GeoJSON Point + propiedades normalizadas. CSV con lat/lon. Las fotos se referencian por photo_id.

## IA
Puede resumir, normalizar lenguaje, detectar inconsistencias y pedir datos faltantes. NO puede cambiar el resultado, certificar habitabilidad ni eliminar evidencia.

## Normativa/instituciones a validar antes del uso operativo
NSR-10 y modificaciones vigentes; A.10; metodología post-sismo IDIGER/AIS; SGC; UNGRD; Secretaría de Gestión del Riesgo de Cali; IDESC/SATIC.

## Criterio V1
Un ciudadano completa el reporte en pocos minutos sin diagnosticar. Un técnico puede abrir el GeoJSON en QGIS y saber por qué el motor asignó el nivel.
