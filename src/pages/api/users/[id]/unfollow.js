import db from "../../../../db";
import getUser from "../../../../utils/getUser";
import auth from "../../../../utils/auth";

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken);
  if (!user) return res.status(401).send({ err: "badAuthorization" });
  if (typeof req.query.id !== "string")
    return res.status(400).json({ err: "badRequest" });

  // Get user
  const u = await getUser(req.query.id);
  if (!u) return res.status(404).json({ err: "missingResource" });

  // Get follower record
  const following = await db.Follower.findOne({
    where: {
      user: user.id,
      following: u.user.id,
    },
  });
  if (!following) return res.json({});

  // Remove follower record
  await following.destroy();

  // Response
  res.json({});
};
