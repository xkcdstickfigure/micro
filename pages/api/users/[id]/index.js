import db from '../../../../db'
import { Op } from 'sequelize'
import getUser from '../../../../utils/getUser'
import auth from '../../../../utils/auth'

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken)
  if (typeof req.query.id !== 'string') return res.status(400).json({ err: 'badRequest' })

  // Declare user
  let u

  // Check for Alles user
  try {
    u = await getUser(req.query.id)
    u.alles = true
  } catch (err) {}

  // Check database for non-Alles user
  if (!u) {
    try {
      u = await db.User.findOne({
        where: {
          id: req.query.id
        }
      })
    } catch (err) {}
  }

  // Missing user
  if (!u) return res.status(404).json({ err: 'missingResource' })

  // Response
  res.json({
    id: u.id,
    alles: !!u.alles,
    name: u.name,
    tag: u.alles ? u.tag : '0000',
    plus: u.alles ? u.plus : false,
    nickname: u.alles ? u.nickname : u.name,
    avatar: u.alles ? null : u.avatar,
    createdAt: u.createdAt,
    xp: u.alles ? u.xp : null,
    posts: {
      recent: (
        await db.Post.findAll({
          where: {
            author: u.id,
            parentId: null
          },
          attributes: ['id'],
          order: [['createdAt', 'DESC']],
          limit: 20
        })
      ).map(p => p.id),
      count: await db.Post.count({
        where: {
          author: u.id,
          parentId: null
        }
      }),
      replies: await db.Post.count({
        where: {
          author: u.id,
          parentId: {
            [Op.not]: null
          }
        }
      })
    },
    followers: {
      count: await db.Follower.count({
        where: {
          following: u.id
        }
      }),
      me: user ? !!(await db.Follower.findOne({
        where: {
          following: u.id,
          user: user.id
        }
      })) : null
    },
    following: {
      count: await db.Follower.count({
        where: {
          user: u.id
        }
      }),
      me: user ? !!(await db.Follower.findOne({
        where: {
          following: user.id,
          user: u.id
        }
      })) : null
    }
  })
}
