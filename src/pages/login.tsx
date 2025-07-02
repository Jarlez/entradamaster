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
      router.push("/dashboard");
    } else if (userType === "normal") {
      router.push("/home"); // ou "/" se preferir
    } else {
      router.push("/");
    }
  };

  return <>{sessionData ? handleRedirect() : <LoginSection />}</>;
};

export default Login;

export async function getServerSideProps({ req }: any) {
  const session = await getSession({ req });
  const userType = req.cookies.userType;

  if (session && userType) {
    return {
      redirect: {
        destination: userType === "admin" ? "/dashboard" : "/home", // ajuste aqui
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
