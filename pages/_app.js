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

  if (ctx.pathname === '/_error') return { ...props }

  try {
    console.log(ctx.req ? ctx.req.headers.cookie : '')
    const user = (await axios.get(
        `${process.env.NEXT_PUBLIC_ORIGIN ? process.env.NEXT_PUBLIC_ORIGIN : ''}/api/me`,
        {
          headers: isServer ? {
            cookie: ctx.req ? ctx.req.headers.cookie : ''
          } : {}
        }
    )).data

    return { ...props, user }
  } catch (err) {
    redirect(`https://alles.cx/login?next=${encodeURIComponent(process.env.NEXT_PUBLIC_ORIGIN + ctx.pathname)}`)
    return { ...props }
  }
}
