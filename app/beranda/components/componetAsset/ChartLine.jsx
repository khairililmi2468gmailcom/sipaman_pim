import React, { useEffect, useRef, useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// Animasi untuk Card
const AnimatedCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white shadow-md rounded-lg p-4"
  >
    {children}
  </motion.div>
);

// Animasi untuk CardHeader
const AnimatedCardHeader = ({ color, children }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-${color}-500 p-4 rounded-t-lg`}
  >
    {children}
  </motion.div>
);

// Animasi untuk CardBody
const AnimatedCardBody = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="p-4"
  >
    {children}
  </motion.div>
);

const years = Array.from(
  { length: 20 },
  (_, i) => new Date().getFullYear() - i
);

export default function ChartLine() {
  const chartRef = useRef(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/pemesanan/GetLinechart?year=${year}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [year]);

  useEffect(() => {
    const config = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: year,
            backgroundColor: "#03a9f4",
            borderColor: "#03a9f4",
            data: data.map((item) => item.orderCount),
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: false,
            text: "Pesanan Charts",
            color: "white",
          },
          legend: {
            labels: {
              color: "black",
            },
            align: "end",
            position: "bottom",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          x: {
            ticks: {
              color: "rgba(17,17,17,.7)",
            },
            display: true,
            title: {
              display: false,
              text: "Month",
              color: "white",
            },
            grid: {
              display: false,
              borderDash: [2],
              borderDashOffset: 2,
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(0, 0, 0, 0)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: 2,
            },
          },
          y: {
            ticks: {
              color: "rgba(17,17,17,.7)",
              beginAtZero: true,
              stepSize: 1, // angka step
              callback: (value) => value.toString(), // hapus koma
            },
            display: true,
            title: {
              display: false,
              text: "Orders",
              color: "white",
            },
            grid: {
              display: false,
              borderDash: [2],
              borderDashOffset: 2,
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(0, 0, 0, 0)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: 2,
            },
            beginAtZero: true, // mulai0
          },
        },
      },
    };

    if (chartRef.current) {
      const chart = new ChartJS(chartRef.current, config);
      return () => chart.destroy();
    }
  }, [data, year]);

  return (
    <AnimatedCard>
      <AnimatedCardHeader
        color="blue"
        contentPosition="left"
        className="bg-blue-500 p-4 mt-4"
      >
        <h6 className="uppercase text-gray-200 text-xs font-medium">
          Line Chart
        </h6>
        <h2 className="text-white text-2xl">Pesanan</h2>
      </AnimatedCardHeader>
      <AnimatedCardBody>
        <div className="mb-4">
          <label
            htmlFor="yearSelect"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tahun
          </label>
          <div className="relative mt-2">
            <select
              id="yearSelect"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            >
              {years.map((yearOption) => (
                <option
                  key={yearOption}
                  value={yearOption}
                  className="py-2 pl-3 pr-9"
                >
                  {yearOption}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>

        <div className="relative h-96">
          <canvas ref={chartRef} />
        </div>
      </AnimatedCardBody>
    </AnimatedCard>
  );
}
