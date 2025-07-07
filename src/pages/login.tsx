import React, { useEffect } from "react";
import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";

import LoginSection from "../components/principal/login/LoginSection";

const Login: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // ✅ Redireciona automaticamente se o usuário já estiver logado
      void router.replace("/user");
    }
  }, [session, router]);

  return !session ? <LoginSection /> : null;
};

export default Login;

// ✅ Protege a rota do lado do servidor (SSR)
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session || req.cookies.userType === "admin") {
    return {
      redirect: {
        destination: "/user",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
