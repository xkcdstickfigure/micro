import { Box, Textarea, Button } from '@reactants/ui'
import { Image } from 'react-feather'
import { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'

export default function PostField (props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setLoading(true)
    axios.post('/api/posts', {
      content: value,
      parent: props.parent
    })
      .then(res => Router.push('/p/[id]', `/p/${res.data.id}`))
      .catch(() => setLoading(false))
  }

  return (
    <Box>
      <Textarea
        placeholder={props.placeholder}
        className='text-base'
        rows={4}
        onChange={e => setValue(e.target.value.trim())}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '15px'
        }}
      />

      <Box.Footer className='flex justify-between'>
        <Button
          color='transparent'
          style={{ padding: '0 5px' }}
          size='lg'
        >
          <Image size={20} strokeWidth={1.75} />
        </Button>
        <Button
          disabled={!value || loading}
          size='sm'
          onClick={submit}
        >
          {props.parent ? 'Reply' : 'Post'}
        </Button>
      </Box.Footer>
    </Box>
  )
};
