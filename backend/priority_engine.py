"""
AI-Based Priority Engine — Python Rule-Based Classification Module

This module mirrors the frontend priority engine (src/services/priorityEngine.js)
to provide server-side priority classification for complaints.

Designed as a standalone, swappable service so the rule-based engine can be
replaced with an AI/LLM model in the future without modifying consuming code.

Usage:
    from priority_engine import calculate_priority
    result = calculate_priority(description, category)
    # result = {"priority": "High", "confidence": 94, "matched_keywords": ["electric wire"], "source": "ai-rule-engine"}
"""

# ─── Priority Keyword Dictionaries ─────────────────────────────────────────────

HIGH_PRIORITY_KEYWORDS = [
    # Electric & fire hazards
    "electric wire", "exposed wire", "live wire", "electrocution", "short circuit",
    "fire hazard", "fire", "burning", "smoke",
    # Water emergencies
    "water pipeline burst", "pipeline burst", "water main break", "sewage leak",
    "sewage overflow", "contaminated water", "water contamination",
    # Flooding
    "flooding", "flood", "waterlogging", "water logging", "submerged",
    # Structural dangers
    "bridge damage", "bridge collapse", "building collapse", "wall collapse",
    "structural damage", "crack in building", "ceiling collapse",
    # Road safety
    "road accident", "accident", "vehicle collision", "fatal",
    # Public safety threats
    "public safety threat", "safety threat", "safety hazard", "danger to life",
    "life threatening", "emergency", "critical",
    # Open hazards
    "open manhole", "manhole", "sinkhole", "cave in",
    "gas leak", "chemical spill", "toxic",
    # Drowning risk
    "drowning", "deep water", "unprotected well",
]

MEDIUM_PRIORITY_KEYWORDS = [
    # Waste & sanitation
    "garbage", "garbage accumulation", "waste dump", "litter", "stench",
    "unhygienic", "mosquito breeding", "overflowing bin",
    # Road issues
    "pothole", "potholes", "road damage", "road crack", "broken road",
    "damaged road", "uneven road", "road repair",
    # Lighting
    "streetlight", "street light", "broken light", "non functional light",
    "dark street", "no light", "lamp post",
    # Traffic
    "traffic signal", "traffic light", "signal malfunction", "broken signal",
    "traffic jam", "traffic congestion",
    # Sanitation facilities
    "public toilet", "toilet maintenance", "broken toilet", "urinal",
    "washroom", "sanitation",
    # Drainage
    "drain blockage", "blocked drain", "clogged drain", "drainage",
    "water stagnation", "standing water",
    # Footpath
    "damaged footpath", "broken footpath", "sidewalk damage", "pavement",
]

LOW_PRIORITY_KEYWORDS = [
    # Park & green spaces
    "park maintenance", "park repair", "park cleaning", "playground",
    "garden maintenance", "gardening",
    # Tree care
    "tree trimming", "tree pruning", "tree cutting", "overgrown tree",
    "fallen leaves", "tree branch",
    # Furniture/amenities
    "bench request", "additional bench", "bench repair", "seating",
    "shade request", "shelter",
    # Beautification
    "beautification", "painting", "whitewash", "mural",
    "landscaping", "flower bed", "plantation",
    # General improvements
    "improvement suggestion", "suggestion", "feedback",
    "general improvement", "enhancement", "upgrade request",
    "signage", "name board", "direction board",
]

# Category-to-priority bias mapping
CATEGORY_PRIORITY_HINTS = {
    "Roads & Highways": "Medium",
    "Water Supply & Sanitation": "Medium",
    "Electricity & Power": "Medium",
    "Waste Management": "Medium",
    "General Public Safety": "Low",
}


def calculate_priority(description="", category=""):
    """
    Calculate the priority of a complaint based on its description and category.

    Args:
        description (str): The complaint description text
        category (str): The complaint category

    Returns:
        dict: {
            "priority": "High" | "Medium" | "Low",
            "confidence": int (0-99),
            "matched_keywords": list[str],
            "source": "ai-rule-engine"
        }
    """
    text = f"{description} {category}".lower().strip()

    if len(text) < 3:
        return {
            "priority": "Medium",
            "confidence": 0,
            "matched_keywords": [],
            "source": "ai-rule-engine",
        }

    # Scan all tiers
    high_matches = [kw for kw in HIGH_PRIORITY_KEYWORDS if kw in text]
    medium_matches = [kw for kw in MEDIUM_PRIORITY_KEYWORDS if kw in text]
    low_matches = [kw for kw in LOW_PRIORITY_KEYWORDS if kw in text]

    # Determine priority by highest tier with matches
    priority = "Medium"  # default — never null
    matched_keywords = []
    confidence = 60  # baseline

    if high_matches:
        priority = "High"
        matched_keywords = high_matches
        confidence = min(99, 80 + len(high_matches) * 5)
    elif medium_matches:
        priority = "Medium"
        matched_keywords = medium_matches
        confidence = min(95, 70 + len(medium_matches) * 5)
    elif low_matches:
        priority = "Low"
        matched_keywords = low_matches
        confidence = min(92, 72 + len(low_matches) * 5)
    else:
        # No keyword matches — use category hint as fallback
        priority = CATEGORY_PRIORITY_HINTS.get(category, "Medium")
        matched_keywords = []
        confidence = 45

    return {
        "priority": priority,
        "confidence": confidence,
        "matched_keywords": matched_keywords,
        "source": "ai-rule-engine",
    }


if __name__ == "__main__":
    # Quick test
    test_cases = [
        ("Electric wire is exposed and sparking near the school", "Electricity & Power"),
        ("Garbage is piling up near the metro station", "Waste Management"),
        ("Need more benches in the park near Block C", "General Public Safety"),
        ("Water pipeline burst flooding the entire street", "Water Supply & Sanitation"),
        ("Broken streetlight near the market area", "Electricity & Power"),
    ]

    for desc, cat in test_cases:
        result = calculate_priority(desc, cat)
        print(f"\n[TEST CASE] '{desc[:50]}...'")
        print(f"   Category: {cat}")
        print(f"   Priority: {result['priority']} ({result['confidence']}% confidence)")
        print(f"   Matched:  {result['matched_keywords']}")
