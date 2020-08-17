import { Box } from '@reactants/ui'
import { User, AtSign, Users } from 'react-feather'
import { useUser } from '../utils/userContext'
import Page from '../components/Page'
import PostField from '../components/PostField'
import Post from '../components/Post'
import { useState, useEffect } from 'react'
import axios from 'axios'
import TrackVisibility from 'react-on-screen'
import Link from 'next/link'

export default function Home () {
  const user = useUser()
  const [posts, setPosts] = useState([])

  // Load new posts
  useEffect(() => {
    const updateFeed = () => axios.get('/api/feed')
      .then(({ data }) => {
        const newPosts = data.posts.filter(p => posts.indexOf(p) === -1)
        if (newPosts.length > 0) setPosts(newPosts.concat(posts))
      })
      .catch(() => {})

    updateFeed()
    const interval = setInterval(updateFeed, 30000)
    return () => clearInterval(interval)
  }, [posts])

  // Load old posts
  const loadOlderPosts = () => {
    // Get last post
    axios.get(`/api/posts/${posts[posts.length - 1]}`)
      .then(res =>
        // Get posts before last post
        axios.get(`/api/feed?before=${new Date(res.data.createdAt).getTime()}`)
          .then(res => setPosts(posts.concat(res.data.posts.filter(p => posts.indexOf(p) === -1))))
      )
  }

  return (
    <Page>
      <div className='space-y-7'>
        <div className='flex justify-between'>
          <h4 className='font-medium text-3xl'>
              Hey, {user.nickname}{user.plus ? <sup className='select-none text-primary'>+</sup> : <></>}
          </h4>

          <div className='flex space-x-4'>
            <Link href='/u/[id]' as={`/u/${user.id}`}>
              <a className='transition duration-100 hover:opacity-75'>
                <Box className='rounded-full p-2 text-gray-600 dark:text-gray-300'>
                  <User />
                </Box>
              </a>
            </Link>

            <a className='transition duration-100 hover:opacity-75'>
              <Box className='rounded-full p-2 text-gray-600 dark:text-gray-300'>
                <Users />
              </Box>
            </a>
            
            <Link href='/mentions'>
              <a className='transition duration-100 hover:opacity-75'>
                <Box className='rounded-full p-2 text-gray-600 dark:text-gray-300'>
                  <AtSign />
                </Box>
              </a>
            </Link>
          </div>
        </div>

        <PostField placeholder="What's up?" />
      </div>

      {posts.length > 0 ? posts.map(id => (
        <TrackVisibility key={id}>{({ isVisible }) => {
          if (isVisible && posts.indexOf(id) >= posts.length - 5) loadOlderPosts()
          return <Post id={id} />
        }}
        </TrackVisibility>
      )) : <p>Loading...</p>}
    </Page>
  )
}
