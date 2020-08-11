import {
  Avatar,
  Box,
  Button
} from '@reactants/ui'
import {
  User,
  AtSign,
  Users,
  Plus,
  Minus
} from 'react-feather'
import { useUser } from '../utils/userContext'
import Page from '../components/Page'
import PostField from '../components/PostField'

const Home = () => {
  const user = useUser()

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

      <Post
        upvotes={6}
        replies={1}
        content={
          <div className='whitespace-pre-wrap'>
              So, my thoughts on Hey.{'\n'}
            {'\n'}
              The way they've done it is amazing. People are begging for
              the privilege of paying $100 a year.{'\n'}
            {'\n'}I think the outcome will be{'\n'}
              A: The hype dies down, people realise it's not worth paying that
              much for{'\n'}
              B: hey.com email addresses become a status symbol, like owning an
              iPhone{'\n'}
              C: Somewhere in between. A lot of companies will likely clone some
              of the features (like the screener){'\n'}
          </div>
        }
      />

      <Post
        upvotes={1}
        replies={0}
        content={
          <div className='whitespace-pre-wrap'>
              Really important things to do:{'\n'}- Alles
            <sup className='text-primary select-none'>+</sup>
            {'\n'}- Developer panel{'\n'}
          </div>
        }
      />
    </Page>
  )
}

const Post = ({ content, replies, upvotes }) => (
  <Box className='flex'>
    <div className='space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center'>
      <Button color='transparent' style={{ padding: 0 }}>
        <Plus size={17.5} />
      </Button>
      <span>{upvotes}</span>
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
          <Avatar id='00000000-0000-0000-0000-000000000000' className='mr-3' size={32.5} />
          <div>
            <div className='text-black dark:text-white text-sm'>
              Archie Baer<sup className='select-none text-primary'>+</sup>
            </div>
            <div className='text-primary text-sm'>@archie</div>
          </div>
        </div>
        <div>{content}</div>
      </Box.Content>
      <Box.Footer
        className='rounded-bl-none flex justify-between'
        style={{ background: 'transparent' }}
      >
        <span>May 18 2020 12:02</span>
        <span>{replies === 0 ? 'No' : replies} Replies</span>
      </Box.Footer>
    </a>
  </Box>
)

export default Home
