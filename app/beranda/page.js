"use client";

import { useState, useRef, useEffect } from "react";
import DashboardIsi from "./components/dashboard";
import LoadingBar from 'react-top-loading-bar';
import ClipLoader from "react-spinners/ClipLoader";

export default function Beranda() {
    const [loading, setLoading] = useState(true);
    const loadingBar = useRef(null);

    useEffect(() => {
        loadingBar.current.continuousStart();
        setTimeout(() => {
            setLoading(false);
            loadingBar.current.complete();
        }, 2000);
    }, []);

    return (
        <>
            <LoadingBar color="#f11946" ref={loadingBar} />

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="loader">
                        <ClipLoader size={50} color={"#ffffff"} loading={loading} />
                    </div>
                </div>
            )}

            <div className={`flex mb-32 lg:mb-0 ${loading ? 'blur-sm' : ''}`}>
                <DashboardIsi />
            </div>
        </>
    );
}
