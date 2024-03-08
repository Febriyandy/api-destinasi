import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';
import Wisata from './dataWisataModel.js';

const Ulasan = db.define('ulasan', {
    bintang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      ulasan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
      },
      wisataId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
      },
}, {
    freezeTableName: true,
});

Users.hasMany(Ulasan);
Wisata.hasMany(Ulasan);
Ulasan.belongsTo(Users, { foreignKey: 'userId', allowNull: false });
Ulasan.belongsTo(Wisata, { foreignKey: 'wisataId', allowNull: false });

export default Ulasan;