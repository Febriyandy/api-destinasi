import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import PaketWisata from './pakeWisataModel.js';
import Users from './UserModel.js';

const Transaksi = db.define('transaksi', {
    Order_Id:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    total_harga:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama_pengguna:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama_paket:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    tanggal_berwisata:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    jumlah_orang:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    no_wa:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    status_pembayaran:{
        type: DataTypes.STRING,
        allowNull: true
    },
    snap_token:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    snap_redirect_url:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
},{
    freezeTableName: true
});

Users.hasMany(Transaksi);
PaketWisata.hasMany(Transaksi);
Transaksi.belongsTo(PaketWisata, {foreignKey: 'paketId', allowNull: false});
Transaksi.belongsTo(Users, {foreignKey: 'userId' , allowNull: false});

export default Transaksi;