import PaketWisata from "../models/pakeWisataModel.js";
import path from "path";
import fs from "fs";

export const createPaketWisata = async (req, res) => {
    const { nama_paket, lama_kegiatan, rentang_harga, destinasi, rangkaian_kegiatan, fasilitas, biaya } = req.body;
  
    try {
      let link = "";
      let namacover = "";
  
      if (req.files && req.files.cover) { 
        const cover = Array.isArray(req.files.cover) ? req.files.cover[0] : req.files.cover;
        const coverName = cover.md5 + path.extname(cover.name);
        const url_cover = `${req.protocol}://${req.get('host')}/paket/${coverName}`;
  
        await cover.mv(`./public/paket/${coverName}`);
        
        link = url_cover;
        namacover = coverName; 
      }
  
      await PaketWisata.create({
        nama_paket: nama_paket,
        lama_kegiatan: lama_kegiatan,
        rentang_harga: rentang_harga,
        destinasi: JSON.stringify(destinasi),
        rangkaian_kegiatan: JSON.stringify(rangkaian_kegiatan),
        fasilitas: JSON.stringify(fasilitas),
        biaya: JSON.stringify(biaya),
        cover: link,
        nama_cover: namacover,
      });
  
      res.status(201).json({ msg: "Paket Wisata berhasil disimpan" });
    } catch (error) {
      console.error("Error in simpan paket wisata:", error);
      res.status(400).json({ msg: "Gagal melakukan simpan paket wisata", error: error.message });
    }
  };

  export const updatePaketWisata = async (req, res) => {
    const { nama_paket, lama_kegiatan, rentang_harga, destinasi, rangkaian_kegiatan, fasilitas, biaya } = req.body;
  
    try {
        const paket = await PaketWisata.findOne({
            where:{
                id: req.params.id
            }
        })

        if (!paket) {
            return res.status(404).json({msg: "Data Paket wisata tidak ditemukan"});
        }

        if(paket.nama_cover) {
            fs.unlinkSync(`./public/paket/${paket.nama_cover}`);
        }

      let link = paket.cover;
      let namacover = paket.nama_cover;
  
      if (req.files && req.files.cover) { 
        const cover = Array.isArray(req.files.cover) ? req.files.cover[0] : req.files.cover;
        const coverName = cover.md5 + path.extname(cover.name);
        const url_cover = `${req.protocol}://${req.get('host')}/paket/${coverName}`;
  
        await cover.mv(`./public/paket/${coverName}`);
        
        link = url_cover;
        namacover = coverName; 
      }
  
      await paket.update({
        nama_paket: nama_paket,
        lama_kegiatan: lama_kegiatan,
        rentang_harga: rentang_harga,
        destinasi: destinasi ? JSON.stringify(destinasi) : null,
        rangkaian_kegiatan: rangkaian_kegiatan ? JSON.stringify(rangkaian_kegiatan) : null,
        fasilitas: fasilitas ? JSON.stringify(fasilitas) : null,
        biaya: biaya ? JSON.stringify(biaya) : null,
        cover: link,
        nama_cover: namacover,
      });
  
      res.status(201).json({ msg: "Paket Wisata berhasil diupdate" });
    } catch (error) {
      console.error("Error in update paket wisata:", error);
      res.status(400).json({ msg: "Gagal melakukan update paket wisata", error: error.message });
    }
  };

  export const deletePaketWisata = async (req, res) => {
    const paket = await PaketWisata.findOne({
        where:{
            id: req.params.id
        }
    });

    if (!paket) {
        return res.status(404).json({msg: "Data Paket wisata tidak ditemukan"});
    }

    if(paket.nama_cover) {
        fs.unlinkSync(`./public/paket/${paket.nama_cover}`);
    }

    try {
      await PaketWisata.destroy({
        where:{
            id: paket.id
        }
      })
      res.status(201).json({ msg: "Paket Wisata berhasil dihapus" });
    } catch (error) {
      console.error("Error in hapus paket wisata:", error);
      res.status(400).json({ msg: "Gagal melakukan hapus paket wisata", error: error.message });
    }
  };

  export const getPaketWisata = async (req, res) => {
    try {
        const paket = await PaketWisata.findAll();
        res.status(200).json(paket); 
    } catch (error) {
        console.error("Error in get paket:", error);
        res.status(500).json({msg: "Gagal mendapatkan data paket", error:error.message});
    }
  };

  export const getPaketWisataById = async (req, res) => {
    try {
        const paket = await PaketWisata.findOne({
          where: {
            id: req.params.id
          }
        });
        res.status(200).json(paket); 
    } catch (error) {
        console.error("Error in get paket:", error);
        res.status(500).json({msg: "Gagal mendapatkan data paket", error:error.message});
    }
  };



  export const getPaket1Day = async (req, res) =>{
    try {
        let lama_kegiatan = "1 Hari";
        const paket = await PaketWisata.findAll({
            where: {
                lama_kegiatan: lama_kegiatan
            }
        });
        res.status(200).json(paket);
    } catch (error) {
        console.error("Error in get wisata:", error);
        res.status(500).json({ msg: "Gagal mendapatkan data wisata", error: error.message });
    }
  };

  export const getPaket2Day = async (req, res) =>{
    try {
        let lama_kegiatan = "2 Hari";
        const paket = await PaketWisata.findAll({
            where: {
                lama_kegiatan: lama_kegiatan
            }
        });
        res.status(200).json(paket);
    } catch (error) {
        console.error("Error in get wisata:", error);
        res.status(500).json({ msg: "Gagal mendapatkan data wisata", error: error.message });
    }
  };
  
  export const getPaket3Day = async (req, res) =>{
    try {
        let lama_kegiatan = "3 Hari";
        const paket = await PaketWisata.findAll({
            where: {
                lama_kegiatan: lama_kegiatan
            }
        });
        res.status(200).json(paket);
    } catch (error) {
        console.error("Error in get wisata:", error);
        res.status(500).json({ msg: "Gagal mendapatkan data wisata", error: error.message });
    }
  };
  
  
