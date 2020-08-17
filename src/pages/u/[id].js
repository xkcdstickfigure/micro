import { useUser } from '../../utils/userContext'
import Page from '../../components/Page'
import PostField from '../../components/PostField'
import Post from '../../components/Post'
import { withRouter } from 'next/router'
import { Box, Breadcrumb, Avatar } from '@reactants/ui'
import axios from 'axios'
import NotFound from '../404'

const UserPage = withRouter(({ user: u }) => {
  const user = useUser()

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
              size={150}
            />
          </div>

          <h1 className='text-center text-3xl font-medium mt-2'>
            {u.name}
            {u.alles ? <span className='text-primary text-sm'>#{u.tag}</span> : <></>}
          </h1>

          {u.nickname !== u.name ? <h2 className='text-center text-xl italic'>{u.nickname}</h2> : <></>}

          {u.plus ? <Label>Plus</Label> : <></>}
        </Box.Content>
      </Box>

      {u.alles ? (
        <Box>
          <Box.Content>
            <div className='flex'>
              <p className='flex-grow'>Level {u.xp.level}</p>
              <p className='text-right ml-5'>{u.xp.total} xp</p>
            </div>
            <div
              className='w-full h-5 mt-3 rounded-full overflow-hidden' style={{
                background: 'rgb(239,239,239)'
              }}
            >
              <div
                className='h-full bg-primary' style={{
                  width: `${u.xp.levelProgress * 100}%`
                }}
              />
            </div>
          </Box.Content>
        </Box>
      ) : <></>}

      {user.id === u.id ? <PostField placeholder='Say something about yourself!' /> : <></>}

      {u.posts.recent.map(p => <Post id={p} key={p} />)}
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

function Label ({ children }) {
  return (
    <h3 className='text-center'>
      <span className='uppercase bg-primary text-white rounded-full px-2 font-medium select-none text-sm'>{children}</span>
    </h3>
  )
}
