import express from "express";
import {
    createTransaction,
   getStatus,
    getTransaksi,
    getTransaksiById,
    getTransaksiByIdUser,
    deleteTransaksi
} from "../controllers/Transaksi.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/transaksi', verifyToken, createTransaction);
router.get('/transaksi/status/:orderId', getStatus);
router.get('/transaksi', verifyToken, getTransaksi);
router.get('/transaksi/:orderId', verifyToken, getTransaksiById);
router.get('/transaksiByuserId/:userId',verifyToken, getTransaksiByIdUser);
router.delete('/transaksi/:id', verifyToken, deleteTransaksi);

export default router;