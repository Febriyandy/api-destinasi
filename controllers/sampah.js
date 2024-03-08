import { nanoid } from 'nanoid';
import fetch from 'node-fetch';
import btoa  from 'btoa';
import Transaksi from '../models/transaksiModel.js';
import PaketWisata from '../models/pakeWisataModel.js';

export const createTransaction = async (req, res) => {
  try {
    const {
      nama_pengguna,
      email,
      nama_paket,
      tanggal_berwisata,
      jumlah_orang,
      no_wa,
      wisataId,
      lama_kegiatan,
    } = req.body;

    const paket = await PaketWisata.findByPk(wisataId);

    if (!paket) {
      return res.status(404).json({ msg: 'Data Paket wisata tidak ditemukan' });
    }

    const transaction_id = `TRX-${nanoid(4)}-${nanoid(8)}`;
    let hargaPerOrang = 0;

    if (lama_kegiatan === '1 hari') {
      if (jumlah_orang >= 2 && jumlah_orang <= 3) {
        hargaPerOrang = 400000;
      } else if (jumlah_orang >= 4 && jumlah_orang <= 6) {
        hargaPerOrang = 350000;
      } else if (jumlah_orang >= 7 && jumlah_orang <= 11) {
        hargaPerOrang = 300000;
      }
    } else if (lama_kegiatan === '2 hari') {
      if (jumlah_orang >= 2 && jumlah_orang <= 3) {
        hargaPerOrang = 600000;
      } else if (jumlah_orang >= 4 && jumlah_orang <= 6) {
        hargaPerOrang = 550000;
      } else if (jumlah_orang >= 7 && jumlah_orang <= 11) {
        hargaPerOrang = 500000;
      }
    } else if (lama_kegiatan === '3 hari') {
      if (jumlah_orang >= 2 && jumlah_orang <= 3) {
        hargaPerOrang = 800000;
      } else if (jumlah_orang >= 4 && jumlah_orang <= 6) {
        hargaPerOrang = 750000;
      } else if (jumlah_orang >= 7 && jumlah_orang <= 11) {
        hargaPerOrang = 700000;
      }
    }

    const gross_amount = hargaPerOrang * parseInt(jumlah_orang);
    const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

    const payload = {
      transaction_detail: {
        order_id: transaction_id,
        gross_amount: gross_amount,
      },
      item_details: {
        transaction_id: transaction_id,
        gross_amount: gross_amount,
        nama_pengguna: nama_pengguna,
        email: email,
        nama_paket: nama_paket,
        tanggal_berwisata: tanggal_berwisata,
        jumlah_orang: jumlah_orang,
        no_wa: no_wa,
        wisataId: wisataId,
      },
      callbacks: {
        finish: `${process.env.FRONT_END_URL}/Status_transaksi?transaction_id=${transaction_id}`,
        error: `${process.env.FRONT_END_URL}/Status_transaksi?transaction_id=${transaction_id}`,
        pending: `${process.env.FRONT_END_URL}/Status_transaksi?transaction_id=${transaction_id}`,
      },
    };

    const response = await fetch(
      'https://app.sandbox.midtrans.com/snap/v1/transactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${authString}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.status !== 201) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create transaction',
      });
    }

    await Transaksi.create({
      transaction_id: transaction_id,
      gross_amount: gross_amount,
      nama_pengguna: nama_pengguna,
      email: email,
      nama_paket: nama_paket,
      tanggal_berwisata: tanggal_berwisata,
      jumlah_orang: jumlah_orang,
      no_wa: no_wa,
      snap_token: data.token,
      snap_redirect_url: data.redirect_url,
      wisataId: wisataId,
    });

    res.json({
      status: 'success',
      data: {
        gross_amount: gross_amount,
        nama_pengguna: nama_pengguna,
        email: email,
        nama_paket: nama_paket,
        tanggal_berwisata: tanggal_berwisata,
        jumlah_orang: jumlah_orang,
        no_wa: no_wa,
        snap_token: data.token,
        snap_redirect_url: data.redirect_url,
        wisataId: wisataId,
      },
    });

    
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};


export const getTransaksi = async (req, res) => {

};

export const getTransaksiById = async (req, res) => {

};

export const updateStatusTransaksi = async (req, res) => {

};

export const getStatus = async (req, res) => {
  try {
    const orderId = "DESTINASYIK77932cb18-36b0-47fb-85e3-14e26c611ebb";
    const statusResponse = await snap.transaction.status(orderId);

    let statusDatabase;
    if (statusResponse.transaction_status === 'settlement') {
      statusDatabase = 'Sukses';
    } else if (statusResponse.transaction_status === 'pending') {
      statusDatabase = 'Pending';
    } else if (statusResponse.transaction_status === 'cancel') {
      statusDatabase = 'Gagal';
    } else {
      // Handle other status if needed
      statusDatabase = 'lainnya';
    }

    // Update the transaction status in the database
    await Transaksi.update({ status_pembayaran: statusDatabase }, { where: { Order_Id: orderId } });

    console.log('Status Transaksi:', statusResponse);
    return statusResponse;
  } catch (error) {
    console.error('Error getting transaction status:', error);
    throw error;
  }
};


export const getStatus = async (res, req) => {
  try {
    const { orderId } = req.body;
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

    console.log('Status Transaksi:', statusResponse);
    response.json(statusResponse);
    return statusResponse;
  } catch (error) {
    console.error('Error getting transaction status:', error);
    throw error;
  }
};
