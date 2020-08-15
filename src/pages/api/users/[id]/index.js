import db from '../../../../db'
import { Op } from 'sequelize'
import getUser from '../../../../utils/getUser'
import auth from '../../../../utils/auth'

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (typeof req.query.id !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Get user
  const u = await getUser(req.query.id)
  if (!u) return res.status(404).json({ err: 'missingResource' })

  // Response
  res.json({
    id: u.user.id,
    alles: !!u.alles,
    name: u.user.name,
    tag: u.alles ? u.user.tag : '0000',
    plus: u.alles ? u.user.plus : false,
    nickname: u.alles ? u.user.nickname : u.user.name,
    avatar: u.alles ? null : u.user.avatar,
    createdAt: u.user.createdAt,
    xp: u.alles ? u.user.xp : null,
    posts: {
      recent: (
        await db.Post.findAll({
          where: {
            author: u.user.id,
            parentId: null
          },
          attributes: ['id'],
          order: [['createdAt', 'DESC']],
          limit: 20
        })
      ).map(p => p.id),
      count: await db.Post.count({
        where: {
          author: u.user.id,
          parentId: null
        }
      }),
      replies: await db.Post.count({
        where: {
          author: u.user.id,
          parentId: {
            [Op.not]: null
          }
        }
      })
    },
    followers: {
      count: await db.Follower.count({
        where: {
          following: u.user.id
        }
      }),
      me: user ? !!(await db.Follower.findOne({
        where: {
          following: u.user.id,
          user: user.id
        }
      })) : null
    },
    following: {
      count: await db.Follower.count({
        where: {
          user: u.user.id
        }
      }),
      me: user ? !!(await db.Follower.findOne({
        where: {
          following: user.id,
          user: u.user.id
        }
      })) : null
    }
  })
}
