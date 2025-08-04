import React from "react";

const renderStatus = (percentage: number) => {
  if (percentage < 30) {
    return (
      <span className="ml-2 rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
        Venta baja
      </span>
    );
  }

  if (percentage >= 80) {
    return (
      <span className="ml-2 rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
        Casi agotado
      </span>
    );
  }

  return null;
};

const AdquisitionsOverview = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 ">
      <h3 className="mb-10 text-xl font-bold leading-none text-gray-900">
        Visión general
      </h3>
      <div className="block w-full overflow-x-auto">
        <table className="w-full border-collapse items-center bg-transparent">
          <thead>
            <tr>
              <th className="whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700">
                Top Artistas
              </th>
              <th className="whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700">
                Usuarios
              </th>
              <th className="min-w-140-px whitespace-nowrap border-l-0 border-r-0 bg-gray-50 px-4 py-3 text-left align-middle text-xs font-semibold uppercase text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="text-gray-500">
              <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">
                Queen
              </th>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                5,300
              </td>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                <div className="flex items-center">
                  <span className="mr-2 flex items-center text-xs font-medium">
                    29%
                    {renderStatus(29)}
                  </span>
                  <div className="relative w-full">
                    <div className="h-2 w-full rounded-sm bg-gray-200">
                      <div
                        className="h-2 rounded-sm bg-cyan-600"
                        style={{
                          width: "30%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="text-gray-500">
              <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">
                Dante Gebel
              </th>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                4,025
              </td>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                <div className="flex items-center">
                  <span className="mr-2 text-xs font-medium">24%</span>
                  <div className="relative w-full">
                    <div className="h-2 w-full rounded-sm bg-gray-200">
                      <div
                        className="h-2 rounded-sm bg-orange-300"
                        style={{
                          width: "24%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="text-gray-500">
              <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">
                Cuarteto de nos
              </th>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                3,105
              </td>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                <div className="flex items-center">
                  <span className="mr-2 text-xs font-medium">18%</span>
                  <div className="relative w-full">
                    <div className="h-2 w-full rounded-sm bg-gray-200">
                      <div
                        className="h-2 rounded-sm bg-teal-400"
                        style={{
                          width: "18%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="text-gray-500">
              <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">
                Emilia
              </th>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                1251
              </td>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                <div className="flex items-center">
                  <span className="mr-2 text-xs font-medium">12%</span>
                  <div className="relative w-full">
                    <div className="h-2 w-full rounded-sm bg-gray-200">
                      <div
                        className="h-2 rounded-sm bg-pink-600"
                        style={{
                          width: "12%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="text-gray-500">
              <th className="whitespace-nowrap border-t-0 p-4 px-4 text-left align-middle text-sm font-normal">
                Fabiana Cantillo
              </th>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs font-medium text-gray-900">
                734
              </td>
              <td className="whitespace-nowrap border-t-0 p-4 px-4 align-middle text-xs">
                <div className="flex items-center">
                  <span className="mr-2 text-xs font-medium">9%</span>
                  <div className="relative w-full">
                    <div className="h-2 w-full rounded-sm bg-gray-200">
                      <div
                        className="h-2 rounded-sm bg-indigo-600"
                        style={{
                          width: "9%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="text-gray-500">
              <th className="whitespace-nowrap border-t-0 p-4 pb-0 text-left align-middle text-sm font-normal">
                Destino San Javier
              </th>
              <td className="whitespace-nowrap border-t-0 p-4 pb-0 align-middle text-xs font-medium text-gray-900">
                456
              </td>
              <td className="whitespace-nowrap border-t-0 p-4 pb-0 align-middle text-xs">
                <div className="flex items-center">
                  <span className="mr-2 text-xs font-medium">7%</span>
                  <div className="relative w-full">
                    <div className="h-2 w-full rounded-sm bg-gray-200">
                      <div
                        className="h-2 rounded-sm bg-purple-500"
                        style={{
                          width: "9%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdquisitionsOverview;
