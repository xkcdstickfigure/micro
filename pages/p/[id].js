import Page from '../../components/Page'
import Post from '../../components/Post'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function PostPage () {
  const { id } = useRouter().query
  const [post, setPost] = useState()

  return (
    <Page title={post ? `${post.author.name}#${post.author.tag}: ${post.content.split('\n')[0]}` : null}>
      <Post
        id={id}
        onLoad={data => setPost(data)}
      />

      {post ? post.children.list.map(id => <Post key={id} id={id} />) : <></>}
    </Page>
  )
}
