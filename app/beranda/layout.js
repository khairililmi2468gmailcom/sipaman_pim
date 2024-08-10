"use client";
import NavBar from '../navbar';
import { motion } from "framer-motion";

export default function BerandaLayout({ children }) {
    return (
        <div>
            <NavBar />
            <main initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }} className="mt-16 md:mt-8 w-full max-w-fit overflow-x-clip">{children}</main>
        </div>
    );
}