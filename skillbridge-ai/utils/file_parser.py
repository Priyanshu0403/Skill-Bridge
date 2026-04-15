from __future__ import annotations

from pathlib import Path


def extract_text_from_file(file_path: str) -> str:
    path = Path(file_path)
    if not path.exists():
        raise ValueError("Resume file was not found")

    suffix = path.suffix.lower()

    if suffix in {".txt", ".md"}:
        return path.read_text(encoding="utf-8", errors="ignore")

    if suffix == ".pdf":
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise ValueError("PDF parsing requires the pypdf package") from exc

        reader = PdfReader(str(path))
        return "\n".join((page.extract_text() or "") for page in reader.pages)

    if suffix == ".docx":
        try:
            from docx import Document
        except ImportError as exc:
            raise ValueError("DOCX parsing requires the python-docx package") from exc

        document = Document(str(path))
        return "\n".join(paragraph.text for paragraph in document.paragraphs)

    raise ValueError("Unsupported resume format. Use PDF, DOCX, TXT, or MD")
