import { useUser } from '../../utils/userContext'
import Page from '../../components/Page'
import PostField from '../../components/PostField'
import Post from '../../components/Post'
import { withRouter } from 'next/router'
import { Breadcrumb, Avatar } from '@reactants/ui'
import axios from 'axios'

const UserPage = withRouter(({ u: user }) => {
  return (
    <Page />
  )
})

UserPage.getInitialProps = async ctx => {
  try {
    return {
      user: (await axios.get(
                `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/${encodeURIComponent(ctx.query.id)}`,
                {
                  headers: ctx.req && ctx.req.headers.cookie ? {
                    cookie: ctx.req.headers.cookie
                  } : {}
                }
      )).data
    }
  } catch (err) {
    if (ctx.res) ctx.res.statusCode = 404
    return {
      user: null
    }
  }
}

export default UserPage
