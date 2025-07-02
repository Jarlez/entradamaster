import React from "react";
import { type NextPage } from "next";
import LoginSection from "../components/principal/login/LoginSection";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";

const Login: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const handleRedirect = () => {
    const userType = typeof window !== "undefined" && localStorage.getItem("userType");

    if (userType === "admin") {
      router.push("/dashboard"); // atualizado
    } else {
      router.push("/");
    }
  };

  return <>{sessionData ? handleRedirect() : <LoginSection />}</>;
};

export default Login;

export async function getServerSideProps({ req }: any) {
  const session = await getSession({ req });

  if (session || req.cookies.userType === "admin") {
    return {
      redirect: {
        destination: req.cookies.userType === "admin" ? "/dashboard" : "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
