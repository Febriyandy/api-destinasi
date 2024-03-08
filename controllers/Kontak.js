import Kontak from "../models/KontakModel.js";

export const getKontak = async (req,res) => {
    try {
        const response = await Kontak.findAll({
            attributes:['id','nama', 'email', 'no_hp', 'perusahaan', 'pesan']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});    
    }
}

export const createKontak = async (req, res) => {
    const { nama, email, no_hp, perusahaan, pesan} = req.body;
    try {
        await Kontak.create({
            nama: nama,
            email: email,
            no_hp: no_hp,
            perusahaan: perusahaan,
            pesan: pesan
        });
        res.status(201).json({msg : "Pesan Terkirim"});
    } catch (error) {
        console.error("Gagal Mengirim Pesan:", error);
        res.status(400).json({msg: "Gagal Mengirim Pesan", error: error.message});
    }
};

export const deleteKontak = async (req, res) => {
    const kontak = await Kontak.findOne({
        where:{
            id: req.params.id
        }
    });
    if(!kontak) return res.status(404).json({msg: "Kontak tidak ditemukan"});
    try {
        await Kontak.destroy({
            where:{
                id: kontak.id
            }
        });
        res.status(200).json({msg: "Pesan berhasil dihapus"});
    } catch (error) {
        res.status(400).json({msg:error.message});
    }
};