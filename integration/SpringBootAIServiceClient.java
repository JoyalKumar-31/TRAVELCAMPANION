package com.tourism.companion.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Spring Boot Integration Client for Python AI Adaptive Tourism Companion Service.
 * Connects the Spring Boot core backend with the LangGraph & Multi-Agent AI microservice.
 */
@Service
public class SpringBootAIServiceClient {

    private final WebClient webClient;

    public SpringBootAIServiceClient(
            WebClient.Builder webClientBuilder,
            @Value("${ai.service.base-url:http://localhost:8000}") String aiServiceBaseUrl) {
        this.webClient = webClientBuilder.baseUrl(aiServiceBaseUrl).build();
    }

    // =========================================================================
    // 1. GENERATE PERSONALIZED ITINERARY
    // =========================================================================
    public Mono<Map> generateItinerary(Map<String, Object> travelerProfile) {
        return this.webClient.post()
                .uri("/api/itinerary/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(travelerProfile)
                .retrieve()
                .bodyToMono(Map.class);
    }

    // =========================================================================
    // 2. REAL-TIME ADAPTIVE REPLANNING (Weather, Crowd, Closures)
    // =========================================================================
    public Mono<Map> adaptItinerary(Map<String, Object> adaptPayload) {
        return this.webClient.post()
                .uri("/api/itinerary/adapt")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(adaptPayload)
                .retrieve()
                .bodyToMono(Map.class);
    }

    // =========================================================================
    // 3. GROUP CONSENSUS, ACCOMMODATION & TRANSIT OPTIMIZATION
    // =========================================================================
    public Mono<Map> computeGroupConsensus(Map<String, Object> groupRequest) {
        return this.webClient.post()
                .uri("/api/group/consensus")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(groupRequest)
                .retrieve()
                .bodyToMono(Map.class);
    }

    // =========================================================================
    // 4. SMART PACKING CHECKLIST GENERATION
    // =========================================================================
    public Mono<Map> generatePackingChecklist(Map<String, Object> packingRequest) {
        return this.webClient.post()
                .uri("/api/packing/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(packingRequest)
                .retrieve()
                .bodyToMono(Map.class);
    }

    // =========================================================================
    // 5. LANDMARK RECOGNITION (COMPUTER VISION / MULTIMODAL AI)
    // =========================================================================
    public Mono<Map> recognizeLandmark(Map<String, Object> visionRequest) {
        return this.webClient.post()
                .uri("/api/vision/recognize-landmark")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(visionRequest)
                .retrieve()
                .bodyToMono(Map.class);
    }

    // =========================================================================
    // 6. WHAT-IF TRAVEL SIMULATOR
    // =========================================================================
    public Mono<Map> simulateWhatIfScenario(Map<String, Object> whatIfRequest) {
        return this.webClient.post()
                .uri("/api/whatif/simulate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(whatIfRequest)
                .retrieve()
                .bodyToMono(Map.class);
    }

    // =========================================================================
    // 7. CONVERSATIONAL MULTILINGUAL COMPANION
    // =========================================================================
    public Mono<Map> chatWithCompanion(Map<String, Object> chatRequest) {
        return this.webClient.post()
                .uri("/api/chat/companion")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(chatRequest)
                .retrieve()
                .bodyToMono(Map.class);
    }

    // =========================================================================
    // 8. TOURIST SAFETY & SOS EMERGENCY ASSISTANCE
    // =========================================================================
    public Mono<Map> getEmergencySupport(Map<String, Object> emergencyRequest) {
        return this.webClient.post()
                .uri("/api/safety/emergency")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(emergencyRequest)
                .retrieve()
                .bodyToMono(Map.class);
    }
}
