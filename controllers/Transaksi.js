import Transaksi from '../models/transaksiModel.js';
import PaketWisata from '../models/pakeWisataModel.js';
import Midtrans from "midtrans-client";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();
let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY  
})


export const createTransaction = async (req, res) => {
  try {
    const {
      nama_pengguna,
      email,
      nama_paket,
      tanggal_berwisata,
      jumlah_orang,
      no_wa,
      paketId,
      gross_amount,
      hargaPerOrang,
      userId,
    } = req.body;

    const orderId = `DESTINASYIK${paketId}${uuidv4()}`;
    const productId = `DESTINASYIK${paketId}`;

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: gross_amount
      },
      item_details: {
        id: productId,
        name: nama_paket,
        price: hargaPerOrang,
        quantity: jumlah_orang
      },
      customer_details: {
        first_name: nama_pengguna,
        email: email,
        phone: no_wa
      },
      callbacks: {
        transaction_status: {
          success: `${process.env.FRONT_END_URL}/callback/success`,
          pending: `${process.env.FRONT_END_URL}/callback/pending`,
          failure: `${process.env.FRONT_END_URL}/callback/failure`,
        },
      },
    };

    const token = await snap.createTransaction(parameter)
    console.log('Token:', token)

    const paket = await PaketWisata.findByPk(paketId);

    if (!paket) {
      return res.status(404).json({ msg: 'Data Paket wisata tidak ditemukan' });
    }

    if (!paketId) {
      return res.status(400).json({ msg: 'Paket ID tidak valid' });
    }

    const response = await Transaksi.create({
      Order_Id: orderId,
      total_harga: gross_amount,
      nama_pengguna: nama_pengguna,
      email: email,
      nama_paket: nama_paket,
      tanggal_berwisata: tanggal_berwisata,
      jumlah_orang: jumlah_orang,
      no_wa: no_wa,
      snap_token: token.token,
      snap_redirect_url: token.redirect_url,
      paketId: paketId,
      userId: userId,
      status_pembayaran: 'Pending',
    });

    res.status(201).json({ msg: 'Simpan Transaksi Berhasil', token, response });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

export const getStatus = async (req, res) => {
  try {
    const { orderId } = req.params; 
    const statusResponse = await snap.transaction.status(orderId);

    let statusDatabase;
    if (statusResponse.transaction_status === 'settlement') {
      statusDatabase = 'Sukses';
    } else if (statusResponse.transaction_status === 'pending') {
      statusDatabase = 'Pending';
    } else if (statusResponse.transaction_status === 'cancel') {
      statusDatabase = 'Gagal';
    } else {
      statusDatabase = 'lainnya';
    }

    await Transaksi.update({ status_pembayaran: statusDatabase }, { where: { Order_Id: orderId } });

    res.json(statusResponse);
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getTransaksi = async (req, res) => {
  try {
      const transaksi = await Transaksi.findAll();
      res.status(200).json(transaksi); 
  } catch (error) {
      console.error("Error in get transaksi:", error);
      res.status(500).json({msg: "Gagal mendapatkan data transaksi", error:error.message});
  }
};

export const getTransaksiById = async (req, res) => {
  try {
      const transaksi = await Transaksi.findOne({
        where: {
          Order_Id: req.params.orderId
        },
        include: [
          {
            model: PaketWisata,
            attributes: ['id', 'cover'],
          },
        ]
      });
      res.status(200).json(transaksi); 
  } catch (error) {
      console.error("Error in get transaksi:", error);
      res.status(500).json({msg: "Gagal mendapatkan data transaksi", error:error.message});
  }
};

export const getTransaksiByIdUser = async (req, res) => {
  try {
      const transaksi = await Transaksi.findAll({
        where: {
          userId: req.params.userId
        },
        include: [
          {
            model: PaketWisata,
            attributes: ['id', 'cover'],
          },
        ]
      });
      res.status(200).json(transaksi); 
  } catch (error) {
      console.error("Error in get transaksi:", error);
      res.status(500).json({msg: "Gagal mendapatkan data transaksi", error:error.message});
  }
};

export const deleteTransaksi = async (req, res) => {
  const transaksi = await Transaksi.findOne({
      where:{
          id: req.params.id
      }
  });
  if(!transaksi) return res.status(404).json({msg: "transaksi tidak ditemukan"});
  try {
      await Transaksi.destroy({
          where:{
              id: transaksi.id
          }
      });
      res.status(200).json({msg: "Pesan berhasil dihapus"});
  } catch (error) {
      res.status(400).json({msg:error.message});
  }
};