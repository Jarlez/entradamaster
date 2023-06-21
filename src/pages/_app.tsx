import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { UserTypeProvider } from "../components/principal/login/UserTypeContext";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <UserTypeProvider>
      <SessionProvider session={session}>
        <NextNProgress
          color="orange"
          options={{
            showSpinner: false,
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </UserTypeProvider>
  );
};

export default trpc.withTRPC(MyApp);
