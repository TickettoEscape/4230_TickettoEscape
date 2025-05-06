import React, { useEffect, useState } from "react";
import "../../App.css";
import { Footer } from "../Footer";

const groupColors = [
  "#FFD700",
  "#87CEFA",
  "#90EE90",
  "#FFB6C1",
  "#DDA0DD",
  "#FFA07A",
  "#40E0D0",
  "#F08080",
  "#D3D3D3",
  "#FA8072",
];

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const myGroupid = localStorage.getItem("group_id") || "My Group";

  useEffect(() => {
    const fetchDepartures = async () => {
      try {
        const game_id = localStorage.getItem("game_id");
        if (!game_id) return;

        const res = await fetch(
          `http://localhost:8000/api/chat?game_id=${encodeURIComponent(
            game_id
          )}`
        );
        const data = await res.json();

        // Sort by time
        const sorted = data.sort((a, b) => a.time.localeCompare(b.time));
        setMessages(sorted);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    };

    fetchDepartures();
  }, []);

  // Assign colors per group name
  const groupColorMap = {};
  let colorIndex = 0;
  messages.forEach(({ group_name }) => {
    if (!groupColorMap[group_name]) {
      groupColorMap[group_name] = groupColors[colorIndex % groupColors.length];
      colorIndex++;
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "1rem",
          fontFamily: "sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {messages.map((msg, index) => {
          const isMine = msg.group_id === myGroupid;
          const alignment = isMine ? "flex-end" : "flex-start";
          const bubbleColor = groupColorMap[msg.group_name];

          return (
            <div
              key={index}
              style={{ display: "flex", justifyContent: alignment }}
            >
              <div
                style={{
                  backgroundColor: bubbleColor,
                  color: "#000",
                  padding: "0.5rem 1rem",
                  borderRadius: "1rem",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  textAlign: "left",
                }}
              >
                <strong>{msg.group_name}</strong>
                <div>{msg.chat_nachricht}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Footer restored */}
      <Footer />
    </div>
  );
};
