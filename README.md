# Sistema de Evaluación e Inspección Visual Post-Sismo - Colombia

Herramienta cartográfica y de peritaje rápido orientada a la gestión del riesgo de desastres para la evaluación preliminar de edificaciones afectadas por eventos sísmicos. Diseñada bajo los lineamientos técnicos de la **NSR-10**, manuales de la **Asociación Colombiana de Ingeniería Sísmica (AIS)**, y recomendaciones internacionales de la **FEMA (ATC-20)** y USAID/BHA.

---

## 🚀 Características del Ecosistema

* **Independencia Operativa (Offline-First):** Funciona directamente en dispositivos móviles con conectividad intermitente o nula en campo, almacenando los reportes localmente en el navegador mediante `localStorage`.
* **Triage Estructural Dinámico:** Muestra sublistas filtradas de máximo 5 a 6 patologías críticas según el sistema constructivo seleccionado (Concreto, Mampostería Confinada, Mampostería Informal o Bahareque/Tapia Pisada), optimizando el tiempo de decisión del evaluador.
* **Semáforo Automático de Habitabilidad:** Calcula en tiempo real el dictamen de seguridad:
  * 🟢 **Verde:** Habitable.
  * 🟡 **Amarillo:** Uso restringido / Daño moderado.
  * 🟠 **Naranja:** No habitable - Requiere evaluación detallada.
  * 🔴 **Rojo:** Peligro de colapso / No habitable (Orden de evacuación preventiva).
* **Georreferenciación Satelital y GIS:** Captura automática de coordenadas GPS del dispositivo y exportación de datos vectoriales en formato `.geojson` listos para ser proyectados en sistemas de información geográfica bajo el estándar oficial colombiano **MAGNA-SIRGAS Origen Nacional / CTM12 (Código EPSG: 9377)** del IGAC.
* **Generación de Reportes en PDF:** Compilador integrado que genera un informe técnico pericial normalizado de 2 páginas con casillas de control, hallazgos y anexo fotográfico institucional.

---

## 🛠️ Instrucciones de Despliegue y Uso

1. Asegúrate de tener los 4 archivos esenciales en la raíz de tu repositorio de GitHub:
   * `index.html` (Interfaz del formulario)
   * `styles.css` (Hojas de estilo institucionales)
   * `app.js` (Motor lógico, geolocalización y exportación)
   * `manifest.json` (Configuración PWA para instalación móvil)
2. Abre la URL de tu GitHub Pages en el navegador de tu celular (ej. Chrome o Safari).
3. Presiona el botón de recargar dos veces si requieres purgar la memoria caché de despliegue antiguo.
4. Completa los datos en campo, permite el acceso al GPS y adjunta las 3 evidencias fotográficas obligatorias para habilitar los botones de exportación y generación de PDF.

---

## ⚠️ Nota Legal y Técnica de Referencia

El presente software y sus dictámenes asociados constituyen un registro pericial preliminar de habitabilidad inmediata, basado exclusivamente en una inspección ocular de las patologías estructurales y no estructurales visibles y accesibles en el sitio al momento de la evaluación. 

Este reporte preliminar no reemplaza un diseño de vulnerabilidad sísmica estructural ni un concepto pericial vinculante definitivo bajo los términos de la **Ley 400 de 1997** y sus decretos reglamentarios en la República de Colombia. 

En caso de evidenciarse una evolución acelerada de fisuras, deformaciones excesivas en elementos esenciales, asentamientos diferenciales o manifestaciones acústicas estáticas (crujidos continuos), se ordena la evacuación inmediata de la edificación de manera preventiva y el reporte prioritario ante el Puesto de Mando Unificado (PMU), la Línea Única de Emergencias **123** o el Cuerpo Oficial de Bomberos.

---
*Desarrollado por el Ing.R.Truque para el apoyo operativo en la gestión de emergencias y habitabilidad urbana.*
