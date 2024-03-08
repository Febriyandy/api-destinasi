import Like from "../models/LikeModel.js";
import Users from "../models/UserModel.js";
import DataWisata from "../models/dataWisataModel.js";

export const getByIdUser = async (req, res) => {
  try {
    const response = await Like.findAll({
      where: {
        userId: req.params.userId, 
      },
      include: [
        {
          model: DataWisata,
          attributes: ['id', 'nama_tempat', 'deskShort', 'cover'], 
        },
      ],
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getByIdUser:', error);
    res.status(500).json({ msg: 'Gagal mendapatkan data', error: error.message });
  }
};



export const likeWisata = async (req, res) => {
  const { userId, wisataId } = req.body;

  try {
    // Cek apakah sudah ada like dari user tersebut
    const existingLike = await Like.findOne({
      where: {
        userId: userId,
        wisataId: wisataId,
      },
    });

    if (existingLike) {
      // Jika sudah ada, hapus like (dislike)
      await existingLike.destroy();
      res.json({ msg: 'Dislike berhasil', isLikedByUser: false });
    } else {
      // Jika belum ada, tambahkan like
      await Like.create({
        userId: userId,
        wisataId: wisataId,
      });
      res.json({ msg: 'Like berhasil', isLikedByUser: true });
    }
  } catch (error) {
    console.error('Error in likeWisata:', error);
    res.status(500).json({ msg: 'Gagal melakukan like', error: error.message });
  }
};


export const deleteLikeWisata = async (req, res) => {
  const { userId, wisataId } = req.body;

  try {
    // Cek apakah sudah ada like dari user tersebut
    const existingLike = await Like.findOne({
      where: {
        userId: userId,
        wisataId: wisataId,
      },
    });

    if (existingLike) {
      // Jika sudah ada, hapus like (dislike)
      await existingLike.destroy();
      res.json({ msg: 'Dislike berhasil' });
    } else {
      res.status(400).json({ msg: 'Like tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error in deleteLikeWisata:', error);
    res.status(500).json({ msg: 'Gagal melakukan dislike', error: error.message });
  }
};

