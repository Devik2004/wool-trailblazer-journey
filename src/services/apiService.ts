import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  Farm,
  WoolBatch,
  ProcessingFacility,
  JourneyHistoryItem,
  AnalyticsData,
  WoolGrade,
  BatchStatus
} from "@/data/wool-data";

const API_BASE_URL = "http://localhost:8000/api";

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle API errors
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const errMsg = error.response?.data?.message || error.message;
    toast.error(`API Error: ${errMsg}`);
    console.error("AxiosError:", error.toJSON());
  } else {
    toast.error("An unexpected error occurred");
    console.error("Unknown error:", error);
  }
  throw error;
};

// ---------- FARM API ----------
export const farmAPI = {
  getAllFarms: async (): Promise<Farm[]> => {
    try {
      const response = await apiClient.get<Farm[]>("/farms/");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getFarmById: async (farmId: string): Promise<Farm> => {
    try {
      const response = await apiClient.get<Farm>(`/farms/${farmId}/`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  createFarm: async (farmData: {
    id: string;
    name: string;
    location: string;
    sheep_count: number;
    annual_production: number;
    certifications: string[];
    contact_person: string;
    contact_email: string;
    photo?: string;
  }): Promise<Farm> => {
    try {
      const response = await apiClient.post<Farm>("/farms/", farmData);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

// ---------- WOOL BATCH API ----------
export const batchAPI = {
  getAllBatches: async (): Promise<WoolBatch[]> => {
    try {
      const response = await apiClient.get<WoolBatch[]>("/wool-batches/");
      return response.data;
    } catch (error) {
      handleError(error);
    } 
  },

  getBatchesByFarmId: async (farmId: string): Promise<WoolBatch[]> => {
    try {
      const allBatches = await batchAPI.getAllBatches();
      return allBatches.filter(batch => batch.farmId === farmId);
    } catch (error) {
      handleError(error);
    }
  },

  getBatchById: async (batchId: string): Promise<WoolBatch> => {
    try {
      const response = await apiClient.get<WoolBatch>(`/wool-batches/${batchId}/`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  createBatch: async (batchData: {
    farmId: string;
    weight: number;
    grade: WoolGrade;
    color: string;
    qualityScore: number;
    notes?: string;
  }): Promise<WoolBatch> => {
    try {
      const response = await apiClient.post<WoolBatch>("/wool-batches/", batchData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateBatchStatus: async (
    batchId: string,
    statusUpdate: {
      status: BatchStatus;
      location: string;
      handledBy: string;
      notes?: string;
    }
  ): Promise<WoolBatch> => {
    try {
      const response = await apiClient.patch<WoolBatch>(
        `/wool-batches/${batchId}/status/`,
        statusUpdate
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ---------- FACILITIES API ----------
export const facilityAPI = {
  getAllFacilities: async (): Promise<ProcessingFacility[]> => {
    try {
      const response = await apiClient.get<ProcessingFacility[]>("/processing-facilities/");
      console.log(response.data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ---------- ANALYTICS API ----------
export const analyticsAPI = {
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      const response = await apiClient.get<AnalyticsData>("/analytics-summary/");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// ---------- EXPORT ----------
const api = {
  farms: farmAPI,
  batches: batchAPI,
  facilities: facilityAPI,
  analytics: analyticsAPI,
};

export default api;
