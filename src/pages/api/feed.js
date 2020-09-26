import db from "../../db";
import { Op, literal } from "sequelize";
import auth from "../../utils/auth";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Before timestamp
  let before;
  if (typeof req.query.before === "string") {
    if (
      !isNaN(req.query.before) &&
      isFinite(req.query.before) &&
      Number(req.query.before) > 0
    )
      before = Number(req.query.before);
    else return res.status(400).json({ err: "badRequest" });
  }

  // Response
  return res.json({ posts: [] });
  res.json({
    posts: (
      await db.Post.findAll({
        where: {
          [Op.or]: [
            {
              author: {
                [Op.in]: literal(
                  // Yeah, I know, this doesn't look very safe but I spent hours trying to
                  // find a better solution. Sequelize doesn't seem to support replacements in
                  // literals here, and user ids will always be UUIDs, so it's good enough :/
                  `(select following from followers where user = "${user.id}" and deletedAt is null)`
                ),
              },
            },
            {
              author: user.id,
            },
          ],
          parentId: null,
          ...(before
            ? {
                createdAt: {
                  [Op.lt]: before,
                },
              }
            : {}),
        },
        attributes: ["id"],
        order: [["createdAt", "DESC"]],
        limit: 10,
      })
    ).map((p) => p.id),
  });
};
