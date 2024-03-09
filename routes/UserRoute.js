import express from "express";
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser, 
    Login, Logout, updatePassword, Home
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
const router = express.Router();

router.get('/users',verifyToken, getUser);
router.get('/users/:id', verifyToken, getUserById);
router.post('/register', createUser);
router.patch('/users/:id',verifyToken, updateUser);
router.patch('/update/:id', updatePassword);
router.delete('/users/:id', verifyToken, deleteUser);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/', Home);
 
export default router;