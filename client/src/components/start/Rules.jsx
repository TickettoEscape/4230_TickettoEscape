import React, { useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

export const Rules = () => {
  const navigate = useNavigate();
  const [popupContent, setPopupContent] = useState(null);

  const rules = [
    { key: "allgemein", title: "🎯 Allgemeines", content: "Gelingt es den Räuber auf dem SBB-Netz der Schweiz vor Ablauf der Zeit zu fliehen, so verhinderen die Polizisten dass die Räuber ihr Ticket to Escape lösen können." },
    { key: "teilnehmer", title: "🧑‍🤝‍🧑 Teilnehmer & Gruppen", content: "1 Räubergruppe & 2-7 Polizistengruppen. Empfehlung: 2-5 Spieler pro Gruppe." },
    { key: "start", title: "🚦 Spielstart", content: "Die Räuber starten mit 30 Minuten Vorsprung an einem selbstgewählten Bahnhof." },
    { key: "ablauf", title: "🔄 Spielablauf", content: "• Räuber melden beim Aussteigen den Bahnhof\n• Alle 30 Minuten: Standort & Linienbezeichnung\n• Polizisten melden jede zweite Linie\n• Polizisten dürfen freiwillige Zusatzinfos geben" },
    { key: "ende", title: "🏁 Spielende", content: "• Gefangen am Bahnhof oder im Zug = Polizei gewinnt\n• Regelbruch = Polizei gewinnt" },
    { key: "regeln", title: "⚠️ Zusätzliche Regeln", content: "• Maximal 1.25h im Zug\n• Kein Wiedereinsteigen ohne Richtungswechsel\n• Maximal 1h mit Endbahnhof-Zügen" },
    { key: "beispiel", title: "📑 Beispiel", content: "09:27 Anmeldung Bahnhof Aarau\n10:00 Standortmeldung S23\n10:15 Anmeldung Bahnhof Langenthal" }
  ];

  return (
    <div className="page">
      <div className="card">
        <div className="form-box">

          {/* Titel und X oben rechts */}
          <h1>Spielregeln</h1>
          <span onClick={() => navigate("/start")} className="close-top-right">✕</span>

          {/* Regeln */}
          {rules.map((rule) => (
            <div key={rule.key} onClick={() => setPopupContent(rule)} style={{ cursor: "pointer" }}>
              <h3>{rule.title}</h3>
            </div>
          ))}

        </div>
      </div>

      {/* Popup */}
      {popupContent && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <span onClick={() => setPopupContent(null)} className="close-button">✕</span>
            </div>
            <h2>{popupContent.title}</h2>
            <pre>{popupContent.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
