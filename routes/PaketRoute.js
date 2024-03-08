import express from "express";
import {
    createPaketWisata,
    updatePaketWisata,
    deletePaketWisata,
    getPaketWisata,
    getPaketWisataById,
    getPaket1Day,
    getPaket2Day,
    getPaket3Day
} from "../controllers/PaketWisata.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/paket',verifyToken, createPaketWisata);
router.patch('/paket/:id',verifyToken, updatePaketWisata);
router.delete('/paket/:id',verifyToken, deletePaketWisata);
router.get('/paket',verifyToken, getPaketWisata);
router.get('/paket/:id',verifyToken, getPaketWisataById);
router.get('/paket1day',verifyToken, getPaket1Day);
router.get('/paket2day',verifyToken, getPaket2Day);
router.get('/paket3day',verifyToken, getPaket3Day); 

export default router;