import axios from 'axios'
const { NEXUS_ID, NEXUS_SECRET, NEXUS_URI } = process.env

export default async (req, res) => {
  const token = req.cookies.sessionToken
  if (!token) return res.status(401).send({ err: 'badAuthorization' })

  try {
    // Get session from token
    const session = (await axios.post(`${NEXUS_URI}/sessions/token`, {
      token
    }, {
      auth: {
        username: NEXUS_ID,
        password: NEXUS_SECRET
      }
    }
    )).data

    // Get user by id
    const user = (await axios.get(`${NEXUS_URI}/users/${session.user}`, {
      auth: {
        username: NEXUS_ID,
        password: NEXUS_SECRET
      }
    })).data

    // Response
    res.json(user)
  } catch (err) {
    res.status(500).send({ err: 'internalError' })
  }
}
