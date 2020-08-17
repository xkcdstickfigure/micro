import { useUser } from '../../utils/userContext'
import Page from '../../components/Page'
import PostField from '../../components/PostField'
import Post from '../../components/Post'
import { withRouter } from 'next/router'
import { Box, Breadcrumb, Avatar } from '@reactants/ui'
import axios from 'axios'
import NotFound from '../404'

const UserPage = withRouter(({ user: u }) => {
  return u ? (
    <Page
      title={u.name}
      breadcrumbs={(
        <Breadcrumb.Item>
          <Avatar
            {...(
              u.alles ? {
                id: u.id
              } : u.avatar ? {
                src: `https://fs.alles.cx/${u.avatar}`
              } : {
                id: '_'
              }
            )}
            size={25}
          />
        </Breadcrumb.Item>
      )}
    >
      <Box>
        <Box.Content>
          <div className='flex justify-center'>
            <Avatar
              {...(
                u.alles ? {
                  id: u.id
                } : u.avatar ? {
                  src: `https://fs.alles.cx/${u.avatar}`
                } : {
                  id: '_'
                }
              )}
              size={200}
            />
          </div>

          <h1 className='text-center text-3xl font-medium mt-2'>
            {u.name}
            {u.alles ? <span className='text-primary text-sm'>#{u.tag}</span> : <></>}
          </h1>

          {u.nickname !== u.name ? <h2 className='text-center text-xl italic'>{u.nickname}</h2> : <></>}
        </Box.Content>
      </Box>
    </Page>
  ) : <NotFound />
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
