import db from "../../../../db";
import { Op } from "sequelize";
import getUser from "../../../../utils/getUser";
import auth from "../../../../utils/auth";

export default async (req, res) => {
  const user = await auth(req);
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get user
  const u = await getUser(req.query.id);
  if (!u) return res.status(404).json({ err: "missingResource" });

  // Response
  res.json({
    id: u.id,
    name: u.name,
    tag: u.tag,
    plus: u.plus,
    nickname: u.nickname,
    createdAt: u.createdAt,
    xp: u.xp,
    posts: {
      recent: (
        await db.Post.findAll({
          where: {
            author: u.id,
            parentId: null,
          },
          attributes: ["id"],
          order: [["createdAt", "DESC"]],
          limit: 20,
        })
      ).map((p) => p.id),
      count: await db.Post.count({
        where: {
          author: u.id,
          parentId: null,
        },
      }),
      replies: await db.Post.count({
        where: {
          author: u.id,
          parentId: {
            [Op.not]: null,
          },
        },
      }),
    },
    followers: {
      count: await db.Follower.count({
        where: {
          following: u.id,
        },
      }),
      me: user
        ? !!(await db.Follower.findOne({
            where: {
              following: u.id,
              user: user.id,
            },
          }))
        : null,
    },
    following: {
      count: await db.Follower.count({
        where: {
          user: u.id,
        },
      }),
      me: user
        ? !!(await db.Follower.findOne({
            where: {
              following: user.id,
              user: u.id,
            },
          }))
        : null,
    },
  });
};
