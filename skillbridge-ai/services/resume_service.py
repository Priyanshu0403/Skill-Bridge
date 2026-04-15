from __future__ import annotations

import re
from pathlib import Path

from utils.file_parser import extract_text_from_file

COMMON_SKILLS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "node",
    "express",
    "flask",
    "django",
    "sql",
    "mongodb",
    "postgresql",
    "supabase",
    "html",
    "css",
    "tailwind",
    "machine learning",
    "data analysis",
    "pandas",
    "numpy",
    "git",
    "figma",
    "ui design",
    "content writing",
    "communication",
]


def _clean_lines(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.strip()]


def _extract_email(text: str) -> str | None:
    match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    return match.group(0) if match else None


def _extract_phone(text: str) -> str | None:
    match = re.search(r"(\+?\d[\d\s().-]{8,}\d)", text)
    return match.group(0).strip() if match else None


def _extract_name(lines: list[str], email: str | None) -> str | None:
    for line in lines[:6]:
        if email and email.lower() in line.lower():
            continue
        if len(line.split()) in {2, 3, 4} and not any(char.isdigit() for char in line):
            return line.title()
    return None


def _extract_skills(text: str) -> list[str]:
    lowered = text.lower()
    found_skills = []

    for skill in COMMON_SKILLS:
        if skill in lowered:
            found_skills.append(skill.title() if skill != "node.js" else "Node.js")

    unique_skills = []
    seen = set()
    for skill in found_skills:
        key = skill.lower()
        if key not in seen:
            seen.add(key)
            unique_skills.append(skill)
    return unique_skills[:15]


def _extract_education(lines: list[str]) -> list[str]:
    education_keywords = ("b.tech", "btech", "b.e", "bachelor", "master", "college", "university", "school")
    return [line for line in lines if any(keyword in line.lower() for keyword in education_keywords)][:5]


def _extract_summary(lines: list[str]) -> str:
    candidates = [line for line in lines if len(line.split()) >= 8]
    return candidates[0][:280] if candidates else ""


def _infer_year(text: str) -> int | None:
    lowered = text.lower()
    mapping = {
        1: ["1st year", "first year", "year 1"],
        2: ["2nd year", "second year", "year 2"],
        3: ["3rd year", "third year", "year 3"],
        4: ["4th year", "fourth year", "final year", "year 4"],
    }

    for year, markers in mapping.items():
        if any(marker in lowered for marker in markers):
            return year
    return None


def parse_resume_file(file_path: str) -> dict:
    if not isinstance(file_path, str) or not file_path.strip():
        raise ValueError("file_path must be a non-empty string")

    path = Path(file_path).resolve()
    text = extract_text_from_file(str(path))
    if not text.strip():
        raise ValueError("Resume file did not contain readable text")

    lines = _clean_lines(text)
    email = _extract_email(text)
    phone = _extract_phone(text)
    name = _extract_name(lines, email)
    skills = _extract_skills(text)
    education = _extract_education(lines)
    summary = _extract_summary(lines)
    suggested_year = _infer_year(text)

    suggested_bio_parts = []
    if summary:
        suggested_bio_parts.append(summary)
    if skills:
        suggested_bio_parts.append(f"Key strengths include {', '.join(skills[:6])}.")

    return {
        "file_name": path.name,
        "file_path": str(path),
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "education": education,
        "summary": summary,
        "suggested_bio": " ".join(suggested_bio_parts).strip(),
        "suggested_year": suggested_year,
        "raw_text_preview": text[:1200],
    }
