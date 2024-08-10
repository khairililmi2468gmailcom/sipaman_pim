"use client";
import React from "react";
import { FaArrowUp, FaArrowDown, FaBox, FaCheckCircle } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import { motion } from "framer-motion";

const iconMap = {
  total: FaBox,
  pemesan: FaCheckCircle,
  box: FaBox,
  check: FaCheckCircle,
};

export default function StatusCard({
  color,
  icon,
  title,
  amount,
  percentage,
  percentageColor,
  percentageIcon,
  date,
}) {
  const IconComponent = iconMap[icon.toLowerCase()] || FaBox;

  const appearAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }; // Ensure `amount` is a number
  const numericAmount = Number(amount);

  const animatedAmountProps = useSpring({
    from: { number: 0 },
    to: { number: numericAmount },
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
    onChange: ({ number }) => {
      // Handle number change if needed
    },
  });
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={appearAnimation}
      transition={{ duration: 0.5 }}
      className={`p-4 bg-${color}-500 rounded-lg shadow-lg flex flex-col-1 items-start justify-center h-full`}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center mb-4 mr-4"
      >
        <div className={`bg-${color}-300 p-3 rounded-full`}>
          <IconComponent size="2rem" color="white" />
        </div>
      </motion.div>
      <div className="flex flex-col flex-grow">
        <motion.h3
          className="text-lg font-medium text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {title}
        </motion.h3>
        <animated.p className="text-4xl font-bold text-white">
          {animatedAmountProps.number.to((n) => Math.floor(n))}
        </animated.p>
        <div className="flex items-center justify-between text-sm mt-4">
          <span
            className={`text-${percentageColor}-500 flex items-center font-bold`}
          >
            {percentage}
          </span>
          <div className="flex items-center space-x-2  ">
            {percentageIcon === "arrow_upward" && (
              <FaArrowUp color={percentageColor} />
            )}
            {percentageIcon === "arrow_downward" && (
              <FaArrowDown color={percentageColor} />
            )}
          </div>
        </div>
        <motion.p
          className="text-xs text-gray-500 mt-2 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {date}
        </motion.p>
      </div>
    </motion.div>
  );
}
