import db from "../../db";
import { Op } from "sequelize";
import auth from "../../utils/auth";
import getAddress from "../../utils/getAddress";
import { v4 as uuid } from "uuid";

export default async (req, res) => {
  const user = await auth(req.cookies.sessionToken);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Don't add ping if already pinged recently
  const recent = await db.Ping.count({
    where: {
      user: user.id,
      createdAt: {
        [Op.gte]: new Date().getTime() - 1000 * 30,
      },
    },
  });
  if (recent > 0) return res.json({});

  // Create ping record
  await db.Ping.create({
    id: uuid(),
    user: user.id,
    address: getAddress(req),
  });

  // Response
  res.json({});
};
