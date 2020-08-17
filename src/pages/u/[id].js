import { useUser } from '../../utils/userContext'
import Page from '../../components/Page'
import PostField from '../../components/PostField'
import Post from '../../components/Post'
import { withRouter } from 'next/router'
import { Box, Breadcrumb, Avatar, Button } from '@reactants/ui'
import axios from 'axios'
import NotFound from '../404'
import { useState, useEffect } from 'react'

const UserPage = withRouter(({ user: u }) => {
  const user = useUser()
  const [online, setOnline] = useState(false)
  const [following, setFollowing] = useState(u.followers.me)
  const followerCount = u.followers.count + following - u.followers.me

  useEffect(() => {
    const getOnline = () => axios.get(`/api/users/${u.id}/online`)
      .then(({ data }) => setOnline(data.online))
      .catch(() => setOnline(false))

    getOnline()
    const interval = setInterval(getOnline, 5000)
    return () => clearInterval(interval)
  }, [])

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
            <div className='relative'>
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
              {online && (
                <div
                  className='absolute w-4 h-4 right-5 bottom-4 rounded-full'
                  style={{
                    background: '#07de40'
                  }}
                />
              )}
            </div>
          </div>

          <h1 className='text-center text-3xl font-medium mt-2'>
            {u.name}
            {u.alles && <span className='text-primary text-sm'>#{u.tag}</span>}
          </h1>

          {u.nickname !== u.name && <h2 className='text-center text-xl'>{u.nickname}</h2>}

          <div className='flex justify-center mt-3'>
            <Button
              size='sm'
              color={following ? 'primary' : 'secondary'}
              style={{ width: 100 }}
              onClick={() => {
                setFollowing(!following)
                axios.post(`/api/users/${u.id}/${following ? 'unfollow' : 'follow'}`).catch(() => {})
              }}
            >Follow{following && 'ing'}
            </Button>
          </div>

          <h3 className='text-center space-x-3 mt-3'>
            <span>
              <strong>{followerCount}</strong> Follower{followerCount === 1 ? '' : 's'}
            </span>
            <span>
              <strong>{u.posts.count}</strong> Post{u.posts.count === 1 ? '' : 's'}
            </span>
          </h3>

          {u.following.me && <p className='text-center mt-3 italic text-sm'>{u.nickname} is following you</p>}
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
              className='w-full h-5 mt-3 rounded-full overflow-hidden'
              style={{
                background: 'rgb(239,239,239)'
              }}
            >
              <div
                className='h-full bg-primary'
                style={{
                  width: `${u.xp.levelProgress * 100}%`
                }}
              />
            </div>
          </Box.Content>
        </Box>
      ) : <></>}

      {user.id === u.id && <PostField placeholder='Say something about yourself!' />}

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
