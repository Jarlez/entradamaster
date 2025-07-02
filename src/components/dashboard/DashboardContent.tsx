import React from "react";
import Header from "../principal/header/Header";
import Footer from "../principal/footer/Footer";
import LastTransactios from "./components/LastTransactions";
import AdquisitionsOverview from "./components/AdquisitionsOverview";
import LatestCostumers from "./components/LatestCostumers";
import InfoCard from "./InfoCard";
import { Users, Activity, Eye } from "lucide-react";

const DashboardContent = () => {
  return (
    <div>
      <Header home buyPage={undefined} />
      <div className="flex overflow-hidden bg-white pt-5">
        <div id="main-content" className="relative h-full w-full overflow-y-auto bg-gray-50">
          <main>
            <div className="px-4">
              {/* KPI Grid com InfoCard */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard title="Funções novas" value="$320K" percentage={5.2} icon={<Activity className="h-5 w-5" />} />
                <InfoCard title="Visitantes" value="152" percentage={2.1} icon={<Eye className="h-5 w-5" />} />
                <InfoCard title="Cadastros" value="150" percentage={10.0} icon={<Users className="h-5 w-5" />} />
              </div>

              {/* Blocos de dados */}
              <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-2">
                <LatestCostumers />
                <AdquisitionsOverview />
              </div>

              {/* Transações */}
              <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-1 2xl:grid-cols-1">
                <LastTransactios />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
