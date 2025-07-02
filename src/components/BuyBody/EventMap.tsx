import React from "react";

interface Sector {
  id: string;
  name: string;
  rows: number;
  pricesByRow: { [row: number]: number };
}

interface MapConfig {
  name: string;
  seatsPerRow: number;
  sectors: Sector[];
}

interface EventMapProps {
  mapConfig: MapConfig;
  onSelect: (sector: string, row: number, seat: number, price: number) => void;
  selectedSeats: { sector: string; row: number; seat: number }[];
}

export const EventMap: React.FC<EventMapProps> = ({
  mapConfig,
  onSelect,
  selectedSeats,
}) => {
  const isSeatSelected = (
    sector: string,
    row: number,
    seat: number
  ) =>
    selectedSeats.some(
      (s) => s.sector === sector && s.row === row && s.seat === seat
    );

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">{mapConfig.name}</h2>
      {mapConfig.sectors.map((sec) => (
        <div key={sec.id} className="mb-4">
          <h3>{sec.name}</h3>
          {[...Array(sec.rows)].map((_, ri) => {
            const row = ri + 1;
            return (
              <div key={row} className="mb-1 flex items-center gap-1">
                <span className="w-16">
                  {sec.id}
                  {row}
                </span>
                {[...Array(mapConfig.seatsPerRow)].map((_, si) => {
                  const seat = si + 1;
                  const selected = isSeatSelected(sec.id, row, seat);
                  return (
                    <button
                      key={seat}
                      className={`h-8 w-8 rounded ${
                        selected ? "bg-green-500 text-white" : "bg-gray-200"
                      }`}
                      onClick={() =>
                        onSelect(
                          sec.id,
                          row,
                          seat,
                          sec.pricesByRow[row] ?? 0
                        )
                      }
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
