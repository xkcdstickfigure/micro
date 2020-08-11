import { DataTypes } from 'sequelize'

export default db => {
  db.User = db.define(
    'user',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false
      },
      secret: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING
      }
    },
    {
      paranoid: true,
      updatedAt: false
    }
  )
}
