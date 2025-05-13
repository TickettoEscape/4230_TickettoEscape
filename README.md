# GDI_Project
Server Client Projekt für eine Geodateninfrastruktur Webportal im Rahmen des Moduls 4230

- **Frontend:** React.js, OpenLayers und MUI
- **Backend:** FastAPI, Unicron

GitHub Pages: https://tickettoescape.github.io/4230_TickettoEscape/



## Requirements

- [Git](https://git-scm.com/)
- IDE wie [Visual Studio Code](https://code.visualstudio.com/) 
- [Anaconda Distribution](https://www.anaconda.com/products/distribution) oder [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
- Node.js und npm ([https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)) 

## Repository lokal klonen
Mit Git in einem Terminal das GitHub Repository *Geoharvester* in ein lokales Verzeichnis klonen.

``` shell
cd /path/to/workspace
# Clone Repository 
git clone https://github.com/314a/GDI_Project.git
```

### Git Projekt mit Visual Studio Code lokal klonen
Öffne ein neues Visual Studio Code Fenster und wähle unter Start *Clone Git Repository*. Alternativ öffne die Command Palette in VS Code `CTRL+Shift+P` (*View / Command Palette*) und wähle `Git: clone`. 
Füge die Git web URL `https://github.com/314a/GDI_Project.git` ein und bestätige die Eingabe mit Enter. Wähle einen Ordner in welchen das Repository *geklont* werden soll.

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
Öffne ein Terminal und wechsle in den *server* Ordner.
1. Virtuelle Umgebung für Python mit allen Requirements in der `requirements.txt` Datei aufsetzen.

```shell
# go to YML-File
cd preprocessing
# Füge conda-forge den als Channel in conda hinzu, da sonst nicht alle Pakete installiert werden können.
conda env create -f ENV_Ticekt_to_Escape.yml
# Env aktivieren.
conda activate Ticket_to_Escape
```

2. Backend ausführen, virtuelle Umgebung starten und server *uvicorn* starten. Öffne http://localhost:8000/docs im Browser und verifiziere, ob das Backend läuft.
``` shell
cd server
# aktiviere die conda umgebung gdiproject
conda activate gdiproject
# start server auf localhost aus dem Ordner "server"
uvicorn app.main:app --reload
# Öffne die angegebene URL im Browser und verifiziere, ob das Backend läuft.
```

## API Dokumentation
Fast API kommt mit vorinstallierter Swagger UI. Wenn der Fast API Backen Server läuft, kann auf die Dokumentation der API über Swagger UI auf http://localhost:8000/docs verfügbar.
