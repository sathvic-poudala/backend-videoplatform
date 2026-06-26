import "./config/env.js";
import dns from "node:dns";
import {app} from "./app.js";
import http from "http";
import { initializeSocket } from "./socket/index.js";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "1.0.0.1"]);


import connectDB from "./db/index.js";


connectDB()
.then(() => {
  const server = http.createServer(app);
  initializeSocket(server)
  server.listen(process.env.PORT || 8000, () => { 
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
  });
})
.catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});