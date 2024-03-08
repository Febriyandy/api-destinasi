import express from "express";
import {
    createDataWisata,
    getDataWisata,
    getDataWisataById,
    updateDataWisata,
    deleteDataWisata
} from "../controllers/DataWisata.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/wisata',verifyToken, createDataWisata);
router.get('/wisata',verifyToken, getDataWisata);
router.get('/wisata/:id',verifyToken, getDataWisataById);
router.patch('/wisata/:id',verifyToken, updateDataWisata);
router.delete('/wisata/:id',verifyToken, deleteDataWisata);

export default router;