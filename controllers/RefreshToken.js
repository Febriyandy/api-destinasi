import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) =>{
    try {
        const refreshToken =req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const uuid = user[0].uuid;
            const nama = user[0].nama;
            const email = user[0].email;
            const no_hp = user[0].no_hp;
            const Alamat = user[0].Alamat;
            const Jenis_Kelamin = user[0].Jenis_Kelamin;
            const foto = user[0].foto;
            const accessToken = jwt.sign({userId, uuid, nama, email, no_hp, Alamat, Jenis_Kelamin, foto}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({accessToken});   
        })
    } catch (error) {
        
    }
}