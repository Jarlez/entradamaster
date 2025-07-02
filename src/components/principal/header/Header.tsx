import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import style from "./Header.module.css";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import logo from "../../../../public/images/logo_new.png";

import { FiFacebook } from "react-icons/fi";
import { AiOutlineClose, AiOutlineInstagram, AiOutlineUser } from "react-icons/ai";
import { MdOutlineExitToApp, MdNotificationsNone } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSession, signOut } from "next-auth/react";
import Notification from "./Notification";
import { useUserType } from "../login/UserTypeContext";
import { useRouter } from "next/router";


interface Props {
  home: boolean | undefined;
  buyPage: boolean | undefined;
}

const HeaderComponent = ({ home, buyPage }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.clear();
    await signOut({
      callbackUrl: "/",
    });
  };
  
  
  const [cidade, setCidade] = useState(""); 
  const [dataSelecionada, setDataSelecionada] = useState("");
  // Removed unused state variable 'data'
  const datePickerRef = useRef<HTMLInputElement>(null); 

  const cidades = [
    "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán", 
    "Mar del Plata", "Salta", "Santa Fe", "San Juan", "Resistencia", "Neuquén", 
    "Santiago del Estero", "Corrientes", "Bahía Blanca", "San Salvador de Jujuy", 
    "Posadas", "Paraná", "Formosa", "San Luis", "La Rioja", "Rio Gallegos", 
    "Comodoro Rivadavia", "San Fernando del Valle de Catamarca", "Trelew", 
    "Ushuaia", "Bariloche", "Villa María", "Concordia", "Rafaela", "Pergamino"
  ]; // Lista de cidades


  const handleNav = () => {
    setNav(!nav); 
  };

  const [nav, setNav] = useState(false);
  // Removed unused state variable 'dropdown'
  const [openNotifications, setOpenNotifications] = useState(false);
  // Removed unused state variable 'dateState'
  const textColor = home ? "[#252525]" : "white";
  interface Notification {
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    userId: string;
  }

  const [notifications] = useState<Notification[]>([]); // Estado para notificações

  const { data: session } = useSession();
  const { userType } = useUserType();
  // Removed unused 'setUserType' assignment

  useEffect(() => {
    const cidadeSalva = localStorage.getItem("cidade");
    if (cidadeSalva) setCidade(cidadeSalva);
  
    const dataSalva = localStorage.getItem("dataSelecionada");
    if (dataSalva) setDataSelecionada(dataSalva);
  }, []);
  
  // Salvar cidade no localStorage ao mudar
  const handleCidadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCidade(e.target.value);
    localStorage.setItem("cidade", e.target.value);
  };
  
  // Salvar data no localStorage ao mudar
  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        defaultDate: dataSelecionada || new Date(),
        minDate: new Date(),
        onChange: (selectedDates: Date[]) => {
          if (selectedDates[0]) {
            const dataStr = selectedDates[0].toISOString();
            setDataSelecionada(dataStr);
            localStorage.setItem("dataSelecionada", dataStr);
          }
        },
        position: "below",
      });
    }
    // eslint-disable-next-line
  }, [datePickerRef, dataSelecionada]);

  return (
    <>
      <header id="inicio" className={`${style.header}`}>
        <div className={style.container_1}>
          <h5>
          {new Date().toLocaleDateString("es-AR", {
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
                {router.pathname === "/" && (
                  <nav className={style.navigation}>
                    <Link href="/">Inicio</Link>
                    <Link href="#eventos-hoy">Eventos hoy</Link> 
                    <Link href="#eventos">Artistas</Link> 
                    <Link href="#categorias">Categorías</Link> 
                  </nav>
                )}
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

          <select
            value={cidade}
            onChange={handleCidadeChange}
            className={`${style.cidade_select}`}
          >
            <option value="">Seleccionar ubicación</option>
            {cidades.map((cidade) => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </select>

          {/* Botão de filtro por data */}
          <input
            ref={datePickerRef}
            type="text"
            className={`${style.data_input}`}
            placeholder="Escolha uma data"
            disabled={!cidade}
            value={dataSelecionada ? new Date(dataSelecionada).toLocaleDateString() : ""} // Mostra a data formatada
            readOnly // flatpickr controla o valor
          />

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
                        <li onClick={handleLogout}>
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

              <li
                onClick={handleNav}
                className="my-3 cursor-pointer rounded-md border-2 border-black bg-[#ffff] py-4 px-9 text-xl text-[#000000]"
              >
                <Link href="/">Eventos Hoy</Link>
              </li>

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
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      />
                      <path
                      d="M6 6L18 18"
                      stroke="#4B5563"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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

export default HeaderComponent;
