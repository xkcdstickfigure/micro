import db from "../../../db";
import { literal } from "sequelize";
import auth from "../../../utils/botAuth";

export default async (req, res) => {
  const bot = await auth(req);
  if (!bot) return res.status(401).send({ err: "badAuthorization" });

  // Response
  res.json({
    posts: (
      await db.Mention.findAll({
        where: {
          user: bot.id,
        },
        attributes: {
          include: [
            [
              literal("(select createdAt from posts where posts.id = postId)"),
              "createdAt",
            ],
          ],
        },
        order: [[literal("createdAt"), "DESC"]],
        limit: 500,
      })
    ).map((p) => p.postId),
  });
};
