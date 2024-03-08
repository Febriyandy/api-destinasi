import express from "express";
import {
    createUlasan,
    getBywisataId
} from "../controllers/Ulasan.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/ulasan', verifyToken, createUlasan);
router.get('/ulasan/:wisataId', verifyToken, getBywisataId);

export default router;