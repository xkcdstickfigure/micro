import Page from '../../components/Page'
import Post from '../../components/Post'
import PostField from '../../components/PostField'
import axios from 'axios'
import { Breadcrumb } from '@reactants/ui'
import { withRouter } from 'next/router'

const TagPage = withRouter(({ name, posts }) => (
  <Page
    title={`#${name}`}
    breadcrumbs={<Breadcrumb.Item>#{name}</Breadcrumb.Item>}
  >
    <PostField placeholder={`${posts.length > 0 ? 'Join' : 'Start'} the conversation!`} />

    {posts.length > 0
      ? posts.map(id => <Post id={id} key={id} />)
      : <p>There's no recent posts using this tag!</p>}
  </Page>
))

TagPage.getInitialProps = async ctx => {
  let posts = []
  try {
    posts = (
      await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/tags/${encodeURIComponent(ctx.query.name)}`, {
        headers: ctx.req && ctx.req.headers.cookie ? {
          cookie: ctx.req.headers.cookie
        } : {}
      })
    ).data.posts
  } catch (err) {}

  if (posts.length === 0) ctx.res.statusCode = 404

  return {
    name: ctx.query.name ? ctx.query.name.toLowerCase() : 'undefined',
    posts
  }
}

export default TagPage
