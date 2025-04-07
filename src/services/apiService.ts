import { farms, woolBatches, processingFacilities, analyticsData } from "@/data/wool-data";
import { toast } from "sonner";

// Types matching our data structure
// These would typically come from a types file in a real application
import type { 
  Farm, 
  WoolBatch, 
  ProcessingFacility, 
  JourneyHistoryItem,
  AnalyticsData,
  WoolGrade,
  BatchStatus
} from "@/data/wool-data";

/**
 * API Service for handling all data communication with the backend.
 * Currently using mock data, but designed to be replaced with actual API calls.
 * 
 * The backend should implement the following endpoints and data formats:
 * 
 * GET /api/farms - Returns all farms
 * Response format:
 * [
 *   {
 *     id: string;
 *     name: string;
 *     location: string;
 *     contactPerson: string;
 *     contactEmail: string;
 *     sheepCount: number;
 *     annualProduction: number;
 *     certifications: string[];
 *     joinedDate: string; // ISO date string
 *     photo: string; // URL to farm photo
 *   },
 *   ...
 * ]
 * 
 * GET /api/wool-batches - Returns all wool batches
 * Response format:
 * [
 *   {
 *     id: string;
 *     farmId: string;
 *     shearDate: string; // ISO date string
 *     weight: number;
 *     grade: "Fine" | "Medium" | "Coarse" | "Superfine";
 *     color: string;
 *     currentStatus: string;
 *     currentLocation: string;
 *     qualityScore: number;
 *     journeyHistory: [
 *       {
 *         status: string;
 *         location: string;
 *         timestamp: string; // ISO date string
 *         handledBy: string;
 *         notes?: string;
 *       },
 *       ...
 *     ]
 *   },
 *   ...
 * ]
 * 
 * GET /api/processing-facilities - Returns all processing facilities
 * Response format:
 * [
 *   {
 *     id: string;
 *     name: string;
 *     type: string;
 *     location: string;
 *     capacity: number;
 *     currentUtilization: number;
 *   },
 *   ...
 * ]
 * 
 * GET /api/analytics - Returns analytics data
 * Response format:
 * {
 *   averageQualityScore: number;
 *   monthlyProduction: [
 *     {
 *       month: string;
 *       amount: number;
 *     },
 *     ...
 *   ]
 * }
 * 
 * POST /api/farms - Create a new farm
 * Request body format:
 * {
 *   name: string;
 *   location: string;
 *   contactPerson: string;
 *   contactEmail: string;
 *   sheepCount: number;
 *   annualProduction: number;
 *   certifications: string[];
 *   photo?: string; // URL to farm photo
 * }
 * 
 * POST /api/wool-batches - Create a new wool batch
 * Request body format:
 * {
 *   farmId: string;
 *   weight: number;
 *   grade: "Fine" | "Medium" | "Coarse" | "Superfine";
 *   color: string;
 *   qualityScore: number;
 *   notes?: string;
 * }
 * 
 * PATCH /api/wool-batches/:id/status - Update a wool batch status
 * Request body format:
 * {
 *   status: string;
 *   location: string;
 *   handledBy: string;
 *   notes?: string;
 * }
 */

// API base URL - would come from environment variables in a real application
const API_BASE_URL = "/api";

// Reusable fetch function with error handling
async function apiFetch<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API request failed with status ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    toast.error(`Error communicating with the server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// Farm related API functions
export const farmAPI = {
  // Get all farms
  getAllFarms: async (): Promise<Farm[]> => {
    // MOCK: Return local data
    // In production, this would be:
    // return apiFetch<Farm[]>('/farms');
    return Promise.resolve([...farms]);
  },

  // Get farm by ID
  getFarmById: async (farmId: string): Promise<Farm | undefined> => {
    // MOCK: Return local data
    // In production, this would be:
    // return apiFetch<Farm>(`/farms/${farmId}`);
    const farm = farms.find(farm => farm.id === farmId);
    return Promise.resolve(farm);
  },

  // Create a new farm
  createFarm: async (farmData: Omit<Farm, 'id' | 'joinedDate'>): Promise<Farm> => {
    // MOCK: Create farm in local data
    // In production, this would be:
    // return apiFetch<Farm>('/farms', {
    //   method: 'POST',
    //   body: JSON.stringify(farmData)
    // });
    
    const lastId = parseInt(farms[farms.length - 1].id.split('-')[1]);
    const newId = `farm-${String(lastId + 1).padStart(3, '0')}`;
    
    const newFarm: Farm = {
      id: newId,
      name: farmData.name,
      location: farmData.location,
      contactPerson: farmData.contactPerson,
      contactEmail: farmData.contactEmail,
      sheepCount: farmData.sheepCount,
      annualProduction: farmData.annualProduction,
      certifications: farmData.certifications,
      joinedDate: new Date().toISOString(),
      photo: farmData.photo || "https://source.unsplash.com/random/800x600/?farm"
    };
    
    farms.push(newFarm);
    return Promise.resolve(newFarm);
  }
};

// Wool Batch related API functions
export const batchAPI = {
  // Get all wool batches
  getAllBatches: async (): Promise<WoolBatch[]> => {
    // MOCK: Return local data
    // In production, this would be:
    // return apiFetch<WoolBatch[]>('/wool-batches');
    return Promise.resolve([...woolBatches]);
  },

  // Get wool batches for a specific farm
  getBatchesByFarmId: async (farmId: string): Promise<WoolBatch[]> => {
    // MOCK: Return local data filtered by farm ID
    // In production, this would be:
    // return apiFetch<WoolBatch[]>(`/wool-batches?farmId=${farmId}`);
    return Promise.resolve(woolBatches.filter(batch => batch.farmId === farmId));
  },

  // Get batch by ID
  getBatchById: async (batchId: string): Promise<WoolBatch | undefined> => {
    // MOCK: Return local data
    // In production, this would be:
    // return apiFetch<WoolBatch>(`/wool-batches/${batchId}`);
    const batch = woolBatches.find(batch => batch.id === batchId);
    return Promise.resolve(batch);
  },

  // Create a new wool batch
  createBatch: async (batchData: {
    farmId: string;
    weight: number;
    grade: WoolGrade;
    color: string;
    qualityScore: number;
    notes?: string;
  }): Promise<WoolBatch> => {
    // MOCK: Create batch in local data
    // In production, this would be:
    // return apiFetch<WoolBatch>('/wool-batches', {
    //   method: 'POST',
    //   body: JSON.stringify(batchData)
    // });
    
    const lastId = parseInt(woolBatches[woolBatches.length - 1].id.split('-')[1]);
    const newId = `batch-${String(lastId + 1).padStart(3, '0')}`;
    
    const farm = farms.find(f => f.id === batchData.farmId);
    
    const newBatch: WoolBatch = {
      id: newId,
      farmId: batchData.farmId,
      shearDate: new Date().toISOString(),
      weight: batchData.weight,
      grade: batchData.grade,
      color: batchData.color,
      currentStatus: "Sheared",
      currentLocation: farm?.name || "Unknown",
      qualityScore: batchData.qualityScore,
      journeyHistory: [
        {
          status: "Sheared",
          location: farm?.name || "Unknown",
          timestamp: new Date().toISOString(),
          handledBy: farm?.contactPerson || "Unknown",
          notes: batchData.notes || "Initial shearing",
        }
      ]
    };
    
    woolBatches.push(newBatch);
    return Promise.resolve(newBatch);
  },

  // Update batch status
  updateBatchStatus: async (
    batchId: string, 
    statusUpdate: {
      status: BatchStatus;
      location: string;
      handledBy: string;
      notes?: string;
    }
  ): Promise<WoolBatch> => {
    // MOCK: Update batch in local data
    // In production, this would be:
    // return apiFetch<WoolBatch>(`/wool-batches/${batchId}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(statusUpdate)
    // });
    
    const batchIndex = woolBatches.findIndex(batch => batch.id === batchId);
    if (batchIndex === -1) {
      throw new Error(`Batch with ID ${batchId} not found`);
    }
    
    const batch = woolBatches[batchIndex];
    const newHistoryItem: JourneyHistoryItem = {
      status: statusUpdate.status,
      location: statusUpdate.location,
      timestamp: new Date().toISOString(),
      handledBy: statusUpdate.handledBy,
      notes: statusUpdate.notes
    };
    
    const updatedBatch: WoolBatch = {
      ...batch,
      currentStatus: statusUpdate.status,
      currentLocation: statusUpdate.location,
      journeyHistory: [...batch.journeyHistory, newHistoryItem]
    };
    
    woolBatches[batchIndex] = updatedBatch;
    return Promise.resolve(updatedBatch);
  }
};

// Processing Facilities related API functions
export const facilityAPI = {
  // Get all processing facilities
  getAllFacilities: async (): Promise<ProcessingFacility[]> => {
    // MOCK: Return local data
    // In production, this would be:
    // return apiFetch<ProcessingFacility[]>('/processing-facilities');
    return Promise.resolve([...processingFacilities]);
  }
};

// Analytics related API functions
export const analyticsAPI = {
  // Get analytics data
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    // MOCK: Return local data
    // In production, this would be:
    // return apiFetch<AnalyticsData>('/analytics');
    return Promise.resolve({...analyticsData});
  }
};

// Export a default object with all APIs for convenience
const api = {
  farms: farmAPI,
  batches: batchAPI,
  facilities: facilityAPI,
  analytics: analyticsAPI
};

export default api;
