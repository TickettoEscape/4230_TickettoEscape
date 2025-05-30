# Ticket to Escape
***"Die Uhr tickt! Schaffen es die Räuber, vor den Polizisten über das SBB-Netz zu entkommen, gewinnen sie ihr Ticket to Escape."***

Das Detektivspiel Scotland Yard oder auch bekannt unter dem Namen Flucht durch die Schweiz oder Mister X wurde von einem Brettspiel in ein Fluchtspiel mit dem SBB-Netz erweitert. Dabei ist eine Räubergruppe mit Vorsprung auf der Flucht und wird von Polizistengruppen verfolgt. Schaffen es die Polizisten vor Ablauf der Zeit die Räuber in einem Zug oder an einem Bahnhof zu fangen, gewinnen sie. 

Mit dieser Webapp gelingt es ihnen, durch das SBB-Netz zu flüchten oder den Räubern auf die Schliche zu kommen. Suchen sie ihre nächsten Verbindung und schauen sie wo sich die anderen Gruppen befinden. 

- **Frontend:** React.js, OpenLayers und MUI
- **Backend:** FastAPI

GitHub Pages: https://tickettoescape.github.io/4230_TickettoEscape/

## Projektstruktur
```bash
├───client                 # Frontend-Code
│    ├───node_modules      # Abhängigkeiten des Frontends (automatisch generiert)
│    ├───public            # Öffentliche statische Ressourcen
│    └───src               # React Komponenten
│        ├───components        # Strukturierte React-Komponenten
│        │    ├───main          # Hauptkomponenten des Interfaces
│        │    └───start         # Komponenten für das erstellen des Spiels
│        └───data              # Statische Daten
├───docs                   # Projektdokumentation
├───preprocessing          # Skripte zur Datenvorbereitung und -verarbeitung
└───server                 # Backend-Code und serverseitige Logik
```


## Requirements

- [Git](https://git-scm.com/)
- IDE wie [Visual Studio Code](https://code.visualstudio.com/) 
- [Anaconda Distribution](https://www.anaconda.com/products/distribution) oder [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
- Node.js und npm ([https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
- [PG Admin4](https://www.pgadmin.org/download/)

## Repository lokal klonen
Mit Git in einem Terminal das GitHub Repository *Ticket to Escape* in ein lokales Verzeichnis klonen.

``` shell
cd /path/to/workspace
# Clone Repository 
git clone https://github.com/TickettoEscape/4230_TickettoEscape.git
```

### Git Projekt mit Visual Studio Code lokal klonen
Öffne ein neues Visual Studio Code Fenster und wähle unter Start *Clone Git Repository*. Alternativ öffne die Command Palette in VS Code `CTRL+Shift+P` (*View / Command Palette*) und wähle `Git: clone`. 
Füge die Git web URL `https://github.com/TickettoEscape/4230_TickettoEscape.git` ein und bestätige die Eingabe mit Enter. Wähle einen Ordner in welchen das Repository *geklont* werden soll.

## Frontend installieren
Öffne ein Terminal (Command Prompt in VS Code) und wechsle in den *client* Ordner in diesem Projekt

``` shell
cd client
# aktiviere node.js (falls nvm genutzt wird) 
# nvm use 22.14.0
# install all the node.js dependencies
npm install
# node Projekt ausführen
# npm run dev ist in package.json definiert
npm run dev
```

## Backend installieren
Öffne ein Terminal und wechsle in den *preprocessing* Ordner.
1. Virtuelle Umgebung für Python mit allen Requirements mit der `ENV_Ticket_to_Escape.yml` automatisch oder mit  `requirements.txt` manuell aufsetzen.

```shell
# go to YML-File
cd preprocessing
# Füge conda-forge den als Channel in conda hinzu, da sonst nicht alle Pakete installiert werden können.
conda env create -f ENV_Ticket_to_Escape.yml
# Env aktivieren.
conda activate Ticket_to_Escape
```

2. Backend ausführen, virtuelle Umgebung starten und server *uvicorn* starten. Öffne http://localhost:8000/docs  im Browser und verifiziere, ob das Backend läuft.
``` shell
cd server
# aktiviere die conda umgebung Ticket_to_Escape
conda activate Ticket_to_Escape
# start server auf localhost aus dem Ordner "server"
uvicorn Daten_Abfrage_API:app --reload
# Öffne die angegebene URL im Browser und verifiziere, ob das Backend läuft.
```

## API Dokumentation
Fast API kommt mit vorinstallierter Swagger UI. Wenn der Fast API Backen Server läuft, kann auf die Dokumentation der API über Swagger UI auf http://localhost:8000/docs verfügbar.


## DB erstellen
Die Daten für die DB sind im preprocessing Ordner im File `Ticket_to_Escape_DB.sql`
``` shell
im PG Admin neue DB erstellen, Name, User, und Passwort Merken!!
mit rechtklick auf DB über "restore" diese Datei wählen `Ticket_to_Escape_DB.sql`. 

Name, USER & Passwort in Zeile 27 im File `Daten_Abfrage_API.py` angepassen:
Zeile 27: db_connection_url = "postgresql+psycopg2://"USER":"PASSWORT"@localhost:5432/"DM-NAME"



```
