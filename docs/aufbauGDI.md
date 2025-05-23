# Aufbau Geodateninfrastruktur (GDI)

Eine vollständige Geodateninfrastruktur (GDI) umfasst das Backend, das Frontend sowie die verwendeten Bibliotheken und API-Schnittstellen. Das folgende Schema zeigt die entwickelte und genutzte GDI der Ticket to Escape Webapplikation.

![GDI Projekt Screenshot](Bilder/Datenbankschema.png)

## Backend

Das Backend beinhaltet alle unsichtbaren Inhalte und Daten, die sich auf dem Server.
Dazu gehören folgenden Punkte:

- Ein Räumliches Datenbanksystem (RDBS) bestehend aus einer PostgreSQL Datenbank mit PostGIS erweiterung.
- API-Schnittstelle
- Node-Server als Schnittstelle zwischen dem RDBS und dem Frontend

Die Datenbank ist mit dem GTFS Datensatz der SBB abgefüllt. Die GTFS Daten müssen bei Fahrplanwechsel neu erfasst werden! Die Tabellen welche fürs Spiel verwendet werden sind per default leer.

## API

Die API werden für den Datentrasnfer zwischen Front-/ Backend verwendet. Erfasste/ gewählte Daten werden aus dem Frontend als Payload ins Backend geschickt. Hier werden je nach Endpoint die Daten weiterverarbeitet und in die Datenbank gespielt. Das gleiche geschieht mit Abfragen an die DB.

## Endpoints Übersicht

Folgende Endpoints wurden erstellt.

| Endpoint                   | Beschreibung                                 |
| -------------------------- | -------------------------------------------- |
| `/api/create_game`         | Einstellungen vom Spiel an die DB            |
| `/api/waiting`             | Liste vom Waitingroom                        |
| `/api/checkRauberRole`     | Abfrage ob Räubergruppe bereits vergeben ist |
| `/api/newGroup`            | Neue Gruppe in DB erfassen                   |
| `/api/history/anmelden`    | An Bahnhof anmelden                          |
| `/api/history/rout_select` | Gewählte Route speichern                     |
| `/api/history/abmelden`    | Von Bahnhof abmelden                         |
| `/api/karte`               | Daten für Karte aus DB beziehen              |
| `/api/chat`                | Daten für Chat aus DB beziehen               |
| `/api/departures`          | Mögliche Abfahrten vom aktuellen Bahnhof     |
| `/api/departures_details`  | Detailangaben von Zugverbindung              |

<a id="top"></a>

[↑](#top)

<div style="display: flex; justify-content: space-between;">
  <div>
    <a href="funktionen.html">← Erklärung der Funktionen</a>
  </div>
  <div>
    <a href="ausblick.html">Erweiterungsmöglichkeiten →</a>
  </div>
</div>
