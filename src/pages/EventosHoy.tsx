import React, { useState } from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import HoyCard from "./HoyCard";
import { useScrollToHash } from "../hooks/useScrollToHash";

import "swiper/css";
import "swiper/css/pagination";

import queen from "../../../../public/images/queen.jpg";
import dante from "../../../../public/images/dante.jpg";
import cuarteto from "../../../../public/images/cuarteto.jpg";
import { hoyCard } from "../../../data";

export default function EventosHoy() {
  useScrollToHash();

  return (
    <section id="eventos-hoy" className="mx-auto mt-10 w-11/12">
      <div className="mb-8 flex items-center gap-4">
        <h3 className="text-3xl font-bold">Eventos para hoy</h3>
        <Link href="/">
          <div className="cursor-pointer text-lg font-bold text-primary-100 lg:text-base">
            Ver todos
          </div>
        </Link>
      </div>


      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
      
          {hoyCard.map((card, index) => (
              <SwiperSlide key={index}>
                <HoyCard
                foto={card.foto}
                titulo={card.titulo}
                horas={card.horas}
                fecha={card.fecha}
                precio={card.precio}
                duracion={card.duracion}
                ubicacion={card.ubicacion}
                ciudad={card.ciudad} categoria={""}                />
              </SwiperSlide>
          ))}
        
      </Swiper>
    </section>
  );
}