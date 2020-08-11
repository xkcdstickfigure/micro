import '@reactants/ui/dist/index.css'
import axios from 'axios'
import App from 'next/app'
import Router from 'next/router'
import { UserContext } from '../utils/userContext'

export default function app ({ Component, pageProps, user }) {
  return (
    <UserContext.Provider value={user}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

app.getInitialProps = async appContext => {
  const props = await App.getInitialProps(appContext)
  const { ctx } = appContext
  const isServer = typeof window === 'undefined'

  const redirect = location =>
    isServer
      ? ctx.res.writeHead(302, { location }).end()
      : /^https?:\/\/|^\/\//i.test(location)
        ? (window.location.href = location)
        : Router.push(location)

  try {
    const user = (await axios.get(
        `${process.env.PUBLIC_URI ? props.env.PUBLIC_URI : ''}/api/me`,
        isServer ? {
            cookie: ctx.req ? ctx.req.headers.cookie : ''
        } : {}
    )).data

    return { ...props, user }
  } catch (err) {
    redirect(`https://alles.cx/login?next=${ctx.pathname}`)
    return { ...props }
  }
}
