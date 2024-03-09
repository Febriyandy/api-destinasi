import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import fs from "fs";
import path from "path";

export const Home = async(req, res) => {
    res.send('Welcome to destinasyik server!');
}

export const getUser = async(req, res) =>{
    try {
        const response = await Users.findAll({
            attributes:['uuid','id','nama','email','no_hp']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
} 

export const getUserById = async(req, res) =>{
    try {
        const response = await Users.findOne({
            attributes:['uuid','nama','email','no_hp'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async (req, res) => {
    const { nama, email, password, confPassword} = req.body;
    const role = 'user';
    const existingUser = await Users.findOne({
        where: {
            email: email
        }
    });

    if (existingUser) {
        return res.status(400).json({ msg: "Email sudah terdaftar, silakan masuk." });
    }
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ msg: "Password minimal 8 karakter dan harus terdiri dari huruf kapital, huruf kecil, dan angka." });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            nama: nama,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Register Berhasil" });
    } catch (error) {
        console.error("Error in createUser:", error);
        res.status(400).json({ msg: "Gagal melakukan registrasi", error: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        let url = user.foto; 
        let fotoName = null;

        if (req.files && req.files.foto) {
            const foto = req.files.foto;
            fotoName = foto.md5 + path.extname(foto.name);
            url = `${req.protocol}://${req.get('host')}/images/${fotoName}`;
            
            await foto.mv(`./public/images/${fotoName}`);

            if (user.nama_foto) {
                const filepath = `./public/images/${user.nama_foto}`;
                fs.unlinkSync(filepath);
            }
        }

        const { nama, email, no_hp, Alamat, Jenis_Kelamin } = req.body;

        await Users.update({
            nama: nama,
            email: email,
            no_hp: no_hp,
            Alamat: Alamat,
            Jenis_Kelamin: Jenis_Kelamin,
            foto: url,
            nama_foto: fotoName,
        }, {
            where: {
                id: user.id
            }
        });

        return res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }
       const { oldPassword, newPassword, confPassword } = req.body;

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Password lama salah" });
        }

        // Periksa apakah password baru dan konfirmasi password baru cocok
        if (newPassword !== confPassword) {
            return res.status(400).json({ msg: "Konfirmasi password baru tidak cocok" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ msg: "Password minimal 8 karakter dan harus terdiri dari huruf kapital, huruf kecil, dan angka." });
    }
        // Hash password baru
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);

        // Update password di database
        await Users.update({
            password: hashPassword,
        }, {
            where: {
                id: user.id
            }
        });

        return res.status(200).json({ msg: "Password berhasil diperbarui" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async(req, res) =>{
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await Users.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await Users.findOne({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        return res.status(400).json({ msg: "Email tidak ditemukan, silahkan daftar" });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(400).json({ msg: "Password Salah, harap coba lagi" });
      }
  
      const { id: userId, nama, role } = user;
      const accessToken = jwt.sign(
        { userId, nama, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '20s',
        }
      );
  
      const refreshToken = jwt.sign(
        { userId, nama, email, role },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '1d',
        }
      );
  
      await Users.update(
        { refresh_token: refreshToken },
        {
          where: {
            id: userId,
          },
        }
      );
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.json({ accessToken, role });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };
  
export const Logout = async (req, res) => {
    const refreshToken =req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(204);
        const userId = user[0].id;
        await Users.update({refresh_token: null}, {
            where:{
                id: userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200)
}