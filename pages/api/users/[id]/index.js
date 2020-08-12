import db from '../../../../db'
import getUser from "../../../../utils/getUser";
import { useImperativeHandle } from 'react';

export default async (req, res) => {
  if (typeof req.query.id !== "string") return res.status(400).json({ err: 'badRequest' })

  // Declare user
  let user;

  // Check for Alles user
  try {
      user = await getUser(req.query.id);
      user.alles = true;
  } catch (err) {}

  // Check database for non-Alles user
  if (!user) {
    try {
      user = await db.User.findOne({
        where: {
          id: req.query.id
        }
      });
    } catch (err) {}
  }

  // Missing user
  if (!user) return res.status(404).json({err: "missingResource"});

  // Response
  res.json({
    id: user.id,
    alles: !!user.alles,
    name: user.name,
    tag: user.alles ? user.tag : "0000",
    nickname: user.alles ? user.nickname : user.name,
    avatar: user.alles ? null : user.avatar,
    createdAt: user.createdAt,
    xp: user.alles ? user.xp : null
  })
}
