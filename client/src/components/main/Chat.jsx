import React, { useEffect, useState } from "react";
import "../../App.css";
import { Footer } from "../Footer";

// Define bubble colors for each group
const groupColors = {
  group1: "#ff6666",
  group2: "#66b3ff",
  group3: "#99ff99",
  group4: "#ffcc99",
  group5: "#cc99ff",
  group6: "#ffff99",
  group7: "#66ffcc",
  group8: "#ff99cc",
  group9: "#aaffc3",
  group10: "#ffb3b3",
};

// Example JSON messages (simulated)
const sampleMessages = [
  {
    groupId: "group1",
    groupName: "Shadow Express",
    location: "Central Yard",
    trip: null,
    time: "2025-05-05T12:01:00Z",
  },
  {
    groupId: "group2",
    groupName: "Tunnel Rats",
    location: "Old Station",
    trip: null,
    time: "2025-05-05T12:03:00Z",
  },
  {
    groupId: "group3",
    groupName: "Steel Bandits",
    location: null,
    trip: "From Cargo Bay to Platform 8",
    time: "2025-05-05T12:05:00Z",
  },
  {
    groupId: "group1",
    groupName: "Shadow Express",
    location: null,
    trip: "To Supply Depot",
    time: "2025-05-05T12:10:00Z",
  },
  {
    groupId: "group4",
    groupName: "The Rust Hawks",
    location: "East Engine Block",
    trip: null,
    time: "2025-05-05T12:12:00Z",
  },
];

export const Chat = () => {
  const [messages, setMessages] = useState([]);

  // Get the user's group ID from localStorage (default to group1)
  const myGroupId = localStorage.getItem("group_id") || "group1";

  useEffect(() => {
    // Sort messages by time
    const sorted = [...sampleMessages].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );
    setMessages(sorted);
  }, []);

  return (
    <div className="page" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%", // ensures full width usage
        }}
      >
        {messages.map((msg, index) => {
          const isMine = msg.groupId === myGroupId;
          const messageText = msg.location || msg.trip || "No info";
          const bubbleColor = groupColors[msg.groupId] || "#ddd";

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  backgroundColor: bubbleColor,
                  borderRadius: "15px",
                  padding: "10px 15px",
                  maxWidth: "70%",
                  textAlign: isMine ? "right" : "left",
                  margin: "2px 10px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {msg.groupName}
                </div>
                <div>{messageText}</div>
                <div
                  style={{
                    fontSize: "0.8em",
                    marginTop: "4px",
                    color: "#444",
                    opacity: 0.6,
                  }}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};
