const { DataTypes } = require("sequelize");

export default (db) => {
  db.Tag = db.define(
    "tag",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  // Post Association
  db.Post.hasMany(db.Tag);
  db.Tag.belongsTo(db.Post);
};
