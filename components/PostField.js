import { Box, Textarea, Button } from '@reactants/ui'
import { Image } from 'react-feather'
import { useState } from 'react'
import axios from 'axios'

export default function PostField (props) {
  const [value, setValue] = useState('')

  const submit = () => {
    axios.post('/api/post', {
      content: value
    })
      .then(res => console.log(res.data))
      .catch(() => {})
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
          disabled={!value}
          size='sm'
          onClick={submit}
        >
          {props.parent ? 'Reply' : 'Post'}
        </Button>
      </Box.Footer>
    </Box>
  )
};
