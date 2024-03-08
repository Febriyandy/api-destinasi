import express from "express";
import {
    getKontak,
    createKontak,
    deleteKontak
} from "../controllers/Kontak.js"
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get('/kontak',verifyToken, getKontak);
router.post('/kontak',verifyToken, createKontak);
router.delete('/kontak/:id', deleteKontak);

export default router;