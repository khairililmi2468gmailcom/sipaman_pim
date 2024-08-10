import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import axios from "axios";
import { motion } from "framer-motion";

ChartJS.register(
  BarController,
  BarElement,
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

const ChartBar = () => {
  const chartRef = useRef(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2004 },
    (_, i) => 2005 + i
  ).reverse(); // Reverse the array to display the latest year first

  const colors = {
    "Kue Basah": "#FF6384", // Red
    "Kue Kering": "#36A2EB", // Blue
    Lainnya: "#FFCE56", // Orange
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/pemesanan/GetBarchart?year=${year}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [year]);

  useEffect(() => {
    if (!data.length) return;

    const labels = [
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
    ];
    const chartData = {
      labels,
      datasets: [],
    };

    const jenisKonsumsiSet = new Set(["Kue Basah", "Kue Kering"]);
    const otherJenisData = Array(12).fill(0);

    data.forEach((item, index) => {
      Object.keys(item.data).forEach((jenis) => {
        if (!jenisKonsumsiSet.has(jenis)) {
          otherJenisData[index] += item.data[jenis];
        }
      });
    });

    jenisKonsumsiSet.forEach((jenis) => {
      const dataset = {
        label: jenis,
        backgroundColor: colors[jenis],
        borderColor: colors[jenis],
        borderWidth: 1,
        data: data.map((item) => item.data[jenis] || 0),
        barThickness: 8,
      };
      chartData.datasets.push(dataset);
    });

    chartData.datasets.push({
      label: "Lainnya",
      backgroundColor: colors["Lainnya"],
      borderColor: colors["Lainnya"],
      borderWidth: 1,
      data: otherJenisData,
      barThickness: 8,
    });

    const config = {
      type: "bar",
      data: chartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: false,
            text: "Jenis Konsumsi Chart",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
          legend: {
            labels: {
              color: "rgba(17,17,17,.7)",
            },
            align: "end",
            position: "bottom",
          },
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Month",
            },
            grid: {
              borderDash: [2],
              borderDashOffset: 2,
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(33, 37, 41, 0.3)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: 2,
            },
          },
          y: {
            display: true,
            title: {
              display: false,
              text: "Value",
            },
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              precision: 0,
            },
            grid: {
              borderDash: [2],
              drawBorder: false,
              borderDashOffset: 2,
              color: "rgba(33, 37, 41, 0.2)",
              zeroLineColor: "rgba(33, 37, 41, 0.15)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        },
      },
    };

    const ctx = document.getElementById("bar-chart").getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new ChartJS(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <AnimatedCard>
      <AnimatedCardHeader
        color="pink"
        contentPosition="left"
        className="bg-blue-500 p-4 mt-4"
      >
        <h6 className="uppercase text-white text-xs font-medium ">Barchart </h6>
        <h2 className="text-white text-2xl">Jenis Konsumsi </h2>
      </AnimatedCardHeader>
      <AnimatedCardBody>
        <div className="flex justify-end mb-4">
          <label htmlFor="yearSelect" className="block text-gray-700">
            Pilih Tahun:
          </label>
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
        </div>
        <div className="relative h-96">
          <canvas id="bar-chart"></canvas>
        </div>
      </AnimatedCardBody>
    </AnimatedCard>
  );
};

export default ChartBar;
