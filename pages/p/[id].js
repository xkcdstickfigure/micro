import { useUser } from '../../utils/userContext'
import Page from '../../components/Page'
import PostField from '../../components/PostField'
import Post from '../../components/Post'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function PostPage () {
  const user = useUser()
  const { id } = useRouter().query
  const [post, setPost] = useState()

  return (
    <Page title={post ? `${post.author.name}#${post.author.tag}: ${post.content.split('\n')[0]}` : null}>
      <Post
        id={id}
        onLoad={data => setPost(data)}
      />
      {post ? (
        <PostField
          placeholder={
            post.author.id === user.id ? 'Continue the conversation...' : `Reply to ${post.author.nickname}...`
          }
          parent={post.id}
        />
      ) : <></>}

      {post ? post.children.list.map(id => <Post key={id} id={id} />) : <></>}
    </Page>
  )
}
