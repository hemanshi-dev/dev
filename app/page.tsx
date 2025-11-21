// "use client";

// import { useEffect, useRef, useState } from "react";
// import "./RecordingPage.css";

// export default function Home() {
//   const [isRecording, setIsRecording] = useState(false);
//   const socketRef = useRef<WebSocket | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   // const startRecording = async () => {
//   //   try {
//   //     // ADD THIS: Send start signal FIRST
//   //     if (socketRef.current?.readyState === WebSocket.OPEN) {
//   //       console.log("📡 Sending START signal");
//   //       socketRef.current.send(JSON.stringify({ type: "start" }));
//   //     }

//   //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   //     const mediaRecorder = new MediaRecorder(stream, {
//   //       mimeType: "audio/webm",
//   //     });

//   //     mediaRecorder.ondataavailable = async (event) => {
//   //       if (
//   //         event.data.size > 0 &&
//   //         socketRef.current?.readyState === WebSocket.OPEN
//   //       ) {
//   //         const buffer = await event.data.arrayBuffer();
//   //         console.log(`Sending ${buffer.byteLength} bytes of data`);
//   //         socketRef.current.send(buffer);
//   //       }
//   //     };

//   //     mediaRecorder.start(1000);
//   //     mediaRecorderRef.current = mediaRecorder;
//   //     setIsRecording(true);
//   //   } catch (error) {
//   //     console.error("Error accessing media devices:", error);
//   //   }
//   // };

//   const startRecording = async () => {
//     try {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const audioDevices = devices.filter((device) => device.kind === "audioinput");
  
//       if (audioDevices.length === 0) {
//         console.error("No audio input devices found.");
//         alert("No microphone detected. Please connect a microphone and try again.");
//         return;
//       }
  
//       if (socketRef.current?.readyState === WebSocket.OPEN) {
//         console.log("📡 Sending START signal");
//         socketRef.current.send(JSON.stringify({ type: "start" }));
//       }
  
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream, {
//         mimeType: "audio/webm",
//       });
  
//       mediaRecorder.ondataavailable = async (event) => {
//         if (
//           event.data.size > 0 &&
//           socketRef.current?.readyState === WebSocket.OPEN
//         ) {
//           const buffer = await event.data.arrayBuffer();
//           console.log(`Sending ${buffer.byteLength} bytes of data`);
//           socketRef.current.send(buffer);
//         }
//       };
  
//       mediaRecorder.start(1000);
//       mediaRecorderRef.current = mediaRecorder;
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error accessing media devices:", error);
//       alert("Failed to access microphone. Please check your browser permissions.");
//     }
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     mediaRecorderRef.current = null;

//     // ADD THIS: Send stop signal
//     if (socketRef.current?.readyState === WebSocket.OPEN) {
//       console.log("📡 Sending STOP signal");
//       socketRef.current.send(JSON.stringify({ type: "stop" }));
//     }

//     setIsRecording(false);
//   };

//   // const stopRecording = () => {
//   //   mediaRecorderRef.current?.stop();
//   //   mediaRecorderRef.current = null;
//   //   setIsRecording(false);
//   // };

//   const toggleRecording = () => {
//     console.log("Toggling recording. Current state:", !isRecording);
//     if (!isRecording) {
//       startRecording();
//     } else {
//       stopRecording();
//     }
//   };

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8082/?role=broadcaster");
//     // const socket = new WebSocket(
//       // "wss://devcoreact-production.up.railway.app/?role=broadcaster"
//     // );

//     socketRef.current = socket;

//     socket.onopen = () => {
//       console.log("WebSocket connection opened.");
//     };

//     socket.onclose = () => {
//       console.log("WebSocket connection closed.");
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   return (
//     <div className="container">
//       <div className="content">
//         <h1 className="title">Auction Speaker</h1>
//         <button
//           className={`record-button ${isRecording ? "recording" : "record"}`}
//           onClick={toggleRecording}
//         ></button>

//         <div className="recording-status">
//           {isRecording ? (
//             <>
//               <span className="recording-indicator"></span> Recording...
//             </>
//           ) : (
//             "Click to start recording"
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import "./RecordingPage.css";

// CONFIGURATION - Change this to your server URL
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "ws://localhost:8082";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    setConnectionStatus("connecting");
    const socket = new WebSocket(`wss://dev-qxvs.onrender.com/?role=broadcaster`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connection opened");
      setConnectionStatus("connected");
      
      // Clear any pending reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Server message:", data);
      } catch (e) {
        console.error("Failed to parse server message:", e);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket connection closed");
      setConnectionStatus("disconnected");
      
      // Auto-reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("🔄 Attempting to reconnect...");
        connectWebSocket();
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setConnectionStatus("disconnected");
    };
  };

  const startRecording = async () => {
    try {
      // Check if microphone is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter((device) => device.kind === "audioinput");
  
      if (audioDevices.length === 0) {
        console.error("No audio input devices found");
        alert("No microphone detected. Please connect a microphone and try again.");
        return;
      }

      // Ensure WebSocket is connected
      if (socketRef.current?.readyState !== WebSocket.OPEN) {
        console.error("WebSocket not connected");
        alert("Server connection lost. Reconnecting...");
        connectWebSocket();
        return;
      }
  
      // Send START signal
      console.log("📡 Sending START signal");
      socketRef.current.send(JSON.stringify({ type: "start" }));
  
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
  
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
          const buffer = await event.data.arrayBuffer();
          console.log(`📤 Sending ${buffer.byteLength} bytes`);
          socketRef.current.send(buffer);
        }
      };

      mediaRecorder.onerror = (error) => {
        console.error("MediaRecorder error:", error);
        stopRecording();
      };
  
      mediaRecorder.start(1000); // Send data every 1 second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      console.log("🎙️ Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to access microphone. Please check your browser permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      mediaRecorderRef.current = null;
    }

    // Send STOP signal
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("📡 Sending STOP signal");
      socketRef.current.send(JSON.stringify({ type: "stop" }));
    }

    setIsRecording(false);
    console.log("⏹️ Recording stopped");
  };

  const toggleRecording = () => {
    if (connectionStatus !== "connected") {
      alert("Not connected to server. Please wait...");
      return;
    }

    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (mediaRecorderRef.current) {
        stopRecording();
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Auction Speaker</h1>
        
        {/* Connection Status Indicator
        <div style={{ 
          marginBottom: "20px", 
          padding: "10px", 
          borderRadius: "8px",
          backgroundColor: connectionStatus === "connected" ? "#d4edda" : 
                          connectionStatus === "connecting" ? "#fff3cd" : "#f8d7da",
          color: connectionStatus === "connected" ? "#155724" : 
                 connectionStatus === "connecting" ? "#856404" : "#721c24"
        }}>
          {connectionStatus === "connected" && "✅ Connected to server"}
          {connectionStatus === "connecting" && "⏳ Connecting..."}
          {connectionStatus === "disconnected" && "❌ Disconnected - Reconnecting..."}
        </div> */}

        <button
          className={`record-button ${isRecording ? "recording" : "record"}`}
          onClick={toggleRecording}
          disabled={connectionStatus !== "connected"}
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