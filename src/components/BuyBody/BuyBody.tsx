import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { EventMap } from "./EventMap";
import { eventMaps } from "../../data/maps";

interface Props {
  foto: string;
  titulo: string;
}

type Seat = {
  sector: string;
  row: number;
  seat: number;
  price: number;
};

const BuyBody: React.FC<Props> = ({ foto, titulo }) => {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSelect = (
    sector: string,
    row: number,
    seat: number,
    price: number
  ) => {
    const isAlreadySelected = selectedSeats.some(
      (s) => s.sector === sector && s.row === row && s.seat === seat
    );

    if (isAlreadySelected) {
      setSelectedSeats((prev) =>
        prev.filter(
          (s) => !(s.sector === sector && s.row === row && s.seat === seat)
        )
      );
    } else {
      setSelectedSeats((prev) => [...prev, { sector, row, seat, price }]);
    }
  };

  const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const totalTickets = selectedSeats.length;
  const disabled = totalTickets === 0;

  const location = (router.query.location as string) || "belgrano";
  const mapConfig = eventMaps[location];

  if (!mapConfig) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Mapa do evento não encontrado.</span>
      </div>
    );
  }

  const handleDirectConfirmation = () => {
    const userType = localStorage.getItem("userType");

    if (userType === "user") {
      router.push("/ConfirmationPage");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-lg shadow-lg border border-gray-300 max-w-[1200px] mx-auto">
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <EventMap
          mapConfig={mapConfig}
          onSelect={handleSelect}
          selectedSeats={selectedSeats}
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h2 className="bg-gray-400 text-white px-4 py-2 text-sm font-bold rounded w-fit">
          DOM-06/JUL
        </h2>

        {selectedSeats.length > 0 ? (
          <div className="mt-4 border-b pb-2 space-y-1">
            {selectedSeats.map((s, i) => (
              <div key={i}>
                <p>Setor: Platea {s.sector}</p>
                <p>
                  Fila: {s.sector}
                  {s.row} - Assento {s.seat}
                </p>
                <p className="font-semibold">$ {s.price}.00</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">Selecione ao menos um assento</p>
        )}

        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Resumo do seu Pedido</h3>
          {selectedSeats.map((s, i) => (
            <div className="flex justify-between text-sm" key={i}>
              <span>
                Platea {s.sector} - {s.row}/{s.seat}
              </span>
              <span>$ {s.price}.00</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2">
            <span>Valor total do pedido</span>
            <span>$ {totalPrice}.00</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center text-sm gap-2">
            <input type="checkbox" className="accent-blue-600" />
            <span>
              Concordo com os{" "}
              <a href="#" className="text-blue-600 underline">
                termos de uso
              </a>
              .
            </span>
          </label>
        </div>

        <div className="mt-6">
          <button
            onClick={handleDirectConfirmation}
            disabled={disabled}
            className={`py-3 px-6 w-full rounded-md font-semibold ${
              disabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#FF5F00] text-white hover:opacity-90"
            }`}
          >
            🛒 Compre Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyBody;
