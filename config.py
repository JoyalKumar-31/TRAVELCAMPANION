import os
from dotenv import load_dotenv
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, BaseMessage

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", "0.3"))

class SimulatedGroqLLM(BaseChatModel):
    """
    Intelligent simulated fallback LLM when GROQ_API_KEY is not configured or in offline mode.
    This guarantees that the AI Architecture and LangGraph flow run smoothly for testing.
    """
    model_name: str = "simulated-groq-llama-3.3"

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        # We extract content from the last user message or prompt
        last_msg = messages[-1].content if messages else ""
        
        # Check what agent is requesting
        response_text = self._smart_simulate(last_msg)
        return type("ChatResult", (), {"generations": [type("ChatGeneration", (), {"message": AIMessage(content=response_text)})()]})()

    @property
    def _llm_type(self) -> str:
        return "simulated-groq"

    def _smart_simulate(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "profil" in prompt_lower:
            return (
                "PROFILE_ANALYSIS:\n"
                "- Travel Persona: High-efficiency cultural and experiential travelers\n"
                "- Rhythm: Balanced (2-3 key attractions per day with buffer time)\n"
                "- Accessibility Check: Verified wheelchair & senior accessibility for selected locations\n"
                "- Budget Allocation: Daily allowance optimized at 25% lodging, 35% activities, 25% dining, 15% transit."
            )
        elif "itinerary" in prompt_lower or "generate" in prompt_lower:
            return (
                "ITINERARY_GENERATION:\n"
                "Optimized schedule built considering opening hours, crowd heatmaps, and spatial proximity."
            )
        elif "adapt" in prompt_lower or "replan" in prompt_lower or "disruption" in prompt_lower:
            return (
                "ADAPTIVE_REPLAN_RESULT:\n"
                "- Identified Disruption: Adverse condition detected in scheduled time window.\n"
                "- Action Taken: Swapped outdoor spot with indoor cultural/museum venue within 1.5 km.\n"
                "- Cost Variance: $0 change to total budget.\n"
                "- Timing Adjusted: Rescheduled outdoor evening stroll to dry hours."
            )
        elif "group" in prompt_lower or "consensus" in prompt_lower:
            return (
                "GROUP_CONSENSUS:\n"
                "- Harmonized conflicting preferences between adventure, relaxation, and culture.\n"
                "- Compromise Index: 92% satisfaction across all members."
            )
        return "Simulated AI agent response executed according to system constraints."

def get_llm():
    """
    Returns ChatGroq if valid API key is set; otherwise falls back to SimulatedGroqLLM
    so developers can run the entire LangGraph flow immediately.
    """
    current_key = os.getenv("GROQ_API_KEY", "").strip()
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    temp = float(os.getenv("GROQ_TEMPERATURE", "0.3"))

    if current_key and current_key != "your_groq_api_key_here" and not current_key.startswith("gsk_your_groq"):
        try:
            from langchain_groq import ChatGroq
            return ChatGroq(
                groq_api_key=current_key,
                model_name=model,
                temperature=temp,
            )
        except Exception as e:
            print(f"[Warning] Failed to initialize ChatGroq: {e}. Falling back to Simulated LLM.")
            return SimulatedGroqLLM()
    else:
        return SimulatedGroqLLM()
