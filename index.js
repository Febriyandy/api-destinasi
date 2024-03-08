import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import FileUpload from "express-fileupload";
import UserRoute from "./routes/UserRoute.js";
import KontakRoute from "./routes/KontakRoute.js";
import Wisata from "./routes/WisataRoute.js";
import UlasanRoute from "./routes/UlasanRoute.js";
import LikeRoute from "./routes/LikeRoute.js";
import PaketRoute from "./routes/PaketRoute.js";
import TransaksiRoute from "./routes/TransaksiRoute.js";
import Profil from "./models/transaksiModel.js";

dotenv.config();
const app = express();
const PORT = process.env.APP_PORT || 3000;

try {
    await db.authenticate();
    console.log('Database Connected..')
   //await Profil.sync();
} catch (error) {
    console.error(error);
}
 
app.use(cors({ credentials:true, origin: 'http://localhost:5173' }));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(UserRoute);
app.use(KontakRoute); 
app.use(UlasanRoute);
app.use(Wisata);
app.use(LikeRoute);
app.use(PaketRoute);
app.use(TransaksiRoute);

app.listen(PORT, ()=> {
    console.log('Server up and running in port ${PORT}...');
});
