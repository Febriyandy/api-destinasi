import DataWisata from "../models/dataWisataModel.js";
import path from "path";
import fs from "fs";

export const createDataWisata = async (req, res) => {
  const { nama_tempat, alamat, kabupaten, link_maps, deskShort, deskLong, harga } = req.body;

  try {
    let link = "";
    let namacover = "";
    let urls = [];
    let fotoNames = [];

    if (req.files && req.files.cover) { 
      const cover = Array.isArray(req.files.cover) ? req.files.cover[0] : req.files.cover;
      const coverName = cover.md5 + path.extname(cover.name);
      const url_cover = `${req.protocol}://${req.get('host')}/cover/${coverName}`;

      await cover.mv(`./public/cover/${coverName}`);
      
      link = url_cover;
      namacover = coverName; 
    }

    if (req.files && req.files.foto) {
      const fotos = Array.isArray(req.files.foto) ? req.files.foto : [req.files.foto];

      for (const foto of fotos) {
        const fotoName = foto.md5 + path.extname(foto.name);
        const url_foto = `${req.protocol}://${req.get('host')}/wisata/${fotoName}`;

        await foto.mv(`./public/wisata/${fotoName}`);

        urls.push(url_foto);
        fotoNames.push(fotoName);
      }
    }

    await DataWisata.create({
      nama_tempat: nama_tempat,
      alamat: alamat,
      kabupaten: kabupaten,
      link_maps: link_maps,
      cover: link,
      nama_cover: namacover,
      deskShort: deskShort,
      deskLong: JSON.stringify(deskLong),
      harga: JSON.stringify(harga),
      foto: JSON.stringify(urls),
      nama_foto: JSON.stringify(fotoNames),
    });

    res.status(201).json({ msg: "Wisata berhasil disimpan" });
  } catch (error) {
    console.error("Error in simpan wisata:", error);
    res.status(400).json({ msg: "Gagal melakukan simpan wisata", error: error.message });
  }
};

export const getDataWisata = async (req, res) => {
    try {
        const wisata = await DataWisata.findAll();
        res.status(200).json(wisata);
    } catch (error) {
        console.error("Error in get wisata:", error);
        res.status(500).json({ msg: "Gagal mendapatkan data wisata", error: error.message });
    }
};

export const getDataWisataById = async (req, res) => {
    try {
        const wisata = await DataWisata.findOne({
          where: {
            id: req.params.id
          }
        });
        res.status(200).json(wisata);
    } catch (error) {
        console.error("Error in get wisata:", error);
        res.status(500).json({ msg: "Gagal mendapatkan data wisata", error: error.message });
    }
};

export const updateDataWisata = async (req, res) => {
  const { nama_tempat, alamat, kabupaten, link_maps, deskShort, deskLong, harga } = req.body;

  try {
    const wisata = await DataWisata.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!wisata) {
      return res.status(404).json({ msg: "Data Wisata tidak ditemukan" });
    }

    // Hapus foto lama dari penyimpanan dan database
    if (wisata.foto) {
      const oldFotoNames = JSON.parse(wisata.nama_foto);

      for (const fotoName of oldFotoNames) {
        fs.unlinkSync(`./public/wisata/${fotoName}`);
      }
      
    }

    if (wisata.nama_cover) {
      fs.unlinkSync(`./public/cover/${wisata.nama_cover}`);
    }

    // Hapus data foto dan nama_foto lama dari database
    await wisata.update({
      foto: null,
      nama_foto: null,
    });

    // Mengupdate cover
    let link = wisata.cover;
    let namacover = wisata.nama_cover;

    if (req.files && req.files.cover) { // Change to req.files.cover
      const cover = Array.isArray(req.files.cover) ? req.files.cover[0] : req.files.cover;
      const coverName = cover.md5 + path.extname(cover.name);
      const url_cover = `${req.protocol}://${req.get('host')}/cover/${coverName}`;

      await cover.mv(`./public/cover/${coverName}`);
      
      link = url_cover; // Change to link = url_cover;
      namacover = coverName; // Change to namacover = coverName;
    }

    // Mengupdate foto baru
    let urls = [];
    let fotoNames = [];

    if (req.files && req.files.foto) {
      const fotos = Array.isArray(req.files.foto) ? req.files.foto : [req.files.foto];

      for (const foto of fotos) {
        const fotoName = foto.md5 + path.extname(foto.name);
        const url_foto = `${req.protocol}://${req.get('host')}/wisata/${fotoName}`;

        await foto.mv(`./public/wisata/${fotoName}`);

        urls.push(url_foto);
        fotoNames.push(fotoName);
      }
    }

    // Mengupdate data wisata dengan foto dan nama_foto baru
    await wisata.update({
      nama_tempat: nama_tempat,
      alamat: alamat,
      kabupaten:kabupaten,
      link_maps: link_maps,
      cover: link,
      nama_cover: namacover,
      deskShort: deskShort,
      deskLong: deskLong ? JSON.stringify(deskLong) : null,
      harga: harga ? JSON.stringify(harga) : null,
      foto: urls.length > 0 ? JSON.stringify(urls) : null,
      nama_foto: fotoNames.length > 0 ? JSON.stringify(fotoNames) : null,
    });

    res.status(200).json({ msg: "Wisata berhasil diupdate" });
  } catch (error) {
    console.error("Error in update wisata:", error);
    res.status(400).json({ msg: "Gagal melakukan update wisata", error: error.message });
  }
};

export const deleteDataWisata = async (req, res) =>{
  const wisata = await DataWisata.findOne({
    where: {
      id: req.params.id
    }
  });

  if (!wisata) {
    return res.status(404).json({ msg: "Data Wisata tidak ditemukan" });
  }

  if (wisata.foto) {
    const oldFotoNames = JSON.parse(wisata.nama_foto);

    for (const fotoName of oldFotoNames) {
      fs.unlinkSync(`./public/wisata/${fotoName}`);
    }
    
  }

  if (wisata.nama_cover) {
    fs.unlinkSync(`./public/cover/${wisata.nama_cover}`);
  }

  try {
    await DataWisata.destroy({
      where:{
        id: wisata.id
      }
    });
    res.status(200).json({msg:"Hapus Data Wisata Berhasil"});
  } catch (error) {
    res.status(400).json({msg: error.message});
  }
}


