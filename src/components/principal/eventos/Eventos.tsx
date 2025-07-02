import React, { useState } from "react";
import Link from "next/link";
import Card from "./EventoCard";
import { cards } from "../../../data";

const Eventos = () => {
  const [categoria, setCategoria] = useState("Todos");

  const categorias = ["Todos","Culinaria", "Deportes","Especiales","Familia","Literatura", "Música","Stand Up", "Teatro"];

  const eventosFiltrados =
    categoria === "Todos"
      ? cards
      : cards.filter((card) => card.categoria === categoria);

  return (
    <section id="eventos" className="mx-auto mt-10 w-11/12 pb-10">
      <div className="mb-8 flex items-center gap-4">
        <h3 className="text-3xl font-bold">Eventos</h3>
      </div>

            {/* Botões de filtro por categoria */}
            <div className="mb-6 flex gap-4">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg ${
              categoria === cat ? "bg-primary-100 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {eventosFiltrados.map((card, index) => (
          <Card
            key={card.artist + card.fecha}
            artist={card.artist}
            fecha={card.fecha}
            ubicacion={card.ubicacion}
            ciudad={card.ciudad}
            foto={card.foto}
          />
        ))}
      </div>
    </section>
  );
};

export default Eventos;
