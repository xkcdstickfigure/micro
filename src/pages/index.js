import { Box } from '@reactants/ui'
import { User, AtSign, Users } from 'react-feather'
import { useUser } from '../utils/userContext'
import Page from '../components/Page'
import PostField from '../components/PostField'
import Post from '../components/Post'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home () {
  const user = useUser()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const updateFeed = () => axios.get('/api/feed')
      .then(({ data }) => {
        const newPosts = data.posts.filter(a => posts.indexOf(a) === -1);
        if (newPosts.length > 0) setPosts(data.posts.filter(a => posts.indexOf(a) === -1).concat(posts));
      })
      .catch(() => {})

    updateFeed()
    const interval = setInterval(updateFeed, 30000)
    return () => clearInterval(interval)
  }, [posts])

  return (
    <Page>
      <div className='space-y-7'>
        <div className='flex justify-between'>
          <h4 className='font-medium text-3xl'>
              Hey, {user.nickname}{user.plus ? <sup className='select-none text-primary'>+</sup> : <></>}
          </h4>

          <div className='flex space-x-4'>
            <a className='transition duration-100 hover:opacity-75' href='#'>
              <Box className='rounded-full p-2 text-gray-600 dark:text-gray-300'>
                <User />
              </Box>
            </a>
            <a className='transition duration-100 hover:opacity-75' href='#'>
              <Box className='rounded-full p-2 text-gray-600 dark:text-gray-300'>
                <Users />
              </Box>
            </a>
            <a className='transition duration-100 hover:opacity-75' href='#'>
              <Box className='rounded-full p-2 text-gray-600 dark:text-gray-300'>
                <AtSign />
              </Box>
            </a>
          </div>
        </div>

        <PostField placeholder="What's up?" />
      </div>

      {posts.length > 0 ? posts.map(id => <Post key={id} id={id} />) : <p>Loading...</p>}
    </Page>
  )
}
