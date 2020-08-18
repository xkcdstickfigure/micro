import axios from "axios";
import App from "next/app";
import Router from "next/router";
import { UserContext } from "../utils/userContext";
import NProgress from "nprogress";
import { useEffect } from "react";

import "@reactants/ui/dist/index.css";
import "../nprogress.css";

export default function app({ Component, pageProps, user }) {
  // Online ping
  if (user && process.env.NODE_ENV !== "development") {
    useEffect(() => {
      const ping = () => axios.post("/api/online").catch(() => {});
      ping();
      const interval = setInterval(ping, 15000);
      return () => clearInterval(interval);
    }, []);
  }

  // Return with Context
  return (
    <UserContext.Provider value={user}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

// User data
app.getInitialProps = async (appContext) => {
  const props = await App.getInitialProps(appContext);
  const { ctx } = appContext;
  const isServer = typeof window === "undefined";

  const redirect = (location) =>
    isServer
      ? ctx.res.writeHead(302, { location }).end()
      : /^https?:\/\/|^\/\//i.test(location)
      ? (window.location.href = location)
      : Router.push(location);

  if (ctx.pathname === "/_error") return { ...props };

  try {
    const user = (
      await axios.get(
        `${
          process.env.NEXT_PUBLIC_ORIGIN ? process.env.NEXT_PUBLIC_ORIGIN : ""
        }/api/me`,
        {
          headers: isServer
            ? {
                cookie: ctx.req ? ctx.req.headers.cookie : "",
              }
            : {},
        }
      )
    ).data;

    return { ...props, user };
  } catch (err) {
    redirect(
      `https://alles.cx/login?next=${encodeURIComponent(
        process.env.NEXT_PUBLIC_ORIGIN + ctx.asPath
      )}`
    );
    return { ...props };
  }
};

// Progress Bar
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
