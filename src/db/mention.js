const { DataTypes } = require('sequelize')

export default db => {
  db.Mention = db.define('mention', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: false
  })

  // Post Association
  db.Post.hasMany(db.Mention)
  db.Mention.belongsTo(db.Post)
}
