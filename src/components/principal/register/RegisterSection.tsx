import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import concierto from "../../../../public/images/concierto.jpg";
import logo from "../../../../public/images/logo_white.png";
import { useFormik } from "formik";
import { registerValidate } from "../../../lib/validate";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { LoadingButton } from "../loader/LoadingButton";
import type { CreateUserInput } from "../../../server/schema/user.schema";
import { FaInfoCircle } from "react-icons/fa";

const RegisterSection: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [validationErrorAlert, setValidationErrorAlert] = useState(false);
  const [error, setError] = useState<string>("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ Hook de mutation deve vir ANTES do "if (!mounted)"
  const { mutate: SignUpUser, isLoading } = trpc.auth.registerUser.useMutation({
    onSuccess(data) {
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    },
    onError(error) {
      setError(error.message);
      setValidationErrorAlert(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cPassword: "",
    },
    validate: registerValidate,
    onSubmit: async (values: CreateUserInput) => {
      SignUpUser(values);
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  async function onSubmit(values: CreateUserInput) {
    SignUpUser(values);
  }

  return (
    <section className="flex flex-col lg:h-screen lg:flex-row">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-2xl font-bold text-green-600">
              Registro exitoso
            </h2>
            <p className="text-gray-700">Serás redirigido al login...</p>
          </div>
        </div>
      )}
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
        <div className="formulario w-full rounded-[2rem] border bg-white p-5 py-5 shadow-lg lg:max-w-lg lg:px-14 lg:pb-1 2xl:max-w-2xl">
          <h2 className="text-center text-3xl font-bold lg:text-4xl">
            Registro
          </h2>

          {validationErrorAlert ? (
            <div className="alert alert-error -mb-5 mt-3 shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 flex-shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>¡Error! {error}</span>
              </div>
            </div>
          ) : null}

          <form
            className="mt-10 flex flex-col gap-5"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label
                className="flex items-center gap-1 font-bold text-primary-100"
                htmlFor="name"
              >
                Nombre de usuario
                <div className="group relative cursor-pointer">
                  <FaInfoCircle
                    className="text-gray-500 hover:text-gray-700"
                    size={16}
                  />
                  <div className="absolute bottom-full left-1/2 z-10 mb-1 hidden w-56 -translate-x-1/2 rounded bg-black px-3 py-2 text-sm text-white shadow-lg group-hover:block">
                    • No puede contener espacios
                    <br />
                    • Solo letras y números
                    <br />• Mínimo 5 caracteres
                  </div>
                </div>
              </label>
              <input
                className="rounded-lg border-b"
                type="text"
                id="name"
                placeholder="Tu nombre de usuario aquí"
                {...formik.getFieldProps("name")}
              />
              <span className="h-1 self-end text-right  text-sm text-red-500">
                {formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : "\u00A0"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-primary-100" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                className="rounded-lg border-b"
                type="email"
                id="email"
                placeholder="Tu correo aquí"
                {...formik.getFieldProps("email")}
              />
              <span className="h-1 self-end text-right  text-sm text-red-500">
                {formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : "\u00A0"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="flex items-center gap-1 font-bold text-primary-100"
                htmlFor="password"
              >
                Contraseña
                <div className="group relative cursor-pointer">
                  <FaInfoCircle
                    className="text-gray-500 hover:text-gray-700"
                    size={16}
                  />
                  <div className="absolute bottom-full left-1/2 z-10 mb-1 hidden w-56 -translate-x-1/2 rounded bg-black px-3 py-2 text-sm text-white shadow-lg group-hover:block">
                    • Debe tener entre 8 y 20 caracteres
                    <br />• No puede contener espacios
                  </div>
                </div>
              </label>
              <input
                className="rounded-lg border-b"
                type="password"
                id="password"
                placeholder="Tu contraseña aquí"
                {...formik.getFieldProps("password")}
              />
              <span className="h-1 self-end text-right  text-sm text-red-500">
                {formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : "\u00A0"}
              </span>
            </div>

            <div className="flex flex-col gap-2 pb-2">
              <label className="font-bold text-primary-100" htmlFor="cPassword">
                Confirmar Contraseña
              </label>
              <input
                className="rounded-lg border-b"
                type="password"
                id="cPassword"
                placeholder="Tu contraseña aquí"
                {...formik.getFieldProps("cPassword")}
              />
              <span className="h-1 self-end text-right  text-sm text-red-500">
                {formik.touched.cPassword && formik.errors.cPassword
                  ? formik.errors.cPassword
                  : "\u00A0"}
              </span>
            </div>

            <LoadingButton
              loading={isLoading}
              textColor="text-ct-blue-600"
              type="submit"
            >
              Registrarse
            </LoadingButton>
          </form>

          <Link href="/login">
            <div className="p-4  text-center text-primary-100">
              ¿Ya tienes una cuenta?
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
