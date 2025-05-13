import React, { useState } from "react";
import "../../App.css";
import { Footer } from "../Footer";
import { Header } from "../Header";

export const Infos = () => {
  const [popupContent, setPopupContent] = useState(null);

  const rules = [
    {
      key: "allgemein",
      title: "🎯 Allgemeines",
      content:
        "Die Uhr tickt! Schaffen es die Räuber, vor den Polizisten über das SBB-Netz zu entkommen, gewinnen sie ihr Ticket to Escape.",
    },
    {
      key: "teilnehmer",
      title: "🧑‍🤝‍🧑 Teilnehmer & Gruppen",
      content:
        "Ein Spiel besteht aus mindestens einer Räubergruppe und 2-7 Polizistengruppen. Empfohlen werden 2-5 Spieler pro Gruppe.",
    },
    {
      key: "start",
      title: "🚦 Spielstart",
      content:
        "Die Räuber starten mit 30 Minuten Vorsprung an einem selbstgewählten Bahnhof und melden diesen den Polizisten.",
    },
    {
      key: "ablauf",
      title: "🔄 Spielablauf",
      content:
        "• Räuber melden beim Aussteigen den Bahnhof\n• Polizisten melden jede zweite Linie\n• Polizisten dürfen freiwillige Zusatzinfos geben",
    },
    {
      key: "ende",
      title: "🏁 Spielende",
      content:
        "• Gefangen am Bahnhof oder im Zug = Polizei gewinnt\n• Regelbruch = Polizei gewinnt",
    },
    {
      key: "regeln",
      title: "⚠️ Zusätzliche Regeln",
      content:
        "• Maximal 1.25h im Zug\n• Kein Wiedereinsteigen ohne Richtungswechsel\n• Maximal 1h mit Endbahnhof-Zügen",
    },
    {
      key: "beispiel",
      title: "📑 Beispiel",
      content:
        "09:27 Anmeldung Bahnhof Aarau\n10:00 Standortmeldung S23\n10:15 Anmeldung Bahnhof Langenthal",
    },
        {
      key: "impressum",
      title: "Impressum",
      content:
        "Entwickler: Aebi Manuel, Fernandes Pereira Vania, Uythoven Sven \nDie Entwickler übernehmen keine Verantwortung für die Aktualität, Korrektheit oder Vollständigkeit der Inhalte der Web App. Es wird keine Gewähr für den Betrieb der Web App übernommen; eine Haftung für Schäden an Hard- oder Software infolge von Viren oder technischen Problemen jeglicher Art ist ausgeschlossen. ",
    },
  ];

  return (
    <div className="page">
      <Header />
      
      <div className="card">
        <div className="form-box">

          {/* Regeln */}
          {rules.map((rule) => (
            <div
              key={rule.key}
              onClick={() => setPopupContent(rule)}
              style={{ cursor: "pointer" }}
            >
              <h3 style={{ textAlign: "left", width: "100%" }}>
                {rule.title}
              </h3>
            </div>
          ))}
        </div>
        <Footer/>
      </div>

      {/* Popup */}
      {popupContent && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <span
                onClick={() => setPopupContent(null)}
                className="close-button"
              >
                ✕
              </span>
            </div>
            <h2>{popupContent.title}</h2>
            <pre>{popupContent.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
