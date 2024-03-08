import Ulasan from "../models/UlasanModel.js";
import Users from "../models/UserModel.js";
import Wisata from "../models/dataWisataModel.js";

export const getBywisataId = async (req, res) => {
  try {
    const response = await Ulasan.findAll({
      attributes: ['bintang', 'ulasan'],
      where: {
        wisataId: req.params.wisataId,
      },
      include: [
        {
          model: Users,
          attributes: ['nama', 'foto'],
        },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getBywisataId:', error);
    res.status(500).json({ msg: 'Gagal mendapatkan data', error: error.message });
  }
};


export const createUlasan = async (req, res) => {
    const { bintang, ulasan: isiUlasan, wisataId, userId } = req.body;
  
    try {
      const user = await Users.findByPk(userId);
      const wisata = await Wisata.findByPk(wisataId);
  
      if (!user || !wisata) {
        return res.status(404).json({ msg: 'User or Wisata not found' });
      }
  
      const ulasan = await Ulasan.create({
        bintang: bintang,
        ulasan: isiUlasan,
        userId: userId,
        wisataId: wisataId,
      });
  
      res.status(201).json({ msg: 'Ulasan berhasil dibuat', ulasan });
    } catch (error) {
      console.error('Error in createUlasan:', error);
      res.status(400).json({ msg: 'Gagal membuat ulasan', error: error.message });
    }
  };