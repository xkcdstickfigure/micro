import { DataTypes } from "sequelize";

export default (db) => {
  db.Ping = db.define(
    "ping",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      user: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      updatedAt: false,
    }
  );
};
