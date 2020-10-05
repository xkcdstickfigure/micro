import auth from "../../../utils/auth";
import axios from "axios";

export default async (req, res) => {
  const user = await auth(req);
  if (!user) return res.status(401).send({ err: "badAuthorization" });

  // Split Name#tag
  const { nt } = req.query;
  if (typeof nt !== "string")
    return res.status(404).json({ err: "badRequest" });
  const name = nt.trim().split("#")[0];
  const tag = nt.trim().split("#")[1];

  // Get results
  let users;
  try {
    if (tag.length !== 4) throw Error();
    users = [await searchUsers(name, tag)];
  } catch (err) {
    try {
      users = await searchUsers(name);
    } catch (err) {
      users = [];
    }
  }

  // Response
  res.json({
    users,
  });
};

const searchUsers = async (name, tag) =>
  (
    await axios.get(
      `${process.env.NEXUS_URI}/nametag?name=${encodeURIComponent(name)}${
        tag ? `&tag=${encodeURIComponent(tag)}` : ``
      }`,
      {
        auth: {
          username: process.env.NEXUS_ID,
          password: process.env.NEXUS_SECRET,
        },
      }
    )
  ).data;
