import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const {DataTypes} = Sequelize;

const Kontak = db.define('kontak',{
    nama:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    no_hp:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    perusahaan:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    pesan:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
},{
    freezeTableName: true
});

export default Kontak;