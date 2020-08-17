import Sequelize from 'sequelize'

import user from './user'
import follower from './follower'
import post from './post'
import interaction from './interaction'
import mention from './mention'
import ping from './ping'

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
      timezone: 'Etc/GMT0'
    }
  }
)
export default db

user(db)
follower(db)
post(db)
interaction(db)
mention(db)
ping(db)

db.sync()
