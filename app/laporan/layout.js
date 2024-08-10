"use client";
import NavBar from '../navbar';

export default function LaporanLayout({ children }) {
    return (
        <div>
            <NavBar />
            <main className="mt-16 md:mt-8 w-full max-w-fit">{children}</main>
        </div>
    );
}