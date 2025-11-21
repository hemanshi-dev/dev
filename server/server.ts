// import { WebSocket, WebSocketServer } from "ws";
// import cors from "cors";
// import express from "express";
// import { spawn, ChildProcess } from "child_process";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { execSync } from "child_process";
// import pusher from "../pusherService.js";


// // LOGGING
// console.log("🚀 SERVER STARTING...");
// console.log("Node version:", process.version);
// console.log("Environment:", process.env.NODE_ENV);
// console.log("CWD:", process.cwd());
// try {
//   const ffmpegPath = execSync("which ffmpeg").toString().trim();
//   console.log("🟢 FFmpeg is installed at:", ffmpegPath);
// } catch (err) {
//   console.error("🔴 FFmpeg not found in PATH");
// }
// // const PORT = Number(process.env.PORT || 8082);
// const PORT = Number(process.env.PORT);
// if (!PORT) {
//   console.error("❌ No PORT provided. Railway must set process.env.PORT");
//   process.exit(1);
// }
// const FFMPEG_PATH = process.env.FFMPEG_PATH || '/usr/bin/ffmpeg';
// console.log("Port:", PORT);
// console.log("FFmpeg path:", FFMPEG_PATH);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log("__dirname:", __dirname);

// const outputDir = path.join(__dirname, "hls");
// if (!fs.existsSync(outputDir)) {
//   fs.mkdirSync(outputDir, { recursive: true });
//   console.log("Created HLS output directory:", outputDir);
// }

// const app = express();
// app.use(cors({
//   origin: "*",
//   credentials: true
// }));

// app.use("/hls", express.static(outputDir, {
//   setHeaders: (res) => {
//     res.setHeader("Cache-Control", "no-store");
//     res.setHeader("Access-Control-Allow-Origin", "*");
//   },
// }));

// app.get("/health", (req, res) => {
//   res.json({ 
//     status: "ok", 
//     broadcasting: isBroadcasting,
//     timestamp: new Date().toISOString()
//   });
// });

// app.get("/", (req, res) => {
//   res.json({ 
//     status: "WebSocket Server Running",
//     port: PORT,
//     ffmpegPath: FFMPEG_PATH,
//     endpoints: {
//       ws: `wss://${req.headers.host}/?role=broadcaster`,
//       hls: `https://${req.headers.host}/hls/audio.m3u8`,
//       health: `https://${req.headers.host}/health`
//     }
//   });
// });

// const server = app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ HTTP server listening on http://0.0.0.0:${PORT}`);
//   console.log(`📡 WebSocket available at ws://0.0.0.0:${PORT}`);
//   console.log(`🎵 HLS at /hls/audio.m3u8`);
// });
// server.on("error", (err) => {
//   console.error("❌ Server error:", err);
//   process.exit(1);
// });

// const wss = new WebSocketServer({ 
//   server,
//   perMessageDeflate: false,
//   clientTracking: true
// });

// console.log("WebSocket server created");

// let ffmpegProcess: ChildProcess | null = null;
// let isBroadcasting = false;

// const listeners = new Set<WebSocket>();
// const broadcasters = new Set<WebSocket>();

// function notifyListeners() {
//   const msg = JSON.stringify({ type: "status", broadcasting: isBroadcasting });
//   for (const ws of listeners) {
//     if (ws.readyState === WebSocket.OPEN) {
//       try {
//         ws.send(msg);
//       } catch (e) {
//         console.error("Failed to notify listener:", e);
//       }
//     }
//   }
// }

// function startFFmpeg() {
//   if (ffmpegProcess) {
//     console.log("⚠️ FFmpeg already running");
//     return;
//   }
//   console.log("🎬 Starting FFmpeg -> HLS...");
//   const streamKey = "audio";
//   const playlist = path.join(outputDir, `${streamKey}.m3u8`);
//   const segmentPattern = path.join(outputDir, `${streamKey}_%03d.ts`);
  
//   try {
//     const files = fs.readdirSync(outputDir);
//     for (const f of files) {
//       if (f.startsWith(`${streamKey}`)) {
//         fs.unlinkSync(path.join(outputDir, f));
//       }
//     }
//     console.log("🧹 Cleaned old HLS segments");
//   } catch (e) {
//     console.error("Error cleaning segments:", e);
//   }

//   console.log("Spawning FFmpeg with path:", FFMPEG_PATH);
//   try {
//     ffmpegProcess = spawn(FFMPEG_PATH, [
//       "-hide_banner",
//       "-loglevel", "level+info",
//       "-f", "webm",
//       "-i", "pipe:0",
//       "-vn",
//       "-acodec", "aac",
//       "-b:a", "128k",
//       "-ar", "48000",
//       "-ac", "2",
//       "-f", "hls",
//       "-hls_time", "2",
//       "-hls_list_size", "3",
//       "-hls_flags", "delete_segments+append_list+discont_start",
//       "-hls_segment_type", "mpegts",
//       "-hls_segment_filename", segmentPattern,
//       "-hls_allow_cache", "0", 
//       "-hls_start_number_source", "epoch",
//       playlist,
//     ], { stdio: ["pipe", "inherit", "pipe"] });
//     console.log("✅ FFmpeg process spawned, PID:", ffmpegProcess.pid);
//   } catch (e) {
//     console.error("❌ Failed to spawn FFmpeg:", e);
//     ffmpegProcess = null;
//     return;
//   }
  

//   pusher.trigger("live-stream", "broadcast-started", {
//     message: "Live stream has started!",
//     timestamp: new Date().toISOString(),
//   }).then(() => {
//     console.log("📡 Pusher event: broadcast-started");
//   }).catch((err) => {
//     console.error("❌ Failed to send Pusher event:", err);
//   });


//   if (ffmpegProcess.stderr) {
//     ffmpegProcess.stderr.on("data", (buf) => {
//       const line = buf.toString();
//       if (line.includes("Opening") || line.includes("error") || line.includes("Error")) {
//         console.log("[FFmpeg]", line.trim());
//       }
//     });
//   }
  
//   ffmpegProcess.on("error", (err) => {
//     console.error("❌ FFmpeg process error:", err);
//     ffmpegProcess = null;
//     isBroadcasting = false;
//     notifyListeners();
//   });
  
//   ffmpegProcess.on("close", (code, sig) => {
//     console.log(`FFmpeg exited code=${code} sig=${sig}`);
//     ffmpegProcess = null;
//     isBroadcasting = false;
//     notifyListeners();
//   });
  
//   // ADD THIS: Wait for first segment to be created before notifying listeners
//   let firstSegmentCreated = false;
//   const checkForFirstSegment = () => {
//     if (firstSegmentCreated) return;
    
//     try {
//       if (fs.existsSync(playlist)) {
//         const playlistContent = fs.readFileSync(playlist, 'utf8');
//         if (playlistContent.includes('.ts')) {
//           console.log("✅ First HLS segment created, notifying listeners");
//           firstSegmentCreated = true;
//           isBroadcasting = true;
//           notifyListeners();
//         }
//       }
//     } catch (e) {
//       // Ignore errors, will retry
//     }
    
//     if (!firstSegmentCreated) {
//       setTimeout(checkForFirstSegment, 500); // Check every 500ms
//     }
//   };
  
//   // Start checking for first segment after a short delay
//   setTimeout(checkForFirstSegment, 1000);
//   console.log("✅ Broadcasting started (waiting for first segment)");
// }
// function stopFFmpeg() {
//   if (!ffmpegProcess) return;
//   console.log("⏹️ Stopping FFmpeg...");
//   try {
//     if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
//       ffmpegProcess.stdin.end();
//     }
//   } catch (e) {
//     console.error("Error closing stdin:", e);
//   }
//   setTimeout(() => {
//     try { 
//       if (ffmpegProcess) {
//         ffmpegProcess.kill("SIGINT");
//       }
//     } catch (e) {
//       console.error("Error killing FFmpeg:", e);
//     }
//   }, 200);
//   ffmpegProcess = null;
//   isBroadcasting = false;
//   notifyListeners();

//   pusher.trigger("live-stream", "broadcast-stopped", {
//     message: "Live stream has stopped!",
//     timestamp: new Date().toISOString(),
//   }).then(() => {
//     console.log("📡 Pusher event: broadcast-stopped");
//   }).catch((err) => {
//     console.error("❌ Failed to send Pusher event:", err);
//   });
// }

// wss.on("connection", (ws, req) => {
//   const host = req.headers.host || "localhost";
//   const url = new URL(req.url || "/", `http://${host}`);
//   const role = url.searchParams.get("role");
//   const ip = req.socket.remoteAddress;

//   console.log(`🔌 WebSocket connection - Role: ${role}, IP: ${ip}`);
//   if (role === "broadcaster") {
//     console.log("🎙️ Broadcaster connected");
//     broadcasters.add(ws);
//     ws.send(JSON.stringify({ 
//       type: "connected", 
//       role: "broadcaster",
//       broadcasting: isBroadcasting 
//     }));
//     ws.on("message", (data, isBinary) => {
//       try {
//         if (!isBinary) {
//           const text = data.toString("utf8");
//           if (text.startsWith("{")) {
//             const msg = JSON.parse(text);
//             console.log("📨 Broadcaster message:", msg.type);
//             if (msg.type === "start") startFFmpeg();
//             if (msg.type === "stop") stopFFmpeg();
//             return;
//           }
//         }
//         // if (ffmpegProcess && ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
//         //   ffmpegProcess.stdin.write(data);
//         // }
//         if (ffmpegProcess && ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
//           ffmpegProcess.stdin.write(data);
    
//           // Notify listeners via Pusher about incoming data
//           pusher.trigger("live-stream", "stream-data", {
//             message: "New stream data received",
//             timestamp: new Date().toISOString(),
//           }).then(() => {
//             console.log("📡 Pusher event: stream-data");
//           }).catch((err) => {
//             console.error("❌ Failed to send Pusher event:", err);
//           });
//         }
//       } catch (e) {
//         console.error("Broadcaster message error:", e);
//       }
//     });
//     ws.on("close", () => {
//       console.log("👋 Broadcaster disconnected");
//       broadcasters.delete(ws);
//       if (broadcasters.size === 0) {
//         stopFFmpeg();
//       }
//     });
//   } else {
//     console.log("👂 Listener connected");
//     listeners.add(ws);
//     ws.send(JSON.stringify({ type: "status", broadcasting: isBroadcasting }));
//     ws.on("close", () => {
//       listeners.delete(ws);
//       console.log("👋 Listener disconnected");
//     });
//   }
//   ws.on("error", (err) => {
//     console.error("❌ WS error:", err);
//     broadcasters.delete(ws);
//     listeners.delete(ws);
//   });
// });

// wss.on("listening", () => {
//   console.log("✅ WebSocket server is listening");
// });
// wss.on("error", (err) => {
//   console.error("❌ WebSocket server error:", err);
// });

// process.on("SIGINT", () => {
//   console.log("🛑 Shutting down...");
//   stopFFmpeg();
//   server.close(() => process.exit(0));
// });

// process.on("SIGTERM", () => {
//   console.log("🛑 SIGTERM received, shutting down...");
//   stopFFmpeg();
//   server.close(() => process.exit(0));
// });
// process.on("uncaughtException", (err) => {
//   console.error("❌ Uncaught exception:", err);
// });
// process.on("unhandledRejection", (reason, promise) => {
//   console.error("❌ Unhandled rejection at:", promise, "reason:", reason);
// });

// console.log("✅ Server initialization complete");

import Pusher from "pusher";
import dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import cors from "cors";
import express from "express";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

dotenv.config();

// Initialize Pusher with validation
console.log("📡 Pusher Configuration:");
console.log("- App ID:", process.env.PUSHER_APP_ID ? "✓" : "✗ MISSING");
console.log("- Key:", process.env.PUSHER_KEY ? "✓" : "✗ MISSING");
console.log("- Secret:", process.env.PUSHER_SECRET_KEY ? "✓" : "✗ MISSING");
console.log("- Cluster:", process.env.PUSHER_CLUSTER || "mt1");

if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET_KEY) {
  console.error("❌ PUSHER CREDENTIALS MISSING - Events will not be sent!");
}

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET_KEY || "",
  cluster: process.env.PUSHER_CLUSTER || "mt1",
  useTLS: true,
});

// LOGGING
console.log("🚀 SERVER STARTING...");
console.log("Node version:", process.version);

try {
  const ffmpegPath = execSync("which ffmpeg").toString().trim();
  console.log("🟢 FFmpeg is installed at:", ffmpegPath);
} catch (err) {
  console.error("🔴 FFmpeg not found in PATH");
}

const PORT = Number(process.env.PORT) || 8082;
const FFMPEG_PATH = process.env.FFMPEG_PATH || '/usr/bin/ffmpeg';
console.log("Port:", PORT);
console.log("FFmpeg path:", FFMPEG_PATH);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "hls");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log("Created HLS output directory:", outputDir);
}

const app = express();
app.use(cors({ origin: "*", credentials: true }));

app.use("/hls", express.static(outputDir, {
  setHeaders: (res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
  },
}));

app.get("/test-pusher", async (req, res) => {
  console.log("🧪 Testing Pusher connection...");
  try {
    const result = await pusher.trigger("live-stream", "test-event", {
      message: "Test event from server",
      timestamp: new Date().toISOString(),
    });
    
    console.log("✅ Pusher test successful:", result);
    res.json({ 
      success: true, 
      message: "Pusher event sent successfully",
      result: result 
    });
  } catch (err: any) {
    console.error("❌ Pusher test failed:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      details: err.body || err.toString()
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    broadcasting: isBroadcasting,
    broadcasters: broadcasters.size,
    listeners: listeners.size,
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const wsProtocol = protocol === 'https' ? 'wss' : 'ws';
  const host = req.headers.host;
  
  res.json({ 
    status: "Audio Streaming Server",
    port: PORT,
    endpoints: {
      ws: `${wsProtocol}://${host}/?role=broadcaster`,
      hls: `${protocol}://${host}/hls/audio.m3u8`,
      health: `${protocol}://${host}/health`
    }
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ HTTP server listening on http://0.0.0.0:${PORT}`);
  console.log(`📡 WebSocket available at ws://0.0.0.0:${PORT}`);
});

const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false,
  clientTracking: true
});

let ffmpegProcess: ChildProcess | null = null;
let isBroadcasting = false;

const listeners = new Set<WebSocket>();
const broadcasters = new Set<WebSocket>();

function notifyListeners() {
  const msg = JSON.stringify({ type: "status", broadcasting: isBroadcasting });
  for (const ws of listeners) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(msg);
      } catch (e) {
        console.error("Failed to notify listener:", e);
      }
    }
  }
}

async function triggerPusherEvent(event: string, data: any) {
  console.log(`📤 Attempting to send Pusher event: ${event}`);
  console.log(`   Channel: live-stream`);
  console.log(`   Data:`, JSON.stringify(data, null, 2));
  
  try {
    const response = await pusher.trigger("live-stream", event, data);
    console.log(`✅ Pusher event sent successfully: ${event}`);
    console.log(`   Response:`, response);
    return response;
  } catch (err: any) {
    console.error(`❌ Failed to send Pusher event (${event}):`, err);
    console.error(`   Error details:`, {
      message: err.message,
      status: err.status,
      body: err.body,
    });
    throw err;
  }
}

function startFFmpeg() {
  if (ffmpegProcess) {
    console.log("⚠️ FFmpeg already running");
    return;
  }
  
  console.log("🎬 Starting FFmpeg -> HLS...");
  const streamKey = "audio";
  const playlist = path.join(outputDir, `${streamKey}.m3u8`);
  const segmentPattern = path.join(outputDir, `${streamKey}_%03d.ts`);
  
  // Clean old segments
  try {
    const files = fs.readdirSync(outputDir);
    for (const f of files) {
      if (f.startsWith(`${streamKey}`)) {
        fs.unlinkSync(path.join(outputDir, f));
      }
    }
    console.log("🧹 Cleaned old HLS segments");
  } catch (e) {
    console.error("Error cleaning segments:", e);
  }

  // Spawn FFmpeg process
  try {
    ffmpegProcess = spawn(FFMPEG_PATH, [
      "-hide_banner",
      "-loglevel", "level+info",
      "-f", "webm",
      "-i", "pipe:0",
      "-vn",
      "-acodec", "aac",
      "-b:a", "128k",
      "-ar", "48000",
      "-ac", "2",
      "-f", "hls",
      "-hls_time", "2",
      "-hls_list_size", "3",
      "-hls_flags", "delete_segments+append_list+discont_start",
      "-hls_segment_type", "mpegts",
      "-hls_segment_filename", segmentPattern,
      "-hls_allow_cache", "0", 
      "-hls_start_number_source", "epoch",
      playlist,
    ], { stdio: ["pipe", "inherit", "pipe"] });
    
    console.log("✅ FFmpeg process spawned, PID:", ffmpegProcess.pid);
  } catch (e) {
    console.error("❌ Failed to spawn FFmpeg:", e);
    ffmpegProcess = null;
    return;
  }

  // 🔔 PUSHER: Broadcast started
  triggerPusherEvent("broadcast-started", {
    message: "Live stream has started!",
    timestamp: new Date().toISOString(),
  });

  if (ffmpegProcess.stderr) {
    ffmpegProcess.stderr.on("data", (buf) => {
      const line = buf.toString();
      if (line.includes("Opening") || line.includes("error")) {
        console.log("[FFmpeg]", line.trim());
      }
    });
  }
  
  ffmpegProcess.on("error", (err) => {
    console.error("❌ FFmpeg process error:", err);
    ffmpegProcess = null;
    isBroadcasting = false;
    notifyListeners();
    triggerPusherEvent("broadcast-error", {
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  });
  
  ffmpegProcess.on("close", (code, sig) => {
    console.log(`FFmpeg exited code=${code} sig=${sig}`);
    ffmpegProcess = null;
    isBroadcasting = false;
    notifyListeners();
  });
  
  // Wait for first segment before notifying
  let firstSegmentCreated = false;
  const checkForFirstSegment = () => {
    if (firstSegmentCreated) return;
    
    try {
      if (fs.existsSync(playlist)) {
        const playlistContent = fs.readFileSync(playlist, 'utf8');
        if (playlistContent.includes('.ts')) {
          console.log("✅ First HLS segment created");
          firstSegmentCreated = true;
          isBroadcasting = true;
          notifyListeners();
          triggerPusherEvent("stream-ready", {
            message: "Stream is ready for playback",
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      // Retry
    }
    
    if (!firstSegmentCreated) {
      setTimeout(checkForFirstSegment, 500);
    }
  };
  
  setTimeout(checkForFirstSegment, 1000);
}

function stopFFmpeg() {
  if (!ffmpegProcess) return;
  
  console.log("⏹️ Stopping FFmpeg...");
  
  try {
    if (ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
      ffmpegProcess.stdin.end();
    }
  } catch (e) {
    console.error("Error closing stdin:", e);
  }
  
  setTimeout(() => {
    try { 
      if (ffmpegProcess) {
        ffmpegProcess.kill("SIGINT");
      }
    } catch (e) {
      console.error("Error killing FFmpeg:", e);
    }
  }, 200);
  
  ffmpegProcess = null;
  isBroadcasting = false;
  notifyListeners();

  // 🔔 PUSHER: Broadcast stopped
  triggerPusherEvent("broadcast-stopped", {
    message: "Live stream has stopped!",
    timestamp: new Date().toISOString(),
  });
}

wss.on("connection", (ws, req) => {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);
  const role = url.searchParams.get("role");

  console.log(`🔌 WebSocket connection - Role: ${role}`);
  
  if (role === "broadcaster") {
    console.log("🎙️ Broadcaster connected");
    broadcasters.add(ws);
    
    ws.send(JSON.stringify({ 
      type: "connected", 
      role: "broadcaster",
      broadcasting: isBroadcasting 
    }));

    triggerPusherEvent("broadcaster-connected", {
      message: "A broadcaster has connected",
      totalBroadcasters: broadcasters.size,
      timestamp: new Date().toISOString(),
    });
    
    ws.on("message", (data, isBinary) => {
      try {
        if (!isBinary) {
          const text = data.toString("utf8");
          if (text.startsWith("{")) {
            const msg = JSON.parse(text);
            console.log("📨 Broadcaster message:", msg.type);
            if (msg.type === "start") startFFmpeg();
            if (msg.type === "stop") stopFFmpeg();
            return;
          }
        }
        
        // Send audio data to FFmpeg
        if (ffmpegProcess && ffmpegProcess.stdin && !ffmpegProcess.stdin.destroyed) {
          ffmpegProcess.stdin.write(data);
        }
      } catch (e) {
        console.error("Broadcaster message error:", e);
      }
    });
    
    ws.on("close", () => {
      console.log("👋 Broadcaster disconnected");
      broadcasters.delete(ws);
      
      triggerPusherEvent("broadcaster-disconnected", {
        message: "A broadcaster has disconnected",
        totalBroadcasters: broadcasters.size,
        timestamp: new Date().toISOString(),
      });

      if (broadcasters.size === 0) {
        stopFFmpeg();
      }
    });
  } else {
    console.log("👂 Listener connected");
    listeners.add(ws);
    ws.send(JSON.stringify({ type: "status", broadcasting: isBroadcasting }));

    triggerPusherEvent("listener-connected", {
      message: "A listener has connected",
      totalListeners: listeners.size,
      timestamp: new Date().toISOString(),
    });
    
    ws.on("close", () => {
      listeners.delete(ws);
      console.log("👋 Listener disconnected");
      
      triggerPusherEvent("listener-disconnected", {
        message: "A listener has disconnected",
        totalListeners: listeners.size,
        timestamp: new Date().toISOString(),
      });
    });
  }
  
  ws.on("error", (err) => {
    console.error("❌ WS error:", err);
    broadcasters.delete(ws);
    listeners.delete(ws);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 Shutting down...");
  stopFFmpeg();
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received...");
  stopFFmpeg();
  server.close(() => process.exit(0));
});

console.log("✅ Server initialization complete");