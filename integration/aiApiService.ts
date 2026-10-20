import axios from "axios";

/**
 * React.js / TypeScript API Service for AI Adaptive Tourism Companion.
 * Connects React UI directly to Python AI microservice (or via Spring Boot API Gateway).
 */
const AI_API_BASE_URL = process.env.REACT_APP_AI_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export interface TravelerProfile {
  destination: string;
  duration_days: number;
  budget: number;
  group_size: number;
  traveler_type: string;
  age_groups?: string[];
  interests: string[];
  preferred_activities?: string[];
  dietary_preferences?: string[];
  accessibility_requirements: string[];
  pace_preference: string;
}

export interface DisruptionEvent {
  day_number: number;
  time_slot: string;
  disruption_type: string;
  description: string;
  severity: string;
}

export interface GroupMember {
  name: string;
  interests: string[];
  max_budget: number;
  accessibility_needs?: string[];
}

export const aiApiService = {
  // 1. Generate Itinerary
  generateItinerary: async (profile: TravelerProfile) => {
    const response = await apiClient.post("/api/itinerary/generate", profile);
    return response.data;
  },

  // 2. Real-Time Dynamic Adapt
  adaptItinerary: async (itinerary: any, disruption: DisruptionEvent) => {
    const response = await apiClient.post("/api/itinerary/adapt", {
      itinerary,
      disruption,
    });
    return response.data;
  },

  // 3. Group Consensus & Logistics
  computeGroupConsensus: async (destination: string, duration_days: number, members: GroupMember[]) => {
    const response = await apiClient.post("/api/group/consensus", {
      destination,
      duration_days,
      members,
    });
    return response.data;
  },

  // 4. Smart Packing Checklist
  generatePackingChecklist: async (
    destination: string,
    duration_days: number,
    traveler_type: string,
    planned_activities: string[] = ["sightseeing", "dining"]
  ) => {
    const response = await apiClient.post("/api/packing/generate", {
      destination,
      duration_days,
      traveler_type,
      planned_activities,
    });
    return response.data;
  },

  // 5. Landmark Recognition (Computer Vision)
  recognizeLandmark: async (landmarkHint?: string, imageBase64?: string) => {
    const response = await apiClient.post("/api/vision/recognize-landmark", {
      landmark_hint: landmarkHint,
      image_base64: imageBase64,
    });
    return response.data;
  },

  // 6. What-If Travel Simulator
  simulateWhatIf: async (
    itinerary: any,
    scenario_type: string,
    parameter_value: string,
    affected_day: number = 1
  ) => {
    const response = await apiClient.post("/api/whatif/simulate", {
      itinerary,
      scenario_type,
      parameter_value,
      affected_day,
    });
    return response.data;
  },

  // 7. Multilingual Companion & Speech Audio
  chatWithCompanion: async (query: string, destination: string, language: string = "English") => {
    const response = await apiClient.post("/api/chat/companion", {
      query,
      destination,
      language,
    });
    return response.data;
  },

  // 8. Tourist Safety & Emergency Hub
  getEmergencySupport: async (destination: string, emergencyType: string = "general") => {
    const response = await apiClient.post("/api/safety/emergency", {
      destination,
      emergency_type: emergencyType,
    });
    return response.data;
  },
};

export default aiApiService;
