# Funktionen der App Ticket to Escape

Anbei werden die Funktionalitäten der einzelnen Komponenten der App erklärt. 

<a id="spielerstellen"></a>
## Spiel erstellen
Der erste Spieler erstellt mit dem Button ***Neues Spiel*** ein Spiel und definiert die *Maximale Spieldauer (Stunden)* und die *Anzahl Polizisten*. Die maximale Spieldauer wurde auf 10 Stunden begrenzt und mindestens eine Polizistengruppe muss dem Spiel beitreten. 

<p style="display: flex; justify-content:center; gap: 10px;">
  <img src="Bilder/01_Startseite.png" alt="Startseite" style="width: 32%;">
  <img src="Bilder/02_Neues_Spiel.png" alt="Neues Spiel" style="width: 32%;">
</p>

Anschliessend kann die eigene Rolle im Spiel gewählt werden und der Spielname angegeben. Im Warteraum erscheint die **Spiel-ID** welche den anderen Gruppen mitgeteilt werden muss. Sind alle Gruppen im Warteraum eingeloggt, kann das Spiel gestartet werden. 


<p style="display: flex; justify-content:center; gap: 10px;">
  <img src="Bilder/03_Rolle_Auswahl.png" alt="Rolle auswählen" style="width: 30%;">
  <img src="Bilder/04_Gruppen_Name.png" alt="Gruppenname" style="width: 30%;">
    <img src="Bilder/05_Warteliste.png" alt="Warteraum" style="width: 30%;">
</p>

<a id="spielbeitreten"></a>
## Spiel beitreten
Wurde das Spiel bereits erstellt, kann man mit der
**Spiel-ID** einem Spiel beitreten, die eigene Rolle und den Name angeben. Anschliessend tritt man zum Warteraum hinzu und kann das Spiel starten sobald die Räuber und eine Polizistengruppe bereit ist.

<p style="display: flex; justify-content:center; gap: 10px;">
  <img src="Bilder/21_Speil_beitreten.png" alt="Speil beitreten" style="width: 30%;">
  <img src="Bilder/22_Auswahl_Bahnhof.png" alt="Auswahl_Gruppe" style="width: 30%;">
    <img src="Bilder/23_Warteliste.png" alt="Warteraum" style="width: 30%;">
</p>

<a id="bahnhofverbindungen"></a>
## Bahnhof und Verbindungen suchen
Von einem Bahnhof aus lassen sich die nächsten Verbindungen samt Abfahrtszeit, Linie, Richtung und Gleis anzeigen. mittels  dem Button ***Nächste Verbindung*** werden spätere Verbindungen geladen. Wählt man eine dieser Verbindungen aus, erscheinen die Haltestellen der Verbindung. 

<p style="display: flex; justify-content:center; gap: 10px;">
  <img src="Bilder/11_Startbahnhof.png" alt="Bahnhof wählen" style="width: 32%;">
  <img src="Bilder/12_Verbindungen.png" alt="Verbindungen" style="width: 32%;">
    <img src="Bilder/13_Detail_Verbindung.png" alt="Warteraum" style="width: 32%;">
</p>

<a id="informationenpolizisten"></a>
## Informationen teilen Polizisten
Die Polizisten können grösstenteils entscheiden wie viele Informationen sie mit dem anderen Gruppen teilen. Dabei kann entscheiden werden ob sie den Bahnhof mit den anderen Gruppen teilen. Beim Auswählen des Bahnhof erscheint ein Pop-up mit der Meldung ***Bahnhof im Chat speichern?***

<p style="display: flex; flex; justify-content:center;gap: 10px;">
  <img src="Bilder/25_Bahnhof_im_Chat_Senden.png" alt="Bahnhof im Chat senden" style="width: 32%;">
</p>

Jede zweite Route muss den anderen Gruppen gemeldet werden. Somit kann im Pop-up ***Trip im Chat speichern?*** ausgewählt werden ob die Verbindung im [Chat](##Chat) gesendet werden soll.

<p style="display: flex; justify-content:center;gap: 10px;">
  <img src="Bilder/26_Trip_Speichern.png" alt="Trip speichern" style="width: 32%;">
</p>

<a id="informationenraeuber"></a>
## Informationen teilen Räuber
Die Räuber müssen sich immer melden, wenn sie einen Bahnhof verlassen. Dabei wird jeweils wenn man eine Verbindung ausgewählt hat mit dem Button ***Route Speichern*** die Route erfasst. Aus taktischen Gründen können sie sich dafür entscheiden länger angemeldet zu bleiben. Ist dies der Fall, meldsen sie die Route und spätestens nach 15 Minuten können sie mit dem Button ***von Bahnhof abmelden*** den Räubern eine Nachricht im [Chat](##Chat) schicken. 

<p style="display: flex; justify-content:center;gap: 10px;">
  <img src="Bilder/14_Von_Bahnhof_abmelden.png" alt="Bahnhof wählen" style="width: 32%;">
</p>

Nachdem die Verbindung erfasst wurde und die Räubergruppe sich am Bahnhof abgemeldet hat, erhält man ein Überblick der ausgewählten Strecke. Während der Fahrt können neue Verbindungen gesucht werden. Bestätigt man die neue Route erhalten die Polizisten automatisch eine Nachricht, dass die Räuber am Bahnhof aussteigen. Die Ausstiegszeit wird aus dem Fahrplannetz abgegriffen und Verspätungen werden dabei nicht abgefangen

<p style="display: flex; justify-content:center;gap: 10px;">
  <img src="Bilder/15_Nächste_Verbindung.png" alt="Bahnhof wählen" style="width: 32%;">
</p>

<a id="chat"></a>
## Chat
Im Chat erscheinen alle geteilten Informationen der anderen Gruppen chronologisch. Zudem sind die Informationen der Gruppen farblich unterteilt.

<p style="display: flex; justify-content:center;gap: 10px;">
  <img src="Bilder/24_Chat.png" alt="Bahnhof wählen" style="width: 32%;">
</p>

<a id="karte"></a>
## Karte
Auf der Karte sind alle bereits besuchten Bahnhöfe ersichtlich. Dabei ist beim anwählen des roten Kreises der Bahnhofsname ersichtlich.

<p style="display: flex; justify-content:center;gap: 10px;">
  <img src="Bilder/27_Karte.png" alt="Bahnhof wählen" style="width: 32%;">
</p>

<a id="informationen"></a>
## Informationen
Unter dem Informationsbutton sind die Spielregeln, welche bereits beim erstellen des Spiels aufzufinden waren und das Impressum ersichtlich. 

<p style="display: flex; justify-content:center;gap: 10px;">
  <img src="Bilder/Spielregeln.png" alt="Bahnhof wählen" style="width: 32%;">
</p>

[↑](#top)


<div style="display: flex; justify-content: space-between;">
  <div>
    <a href="index.html">← Ticket to Escape</a>
  </div>
  <div>
    <a href="aufbauGDI.html">Aufbau GDI →</a>
  </div>
</div>