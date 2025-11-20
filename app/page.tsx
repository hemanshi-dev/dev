"use client";

import { useEffect, useRef, useState } from "react";
import "./RecordingPage.css";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      // ADD THIS: Send start signal FIRST
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log("📡 Sending START signal");
        socketRef.current.send(JSON.stringify({ type: "start" }));
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorder.ondataavailable = async (event) => {
        if (
          event.data.size > 0 &&
          socketRef.current?.readyState === WebSocket.OPEN
        ) {
          const buffer = await event.data.arrayBuffer();
          console.log(`Sending ${buffer.byteLength} bytes of data`);
          socketRef.current.send(buffer);
        }
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    // ADD THIS: Send stop signal
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("📡 Sending STOP signal");
      socketRef.current.send(JSON.stringify({ type: "stop" }));
    }

    setIsRecording(false);
  };

  // const stopRecording = () => {
  //   mediaRecorderRef.current?.stop();
  //   mediaRecorderRef.current = null;
  //   setIsRecording(false);
  // };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  useEffect(() => {
    // const socket = new WebSocket("ws://localhost:8082/?role=broadcaster");
    const socket = new WebSocket(
      "wss://devcoreact-production.up.railway.app/?role=broadcaster"
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Auction Speaker</h1>
        <button
          className={`record-button ${isRecording ? "recording" : "record"}`}
          onClick={toggleRecording}
        ></button>

        <div className="recording-status">
          {isRecording ? (
            <>
              <span className="recording-indicator"></span> Recording...
            </>
          ) : (
            "Click to start recording"
          )}
        </div>
      </div>
    </div>
  );
}
