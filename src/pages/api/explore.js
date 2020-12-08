import db from "../../db";
import auth from "../../utils/auth";
import getUser from "../../utils/getUser";
import { Op, literal } from "sequelize";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Response
  res.json({
    users: (
      await Promise.all(
        Array.from(
          new Set(
            (
              await db.Post.findAll({
                where: {
                  createdAt: {
                    [Op.gt]: new Date().getTime() - 1000 * 60 * 60 * 24 * 7,
                  },
                },
                attributes: {
                  include: [
                    [
                      literal(
                        "(select count(*) from interactions where postId = post.id)"
                      ),
                      "interactions",
                    ],
                  ],
                },
                order: [[literal("interactions"), "DESC"]],
                limit: 20,
              })
            )
              .map((p) => p.author)
              .filter((author) => !!author)
          )
        ).map((id) => getUser(id))
      )
    )
      .filter((author) => !!author)
      .map((author) => ({
        id: author.id,
        name: author.name,
        tag: author.tag,
      })),
  });
};
