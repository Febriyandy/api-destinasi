import { DataTypes } from 'sequelize';
import db from '../config/Database.js';

const DataWisata = db.define('dataWisata', {
    nama_tempat:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    alamat:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    kabupaten:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    link_maps:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    cover:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    nama_cover:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    deskShort:{
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    deskLong: {
        type: DataTypes.JSON(DataTypes.TEXT),
        allowNull: true,
      },
      harga: {
        type: DataTypes.JSON(DataTypes.TEXT),
        allowNull: true,
      },
      foto: {
        type: DataTypes.JSON(DataTypes.STRING),
        allowNull: true,
      },
      nama_foto: {
        type: DataTypes.JSON(DataTypes.STRING),
        allowNull: true,
      },
},{
    freezeTableName: true
});

export default DataWisata;