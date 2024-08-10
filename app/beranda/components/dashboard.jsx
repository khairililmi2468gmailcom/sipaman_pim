"use client";
import React, { useEffect, useState } from "react";
import ChartLine from "./componetAsset/ChartLine";
import ChartBar from "./componetAsset/ChartBar";
import StatusCard from "./componetAsset/StatusCard";
import { motion } from "framer-motion";

const DashboardIsi = () => {
  const [statusCards, setStatusCards] = useState([]);

  useEffect(() => {
    const fetchStatusCards = async () => {
      try {
        const response = await fetch("/api/pemesanan/GetStatus");
        const data = await response.json();
        setStatusCards(data);
      } catch (error) {
        console.error("Error fetching status cards:", error);
      }
    };

    fetchStatusCards();
  }, []);

  return (
    <motion.div
      className="flex bg-gray-100 rounded-xl items-center justify-center px-2 md:px-8 mt-4 mb-8 ml-5 md:ml-10 lg:ml-16 min-h-screen w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="container mx-auto max-w-full"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex-1 flex justify-start space-x-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1
            className="mt-8 text-5xl font-extrabold dark:text-white"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Beranda
            <motion.span
              className="block lg:inline bg-green-100 text-green-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Statistik
            </motion.span>
          </motion.h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:w-full md:w-full w-auto mr-4 lg:mr-0 md:mr-0">
          {statusCards.map((card, index) => (
            <StatusCard
              key={index}
              color={card.color}
              icon={card.icon}
              title={card.title}
              amount={card.amount}
              difference={card.difference}
              differenceIcon={card.differenceIcon}
              differenceColor={card.differenceColor}
              date={card.date}
            />
          ))}
        </div>

        <div className="mt-8 mr-4 lg:mr-0 md:mr-0">
          <div className="container mx-auto max-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
              <div className="w-full h-96 mb-36">
                <ChartLine />
              </div>
              <div className="w-full h-96">
                <ChartBar />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardIsi;
