// src/pages/index.tsx
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Categorias from "../components/principal/categorias/Categorias";
import Eventos from "../components/principal/eventos/Eventos";
import EventosHoy from "./EventosHoy";
import Footer from "../components/principal/footer/Footer";
import Header from "../components/principal/header/Header";
import Hero from "../components/principal/hero/Hero";
import Spinner from "../components/principal/loader/Spinner";

const Home: NextPage = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const alreadyRedirected = sessionStorage.getItem("admin_redirected");

    if (
      router.isReady &&
      status === "authenticated" &&
      session?.user?.role === "ADMIN" &&
      router.pathname === "/" &&
      !alreadyRedirected
    ) {
      sessionStorage.setItem("admin_redirected", "true");
      router.replace("/dashboard");
    }
  }, [router.isReady, status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center">
        <Spinner />
        <h1 className="text-2xl font-bold">Cargando...</h1>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>EntradaMaster</title>
        <meta name="description" content="EntradaMaster" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header home={true} buyPage={undefined} />

      <main>
        <Hero />
        <Categorias />
        <EventosHoy />
        <Eventos />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
