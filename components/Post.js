import { Avatar, Box, Button } from '@reactants/ui'
import { Plus, Minus, MessageCircle } from 'react-feather'
import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'

export default function Post ({ id }) {
  const [post, setPost] = useState()
  const [author, setAuthor] = useState()
  const skeleton = !post || !author

  useEffect(() => {
    // Get post
    axios.get(`/api/posts/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        setPost(data)

        // Get author
        axios.get(`/api/users/${encodeURIComponent(data.author)}`)
          .then(({ data }) => setAuthor(data))
          .catch(() => {})
      })
      .catch(() => {})
  }, [])

  return (
    <Box className='flex'>
      <div className='space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center'>
        <Button
          color='transparent'
          style={{ padding: 0, ...(skeleton && { opacity: 0.5 }) }}
        >
          <Plus size={17.5} />
        </Button>
        {skeleton ? (
          <span className='w-3 h-3 bg-gray-200 rounded-full' />
        ) : (
          <span>69</span>
        )}
        <Button
          color='transparent'
          style={{ padding: 0, ...(skeleton && { opacity: 0.5 }) }}
        >
          <Minus size={17.5} />
        </Button>
      </div>

      <a
        href={skeleton ? '#' : `/p/${post.id}`}
        className='block hover:opacity-75 transition duration-100 cursor-pointer w-full'
      >
        <Box.Content>
          {skeleton ? (
            <>
              <div className='flex items-center mb-3'>
                <div
                  className='mr-3 bg-gray-200 rounded-full'
                  style={{ width: 32.5, height: 32.5 }}
                />
                <div className='space-y-1'>
                  <div className='bg-gray-200 rounded-sm dark:bg-white h-3 w-10' />
                  <div className='bg-gray-200 rounded-sm h-3 w-15' />
                </div>
              </div>
              <div className='bg-gray-200 h-15 rounded w-full' />
            </>
          ) : (
            <>
              <div className='flex items-center mb-3'>
                <Avatar id={author.id} className='mr-3' size={32.5} />
                <div>
                  <div className='text-black dark:text-white text-lg'>
                    {author.name}
                    {author.plus && (
                      <sup className='select-none text-primary'>+</sup>
                    )}
                  </div>
                </div>
              </div>
              <div>{post.content}</div>
              {post.image && <img className='mt-5 rounded-lg' src={post.image} />}
            </>
          )}
        </Box.Content>
        <Box.Footer
          className='rounded-bl-none flex justify-between cursor-pointer'
          style={{ background: 'transparent' }}
        >
          {skeleton ? (
            <>
              <span className='bg-gray-200 w-20 h-3 rounded-sm' />
              <span className='bg-gray-200 w-13 h-3 rounded-sm' />
            </>
          ) : (
            <>
              <span>{moment(post.createdAt).format('LLL')}</span>
              <span className='flex items-center'>
                {post.children.count}
                <MessageCircle className='ml-1.5' size={17} />
              </span>
            </>
          )}
        </Box.Footer>
      </a>
    </Box>
  )
}
