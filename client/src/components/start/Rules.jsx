import React, { useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

export const Rules = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="page">
      <div className="card">

        <div className="form-box">

          {/* Titel jetzt in der weißen Box */}
          <h1>Spielregeln</h1>

          {/* Kapitel */}
          <div onClick={() => toggleSection("allgemein")}>
            <h3>🎯 Allgemeines</h3>
            {openSection === "allgemein" && (
              <p>Die Räuber fliehen mithilfe des SBB-Netzes. Die Polizisten versuchen, sie zu fangen.</p>
            )}
          </div>

          <div onClick={() => toggleSection("teilnehmer")}>
            <h3>🧑‍🤝‍🧑 Teilnehmer & Gruppen</h3>
            {openSection === "teilnehmer" && (
              <p>1 Räubergruppe & 2-7 Polizistengruppen. Empfehlung: 2-5 Spieler pro Gruppe.</p>
            )}
          </div>

          <div onClick={() => toggleSection("start")}>
            <h3>🚦 Spielstart</h3>
            {openSection === "start" && (
              <p>Die Räuber starten mit 30 Minuten Vorsprung an einem selbstgewählten Bahnhof.</p>
            )}
          </div>

          <div onClick={() => toggleSection("ablauf")}>
            <h3>🔄 Spielablauf</h3>
            {openSection === "ablauf" && (
              <ul>
                <li>Räuber melden beim Aussteigen den Bahnhof</li>
                <li>Alle 30 Minuten: Standort & Linienbezeichnung</li>
                <li>Polizisten melden jede zweite Linie</li>
                <li>Polizisten dürfen freiwillige Zusatzinfos geben</li>
              </ul>
            )}
          </div>

          <div onClick={() => toggleSection("ende")}>
            <h3>🏁 Spielende</h3>
            {openSection === "ende" && (
              <ul>
                <li>Gefangen am Bahnhof oder im Zug = Polizei gewinnt</li>
                <li>Regelbruch = Polizei gewinnt</li>
              </ul>
            )}
          </div>

          <div onClick={() => toggleSection("regeln")}>
            <h3>⚠️ Zusätzliche Regeln</h3>
            {openSection === "regeln" && (
              <ul>
                <li>Maximal 1.25h im Zug</li>
                <li>Kein Wiedereinsteigen ohne Richtungswechsel</li>
                <li>Maximal 1h mit Endbahnhof-Zügen</li>
              </ul>
            )}
          </div>

          <div onClick={() => toggleSection("beispiel")}>
            <h3>📑 Beispiel</h3>
            {openSection === "beispiel" && (
              <p>
                09:27 Anmeldung Bahnhof Aarau <br />
                10:00 Standortmeldung S23 <br />
                10:15 Anmeldung Bahnhof Langenthal
              </p>
            )}
          </div>

          <button onClick={() => navigate("/start")}>Zurück</button>
        </div>
      </div>
    </div>
  );
};
