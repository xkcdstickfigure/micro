import db from "../../db";
import auth from "../../utils/auth";
import getUser from "../../utils/getUser";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Response
  res.json({
    count: await db.Follower.count({
      where: {
        user: user.id,
      },
    }),
    users: (
      await Promise.all(
        (
          await db.Follower.findAll({
            where: {
              user: user.id,
            },
            attributes: ["following"],
            order: [["createdAt", "DESC"]],
            limit: 100,
          })
        ).map(async (f) => {
          const u = await getUser(f.following);
          return (
            u && {
              id: u.id,
              name: u.name,
              tag: u.tag,
            }
          );
        })
      )
    ).filter((f) => !!f),
  });
};
