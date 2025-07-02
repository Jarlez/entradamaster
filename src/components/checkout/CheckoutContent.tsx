import Link from "next/link";
import React from "react";
import styles from "./Checkout.module.css";

import imgTU from "../../../public/images/PayPal.svg";
import Image, { StaticImageData } from "next/image";

interface Props {
  picture: StaticImageData;
  title: string;
  sector: string;
  price: number;
  cant: number;
}

const CheckoutContent = ({ title, price, sector, cant, picture }: Props) => {
  return (
    <div className="mt-5">
      <div className="min-w-screen bg-gray-50">
        <div className="p-5 py-5">
          <div className="mb-8"></div>
          <div className="mb-2">
            <h1 className="text-3xl font-bold md:text-5xl">Pagar</h1>
          </div>
          <div className="mb-5 text-gray-400">
            <span className="text-gray-500 ">
              Boletos
            </span>{" "}
            / <span className="text-gray-800">Pagar</span>
          </div>
        </div>
        <div className="w-full border-t border-b border-gray-200 bg-white p-5 text-gray-800">
          <div className="mt-9 w-full">
            <div className="-mx-3 items-start md:flex">
              <div className="px-3 md:w-7/12 lg:pr-10">
                <div className="mx-auto mb-6 w-full border-b border-gray-200 pb-6 font-light text-gray-800">
                  <div className="flex w-full items-center">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <Image
                        src={picture}
                        alt="Imagen"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow pl-3">
                      <h6 className="font-semibold uppercase text-gray-600">
                        {title}
                      </h6>
                      <p className="text-gray-600">
                        Auditorio de Belgrano - Buenos Aires
                      </p>
                      <p className="text-gray-600">{sector} </p>
                      <p className="text-gray-400">x {cant}</p>
                    </div>
                    <div>
                      <span className="text-xl font-semibold text-gray-600">
                        ${price}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        .00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <div className="-mx-2 flex items-end justify-end">
                    <div className="flex-grow px-2 lg:max-w-xs">
                      <label className="mb-2 ml-1 text-sm font-semibold text-gray-600">
                        Código de descuento
                      </label>
                      <div>
                        <input
                          className="w-full rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none"
                          placeholder="XXXXXX"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="px-2">
                      <button className="mx-auto block w-full max-w-xs rounded-md border border-transparent bg-warning px-5 py-2 font-semibold text-white hover:bg-green-500 focus:bg-green-500">
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mb-6 border-b border-gray-200 pb-6 text-gray-800">
                  <div className="mb-3 flex w-full items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Subtotal</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">${price}.00</span>
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Impuestos</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">
                        ${price * (10 / 100)}.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-6 border-b border-gray-200 pb-6 text-xl text-gray-800 md:border-none">
                  <div className="flex w-full items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Total</span>
                    </div>
                    <div className="pl-3">
                      <span className="text-sm font-semibold text-gray-400">
                        ARG
                      </span>{" "}
                      <span className="font-semibold">
                        ${Number(price) + Number(price) * (10 / 100)}.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 md:w-5/12">
                <div className="mx-auto mb-6 w-full rounded-lg border border-gray-200 bg-white p-3 font-light text-gray-800">
                  <div className="mb-3 flex w-full items-center">
                    <div className="w-32">
                      <span className="font-semibold text-gray-600">
                        Contacto
                      </span>
                    </div>
                    <div className="flex-grow pl-3">
                      <input
                        className="mb-1 w-full rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none"
                        placeholder="Nombre de contacto"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex w-full items-center">
                    <div className="w-32">
                      <span className="font-semibold text-gray-600">
                        Dirección
                      </span>
                    </div>
                    <div className="flex-grow pl-3">
                      <input
                        className="mb-1 w-full rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none"
                        placeholder="Dirección"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="mx-auto mb-6 w-full rounded-lg border border-gray-200 bg-white font-light text-gray-800">
                  <div className="w-full p-3">
                    <label
                      htmlFor="type2"
                      className="flex cursor-pointer items-center"
                    >
                      <input
                        type="radio"
                        className="form-radio h-5 w-5 text-indigo-500"
                        name="type"
                        id="type2"
                        checked
                      />
                      <Image
                        src={imgTU}
                        alt="tarjeta urbana"
                        width="150"
                        className="ml-3"
                      />
                    </label>
                  </div>
                  <div className="w-full border-t border-gray-200 p-3">
                    <div className="mb-5">
                      <label
                        htmlFor="type1"
                        className="flex cursor-pointer items-center"
                      >
                        <input
                          type="radio"
                          className="form-radio h-5 w-5 text-indigo-500"
                          name="type"
                          id="type1"
                        />
                        <img
                          src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                          className="ml-3 h-6"
                        />
                      </label>
                    </div>
                    <div>
                      <div className="mb-3">
                        <label className="mb-2 ml-1 text-sm font-semibold text-gray-600">
                          Nombre en la tarjeta
                        </label>
                        <div>
                          <input
                            className="mb-1 w-full rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none"
                            placeholder="José González"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="mb-2 ml-1 text-sm font-semibold text-gray-600">
                          Numero de la tarjeta
                        </label>
                        <div>
                          <input
                            className="mb-1 w-full rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none"
                            placeholder="0000 0000 0000 0000"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="-mx-2 mb-3 flex items-end">
                        <div className="w-1/4 px-2">
                          <label className="justify-left mb-2 ml-1 text-sm font-semibold text-gray-600">
                            Valido Hasta
                          </label>
                          <div>
                            <select className="form-select mb-1 w-full cursor-pointer rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none">
                              <option value="01">01 - Enero</option>
                              <option value="02">02 - Febrero</option>
                              <option value="03">03 - Marzo</option>
                              <option value="04">04 - Abril</option>
                              <option value="05">05 - Mayo</option>
                              <option value="06">06 - Junio</option>
                              <option value="07">07 - Julio</option>
                              <option value="08">08 - Agosto</option>
                              <option value="09">09 - Septiembre</option>
                              <option value="10">10 - Octubre</option>
                              <option value="11">11 - Noviembre</option>
                              <option value="12">12 - Diciembre</option>
                            </select>
                          </div>
                        </div>
                        <div className="w-1/4 px-2">
                          <select className="form-select mb-1 w-full cursor-pointer rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none">
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                          </select>
                        </div>
                        <div className="w-1/4 px-2">
                          <label className="mb-2 ml-1 text-sm font-semibold text-gray-600">
                            CVC
                          </label>
                          <div>
                            <input
                              className="mb-1 w-full rounded-md border border-gray-200 px-3 py-2 transition-colors focus:border-indigo-500 focus:outline-none"
                              placeholder="000"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="mx-auto mb-9 block w-full max-w-xs rounded-lg bg-indigo-500 px-3 py-2 font-semibold text-white hover:bg-indigo-700 focus:bg-indigo-700">
                    <i className="mdi mdi-lock-outline mr-1"></i> PAGAR AHORA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
