import db from "../../../db";

export default async (req, res) => {
  if (typeof req.query.name !== "string")
    return res.status(400).json({ err: "badRequest" });

  res.json(
    await db.Alias.findOne({
      where: {
        name: req.query.name,
      },
    })
  );
};
