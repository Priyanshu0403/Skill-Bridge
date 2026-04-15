from __future__ import annotations

from collections.abc import Iterable

from data.chatbot_knowledge import PLATFORM_KNOWLEDGE, SUGGESTED_PROMPTS


def _normalize_list(value: object) -> list[str]:
    if not isinstance(value, Iterable) or isinstance(value, (str, bytes, dict)):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


def _score_topic(message: str, keywords: list[str]) -> int:
    lowered = message.lower()
    return sum(1 for keyword in keywords if keyword in lowered)


def _profile_context(profile: dict) -> str:
    if not isinstance(profile, dict):
        return ""

    skills = _normalize_list(profile.get("skills"))
    full_name = str(profile.get("full_name", "")).strip()
    year = profile.get("year")

    parts: list[str] = []

    if full_name:
        parts.append(f"I can tailor suggestions for {full_name}.")
    if skills:
        top_skills = ", ".join(skills[:5])
        parts.append(f"Your current profile highlights skills like {top_skills}.")
    if year:
        parts.append(f"Your academic year is currently set to {year}.")

    return " ".join(parts)


def generate_chat_response(message: str, profile: dict | None = None, history: list | None = None) -> dict:
    if not isinstance(message, str) or not message.strip():
        raise ValueError("message must be a non-empty string")

    profile = profile or {}
    history = history or []
    cleaned_message = message.strip()

    ranked_topics = sorted(
        PLATFORM_KNOWLEDGE,
        key=lambda item: _score_topic(cleaned_message, item["keywords"]),
        reverse=True,
    )

    top_topic = ranked_topics[0]
    top_score = _score_topic(cleaned_message, top_topic["keywords"])

    if top_score == 0:
        base_response = (
            "I can help with SkillBridge questions about profiles, gigs, recommendations, payments, and resume uploads. "
            "If you want, ask me something specific about using the platform or improving your profile."
        )
    else:
        base_response = top_topic["response"]

    recent_turns = len(history) if isinstance(history, list) else 0
    context = _profile_context(profile)

    response_parts = [base_response]
    if context:
        response_parts.append(context)
    if recent_turns > 0:
        response_parts.append(f"I also kept the last {min(recent_turns, 5)} message(s) in mind for continuity.")

    suggestions = list(SUGGESTED_PROMPTS)
    if _normalize_list(profile.get("skills")):
        suggestions.insert(0, "Which gigs fit my current skills best?")

    return {
        "reply": " ".join(response_parts).strip(),
        "suggestions": suggestions[:3],
        "topic": top_topic["topic"] if top_score > 0 else "general",
    }
