import auth from "../../../utils/auth";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Response
  res.json({
    tag: "BlackLivesMatter"
  });
};
