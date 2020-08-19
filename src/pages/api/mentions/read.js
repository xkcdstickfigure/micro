import db from "../../../db";
import auth from "../../../utils/auth";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Update
  await db.Mention.update(
    {
      read: true,
    },
    {
      where: {
        user: user.id,
        read: false,
      },
    }
  );

  // Response
  res.json({});
};
