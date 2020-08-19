import { DataTypes } from "sequelize";

export default (db) => {
  db.Post = db.define(
    "post",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
      },
      author: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
      updatedAt: false,
    }
  );

  // Reply Association
  db.Post.hasMany(db.Post, {
    foreignKey: "parentId",
    as: "children",
  });
  db.Post.belongsTo(db.Post, {
    as: "parent",
  });
};
