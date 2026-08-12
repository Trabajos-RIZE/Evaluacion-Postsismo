/**
 * MODULE: Database Persistence Layer
 * Description: IndexedDB abstraction for offline-first data storage
 * HITO: 3 - Persistent storage for assessments, photos, and metadata
 * Design: Pure async/Promise-based API, decoupled from UI
 * 
 * Database: 'SismoCaliDB' (version 1)
 * Object Store: 'assessments' (keyPath: 'id', autoIncrement: true)
 * 
 * Schema per assessment record:
 * {
 *   id: Number (auto-generated),
 *   timestamp: ISO String,
 *   evaluator: {
 *     name: String,
 *     license: String,
 *     agency: String
 *   },
 *   location: {
 *     address: String,
 *     latitude: Number,
 *     longitude: Number,
 *     accuracy: Number
 *   },
 *   assessment: Object (from TriageModule.evaluateAssessment),
 *   damages: Object (raw inspection data),
 *   photos: {
 *     structural: String (Base64),
 *     facade: String (Base64),
 *     detail: String (Base64)
 *   },
 *   metadata: {
 *     buildingType: String,
 *     constructionYear: Number,
 *     storeys: Number,
 *     municipalCode: String,
 *     municipality: String
 *   },
 *   syncStatus: 'PENDING' | 'SYNCED' | 'ERROR'
 * }
 */

const DatabaseModule = (() => {
  'use strict';

  const DB_NAME = 'SismoCaliDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'assessments';

  let dbInstance = null;

  /**
   * Initialize or retrieve IndexedDB instance
   * @returns {Promise<IDBDatabase>}
   */
  async function getDatabase() {
    return new Promise((resolve, reject) => {
      if (dbInstance) {
        resolve(dbInstance);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error.message}`));
      };

      request.onsuccess = () => {
        dbInstance = request.result;
        resolve(dbInstance);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create assessments object store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });

          // Create indexes for efficient querying
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
          store.createIndex('evaluatorName', 'evaluator.name', { unique: false });
          store.createIndex('municipality', 'metadata.municipality', { unique: false });

          console.log(`[DB] IndexedDB schema initialized: ${STORE_NAME} object store created`);
        }
      };
    });
  }

  /**
   * Validate assessment record against schema
   * @param {Object} assessment - Assessment record to validate
   * @returns {Object} {valid: Boolean, errors: Array<String>}
   */
  function validateAssessmentRecord(assessment) {
    const errors = [];

    if (!assessment) {
      errors.push('Assessment record is null or undefined');
      return { valid: false, errors };
    }

    // Validate required top-level fields
    if (!assessment.timestamp) {
      errors.push('Missing required field: timestamp (ISO string)');
    }

    if (!assessment.evaluator || typeof assessment.evaluator !== 'object') {
      errors.push('Missing or invalid evaluator object');
    } else {
      if (!assessment.evaluator.name) {
        errors.push('Evaluator name is required');
      }
      if (!assessment.evaluator.license) {
        errors.push('Evaluator license/matrícula is required');
      }
    }

    if (!assessment.location || typeof assessment.location !== 'object') {
      errors.push('Missing or invalid location object');
    } else {
      if (assessment.location.latitude === undefined || assessment.location.longitude === undefined) {
        errors.push('Location must include latitude and longitude');
      }
      if (!assessment.location.address) {
        errors.push('Location address is required');
      }
    }

    if (!assessment.damages || typeof assessment.damages !== 'object') {
      errors.push('Missing damages object (raw inspection data)');
    }

    if (!assessment.photos || typeof assessment.photos !== 'object') {
      errors.push('Missing photos object');
    }

    // Validate assessment result (from TriageModule)
    if (!assessment.assessment || typeof assessment.assessment !== 'object') {
      errors.push('Missing assessment result object (from TriageModule)');
    } else {
      if (!assessment.assessment.level) {
        errors.push('Assessment result missing level (P1-P4, NR)');
      }
      if (!assessment.assessment.result_code) {
        errors.push('Assessment result missing result_code');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Save a new assessment record to IndexedDB
   * Enforces schema validation before storage
   * 
   * @param {Object} assessment - Assessment record with all required fields
   * @returns {Promise<Number>} Record ID (auto-generated)
   */
  async function saveAssessment(assessment) {
    // Validate record
    const validation = validateAssessmentRecord(assessment);
    if (!validation.valid) {
      throw new Error(`Invalid assessment record: ${validation.errors.join('; ')}`);
    }

    // Ensure timestamp and syncStatus
    if (!assessment.timestamp) {
      assessment.timestamp = new Date().toISOString();
    }
    if (!assessment.syncStatus) {
      assessment.syncStatus = 'PENDING';
    }

    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(assessment);

      request.onerror = () => {
        reject(new Error(`Failed to save assessment: ${request.error.message}`));
      };

      request.onsuccess = () => {
        console.log(`[DB] Assessment saved with ID: ${request.result}`);
        resolve(request.result);
      };
    });
  }

  /**
   * Retrieve all assessments from IndexedDB
   * Returns complete history for SIS mapping or export
   * 
   * @returns {Promise<Array<Object>>} Array of all assessment records
   */
  async function getAllAssessments() {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev'); // Most recent first

      const assessments = [];

      request.onerror = () => {
        reject(new Error(`Failed to retrieve assessments: ${request.error.message}`));
      };

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          assessments.push(cursor.value);
          cursor.continue();
        } else {
          console.log(`[DB] Retrieved ${assessments.length} assessments from storage`);
          resolve(assessments);
        }
      };
    });
  }

  /**
   * Retrieve a single assessment by ID
   * 
   * @param {Number} id - Record ID
   * @returns {Promise<Object|null>} Assessment record or null if not found
   */
  async function getAssessmentById(id) {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => {
        reject(new Error(`Failed to retrieve assessment: ${request.error.message}`));
      };

      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  /**
   * Retrieve assessments by municipality for regional analysis
   * 
   * @param {String} municipality - Municipality name
   * @returns {Promise<Array<Object>>} Filtered assessments
   */
  async function getAssessmentsByMunicipality(municipality) {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('municipality');
      const request = index.getAll(municipality);

      request.onerror = () => {
        reject(new Error(`Failed to query by municipality: ${request.error.message}`));
      };

      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  /**
   * Retrieve assessments by sync status
   * Used to identify records pending server sync
   * 
   * @param {String} status - 'PENDING' | 'SYNCED' | 'ERROR'
   * @returns {Promise<Array<Object>>}
   */
  async function getAssessmentsBySyncStatus(status) {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('syncStatus');
      const request = index.getAll(status);

      request.onerror = () => {
        reject(new Error(`Failed to query by sync status: ${request.error.message}`));
      };

      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  /**
   * Update sync status of an assessment
   * Called after successful server sync
   * 
   * @param {Number} id - Record ID
   * @param {String} status - New sync status
   * @returns {Promise<void>}
   */
  async function updateSyncStatus(id, status) {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const assessment = getRequest.result;
        if (!assessment) {
          reject(new Error(`Assessment with ID ${id} not found`));
          return;
        }

        assessment.syncStatus = status;
        const updateRequest = store.put(assessment);

        updateRequest.onerror = () => {
          reject(new Error(`Failed to update sync status: ${updateRequest.error.message}`));
        };

        updateRequest.onsuccess = () => {
          console.log(`[DB] Assessment ${id} sync status updated to: ${status}`);
          resolve();
        };
      };

      getRequest.onerror = () => {
        reject(new Error(`Failed to fetch assessment: ${getRequest.error.message}`));
      };
    });
  }

  /**
   * Delete a single assessment by ID
   * Permanent removal from local storage
   * 
   * @param {Number} id - Record ID
   * @returns {Promise<void>}
   */
  async function deleteAssessment(id) {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => {
        reject(new Error(`Failed to delete assessment: ${request.error.message}`));
      };

      request.onsuccess = () => {
        console.log(`[DB] Assessment ${id} deleted from storage`);
        resolve();
      };
    });
  }

  /**
   * Clear all assessments from local storage
   * DESTRUCTIVE OPERATION - use with caution
   * 
   * @returns {Promise<void>}
   */
  async function clearAllAssessments() {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => {
        reject(new Error(`Failed to clear assessments: ${request.error.message}`));
      };

      request.onsuccess = () => {
        console.log('[DB] All assessments cleared from storage');
        resolve();
      };
    });
  }

  /**
   * Get storage statistics
   * Returns count of records and estimated size
   * 
   * @returns {Promise<Object>} {recordCount: Number, estimatedSize: String}
   */
  async function getStorageStats() {
    const db = await getDatabase();
    let recordCount = 0;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onerror = () => {
        reject(new Error(`Failed to get storage stats: ${request.error.message}`));
      };

      request.onsuccess = () => {
        recordCount = request.result;
        
        // Attempt to get quota info (if available in browser)
        if (navigator.storage && navigator.storage.estimate) {
          navigator.storage.estimate().then(estimate => {
            resolve({
              recordCount: recordCount,
              usedBytes: estimate.usage,
              availableBytes: estimate.quota,
              usedMB: (estimate.usage / (1024 * 1024)).toFixed(2),
              quotaMB: (estimate.quota / (1024 * 1024)).toFixed(2)
            });
          }).catch(() => {
            resolve({
              recordCount: recordCount,
              usedBytes: null,
              availableBytes: null,
              message: 'Storage quota API not available'
            });
          });
        } else {
          resolve({
            recordCount: recordCount,
            message: 'Storage quota API not available'
          });
        }
      };
    });
  }

  /**
   * Export all assessments as JSON
   * For data backup and analysis
   * 
   * @returns {Promise<String>} JSON string of all records
   */
  async function exportAsJSON() {
    const assessments = await getAllAssessments();
    return JSON.stringify(assessments, null, 2);
  }

  /**
   * Import assessments from JSON
   * Merges with existing data (does not clear)
   * 
   * @param {String} jsonData - JSON string of assessment array
   * @returns {Promise<Number>} Count of imported records
   */
  async function importFromJSON(jsonData) {
    let data;
    try {
      data = JSON.parse(jsonData);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }

    if (!Array.isArray(data)) {
      throw new Error('JSON must contain an array of assessments');
    }

    let importedCount = 0;
    for (const assessment of data) {
      try {
        await saveAssessment(assessment);
        importedCount++;
      } catch (error) {
        console.warn(`[DB] Skipped import of assessment: ${error.message}`);
      }
    }

    console.log(`[DB] Imported ${importedCount} assessments successfully`);
    return importedCount;
  }

  return {
    // Core operations
    saveAssessment,
    getAllAssessments,
    getAssessmentById,
    deleteAssessment,
    clearAllAssessments,

    // Query operations
    getAssessmentsByMunicipality,
    getAssessmentsBySyncStatus,
    updateSyncStatus,

    // Utility operations
    getStorageStats,
    exportAsJSON,
    importFromJSON,
    validateAssessmentRecord,

    // Constants for external use
    DB_NAME,
    DB_VERSION,
    STORE_NAME
  };
})();

// Export for CommonJS/Node.js environments (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DatabaseModule;
}
