# Was bau ich?

Ein Knopf, ein Zufalls-Shuffle: Format und Thema für dein nächstes Design-Projekt.

**App öffnen:** https://jorismeyer213-web.github.io/was-bau-ich/

## Aufs Handy holen

- **iPhone:** Link in Safari öffnen → Teilen → „Zum Home-Bildschirm"
- **Android:** Link in Chrome öffnen → Menü → „App installieren"

Danach startet die App wie eine normale App und funktioniert auch offline.

## Inhalte erweitern

Alle Formate, Themen und Twists stehen in [`assets/js/data.js`](assets/js/data.js).
Jedes Format braucht neben dem Namen die Akkusativ-Form für den Satz (`"eine Landingpage"`),
jedes Themen-Beispiel ein eigenes Satzstück (`"für eine Bio-Bäckerei in Leipzig"`).
Anzeige-Namen höchstens 22 Zeichen, damit sie auf dem Handy in eine Zeile passen.

Reine HTML/CSS/JS-Seite ohne Build-Schritt. `build.py` erzeugt nur eine Einzeldatei-Version (`artifact.html`) für Claude-Artifacts.
