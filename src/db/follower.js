import { DataTypes } from 'sequelize'

export default db => {
  db.Follower = db.define(
    'follower',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false
      },
      user: {
        type: DataTypes.UUID,
        allowNull: false
      },
      following: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      paranoid: true,
      updatedAt: false
    }
  )
}
