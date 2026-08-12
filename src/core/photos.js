/**
 * PHOTOGRAPHY COMPRESSION & PROCESSING CORE MODULE (MODULE VERSION)
 * Ecosistema Triage Sísmico Cali v3.7 - Hito 5 Production
 */

const PhotosModule = (() => {
    const REQUIRED_PHOTOS = 3;

    // Procesa el archivo de imagen nativo capturado por la cámara del celular
    function compress(fileObject) {
        return new Promise((resolve) => {
            if (!fileObject) {
                resolve(null);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Escala métrica fija para resguardar el búfer de IndexedDB
                    const MAX_WIDTH = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Codificación agresiva JPEG fijada al 50% de calidad
                    const base64Compressed = canvas.toDataURL('image/jpeg', 0.50);
                    console.log(`[Photos] Imagen comprimida con éxito. Reducción de peso completada.`);
                    resolve(base64Compressed);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(fileObject);
        });
    }

    // Genera y renderiza una miniatura (thumbnail) en la interfaz móvil
    function preview(base64Data, targetInputId) {
        // Encontrar o crear un contenedor dinámico justo debajo del input de tipo file
        const inputElement = document.getElementById(targetInputId);
        if (!inputElement) return;

        let previewContainer = inputElement.nextElementSibling;
        if (!previewContainer || !previewContainer.classList.contains('thumbnail-preview-container')) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'thumbnail-preview-container';
            previewContainer.style.marginTop = '8px';
            inputElement.parentNode.insertBefore(previewContainer, inputElement.nextSibling);
        }

        previewContainer.innerHTML = ''; // Limpiar preexistentes

        const imgElement = document.createElement('img');
        imgElement.src = base64Data;
        imgElement.style.width = '90px'; // Tamaño óptimo de miniatura para pantalla táctil
        imgElement.style.height = '65px';
        imgElement.style.objectFit = 'cover';
        imgElement.style.borderRadius = '6px';
        imgElement.style.border = '2px solid #1e3a8a';

        previewContainer.appendChild(imgElement);
    }

    function hasRequiredPhotos(photosObject) {
        if (!photosObject) return false;
        let count = 0;
        if (photosObject.f1) count++;
        if (photosObject.f2) count++;
        if (photosObject.f3) count++;
        return count >= REQUIRED_PHOTOS;
    }

    function deletePhoto(photoId) {
        console.log(`[Photos] Eliminando foto: ${photoId} de la memoria temporal`);
        return true;
    }

    // Interfaz pública mapeada
    return {
        REQUIRED_PHOTOS: REQUIRED_PHOTOS,
        compress: compress,
        preview: preview,
        hasRequiredPhotos: hasRequiredPhotos,
        deletePhoto: deletePhoto
    };
})();

// Escuchador global automático para procesar cargas y pintar miniaturas reactivas
document.addEventListener('DOMContentLoaded', () => {
    // Exponer métodos de apoyo en el objeto global de forma segura
    window.optimizarYConvertirImagen = PhotosModule.compress;
    window.renderizarMiniatura = PhotosModule.preview;
});
