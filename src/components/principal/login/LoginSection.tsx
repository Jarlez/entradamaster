import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import concierto from "../../../../public/images/concierto.jpg";
import logo from "../../../../public/images/logo_white.png";
import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import loginValidate from "../../../lib/validate";
import { useRouter } from "next/router";
import { useUserType } from "./UserTypeContext";

const LoginSection: React.FC = () => {
  const { setUserType } = useUserType();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidate,
    onSubmit,
  });

  async function onSubmit(values: { password: string; email: string }) {
    if (
      values.email === "admin@entradamaster.com" &&
      values.password === "12345678"
    ) {
      setUserType("admin");
      localStorage.setItem("userType", "admin");
      document.cookie = "userType=admin";
      router.push("/dashboard");
    } else {
      setUserType("user");
      localStorage.setItem("userType", "user");
      document.cookie = "userType=user";
      router.push("/");
    }
  }

  return (
    <section className="flex flex-col lg:h-screen lg:flex-row">
      <div className="relative z-0 flex h-[25rem] w-full items-center justify-center lg:h-screen lg:w-1/2">
        <Image
          src={concierto}
          alt="biza"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="-z-10 brightness-50 "
        />
        <Link href={"/"}>
          <div className="absolute top-6 left-6 w-[5rem]">
            <Image src={logo} alt="logo" />
          </div>
        </Link>
        <div className="z-10 mx-auto w-[90%]">
          <h2 className="text-5xl font-bold text-white lg:text-7xl">
            Vive los conciertos.
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 bg-slate-100 px-5 py-10 lg:w-1/2">
        <div className="formulario w-full rounded-[2rem] border bg-white p-5 py-10 shadow-lg lg:max-w-lg lg:px-14 lg:pb-14 2xl:max-w-2xl">
          <h2 className="text-center text-3xl font-bold lg:text-4xl">
            Iniciar sesión
          </h2>

          <form
            className="mt-10 flex flex-col gap-5"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xl font-bold text-primary-100" htmlFor="correo">
                Correo Electrónico
              </label>
              <input
                className="rounded-lg border-b"
                type="email"
                id="email"
                placeholder="Tu correo aquí"
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <span className="-my-2 text-red-500">{formik.errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xl font-bold text-primary-100" htmlFor="contrasena">
                Contraseña
              </label>
              <input
                className="rounded-lg border-b"
                type="password"
                id="password"
                placeholder="Tu contraseña aquí"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password && (
                <span className="-my-2 text-red-500">{formik.errors.password}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="accent-[#FF5F00]"
              />
              <label className="text-sm text-gray-700">Entrar como administrador</label>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#FF5F00] py-3 text-xl font-bold text-white"
            >
              Ingresar
            </button>
          </form>

          <div className="flex flex-col p-9">
            <button
              className="btn-warning btn my-2 flex bg-white"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <div className="flex items-center justify-center">
                <FcGoogle className="mr-2 text-4xl" />
                <span className="text-left text-black">Iniciar Sesión con Google</span>
              </div>
            </button>
            <button
              className="btn-warning btn my-2 bg-[#3b5998] text-white"
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
            >
              <div className="flex items-center justify-center">
                <AiFillFacebook className="mr-2 text-4xl" />
                <span className="text-left">Iniciar Sesión con Facebook</span>
              </div>
            </button>
          </div>

          <Link href="/register">
            <div className="text-center text-[#FF5F00]">
              ¿Todavía no tienes una cuenta?
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
