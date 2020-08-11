import { Box, Textarea, Button } from '@reactants/ui'
import { Image } from 'react-feather'
import { useState } from 'react'

export default function PostField (props) {
  const [value, setValue] = useState('')

  return (
    <Box>
      <Textarea
        placeholder={props.placeholder}
        className='text-base'
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
        <Button disabled={!value} size='sm'>
                Post
        </Button>
      </Box.Footer>
    </Box>
  )
};
