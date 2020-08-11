const { DataTypes } = require('sequelize')

module.exports = db => {
  db.Interaction = db.define('interaction', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    vote: {
      type: DataTypes.ENUM('up', 'neutral', 'down'),
      defaultValue: 'neutral',
      allowNull: false
    }
  })

  // Post Association
  db.Post.hasMany(db.Interaction)
  db.Interaction.belongsTo(db.Post)
}
