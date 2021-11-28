import { config } from "dotenv";
import { type } from "os";
config();
export default {
  jwtSecret: process.env.JWT_SECRET || 'somesecrettoken',
  DB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost/ionicjwttutorial',
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD
  },
  workdir: process.env.WORKDIR || "/home/user/maps",
  tippecanoe: {
    command: (type() == "Windows_NT") ? "assets/script.ps1" : "assets/script.sh",
    dir: process.env.TIPPECANOE_DIR || "/home/user/maps"
  }
};