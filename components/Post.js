import { Avatar, Box, Button } from '@reactants/ui'
import { Plus, Minus } from 'react-feather'
import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'

export default function Post ({ id }) {
  const [post, setPost] = useState()
  const [author, setAuthor] = useState()

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

  return post ? (
    <Box className='flex'>
      <div className='space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center'>
        <Button color='transparent' style={{ padding: 0 }}>
          <Plus size={17.5} />
        </Button>
        <span>69</span>
        <Button color='transparent' style={{ padding: 0 }}>
          <Minus size={17.5} />
        </Button>
      </div>

      <a
        href='#'
        className='block hover:opacity-75 transition duration-100 cursor-pointer w-full'
      >
        <Box.Content>
          <div className='flex items-center mb-3'>
            <Avatar id={author ? author.id : '_'} className='mr-3' size={32.5} />
            <div>
              <div className='text-black dark:text-white text-lg'>
                {author
                  ? (
                    <>{author.name}{author.plus
                      ? <sup className='select-none text-primary'>+</sup>
                      : <></>}
                    </>
                  )
                  : <></>}
              </div>
            </div>
          </div>
          <div>{post.content}</div>
        </Box.Content>
        <Box.Footer
          className='rounded-bl-none flex justify-between'
          style={{ background: 'transparent' }}
        >
          <span>{moment(post.createdAt).format('LLL')}</span>
          <span>{post.children.count === 0 ? 'No' : post.children.count} Replies</span>
        </Box.Footer>
      </a>
    </Box>
  ) : (
    <Box>
      <Box.Content>
        <div>Loading</div>
      </Box.Content>
    </Box>
  )
}
