import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const {DataTypes} = Sequelize;

const Users = db.define('users',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
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
        allowNull: true,
    },
    Alamat:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    Jenis_Kelamin:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    foto:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    nama_foto:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName: true
});

export default Users;