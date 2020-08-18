import { DataTypes } from "sequelize";

export default (db) => {
  db.Alias = db.define(
    "alias",
    {
      name: {
        primaryKey: true,
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      user: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
