import { config } from "dotenv";
import { type as osType } from "os";
config();
export default {
  maxUploadSize: process.env.MAX_UPLOAD_SIZE ? parseInt(process.env.MAX_UPLOAD_SIZE) : 100, // 100MB por defecto
  jwtSecret: process.env.JWT_SECRET || 'somesecrettoken',
  DB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost/ionicjwttutorial',
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD
  },
  workdir: process.env.WORKDIR || "/home/user/maps",
  tippecanoe: {
    command: (osType() == "Windows_NT") ? "assets/script.ps1" : "assets/script.sh",
    dir: process.env.TIPPECANOE_DIR || "/home/user/maps"
  },
  tileserver: {
    basePort: process.env.TILESERVER_BASE_PORT ? parseInt(process.env.TILESERVER_BASE_PORT) : 8000,
    dir: process.env.TILESERVER_DIR || "/home/user/maps/output", // Sería el lugar donde tippecanoe guarda los mbtiles ($WORKDIR/output)
    baseUrl: process.env.TILESERVER_URL || "http://localhost"
  }
};