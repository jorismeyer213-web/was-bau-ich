#!/usr/bin/env python3
"""Baut aus index.html + assets die Datei artifact.html fuer die Artifact-
Veroeffentlichung: CSS und JS inline, ohne Doctype/<html>/<head>/<body>-Huelle
(das Artifact-Tool legt sie selbst an) und ohne PWA-Teile (Manifest, Icons,
Service Worker laufen im Artifact-Rahmen nicht).

Nach jeder Aenderung an index.html, style.css, data.js oder app.js neu ausfuehren:
    python3 build.py
"""
import pathlib
import re

root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "assets/css/style.css").read_text(encoding="utf-8")
js = "\n".join(
    (root / f"assets/js/{name}").read_text(encoding="utf-8") for name in ["data.js", "app.js"]
)

head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)

# --- Kopf: nur behalten, was im Artifact Sinn ergibt -----------------------
DROP = (
    'name="viewport"',          # liefert das Artifact-Geruest selbst (mit viewport-fit=cover)
    'rel="manifest"',
    'rel="icon"',
    'rel="apple-touch-icon"',
    'name="theme-color"',
    'mobile-web-app-capable',
    'apple-mobile-web-app',
    '<meta charset',            # kommt unten als erste Zeile
)
head_lines = [
    line.strip() for line in head.splitlines()
    if line.strip() and not any(token in line for token in DROP)
]
head_lines = [
    f"<style>\n{css}\n</style>" if 'href="assets/css/style.css"' in line else line
    for line in head_lines
]

# --- Koerper: Skripte inline ------------------------------------------------
body = re.sub(
    r'<script src="assets/js/data\.js"></script>\s*<script src="assets/js/app\.js"></script>',
    lambda _: f"<script>\n{js}\n</script>",
    body,
)

out = '<meta charset="UTF-8">\n' + "\n".join(head_lines) + "\n" + body.strip() + "\n"
(root / "artifact.html").write_text(out, encoding="utf-8")

kb = len(out.encode("utf-8")) / 1024
print(f"artifact.html geschrieben – {kb:.0f} kB")
assert "assets/" not in out, "es sind noch lokale asset-Referenzen enthalten!"
assert "manifest.webmanifest" not in out and 'register("sw.js")' in out  # Registrierung bleibt, greift aber ohne Manifest-Link nicht
assert out.startswith('<meta charset="UTF-8">') and "<title>Was bau ich?</title>" in out[:8192]
assert "<html" not in out and "<body" not in out and "<!DOCTYPE" not in out
print("keine lokalen Pfade, keine Huelle, Titel in den ersten 8 kB")
