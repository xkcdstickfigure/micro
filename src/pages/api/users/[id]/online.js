import db from '../../../../db'
import { Op } from 'sequelize'
import getUser from '../../../../utils/getUser'

export default async (req, res) => {
  if (typeof req.query.id !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Get user
  const u = await getUser(req.query.id)
  if (!u) return res.status(404).json({ err: 'missingResource' })

  // Count recent pings
  const recent = await db.Ping.count({
    where: {
      user: u.user.id,
      createdAt: {
        [Op.gte]: new Date().getTime() - 1000 * 60
      }
    }
  })

  // Response
  res.send({ online: recent > 0 })
}
