import express from "express";
import {
    likeWisata,
    deleteLikeWisata,
    getByIdUser
} from "../controllers/Like.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/like', verifyToken, likeWisata);
router.get('/like/:userId', verifyToken, getByIdUser);
router.delete('/dislike', verifyToken, deleteLikeWisata);


export default router;