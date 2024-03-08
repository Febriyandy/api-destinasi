import { DataTypes } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';
import Wisata from './dataWisataModel.js'; 

const Like = db.define('Like', {
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
});

Users.hasMany(Like);
Wisata.hasMany(Like);
Like.belongsTo(Users, { foreignKey: 'userId', allowNull: false });
Like.belongsTo(Wisata, { foreignKey: 'wisataId', allowNull: false });

export default Like;
