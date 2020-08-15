import Page from '../components/Page'
import Post from '../components/Post'
import axios from 'axios'

const Mentions = ({ posts }) => {
  return (
    <Page title='Mentions and Replies'>
      {posts.length > 0
        ? posts.map(p => <Post id={p.id} key={p.id} />)
        : <p>You don't have any notifications just yet!</p>}
    </Page>
  )
}

Mentions.getInitialProps = async ctx => (await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/mentions`, {
  headers: ctx.req && ctx.req.headers.cookie ? {
    cookie: ctx.req.headers.cookie
  } : {}
})).data

export default Mentions
