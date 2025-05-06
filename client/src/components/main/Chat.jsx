import React, { useEffect, useState } from "react";
import "../../App.css";
import { Footer } from "../Footer";
import { Header } from "../Header";

const groupColors = [

  "#FFDFBA", // Apricot
  "#E5CCFF", // Lavendel
  "#BAFFC9", // Minzgrün
  "#BAE1FF", // Babyblau
  "#FFB3BA", // helles Korallrosa
  "#FFFFBA", // Blassgelb
  "#FFCCE5", // Rosa
  "#C2F0C2", // Grünlich
  "#FFE6CC", // Pfirsich
  "#D1C4E9", // helles Violett
];

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const groupName = localStorage.getItem("groupName") || "";

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const game_id = localStorage.getItem("gameId");
        if (!game_id) return;

        const res = await fetch(
          `http://localhost:8000/api/chat?game_id=${encodeURIComponent(game_id)}`
        );
        const data = await res.json();
        const sorted = data.sort((a, b) => a.time.localeCompare(b.time));
        setMessages(sorted);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    };

    fetchChat();
  }, []);

      // Farbzuteilung pro Gruppe
      const groupColorMap = {};
      let colorIndex = 0;
      messages.forEach(({ group_name }) => {
        if (!groupColorMap[group_name]) {
          groupColorMap[group_name] = groupColors[colorIndex % groupColors.length];
          colorIndex++;
        }
      });

      return (
        <div className="page top-align" style={{ paddingBottom: "50px" }}>
          <Header />
          <div className="card" style={{ width: "100%", maxWidth: "420px", marginBottom: "16px" }}>
            <div className="form-box" style={{
              height: "calc(100vh - 160px)",
              overflowY: "auto",
              padding: "1px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: "#011432",
              borderRadius: "10px",
            }}>
              {messages.map((msg, index) => {
                const isMine = msg.group_name === groupName;
                const align = isMine ? "flex-end" : "flex-start";
                const bubbleColor = groupColorMap[msg.group_name];

      return (
        <div
          key={index}
          style={{ display: "flex", justifyContent: align }}
        >
          <div
            style={{
              backgroundColor: bubbleColor,
              color: "#011432",
              padding: "8px 12px",
              borderRadius: "16px",
              maxWidth: "69%",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              textAlign: "left",
              alignSelf: isMine ? "flex-end" : "flex-start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <img
                src={msg.role === "Polizei" ? "/Logo_Polizei_Hut.png" : "/Logo_Raeuber_Augen.png"}
                alt={msg.role}
                style={{ height: "18px", width: "23px" }}
              />
              <strong>{msg.group_name}</strong>
            </div>
            <div style={{ marginTop: "4px" }}>{msg.chat_nachricht}</div>
          </div>
        </div>
      );
    })}
        </div>
      </div>
      <Footer />
    </div>
  );
};
