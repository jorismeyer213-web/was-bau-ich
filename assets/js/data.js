/* Was bau ich? – alle Begriffs-Pools.
   Jedes Satzstück ist von Hand geschrieben, damit Artikel und Fälle stimmen.
   Satzbau in app.js:  Bau <format.akk> <beispiel.satz>[ – <twist.satz>].  */
(function () {
  "use strict";

  // Format: [Anzeige, Akkusativ für den Satz]
  const f = (name, akk) => ({ name, akk });
  // Bereich: Name + Beispiele als [Anzeige, Satzstück, schräg?]
  const b = (name, beispiele) => ({
    name,
    beispiele: beispiele.map(([text, satz, schraeg]) => ({ text, satz, schraeg: !!schraeg }))
  });
  // Twist: [Anzeige, Satzstück]
  const t = (name, satz) => ({ name, satz });

  window.WBI_DATA = {
    formate: {
      digital: {
        name: "Digital",
        items: [
          f("Webseite", "eine Webseite"),
          f("Landingpage", "eine Landingpage"),
          f("Handy-App", "eine Handy-App"),
          f("Web-App", "eine Web-App"),
          f("Online-Shop", "einen Online-Shop"),
          f("Dashboard", "ein Dashboard"),
          f("Newsletter", "einen Newsletter"),
          f("Buchungsstrecke", "eine Buchungsstrecke"),
          f("Microsite", "eine Microsite"),
          f("404-Seite", "eine 404-Seite"),
          f("Onboarding", "ein Onboarding"),
          f("Anmeldeformular", "ein Anmeldeformular"),
          f("Blog", "einen Blog"),
          f("Smartwatch-App", "eine Smartwatch-App"),
          f("Chatbot-Oberfläche", "eine Chatbot-Oberfläche"),
          f("Preisrechner", "einen Preisrechner"),
          f("Countdown-Seite", "eine Countdown-Seite"),
          f("Mitgliederbereich", "einen Mitgliederbereich"),
          f("Interaktive Karte", "eine interaktive Karte"),
          f("Konfigurator", "einen Konfigurator"),
          f("Online-Quiz", "ein Online-Quiz"),
          f("Instagram-Karussell", "ein Instagram-Karussell"),
          f("Interaktive Infografik", "eine interaktive Infografik"),
          f("Karriereseite", "eine Karriereseite")
        ]
      },
      bewegtbild: {
        name: "Bewegtbild",
        items: [
          f("Erklärvideo", "ein Erklärvideo"),
          f("Imagefilm", "einen Imagefilm"),
          f("Reel", "ein Reel"),
          f("YouTube-Intro", "ein YouTube-Intro"),
          f("Logo-Animation", "eine Logo-Animation"),
          f("Ladeanimation", "eine Ladeanimation"),
          f("Produktvideo", "ein Produktvideo"),
          f("Animierte Infografik", "eine animierte Infografik"),
          f("Scroll-Animation", "eine Scroll-Animation"),
          f("Micro-Interaction", "eine Micro-Interaction"),
          f("Stop-Motion-Clip", "einen Stop-Motion-Clip"),
          f("Kinetische Typo", "ein Video mit kinetischer Typo"),
          f("Story-Serie", "eine Story-Serie"),
          f("15-Sekunden-Spot", "einen 15-Sekunden-Spot"),
          f("Animiertes Maskottchen", "ein animiertes Maskottchen"),
          f("Tutorial-Video", "ein Tutorial-Video")
        ]
      }
    },

    themen: {
      branchen: {
        name: "Branchen",
        bereiche: [
          b("Bäckerei", [
            ["Bio-Bäckerei mit Sauerteig-Kursen in Leipzig", "für eine Bio-Bäckerei mit Sauerteig-Kursen in Leipzig"],
            ["Familienbäckerei in vierter Generation im Allgäu", "für eine Familienbäckerei in vierter Generation im Allgäu"],
            ["Bäckerei, die nur nachts öffnet", "für eine Bäckerei, die nur nachts öffnet", true]
          ]),
          b("Dachdecker", [
            ["Familienbetrieb an der Nordsee", "für einen Dachdecker-Familienbetrieb an der Nordsee"],
            ["Gründach-Spezialist in Hamburg", "für einen Gründach-Spezialisten in Hamburg"],
            ["Dachdeckerei, die per TikTok Azubis sucht", "für eine Dachdeckerei, die per TikTok Azubis sucht"]
          ]),
          b("Zahnarztpraxis", [
            ["Kinderzahnarztpraxis in Köln", "für eine Kinderzahnarztpraxis in Köln"],
            ["Praxis für Angstpatienten", "für eine Zahnarztpraxis, die sich auf Angstpatienten spezialisiert hat"],
            ["Praxis mit Sprechstunde bis 22 Uhr", "für eine Zahnarztpraxis mit Sprechstunde bis 22 Uhr"]
          ]),
          b("Fahrradladen", [
            ["Lastenrad-Verleih in Münster", "für einen Lastenrad-Verleih in Münster"],
            ["Rennradwerkstatt mit Espressobar", "für eine Rennradwerkstatt mit Espressobar"],
            ["Laden nur für gebrauchte Räder", "für einen Fahrradladen, der nur gebrauchte Räder verkauft"]
          ]),
          b("Steuerberatung", [
            ["Kanzlei für Kreative und Freelancer", "für eine Steuerkanzlei, die Kreative und Freelancer berät"],
            ["Steuerberatung komplett online", "für eine Steuerberatung, die komplett online arbeitet"],
            ["Steuerbüro, das alles mit Comics erklärt", "für ein Steuerbüro, das alles mit Comics erklärt", true]
          ]),
          b("Tattoo-Studio", [
            ["Fineline-Studio in Berlin-Neukölln", "für ein Fineline-Tattoostudio in Berlin-Neukölln"],
            ["Studio mit Walk-in-Freitag", "für ein Tattoostudio mit Walk-in-Freitag"],
            ["Cover-up-Spezialist für Jugendsünden", "für ein Tattoostudio, das alte Jugendsünden übertätowiert"]
          ]),
          b("Friseursalon", [
            ["Barbershop im Industrie-Look", "für einen Barbershop im Industrie-Look"],
            ["Mobiler Salon in einem umgebauten Bus", "für einen mobilen Friseursalon in einem umgebauten Bus"],
            ["Salon nur für Locken", "für einen Friseursalon nur für Locken"]
          ]),
          b("Blumenladen", [
            ["Blumenladen mit Lastenrad-Lieferdienst", "für einen Blumenladen mit Lastenrad-Lieferdienst"],
            ["Hochzeitsfloristin auf dem Land", "für eine Hochzeitsfloristin auf dem Land"],
            ["Trockenblumen-Atelier", "für ein Trockenblumen-Atelier"]
          ]),
          b("Autowerkstatt", [
            ["Oldtimer-Restaurierung", "für eine Werkstatt, die Oldtimer restauriert"],
            ["Werkstatt nur für E-Autos", "für eine Werkstatt nur für E-Autos"],
            ["Freie Werkstatt mit Festpreisen", "für eine freie Werkstatt mit Festpreisen"]
          ]),
          b("Tierarztpraxis", [
            ["Praxis für Reptilien und Exoten", "für eine Tierarztpraxis, die Reptilien und Exoten behandelt"],
            ["Kleintierpraxis mit Nachtdienst", "für eine Kleintierpraxis mit Nachtdienst"],
            ["Mobile Tierärztin für Bauernhöfe", "für eine mobile Tierärztin, die Bauernhöfe besucht"]
          ]),
          b("Café", [
            ["Katzencafé in Dresden", "für ein Katzencafé in Dresden"],
            ["Rösterei-Café mit Specialty Coffee", "für ein Rösterei-Café mit Specialty Coffee"],
            ["Café, in dem nur geflüstert wird", "für ein Café, in dem nur geflüstert wird", true]
          ]),
          b("Fitnessstudio", [
            ["Boxgym im Hinterhof", "für ein Boxgym im Hinterhof"],
            ["Studio nur für Menschen über 60", "für ein Fitnessstudio nur für Menschen über 60"],
            ["Rund-um-die-Uhr-Studio ohne Personal", "für ein Rund-um-die-Uhr-Studio ohne Personal"]
          ]),
          b("Physiotherapie", [
            ["Praxis für Läuferinnen und Läufer", "für eine Physiopraxis, die auf Laufsport spezialisiert ist"],
            ["Physiotherapeutin mit Hausbesuchen", "für eine Physiotherapeutin, die Hausbesuche macht"],
            ["Praxis für Büro-Rücken", "für eine Physiopraxis, die sich um Büro-Rücken kümmert"]
          ]),
          b("Weingut", [
            ["Junges Weingut an der Mosel", "für ein junges Weingut an der Mosel"],
            ["Bio-Winzerin mit Hofladen", "für eine Bio-Winzerin mit Hofladen"],
            ["Weingut mit Übernachtung im Weinfass", "für ein Weingut, in dem man im Weinfass übernachtet", true]
          ]),
          b("Bestattungen", [
            ["Bestattungshaus mit freien Trauerfeiern", "für ein Bestattungshaus mit freien Trauerfeiern"],
            ["Waldbestattungen im Naturpark", "für einen Anbieter von Waldbestattungen im Naturpark"],
            ["Tierbestattung", "für eine Tierbestattung"]
          ]),
          b("Kita", [
            ["Waldkita im Odenwald", "für eine Waldkita im Odenwald"],
            ["Zweisprachige Kita in Frankfurt", "für eine zweisprachige Kita in Frankfurt"],
            ["Betriebskita einer Werft", "für die Betriebskita einer Werft"]
          ]),
          b("Brauerei", [
            ["Craft-Brauerei in einem alten Bahnhof", "für eine Craft-Brauerei in einem alten Bahnhof"],
            ["Klosterbrauerei mit 400 Jahren Geschichte", "für eine Klosterbrauerei mit 400 Jahren Geschichte"],
            ["Brauerei nur für alkoholfreies Bier", "für eine Brauerei, die nur alkoholfreies Bier braut"]
          ]),
          b("Umzugsfirma", [
            ["Umzugshilfe für WGs", "für eine Umzugshilfe, die auf WGs spezialisiert ist"],
            ["Seniorenumzüge mit Einräumservice", "für eine Firma, die Seniorenumzüge mit Einräumservice anbietet"],
            ["Umzugsfirma, die nur mit Lastenrädern fährt", "für eine Umzugsfirma, die nur mit Lastenrädern fährt", true]
          ]),
          b("Optiker", [
            ["Brillenmanufaktur mit Holzfassungen", "für eine Brillenmanufaktur mit Holzfassungen"],
            ["Optiker mit Sehtest-Bus", "für einen Optiker mit Sehtest-Bus"],
            ["Sonnenbrillen für Hunde", "für ein Label, das Sonnenbrillen für Hunde verkauft", true]
          ]),
          b("Coworking", [
            ["Coworking auf dem Bauernhof", "für einen Coworking-Space auf einem Bauernhof"],
            ["Coworking mit Kinderbetreuung", "für einen Coworking-Space mit Kinderbetreuung"],
            ["Coworking in einem alten Hallenbad", "für einen Coworking-Space in einem alten Hallenbad"]
          ])
        ]
      },

      alltag: {
        name: "Alltagssituationen",
        bereiche: [
          b("Parkplatzsuche", [
            ["Samstagmittag in der Altstadt", "über die Parkplatzsuche am Samstagmittag in der Altstadt"],
            ["Das Parkhaus ist schon wieder voll", "über ein Parkhaus, das schon wieder voll ist"],
            ["Anwohnerparkausweis beantragen", "darüber, wie man einen Anwohnerparkausweis beantragt"]
          ]),
          b("WG-Putzplan", [
            ["Fünfer-WG mit einem Bad", "über eine Fünfer-WG mit nur einem Bad"],
            ["Streit um den Abwasch", "über den ewigen Streit um den Abwasch"],
            ["Ein Putzplan, an den sich alle halten", "über einen WG-Putzplan, an den sich wirklich alle halten"]
          ]),
          b("Wocheneinkauf", [
            ["Einkauf für eine fünfköpfige Familie", "über den Wocheneinkauf einer fünfköpfigen Familie"],
            ["Einkaufen ohne Plastik", "über das Einkaufen ohne Plastik"],
            ["Mit 30 Euro durch die Woche", "darüber, wie man mit 30 Euro durch die Woche kommt"]
          ]),
          b("Schlüssel verloren", [
            ["Ausgesperrt am Sonntagabend", "darüber, was man tut, wenn man sich am Sonntagabend aussperrt"],
            ["Schlüssel im Freibad verloren", "über einen Schlüssel, der im Freibad verloren ging"],
            ["Ersatzschlüssel beim Nachbarn", "über den Ersatzschlüssel beim Nachbarn"]
          ]),
          b("Montagmorgen", [
            ["Der Wecker klingelt zum dritten Mal", "über einen Montagmorgen, an dem der Wecker zum dritten Mal klingelt"],
            ["Erster Tag im neuen Job", "über den ersten Tag im neuen Job"],
            ["Montagmorgen im Homeoffice", "über den Montagmorgen im Homeoffice"]
          ]),
          b("Umziehen", [
            ["Die erste eigene Wohnung", "über den Umzug in die erste eigene Wohnung"],
            ["Neu in einer fremden Stadt", "darüber, wie man in einer fremden Stadt ankommt"],
            ["Kartons packen in letzter Minute", "über das Kartonpacken in letzter Minute"]
          ]),
          b("Arzttermin", [
            ["Einen Facharzttermin bekommen", "darüber, wie man einen Facharzttermin bekommt"],
            ["Wartezimmer mit Kleinkind", "über das Warten im Wartezimmer mit Kleinkind"],
            ["An die Vorsorge denken", "darüber, wie man an die Vorsorge denkt"]
          ]),
          b("Pendeln", [
            ["Zugausfall auf dem Weg zur Arbeit", "über einen Zugausfall auf dem Weg zur Arbeit"],
            ["Eine Fahrgemeinschaft finden", "darüber, wie man eine Fahrgemeinschaft findet"],
            ["Mit dem Rad durch den Regen", "über das Pendeln mit dem Rad durch den Regen"]
          ]),
          b("Kochen", [
            ["Kochen mit Resten aus dem Kühlschrank", "über das Kochen mit Resten aus dem Kühlschrank"],
            ["Das erste Essen für die Schwiegereltern", "über das erste Essen für die Schwiegereltern"],
            ["Meal-Prep für die ganze Woche", "über Meal-Prep für die ganze Woche"]
          ]),
          b("Wäsche", [
            ["Die Suche nach dem zweiten Socken", "über die Suche nach dem zweiten Socken", true],
            ["Wäsche richtig sortieren", "darüber, wie man Wäsche richtig sortiert"],
            ["Waschkeller im Mehrfamilienhaus", "über den Waschkeller im Mehrfamilienhaus"]
          ]),
          b("Geburtstag", [
            ["Geschenk in letzter Minute", "über das Geburtstagsgeschenk in letzter Minute"],
            ["Überraschungsparty planen", "darüber, wie man eine Überraschungsparty plant"],
            ["Kuchen fürs Büro", "über den Geburtstagskuchen fürs Büro"]
          ]),
          b("Schlafen", [
            ["Einschlafen trotz lauter Nachbarn", "über das Einschlafen trotz lauter Nachbarn"],
            ["Powernap in der Mittagspause", "über den Powernap in der Mittagspause"],
            ["Abends ohne Handy ins Bett", "darüber, wie man abends ohne Handy ins Bett geht"]
          ]),
          b("Haustier", [
            ["Hund allein zu Haus", "über einen Hund, der allein zu Hause bleibt"],
            ["Die Katze muss zum Tierarzt", "über den Moment, in dem die Katze zum Tierarzt muss"],
            ["Die Katze liegt auf der Tastatur", "über eine Katze, die auf der Tastatur liegt", true]
          ]),
          b("Behördengang", [
            ["Personalausweis verlängern", "darüber, wie man den Personalausweis verlängert"],
            ["Wohnsitz ummelden", "darüber, wie man den Wohnsitz ummeldet"],
            ["Ein Formular, das niemand versteht", "über ein Formular, das niemand versteht"]
          ]),
          b("Nachbarschaft", [
            ["Paket beim Nachbarn abholen", "über das Paket, das man beim Nachbarn abholen muss"],
            ["Ein Hoffest organisieren", "darüber, wie man ein Hoffest organisiert"],
            ["Die Bohrmaschine am Sonntag", "über die Bohrmaschine des Nachbarn am Sonntag"]
          ]),
          b("Sport anfangen", [
            ["Die ersten 5 Kilometer laufen", "über die ersten 5 Kilometer beim Laufen"],
            ["Neujahrsvorsatz Fitnessstudio", "über den Neujahrsvorsatz, endlich ins Fitnessstudio zu gehen"],
            ["Sport trotz Rückenschmerzen", "über Sport trotz Rückenschmerzen"]
          ]),
          b("Putzen", [
            ["Frühjahrsputz", "über den großen Frühjahrsputz"],
            ["Backofen reinigen", "darüber, wie man den Backofen reinigt"],
            ["Besuch kommt in 20 Minuten", "über das Aufräumen, wenn der Besuch in 20 Minuten kommt"]
          ]),
          b("Familienalltag", [
            ["Zum ersten Mal allein zur Schule", "über den ersten Schulweg ganz allein"],
            ["Hausaufgaben-Stress", "über Hausaufgaben-Stress am Küchentisch"],
            ["Kindergeburtstag zu Hause", "über einen Kindergeburtstag zu Hause"]
          ]),
          b("Geld", [
            ["Haushaltsbuch führen", "darüber, wie man ein Haushaltsbuch führt"],
            ["Sparen für den ersten Urlaub", "über das Sparen für den ersten eigenen Urlaub"],
            ["Vergessene Abos kündigen", "darüber, wie man vergessene Abos kündigt"]
          ]),
          b("Warten", [
            ["Schlange an der Supermarktkasse", "über die Schlange an der Supermarktkasse"],
            ["Warten aufs Paket", "über das Warten aufs Paket"],
            ["Warteschleife an der Hotline", "über die Warteschleife an der Hotline"]
          ])
        ]
      },

      freizeit: {
        name: "Freizeit & Reisen",
        bereiche: [
          b("Ferienunterkünfte", [
            ["Baumhaus-Hotel im Schwarzwald", "für ein Baumhaus-Hotel im Schwarzwald"],
            ["Ferienwohnung an der Nordsee", "für eine Ferienwohnung an der Nordsee"],
            ["Übernachten im Leuchtturm", "für einen Leuchtturm, in dem man übernachten kann", true]
          ]),
          b("Festivals", [
            ["Indie-Festival auf einer Pferdekoppel", "für ein Indie-Festival auf einer Pferdekoppel"],
            ["Jazzfestival in der Altstadt", "für ein Jazzfestival in der Altstadt"],
            ["Festival nur für Hörspiele", "für ein Festival nur für Hörspiele", true]
          ]),
          b("Sportvereine", [
            ["Fußballverein der Kreisliga", "für einen Fußballverein aus der Kreisliga"],
            ["Ruderclub am See", "für einen Ruderclub am See"],
            ["Quidditch-Verein", "für einen Quidditch-Verein", true]
          ]),
          b("Wandern", [
            ["Fernwanderweg durch den Harz", "für einen Fernwanderweg durch den Harz"],
            ["Feierabend-Wandergruppe", "für eine Feierabend-Wandergruppe"],
            ["Nachtwanderung mit Sternenführung", "für eine Nachtwanderung mit Sternenführung"]
          ]),
          b("Escape Rooms", [
            ["Escape Room in einem alten Bunker", "für einen Escape Room in einem alten Bunker"],
            ["Outdoor-Escape-Game durch die Stadt", "für ein Outdoor-Escape-Game quer durch die Stadt"],
            ["Escape Room für Firmenteams", "für einen Escape Room, der Firmenteams zusammenschweißt"]
          ]),
          b("Camping", [
            ["Glamping am See", "für einen Glamping-Platz am See"],
            ["Zeltplatz ohne Wohnmobile", "für einen Zeltplatz ohne Wohnmobile"],
            ["Stellplatz auf einem Bauernhof", "für einen Wohnmobil-Stellplatz auf einem Bauernhof"]
          ]),
          b("Museen", [
            ["Kleines Heimatmuseum", "für ein kleines Heimatmuseum"],
            ["Museum für Computerspiele", "für ein Museum für Computerspiele"],
            ["Museum der gescheiterten Erfindungen", "für ein Museum der gescheiterten Erfindungen", true]
          ]),
          b("Kino", [
            ["Programmkino mit Sofas", "für ein Programmkino mit Sofas statt Sitzreihen"],
            ["Autokino", "für ein Autokino"],
            ["Kino, das nur Kurzfilme zeigt", "für ein Kino, das nur Kurzfilme zeigt", true]
          ]),
          b("Freibad", [
            ["Freibad mit Zehnmeterturm", "für ein Freibad mit Zehnmeterturm"],
            ["Naturbad im Moor", "für ein Naturbad im Moor"],
            ["Hundeschwimmtag zum Saisonende", "für den Hundeschwimmtag zum Saisonende", true]
          ]),
          b("Klettern", [
            ["Boulderhalle in einer alten Fabrik", "für eine Boulderhalle in einer alten Fabrik"],
            ["Hochseilgarten im Wald", "für einen Hochseilgarten im Wald"],
            ["Kletterkurs für Kinder", "für einen Kletterkurs für Kinder"]
          ]),
          b("Städtereisen", [
            ["Wochenende in Hamburg", "für ein Wochenende in Hamburg"],
            ["Barrierefreier Stadtführer", "für einen barrierefreien Stadtführer"],
            ["Kneipentour durch Köln", "für eine Kneipentour durch Köln"]
          ]),
          b("Radtouren", [
            ["Elberadweg", "für den Elberadweg"],
            ["E-Bike-Touren in den Alpen", "für E-Bike-Touren in den Alpen"],
            ["Gravel-Tour mit Zelt", "für eine Gravel-Tour mit Zelt"]
          ]),
          b("Konzerte", [
            ["Wohnzimmerkonzert", "für ein Wohnzimmerkonzert"],
            ["Orgelnacht in einer Kirche", "für eine Orgelnacht in einer Kirche"],
            ["Blasorchester spielt Popsongs", "für ein Blasorchester, das Popsongs spielt"]
          ]),
          b("Brettspiele", [
            ["Brettspielcafé", "für ein Brettspielcafé"],
            ["Spieleabend-Verein", "für einen Verein für Spieleabende"],
            ["Kleiner Verlag für Familienspiele", "für einen kleinen Verlag für Familienspiele"]
          ]),
          b("Wassersport", [
            ["SUP-Verleih am Baggersee", "für einen SUP-Verleih am Baggersee"],
            ["Segelschule an der Ostsee", "für eine Segelschule an der Ostsee"],
            ["Surfcamp in Portugal", "für ein Surfcamp in Portugal"]
          ]),
          b("Wintersport", [
            ["Kleines Skigebiet im Sauerland", "für ein kleines Skigebiet im Sauerland"],
            ["Langlaufschule", "für eine Langlaufschule"],
            ["Rodelbahn mit Flutlicht", "für eine Rodelbahn mit Flutlicht"]
          ]),
          b("Theater", [
            ["Freies Theater in einer Lagerhalle", "für ein freies Theater in einer Lagerhalle"],
            ["Puppentheater", "für ein Puppentheater"],
            ["Improtheater mit Publikumswünschen", "für ein Improtheater, das Publikumswünsche spielt"]
          ]),
          b("Tierparks", [
            ["Wildpark mit Wolfsgehege", "für einen Wildpark mit Wolfsgehege"],
            ["Streichelzoo", "für einen Streichelzoo"],
            ["Vogelpark mit Nachtführung", "für einen Vogelpark mit Nachtführung"]
          ]),
          b("Kochkurse", [
            ["Pasta-Kurs in der Toskana", "für einen Pasta-Kurs in der Toskana"],
            ["Vegane Kochschule", "für eine vegane Kochschule"],
            ["Kochkurs nur mit Zutaten vom Späti", "für einen Kochkurs nur mit Zutaten vom Späti", true]
          ]),
          b("Mitmach-Werkstätten", [
            ["Töpferkurs am Wochenende", "für einen Töpferkurs am Wochenende"],
            ["Repair-Café", "für ein Repair-Café"],
            ["Siebdruck-Werkstatt", "für eine Siebdruck-Werkstatt zum Mitmachen"]
          ])
        ]
      },

      // Menschentypen: abwechselnd männlich/weiblich, bewusst gegen die üblichen Klischees verteilt
      typen: {
        name: "Menschentypen",
        bereiche: [
          b("Chaotin", [
            ["Chaotin, die jeden Morgen ihren Schlüssel sucht", "für eine Chaotin, die jeden Morgen ihren Schlüssel sucht"],
            ["Chaotin, die drei Kalender gleichzeitig führt", "für eine Chaotin, die drei Kalender gleichzeitig führt"],
            ["Chaotin, die ihre Belege im Schuhkarton sammelt", "für eine Chaotin, die ihre Belege im Schuhkarton sammelt"]
          ]),
          b("Perfektionist", [
            ["Perfektionist, der jede Mail fünfmal liest", "für einen Perfektionisten, der jede Mail fünfmal liest"],
            ["Perfektionist, der seine Gewürze alphabetisch sortiert", "für einen Perfektionisten, der seine Gewürze alphabetisch sortiert"],
            ["Perfektionist, der etwas halb fertig abgeben muss", "für einen Perfektionisten, der etwas halb fertig abgeben muss"]
          ]),
          b("Morgenmuffel", [
            ["Morgenmuffel, der vor dem ersten Kaffee nicht spricht", "für einen Morgenmuffel, der vor dem ersten Kaffee nicht spricht"],
            ["Morgenmuffel, der plötzlich Frühschicht hat", "für einen Morgenmuffel, der plötzlich Frühschicht hat"],
            ["Morgenmuffel, dessen Wecker fünfmal klingelt", "für einen Morgenmuffel, dessen Wecker fünfmal klingelt"]
          ]),
          b("Besserwisser", [
            ["Besserwisser, der dem Navi widerspricht", "für einen Besserwisser, der dem Navi widerspricht"],
            ["Besserwisser, der im Familien-Chat Fakten checkt", "für einen Besserwisser, der im Familien-Chat Fakten checkt"],
            ["Besserwisser, der beim Kneipenquiz verliert", "für einen Besserwisser, der beim Kneipenquiz verliert"]
          ]),
          b("Sparfüchsin", [
            ["Sparfüchsin, die jeden Gutschein sammelt", "für eine Sparfüchsin, die jeden Gutschein sammelt"],
            ["Sparfüchsin, die den Urlaub in Excel plant", "für eine Sparfüchsin, die den Urlaub in Excel plant"],
            ["Sparfüchsin, die sich endlich etwas gönnen will", "für eine Sparfüchsin, die sich endlich etwas gönnen will"]
          ]),
          b("Zuspätkommer", [
            ["Zuspätkommer, der einen Flug erwischen muss", "für einen Zuspätkommer, der einen Flug erwischen muss"],
            ["Zuspätkommer, der immer noch fünf Minuten braucht", "für einen Zuspätkommer, der immer noch fünf Minuten braucht"],
            ["Zuspätkommer, der zur eigenen Hochzeit muss", "für einen Zuspätkommer, der zur eigenen Hochzeit muss"]
          ]),
          b("Nörglerin", [
            ["Nörglerin, die jedes Restaurant schlecht bewertet", "für eine Nörglerin, die jedes Restaurant schlecht bewertet"],
            ["Nörglerin, die sich über jedes Wetter beschwert", "für eine Nörglerin, die sich über jedes Wetter beschwert"],
            ["Nörglerin, die ausnahmsweise etwas loben soll", "für eine Nörglerin, die ausnahmsweise etwas loben soll"]
          ]),
          b("Jammerlappen", [
            ["Jammerlappen, dessen Akku bei 20 Prozent ist", "für einen Jammerlappen, dessen Akku bei 20 Prozent ist"],
            ["Jammerlappen, der beim Umzug helfen soll", "für einen Jammerlappen, der beim Umzug helfen soll"],
            ["Jammerlappen, der seinen ersten Halbmarathon läuft", "für einen Jammerlappen, der seinen ersten Halbmarathon läuft"]
          ]),
          b("Angeberin", [
            ["Angeberin, die ihr neues Auto vorführt", "für eine Angeberin, die ihr neues Auto vorführt"],
            ["Angeberin, die jede Reise in der Story postet", "für eine Angeberin, die jede Reise in der Story postet"],
            ["Angeberin, die beim Grillen alles besser kann", "für eine Angeberin, die beim Grillen alles besser kann"]
          ]),
          b("Stubenhocker", [
            ["Stubenhocker, der zum ersten Mal zeltet", "für einen Stubenhocker, der zum ersten Mal zeltet"],
            ["Stubenhocker, der sich alles liefern lässt", "für einen Stubenhocker, der sich alles liefern lässt"],
            ["Stubenhocker, der ein Wochenende ohne WLAN übersteht", "für einen Stubenhocker, der ein Wochenende ohne WLAN übersteht"]
          ]),
          b("Dränglerin", [
            ["Dränglerin, die an der Kasse schiebt", "für eine Dränglerin, die an der Kasse schiebt"],
            ["Dränglerin, die auf der Autobahn Lichthupe gibt", "für eine Dränglerin, die auf der Autobahn Lichthupe gibt"],
            ["Dränglerin, die im Freizeitpark anstehen muss", "für eine Dränglerin, die im Freizeitpark anstehen muss"]
          ]),
          b("Helikopter-Vater", [
            ["Helikopter-Vater, der den Schulweg per GPS verfolgt", "für einen Helikopter-Vater, der den Schulweg per GPS verfolgt"],
            ["Helikopter-Vater, dessen Kind auf Klassenfahrt fährt", "für einen Helikopter-Vater, dessen Kind auf Klassenfahrt fährt"],
            ["Helikopter-Vater, der loslassen lernen will", "für einen Helikopter-Vater, der loslassen lernen will"]
          ]),
          b("Cholerikerin", [
            ["Cholerikerin, die beim Brettspiel verliert", "für eine Cholerikerin, die beim Brettspiel verliert"],
            ["Cholerikerin, deren Drucker streikt", "für eine Cholerikerin, deren Drucker streikt"],
            ["Cholerikerin, die einen Yoga-Kurs ausprobiert", "für eine Cholerikerin, die einen Yoga-Kurs ausprobiert"]
          ]),
          b("Plaudertasche", [
            ["Plaudertasche, die jedes Gerücht im Haus kennt", "für eine Plaudertasche, die jedes Gerücht im Haus kennt"],
            ["Plaudertasche, die ein Geheimnis bewahren soll", "für eine Plaudertasche, die ein Geheimnis bewahren soll"],
            ["Plaudertasche, die Sprachnachrichten in Hörbuchlänge schickt", "für eine Plaudertasche, die Sprachnachrichten in Hörbuchlänge schickt", true]
          ]),
          b("Technik-Nerd", [
            ["Technik-Nerd, der sein Zuhause komplett smart macht", "für einen Technik-Nerd, der sein Zuhause komplett smart macht"],
            ["Technik-Nerd, der den Eltern das Handy einrichtet", "für einen Technik-Nerd, der den Eltern das Handy einrichtet"],
            ["Technik-Nerd, der eine Woche offline sein soll", "für einen Technik-Nerd, der eine Woche offline sein soll"]
          ]),
          b("Fitness-Fanatiker", [
            ["Fitness-Fanatiker, der jeden Schritt zählt", "für einen Fitness-Fanatiker, der jeden Schritt zählt"],
            ["Fitness-Fanatiker, der um 5 Uhr joggen geht", "für einen Fitness-Fanatiker, der um 5 Uhr joggen geht"],
            ["Fitness-Fanatiker, der einen Ruhetag einlegen muss", "für einen Fitness-Fanatiker, der einen Ruhetag einlegen muss"]
          ]),
          b("Aufschieberin", [
            ["Aufschieberin, die morgen ihre Hausarbeit abgeben muss", "für eine Aufschieberin, die morgen ihre Hausarbeit abgeben muss"],
            ["Aufschieberin, die seit drei Jahren ihr Fahrrad reparieren will", "für eine Aufschieberin, die seit drei Jahren ihr Fahrrad reparieren will"],
            ["Aufschieberin, die endlich die Steuer macht", "für eine Aufschieberin, die endlich die Steuer macht"]
          ]),
          b("Weltverbesserer", [
            ["Weltverbesserer, der seiner WG Mülltrennung beibringt", "für einen Weltverbesserer, der seiner WG Mülltrennung beibringt"],
            ["Weltverbesserer, der eine Petition startet", "für einen Weltverbesserer, der eine Petition startet"],
            ["Weltverbesserer, der beim Familienessen diskutiert", "für einen Weltverbesserer, der beim Familienessen diskutiert"]
          ]),
          b("Schwarzmalerin", [
            ["Schwarzmalerin, die vor jedem Ausflug Regen sieht", "für eine Schwarzmalerin, die vor jedem Ausflug Regen sieht"],
            ["Schwarzmalerin, die ein Start-up gründet", "für eine Schwarzmalerin, die ein Start-up gründet"],
            ["Schwarzmalerin, die plötzlich im Lotto gewinnt", "für eine Schwarzmalerin, die plötzlich im Lotto gewinnt", true]
          ]),
          b("Spießerin", [
            ["Spießerin, die den Rasen mit der Nagelschere schneidet", "für eine Spießerin, die den Rasen mit der Nagelschere schneidet", true],
            ["Spießerin, die die Hausordnung auswendig kennt", "für eine Spießerin, die die Hausordnung auswendig kennt"],
            ["Spießerin, die zum ersten Mal auf ein Festival geht", "für eine Spießerin, die zum ersten Mal auf ein Festival geht"]
          ])
        ]
      }
    },

    twist: {
      stil: {
        name: "Stil",
        items: [
          t("Swiss Style", "im Swiss Style"),
          t("Bauhaus", "im Bauhaus-Stil"),
          t("Brutalismus", "im Stil des Brutalismus"),
          t("Art déco", "im Art-déco-Stil"),
          t("Memphis Design", "im Memphis-Design"),
          t("Retro-80er", "im Look der 80er"),
          t("70er-Jahre-Groovy", "im Groovy-Look der 70er"),
          t("Y2K", "im Y2K-Look"),
          t("Pixel-Art", "als Pixel-Art"),
          t("Handgezeichnet", "komplett handgezeichnet"),
          t("Risograph-Look", "im Risograph-Look"),
          t("Collage", "als Collage aus Papierschnipseln"),
          t("Zeitungs-Look", "im Look einer alten Tageszeitung"),
          t("Japan-Minimalismus", "im Stil des japanischen Minimalismus"),
          t("Skandinavisch", "im skandinavischen Stil"),
          t("Cyberpunk", "im Cyberpunk-Look"),
          t("Retro-Futurismus", "im Stil des Retro-Futurismus"),
          t("Vintage-Reiseplakat", "im Look eines alten Reiseplakats"),
          t("Comic", "im Comic-Stil"),
          t("Kinderbuch-Look", "im Stil eines Kinderbuchs"),
          t("Blaupause", "als Blaupause gezeichnet"),
          t("Psychedelisch", "im psychedelischen Stil"),
          t("Glassmorphism", "im Glassmorphism-Stil"),
          t("Monochrom", "komplett in einer Farbe"),
          t("Pop-Art", "im Pop-Art-Stil")
        ]
      },
      zielgruppe: {
        name: "Zielgruppe",
        items: [
          t("Kinder unter 10", "gedacht für Kinder unter 10"),
          t("Jugendliche", "gedacht für Jugendliche"),
          t("Gen Z", "gedacht für die Gen Z"),
          t("Studierende", "gedacht für Studierende"),
          t("Eltern mit Kleinkind", "gedacht für Eltern mit Kleinkind"),
          t("Menschen über 70", "gedacht für Menschen über 70"),
          t("Leute mit Sehschwäche", "gedacht für Menschen mit Sehschwäche"),
          t("Pendelnde", "gedacht für Leute, die täglich pendeln"),
          t("Leute vom Bau", "gedacht für Leute auf der Baustelle"),
          t("Luxuskundschaft", "gedacht für eine Luxuskundschaft"),
          t("Gäste ohne Deutsch", "gedacht für Gäste, die kein Deutsch sprechen"),
          t("Technikmuffel", "gedacht für Technikmuffel"),
          t("Hundemenschen", "gedacht für Hundemenschen"),
          t("Gaming-Fans", "gedacht für Gaming-Fans"),
          t("Landwirtschaft", "gedacht für Menschen aus der Landwirtschaft"),
          t("Nachtschwärmer", "gedacht für Nachtschwärmer"),
          t("Sportbegeisterte", "gedacht für Sportbegeisterte"),
          t("Erstwählende", "gedacht für Erstwählende"),
          t("Leute mit wenig Zeit", "gedacht für Leute mit wenig Zeit"),
          t("Expats in Deutschland", "gedacht für Expats in Deutschland")
        ]
      }
    }
  };
})();
