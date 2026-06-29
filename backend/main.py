"""
HEATESCAPE Backend (Multi-City)
=================================
Thin, read-only FastAPI server serving precomputed zone, materials, and
cooling simulation data across multiple Indian cities.

Still no database, no auth, no write operations — same architecture
rationale as the single-city version, just namespaced by city_id now.

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""

import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

load_dotenv()

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

app = FastAPI(
    title="HEATESCAPE API",
    description="Urban Heat Mitigation & Cooling Strategy Optimizer — Multi-City India",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def load_json(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(
            status_code=503,
            detail=f"{filename} not found. Run data-pipeline/build_dataset.py first.",
        )
    with open(path, "r") as f:
        return json.load(f)


def load_json_safe(filename: str):
    """Like load_json but returns None instead of raising on missing files."""
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        return json.load(f)


def validate_city(city_id: str):
    if not os.path.exists(os.path.join(DATA_DIR, f"zones_{city_id}.json")):
        raise HTTPException(
            status_code=404,
            detail=f"No data for city '{city_id}'. Check /api/cities for valid IDs.",
        )


# ── Data endpoints ──────────────────────────────────────────────────────────


@app.get("/")
def root():
    return {
        "service": "HEATESCAPE API",
        "status": "running",
        "endpoints": [
            "/api/cities",
            "/api/cities/{city_id}/zones",
            "/api/cities/{city_id}/zones/{zone_id}",
            "/api/cities/{city_id}/zones/{zone_id}/cooling",
            "/api/cities/{city_id}/model-meta",
            "/api/materials",
            "/api/chat",
        ],
    }


@app.get("/api/cities")
def get_all_cities():
    """India-level summary: one entry per city, used by the map selector."""
    return load_json("cities.json")


@app.get("/api/cities/{city_id}/zones")
def get_city_zones(city_id: str):
    """All zones for a given city, pre-sorted by priority score descending."""
    validate_city(city_id)
    return load_json(f"zones_{city_id}.json")


@app.get("/api/cities/{city_id}/zones/{zone_id}")
def get_city_zone(city_id: str, zone_id: str):
    """Full detail for one zone within a city."""
    validate_city(city_id)
    zones = load_json(f"zones_{city_id}.json")
    zone = next((z for z in zones if z["zone_id"] == zone_id), None)
    if zone is None:
        raise HTTPException(status_code=404, detail=f"Zone '{zone_id}' not found in '{city_id}'")
    return zone


@app.get("/api/cities/{city_id}/zones/{zone_id}/cooling")
def get_city_zone_cooling(city_id: str, zone_id: str):
    """Cooling potential per intervention type for a specific zone."""
    validate_city(city_id)
    cooling = load_json(f"cooling_{city_id}.json")
    if zone_id not in cooling:
        raise HTTPException(status_code=404, detail=f"No cooling data for zone '{zone_id}' in '{city_id}'")
    return cooling[zone_id]


@app.get("/api/cities/{city_id}/model-meta")
def get_city_model_meta(city_id: str):
    """Regression model metadata for a specific city: coefficients, R², methodology."""
    validate_city(city_id)
    return load_json(f"model_meta_{city_id}.json")


@app.get("/api/materials")
def get_materials():
    """Static materials comparison table — shared across all cities."""
    return load_json("materials.json")


# ── Chat endpoint (Gemini) ──────────────────────────────────────────────────


class ChatRequest(BaseModel):
    message: str
    city_id: str = "delhi-ncr"
    history: list = []


def build_system_prompt(city_id: str) -> str:
    """Construct a rich system prompt with all available data for the city."""
    cities = load_json_safe("cities.json") or []
    city_info = next((c for c in cities if c["city_id"] == city_id), None)
    zones = load_json_safe(f"zones_{city_id}.json") or []
    materials = load_json_safe("materials.json") or []
    model_meta = load_json_safe(f"model_meta_{city_id}.json")
    cooling = load_json_safe(f"cooling_{city_id}.json") or {}

    # Build a compact text summary of the data for the model
    zone_summaries = []
    for z in zones:
        top_cooling = ""
        zone_cool = cooling.get(z["zone_id"], [])
        if zone_cool:
            best = max(zone_cool, key=lambda x: abs(x.get("predicted_cooling_c", 0)))
            top_cooling = f", best cooling: {best.get('material_name','?')} ({best.get('predicted_cooling_c',0):.1f}°C)"
        zone_summaries.append(
            f"  - {z['zone_name']} (ID:{z['zone_id']}): LST {z['lst_celsius']}°C, "
            f"NDVI {z['ndvi']}, NDBI {z['ndbi']}, albedo {z['albedo']}, "
            f"pop {z.get('population','?')}, area {z.get('area_sqkm','?')} km², "
            f"heat_risk {z['heat_risk_index']:.1f}, priority {z['priority_score']:.1f}"
            f"{top_cooling}"
        )

    mat_lines = []
    for m in materials:
        mat_lines.append(
            f"  - {m['name']} (ID:{m['material_id']}): albedo {m['albedo']}, "
            f"temp reduction {m['surface_temp_reduction_c']}°C, "
            f"cost ₹{m['cost_per_sqm_inr']}/m², "
            f"durability {m['durability_years']}yr, category: {m['category']}"
        )

    city_label = city_info["city_name"] if city_info else city_id
    r2 = model_meta["r_squared"] if model_meta else "N/A"

    return f"""You are HEATESCAPE AI, an expert assistant for the HEATESCAPE Urban Heat Island Monitor & Cooling Strategy Optimizer.

You help urban planners, policymakers, and citizens understand heat island data for Indian cities and recommend cooling strategies.

CURRENT CITY: {city_label} (ID: {city_id})
Model R²: {r2}

ZONES ({len(zones)} total):
{chr(10).join(zone_summaries)}

COOLING MATERIALS ({len(materials)} total):
{chr(10).join(mat_lines)}

GUIDELINES:
- Be concise but thorough. Use specific numbers from the data above.
- When recommending materials, cite the predicted cooling in °C and cost.
- Explain heat drivers (NDBI = built-up density, NDVI = vegetation, albedo = surface reflectivity).
- If the user asks about a city you don't have data for, say so clearly.
- Use markdown formatting: **bold** for emphasis, bullet lists for comparisons.
- Keep responses under 300 words unless the user asks for a detailed analysis.
- Be helpful, professional, and data-driven. You are an urban heat expert."""


def generate_local_fallback_reply(message: str, city_id: str) -> str:
    """Generate a highly contextual local fallback reply using loaded city data."""
    message_lower = message.lower().strip()
    
    # Load all the data
    cities = load_json_safe("cities.json") or []
    city_info = next((c for c in cities if c["city_id"] == city_id), None)
    city_label = city_info["city_name"] if city_info else city_id.replace("-", " ").title()
    
    zones = load_json_safe(f"zones_{city_id}.json") or []
    materials = load_json_safe("materials.json") or []
    model_meta = load_json_safe(f"model_meta_{city_id}.json") or {}
    cooling = load_json_safe(f"cooling_{city_id}.json") or {}
    
    # 1. Check for specific zone queries
    matched_zone = None
    for z in zones:
        zone_name = z["zone_name"].lower()
        zone_id = z["zone_id"].lower()
        if zone_name in message_lower or zone_id in message_lower:
            matched_zone = z
            break
            
    if matched_zone:
        z = matched_zone
        zone_cool = cooling.get(z["zone_id"], [])
        cooling_str = ""
        if zone_cool:
            best = max(zone_cool, key=lambda x: abs(x.get("predicted_cooling_c", 0)))
            cooling_str = f"The recommended mitigation strategy is **{best.get('material_name')}** which is simulated to reduce the surface temperature by **{abs(best.get('predicted_cooling_c', 0)):.1f}°C**."
        
        return f"""### Neighborhood Analysis: **{z['zone_name']}** ({city_label})
- **Surface Temperature (LST):** {z['lst_celsius']}°C
- **Vegetation Index (NDVI):** {z['ndvi']:.2f} (Scale: -1 to 1)
- **Built-up Density (NDBI):** {z['ndbi']:.2f} (Scale: -1 to 1)
- **Albedo (Reflectivity):** {z['albedo']:.2f}
- **Heat Risk Index:** {z['heat_risk_index']:.1f}/100
- **Mitigation Priority Score:** {z['priority_score']:.1f}/100

{cooling_str}

*Analysis:* This zone has a high built-up index of **{z['ndbi']:.2f}**, which traps solar radiation. Increasing surface reflectivity (albedo) and green cover is highly recommended.

*(Response generated by HEATESCAPE Local Analytics Engine)*"""

    # 2. Hottest zone query
    if any(k in message_lower for k in ["hottest", "hot zone", "hottest zone", "maximum temp", "highest temp"]):
        if not zones:
            return "No zone data is available for this city."
        hottest = max(zones, key=lambda x: x["lst_celsius"])
        zone_cool = cooling.get(hottest["zone_id"], [])
        cooling_str = ""
        if zone_cool:
            best = max(zone_cool, key=lambda x: abs(x.get("predicted_cooling_c", 0)))
            cooling_str = f"Applying **{best.get('material_name')}** is predicted to cool this zone by **{abs(best.get('predicted_cooling_c', 0)):.1f}°C**."
            
        return f"""The hottest neighborhood in **{city_label}** is **{hottest['zone_name']}** which runs at an extreme surface temperature of **{hottest['lst_celsius']}°C**.

**Zone Profile:**
- **Built-up Density (NDBI):** {hottest['ndbi']:.2f} (Very High)
- **Vegetation Cover (NDVI):** {hottest['ndvi']:.2f} (Low)
- **Priority Score:** {hottest['priority_score']:.1f}/100

{cooling_str} This zone is a critical heat hotspot due to high concrete/pavement concentration and lack of shade trees.

*(Response generated by HEATESCAPE Local Analytics Engine)*"""

    # 3. Best cooling material query
    if any(k in message_lower for k in ["best cooling", "best material", "cooling material", "recommend cooling", "mitigation strategy"]):
        # Find material with highest surface temp reduction or average predicted cooling
        valid_materials = [m for m in materials if m.get("material_id") not in ["baseline_asphalt", "baseline_roof"]]
        if not valid_materials:
            return "No cooling materials comparison data is available."
            
        best_mat = max(valid_materials, key=lambda x: float(x.get("surface_temp_reduction_c", 0)))
        
        reply = f"Based on the microclimate simulations for **{city_label}**, here are the top cooling interventions:\n\n"
        for idx, m in enumerate(sorted(valid_materials, key=lambda x: float(x.get("surface_temp_reduction_c", 0)), reverse=True)[:3]):
            reply += f"{idx+1}. **{m['name']}** ({m['category']})\n"
            reply += f"   - **Surface Temp Reduction:** {m['surface_temp_reduction_c']}°C\n"
            reply += f"   - **Cost:** ₹{m['cost_per_sqm_inr']}/m² | **Durability:** {m['durability_years']} years\n"
            
        reply += f"\n**Recommendation:** *{best_mat['name']}* provides the highest potential cooling, while *Cool Roof Coatings* represent the most cost-effective solution for rapid deployment.\n\n*(Response generated by HEATESCAPE Local Analytics Engine)*"
        return reply

    # 4. Explain heat drivers (regression coefficients)
    if any(k in message_lower for k in ["driver", "explain heat", "why is it hot", "regression", "coefficient", "r2", "r-squared", "formula"]):
        r2 = model_meta.get("r_squared", 0.85)
        coefs = model_meta.get("coefficients", {})
        
        ndvi_coef = coefs.get("NDVI", -7.5)
        ndbi_coef = coefs.get("NDBI", 11.2)
        albedo_coef = coefs.get("Albedo", -4.8)
        
        return f"""Our machine learning model explains the surface temperature dynamics in **{city_label}** with an accuracy (R²) of **{r2:.2f}**.

Here are the key heat drivers and their impact coefficients:
1. **Built-up Density (NDBI) [Impact: {ndbi_coef:+.1f}°C]:** Built-up surfaces absorb and retain heat. A 0.1 increase in density increases surface temp by approx {abs(ndbi_coef)*0.1:.2f}°C.
2. **Vegetation (NDVI) [Impact: {ndvi_coef:.1f}°C]:** Trees and plants cool neighborhoods through evapotranspiration and shading. A 0.1 increase in vegetation lowers surface temp by approx {abs(ndvi_coef)*0.1:.2f}°C.
3. **Reflectivity (Albedo) [Impact: {albedo_coef:.1f}°C]:** Highly reflective materials bounce solar radiation back into space, preventing heat absorption.

**Conclusion:** Urban heat is primarily driven by concrete concentration (NDBI) and lack of trees (NDVI). The most effective policy is a combination of cool roofing and neighborhood greening.

*(Response generated by HEATESCAPE Local Analytics Engine)*"""

    # 5. Compare cool roofs and green roofs
    if any(k in message_lower for k in ["compare", "cool roof vs", "green roof vs", "roof comparison"]):
        cool_roof = next((m for m in materials if "cool roof" in m["name"].lower()), None)
        green_roof = next((m for m in materials if "green roof" in m["name"].lower()), None)
        
        if cool_roof and green_roof:
            return f"""### Comparison: Cool Roofs vs. Green Roofs in **{city_label}**

| Parameter | **{cool_roof['name']}** | **{green_roof['name']}** |
| --- | --- | --- |
| **Cooling Effect** | {cool_roof['surface_temp_reduction_c']}°C | {green_roof['surface_temp_reduction_c']}°C |
| **Installation Cost** | ₹{cool_roof['cost_per_sqm_inr']}/m² | ₹{green_roof['cost_per_sqm_inr']}/m² |
| **Lifespan** | {cool_roof['durability_years']} years | {green_roof['durability_years']} years |
| **Key Benefits** | Extremely cost-effective, easy to apply, high reflectivity | Stormwater absorption, improves air quality, long durability |

**Recommendation:** For quick, budget-friendly heat relief, **{cool_roof['name']}** is superior. For long-term ecological benefits and building insulation, **{green_roof['name']}** is preferred.

*(Response generated by HEATESCAPE Local Analytics Engine)*"""

    # 6. Default / Help Response
    return f"""Hello! I am **HEATESCAPE AI**, your urban heat microclimate assistant for **{city_label}**.

You can ask me questions such as:
- *"Which neighborhood is the hottest?"*
- *"What is the best cooling material to deploy?"*
- *"Explain the main drivers of the heat island effect here"*
- *"Compare cool roofs vs green roofs"*
- Or ask about a specific neighborhood name from the dashboard.

How can I help you optimize cooling strategies today?

*(Response generated by HEATESCAPE Local Analytics Engine)*"""


@app.post("/api/chat")
async def chat(req: ChatRequest):
    """Send a user message to Gemini with city heat data as context, falling back locally on error."""
    # Use fallback if key is missing or is placeholder
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your-key-here":
        reply = generate_local_fallback_reply(req.message, req.city_id)
        return {"reply": reply}

    system_prompt = build_system_prompt(req.city_id)

    # Build conversation history for multi-turn
    contents = []
    for msg in req.history[-10:]:  # Keep last 10 messages for context window
        role = "user" if msg.get("role") == "user" else "model"
        contents.append(genai.types.Content(
            role=role,
            parts=[genai.types.Part(text=msg.get("text", ""))],
        ))
    # Append the current user message
    contents.append(genai.types.Content(
        role="user",
        parts=[genai.types.Part(text=req.message)],
    ))

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )
        reply = response.text or "I couldn't generate a response. Please try again."
    except Exception as e:
        # Log error print for local debug/info
        print(f"Gemini API failed: {e}. Falling back to local analytics engine.")
        # Seamlessly fallback to rule-based response generator
        reply = generate_local_fallback_reply(req.message, req.city_id)
        # Add rate-limit note so it's clear
        reply += "\n\n*(Note: Gemini API rate limited / error occurred. Operating in local analytics fallback mode)*"

    return {"reply": reply}
