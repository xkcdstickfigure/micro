import { useUser } from '../../utils/userContext'
import Page from '../../components/Page'
import PostField from '../../components/PostField'
import Post from '../../components/Post'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Breadcrumb, Avatar } from '@reactants/ui'
import plainContent from '../../utils/plainContent'
import NotFound from '../404'

export default function PostPage () {
  const user = useUser()
  const { id } = useRouter().query
  const [post, setPost] = useState()
  const [notFound, setNotFound] = useState(false)

  return !notFound ? (
    <Page
      title={post ? `${post.users[post.author].name}: ${
        plainContent(post.content.split('\n')[0], (() => {
          const names = {}
          Object.keys(post.users).forEach(
            id => { names[id] = post.users[id].name }
          )
          return names
        })())
      }` : null}
      breadcrumbs={post ? (
        <Breadcrumb.Item>
          <Avatar
            {...(
              post.users[post.author].alles ? {
                id: post.author
              } : post.users[post.author].avatar ? {
                src: `https://fs.alles.cx/${post.users[post.author].avatar}`
              } : {
                id: '_'
              }
            )} size={25}
          />
        </Breadcrumb.Item>
      ) : null}
    >
      {post && post.parent ? <Parent id={post.parent} /> : <></>}

      <Post
        id={id}
        expanded
        onLoad={data => setPost(data)}
        onError={() => setNotFound(true)}
      />
      {post ? (
        <PostField
          placeholder={
            post.author === user.id
              ? 'Continue the conversation...'
              : `Reply to ${post.users[post.author].nickname}...`
          }
          parent={post.id}
          key={`reply-${post.id}`}
        />
      ) : <></>}

      {post ? post.children.list.map(id => <Post key={id} id={id} />) : <></>}
    </Page>
  ) : <NotFound />
}

function Parent ({ id }) {
  const [post, setPost] = useState()

  return (
    <>
      {post && post.parent ? <Parent id={post.parent} /> : <></>}
      <Post
        id={id}
        onLoad={data => setPost(data)}
      />
      <div>
        <div className='mx-auto -my-7 w-1 h-7 bg-primary' />
      </div>
    </>
  )
}
