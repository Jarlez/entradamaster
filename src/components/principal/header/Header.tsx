import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import style from "./Header.module.css";

import logo from "../../../../public/images/logo_new.png";

import { FiFacebook } from "react-icons/fi";
import {
  AiOutlineClose,
  AiOutlineInstagram,
  AiOutlineUser,
} from "react-icons/ai";
import { MdExitToApp, MdOutlineExitToApp } from "react-icons/md";
import { TfiTwitter } from "react-icons/tfi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdNotificationsNone } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSession, signOut } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import Notification from "./Notification";
import { useRouter } from "next/router";
import { useUserType } from "../login/UserTypeContext";

interface Props {
  home?: boolean | undefined;
  buyPage?: boolean | undefined;
}

const Header = ({ home, buyPage }: Props) => {
  const router = useRouter();
  const [nav, setNav] = useState(false);
  const [dropdown, setDropdow] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [dateState, setDateState] = useState(new Date());
  const [textColor, setTextColor] = useState(home ? "[#252525]" : "white");

  const { data: session } = useSession();
  const { userType } = useUserType();
  const { setUserType } = useUserType();

  // const { data: user } = trpc.auth.getUserById.useQuery(sessionData?.user?.id);

  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1);
  }, []);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleDropdown = () => {
    setDropdow(!dropdown);
  };

  const handleLogout = () => {
    setUserType("");
    router.push("/");
  };

  const { data: notifications } = trpc.notification.getAll.useQuery(
    session?.user?.id,
    {
      enabled: session?.user?.id !== undefined,
    }
  );

  return (
    <>
      <header className={`${style.header}`}>
        <div className={style.container_1}>
          <h5>
            {dateState.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </h5>
          <div className={style.socials}>
            <a href="#">
              <FiFacebook className={style.icon} />
            </a>

            <a href="#">
              <AiOutlineInstagram className={style.icon} />
            </a>

            <a href="#">
              <TfiTwitter className={style.icon} />
            </a>
          </div>
        </div>

        <div className={style.container_2}>
          <div className={style.left_container}>
            {buyPage ? (
              <>
                <div onClick={handleNav} className="z-50 hidden lg:block">
                  {nav ? (
                    <>
                      <div className="h-[33px] w-[33px]"></div>
                      <AiOutlineClose
                        className="fixed top-[70px] left-[40px] cursor-pointer"
                        size={30}
                        style={{ color: `black` }}
                      />
                    </>
                  ) : (
                    <HiMenuAlt3
                      className={`cursor-pointer ${style.hamburger}`}
                      size={33}
                      style={{ color: `${textColor}` }}
                    />
                  )}
                </div>

                <div
                  className={
                    nav
                      ? "fixed top-0 left-0 right-0 bottom-0 z-40 hidden h-screen w-[30%] flex-col items-center justify-between bg-[#ffff] text-center duration-300 ease-in lg:flex"
                      : "fixed top-0 left-[-100%] right-0 bottom-0 z-40 hidden h-screen w-[30%] flex-col items-center justify-between bg-[#ffff] text-center duration-300 ease-in lg:flex"
                  }
                >
                  <div className="h-[10%]"></div>
                  <ul>
                    <li className={style.search_bar}>
                      <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Empezá a buscar tus eventos..."
                        className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 focus:outline-none"
                      />
                      <AiOutlineSearch className={style.icon} />
                    </li>
                    {!session ? (
                      <li>
                        <Link href="/login">
                          <div
                            onClick={handleNav}
                            className="my-3 flex cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[#ff6c00] py-4 px-9 text-xl text-[#ffff]"
                          >
                            <AiOutlineUser size={30} />
                            Iniciar sesión
                          </div>
                        </Link>
                      </li>
                    ) : null}

                    <Link href="#">
                      <li
                        onClick={handleNav}
                        className="my-3 cursor-pointer rounded-md border-2 border-black bg-[#ffff] py-4 px-9 text-xl text-[#000000]"
                      >
                        Eventos Hoy
                      </li>
                    </Link>

                    <li
                      onClick={handleNav}
                      className="my-3 cursor-pointer rounded-md border-2 border-black bg-[#ffff] py-4 px-9 text-xl text-[#000000]"
                    >
                      <Link href="/">Artistas</Link>
                    </li>
                    <li
                      onClick={handleNav}
                      className="my-3 cursor-pointer rounded-md border-2 border-black bg-[#ffff] py-4 px-9 text-xl text-[#000000]"
                    >
                      <Link href="/">Categorías</Link>
                    </li>
                  </ul>
                  <p className="my-6 text-gray-500">
                    © 2023 EntradaMaster. Todos los derechos reservados.
                  </p>
                </div>
                {nav ? (
                  <div className="fixed top-0 left-0 z-20 h-screen w-full bg-black opacity-75"></div>
                ) : null}
              </>
            ) : null}

            <div className={style.logo_container}>
              <Link href={"/"}>
                <Image src={logo} alt="logo" className="cursor-pointer" />
              </Link>
            </div>

            {!buyPage ? (
              <>
                <nav>
                  <Link href={"/"}>Inicio</Link>
                  <Link href="#">Eventos hoy</Link>
                  <Link href="#">Artistas</Link>
                  <Link href="#">Categorías</Link>
                </nav>

                <div className="hidden sm:block">
                  <div className={`${style.search_bar}`}>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Empezá a buscar tus eventos..."
                      className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 outline-0 focus:outline-none"
                    />
                    <AiOutlineSearch className={style.icon} />
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className={style.right_container}>
            {userType === "admin" ? (
              <>
                <Link href={"/"}>
                  <div className="cursor-pointer rounded-lg bg-gray-500 py-2 px-2 text-center text-sm font-bold text-white xl:text-base">
                    Publicar
                  </div>
                </Link>
                <Link href={"/dashboard"}>
                  <div className="cursor-pointer rounded-lg border border-primary-100 py-2 px-2 text-center text-sm font-bold xl:text-base">
                    Panel Administrador
                  </div>
                </Link>
                <div className="cursor-pointer" onClick={handleLogout}>
                  <MdOutlineExitToApp size={33} />
                </div>
              </>
            ) : !session ? (
              <>
                <Link href={"/login"}>
                  <div className="cursor-pointer font-bold">Iniciar Sesión</div>
                </Link>
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    setOpenNotifications(!openNotifications);
                  }}
                >
                  <Link href="#">
                    <MdNotificationsNone className={style.icon} />
                  </Link>
                </div>

                {/* <Link href="#">
                    <AiOutlineShoppingCart className={style.icon} />
                  </Link> */}

                <div className={style.img_container}>
                  <Image
                    src={`${session?.user?.image}`}
                    alt="imagen de perfil"
                    width={50}
                    height={50}
                  />
                </div>
                <Link href="#">
                  <div className="relative">
                    <div className="dropdown-left dropdown">
                      <label tabIndex={0}>
                        <IoMdArrowDropdown className={style.icon} />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                      >
                        <p className="border-b py-2 text-center font-bold">
                          {session && session.user?.name}
                        </p>
                        <li>
                          <Link href={"/profile"}>Perfil</Link>
                        </li>
                        <li onClick={() => signOut()}>
                          <span>Cerrar Sesión</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>

          <div onClick={handleNav} className="z-50 block lg:hidden">
            {nav ? (
              <AiOutlineClose
                className="fixed right-6 top-[70px] cursor-pointer"
                size={30}
                style={{ color: `black` }}
              />
            ) : (
              <HiMenuAlt3
                className={`cursor-pointer ${style.hamburger}`}
                size={33}
                style={{ color: textColor }}
              />
            )}
          </div>

          <div
            className={
              nav
                ? "fixed top-0 left-0 right-0 bottom-0 z-40 flex h-screen w-full items-center justify-center bg-[#ffff] text-center duration-300 ease-in lg:hidden"
                : "fixed top-0 left-[-100%] right-0 bottom-0 z-40 flex h-screen w-full items-center justify-center bg-[#ffff] text-center duration-300 ease-in lg:hidden"
            }
          >
            <ul>
              <li className={style.search_bar}>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Empezá a buscar tus eventos..."
                  className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 outline-0 focus:outline-none"
                />
                <AiOutlineSearch className={style.icon} />
              </li>
              {userType === "admin" ? (
                <>
                  <div className="my-3 flex cursor-pointer items-center justify-center rounded-md border-2 border-black bg-gray-500 py-4 px-9 text-xl text-gray-400">
                    Publicar
                  </div>

                  <Link href="/dashboard">
                    <div
                      onClick={handleNav}
                      className="my-3 flex cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[#ff6c00] py-4 px-9 text-xl text-[#ffff]"
                    >
                      Panel Administrador
                    </div>
                  </Link>
                </>
              ) : !session ? (
                <div>
                  <Link href="/login">
                    <div
                      onClick={handleNav}
                      className="my-3 flex cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[#ff6c00] py-4 px-9 text-xl text-[#ffff]"
                    >
                      <AiOutlineUser size={30} />
                      Iniciar sesión
                    </div>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link href="/profile">
                    <div
                      onClick={handleNav}
                      className="my-3 flex cursor-pointer items-center justify-center rounded-md border-2 border-black bg-[#ff6c00] py-4 px-9 text-xl text-[#ffff]"
                    >
                      <AiOutlineUser size={30} />
                      Cuenta
                    </div>
                  </Link>
                </div>
              )}

              <Link href="#">
                <li
                  onClick={handleNav}
                  className="my-3 cursor-pointer rounded-md border-2 border-black bg-[#ffff] py-4 px-9 text-xl text-[#000000]"
                >
                  Eventos Hoy
                </li>
              </Link>

              <li
                onClick={handleNav}
                className="my-3 cursor-pointer rounded-md border-2 border-black bg-[#ffff] py-4 px-9 text-xl text-[#000000]"
              >
                <Link href="/">Artistas</Link>
              </li>
              <li
                onClick={handleNav}
                className="my-3 cursor-pointer rounded-md border-2 border-black bg-[#ffff] py-4 px-9 text-xl text-[#000000]"
              >
                <Link href="/">Categorías</Link>
              </li>
              {!session && userType !== "admin" ? null : (
                <li
                  onClick={() => {
                    signOut();
                    handleLogout();
                  }}
                  className="my-3 cursor-pointer rounded-md border-2 border-black bg-red-500 py-4 px-9 text-xl text-white"
                >
                  Cerrar Sesión
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>
      {openNotifications ? (
        <>
          <div
            className="sticky-0 fixed top-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-90"
            id="chec-div"
          >
            <div
              className="absolute right-0 z-10 h-full w-full translate-x-0 transform overflow-x-hidden transition duration-700 ease-in-out"
              id="notification"
            >
              <div className="absolute right-0 h-screen overflow-y-auto bg-gray-50 p-8 2xl:w-4/12">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold leading-6 text-gray-800 focus:outline-none">
                    Notificaciones
                  </p>
                  <button
                    role="button"
                    aria-label="close modal"
                    className="cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={() => {
                      setOpenNotifications(!openNotifications);
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18"
                        stroke="#4B5563"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M6 6L18 18"
                        stroke="#4B5563"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {notifications?.map((notifitacion) => (
                  <div key={notifitacion.id} className="mt-5">
                    <Notification
                      notification={notifitacion}
                      // onDelete={() => void deleteNote.mutate({ id: note.id })}
                    />
                  </div>
                ))}

                <div className="justiyf-between flex items-center">
                  <hr className="w-full" />
                  <p className="flex flex-shrink-0 px-3 py-16 text-sm leading-normal text-gray-500 focus:outline-none">
                    Eso es todo por ahora :&#41;
                  </p>
                  <hr className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Header;
