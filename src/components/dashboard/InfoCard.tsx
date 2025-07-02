import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type InfoCardProps = {
  title: string;
  value: string | number;
  percentage?: number;
  positive?: boolean;
  icon?: React.ReactNode;
};

const InfoCard = ({ title, value, percentage, positive = true, icon }: InfoCardProps) => {
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  const percentColor = positive ? "text-green-500" : "text-red-500";

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {percentage !== undefined && (
          <div className={`mt-2 flex items-center text-sm font-semibold ${percentColor}`}>
            <Icon className="mr-1 h-4 w-4" />
            {percentage}%
          </div>
        )}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        {icon}
      </div>
    </div>
  );
};

export default InfoCard;
