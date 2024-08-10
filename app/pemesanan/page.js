"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import DeleteButton from './Delete/DeleteButton';
import EditButton from './Edit/EditButton';
import DetailButton from './Detail/DetailButton';
import TambahButton from './Tambah/TambahButton';
import PersetujuanButton from './Persetujuan/PersetujuanButton';
import LoadingBar from 'react-top-loading-bar';
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import { format } from "date-fns"; // Import date-fns for date formatting
import { id as idLocale } from "date-fns/locale"; // Import Indonesian locale

export default function Pemesanan() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const loadingBar = useRef(null);
    const [role, setRole] = useState('');
    const [idUser, setIdUser] = useState('');
    const [namaDepartement, setNamaDepartement] = useState('');
    const fetchUser = async () => {
        try {
            const response = await fetch('/api/user/Get');
            const users = await response.json();
            return users.map(user => ({ id: user.id, nama: user.nama }));
        } catch (error) {
            console.error('Failed to fetch users:', error);
            return [];
        }
    };

    const optionsPerPage = [10, 15, 20, 30, 40, 50, 100, 250, 500, 1000, 2000, 5000, 10000];

    // search item
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page
    };
    // Get role and id_user from sessionStorage
    useEffect(() => {
        const storedRole = sessionStorage.getItem('role');
        const storedIdUser = sessionStorage.getItem('id_user');
        const storedNamaDepartement = sessionStorage.getItem('nama');
        setRole(storedRole || '');
        setIdUser(storedIdUser || '');
        setNamaDepartement(storedNamaDepartement || '');

    }, []);

    const extractDateParts = (dateString) => {
        if (!dateString) return { year: "", month: "", day: "" };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { year: "", month: "", day: "" };
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, pad with zero
        const day = date.getDate().toString().padStart(2, '0'); // Pad with zero
        return { year, month, day };
    };

    // Filter the data based on the search query
    const filteredData = data
        .filter(item => {
            const { year, month, day } = extractDateParts(item.tanggal_permintaan);

            const searchQueryLower = searchQuery.toLowerCase();
            return (
                (item.kegiatan && item.kegiatan.toLowerCase().includes(searchQueryLower)) ||
                (item.userName && item.userName.toLowerCase().includes(searchQueryLower)) ||
                (item.waktu && item.waktu.toLowerCase().includes(searchQueryLower)) ||
                (year && year.includes(searchQueryLower)) ||
                (month && month.includes(searchQueryLower)) ||
                (day && day.includes(searchQueryLower)) ||
                (item.lokasi && item.lokasi.toLowerCase().includes(searchQueryLower)) ||
                (item.jenis_konsumsi && item.jenis_konsumsi.toLowerCase().includes(searchQueryLower)) ||
                (item.cost_center && item.cost_center.toLowerCase().includes(searchQueryLower)) ||
                (item.status && item.status.toLowerCase().includes(searchQueryLower)) ||
                (item.jumlah_box_pesan && item.jumlah_box_pesan.toString().toLowerCase().includes(searchQueryLower))
            );
        })
        .sort((a, b) => new Date(b.tanggal_permintaan) - new Date(a.tanggal_permintaan)); // Sort by date descending



    const fetchData = async () => {
        try {
            loadingBar.current.continuousStart();

            // Fetch data from both APIs
            const [users, response] = await Promise.all([
                fetchUser(),
                fetch("/api/pemesanan/Get")
            ]);

            const result = await response.json();

            // Add userName from fetchUser to result
            const resultWithNames = result.map(item => {
                const user = users.find(u => u.id === item.id_user);
                return {
                    ...item,
                    userName: user ? user.nama : 'Unknown Departement'
                };
            });

            // Apply the original filter logic
            let filteredResult;

            if (role === 'pemesan') {
                filteredResult = resultWithNames.filter(item => item.id_user === parseInt(idUser, 10));
            } else {
                filteredResult = resultWithNames;
            }

            // Set filtered data to state
            setData(filteredResult);


            loadingBar.current.complete();
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            loadingBar.current.complete();
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [role, idUser]);

    const handleUpdateSuccess = () => {
        fetchData(); // refresh data update
    };

    const handleCreateSuccess = () => {
        fetchData(); //refresh data create
    }
    // Calculate the current data to display based on the filtered data, current page, and items per page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle change of items per page
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page
    };

    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return format(date, "dd MMMM yyyy", { locale: idLocale });
    };

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

            <motion.section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased" initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>

                <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }} className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <motion.div initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }} className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <motion.div initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }} className="flex-1 flex justify-start space-x-2">
                            <motion.h1 initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }} className="flex items-center text-5xl font-extrabold dark:text-white">Table<span className="bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2">Pesanan</span></motion.h1>
                        </motion.div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }} className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
                        <motion.div initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }} className="w-full md:w-1/2">
                            <motion.form initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }} className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">Cari</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        placeholder="Cari Pesanan"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                            </motion.form>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }} className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            {role === 'pemesan' && (
                                <TambahButton onCreateSuccesss={handleCreateSuccess} />
                            )}
                        </motion.div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }} className="overflow-x-auto">
                        <motion.table initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }} className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="p-4">No</th>
                                    <th scope="col" className="p-4">Nama Departement</th>
                                    <th scope="col" className="p-4">Nama Kegiatan</th>
                                    <th scope="col" className="p-4">Waktu</th>
                                    <th scope="col" class="p-4">
                                        Tanggal Permintaan
                                    </th>
                                    <th scope="col" className="p-4">Lokasi</th>
                                    <th scope="col" className="p-4">Jenis Konsumsi</th>
                                    <th scope="col" className="p-4">Cost Center</th>
                                    <th scope="col" className="p-4">Jumlah Box</th>
                                    <th scope="col" className="p-4">Status</th>
                                    <th scope="col" className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {currentData.length > 0 ? (
                                    currentData.map((item, index) => (
                                        <tr key={item.id} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center mr-3">
                                                    <img src="/pim_logo.png" alt="iMac Front Image" className="h-8 w-auto mr-3" />
                                                    {item.userName}
                                                </div>
                                            </th>
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center mr-3">
                                                    {item.kegiatan}
                                                </div>
                                            </th>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.waktu}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {formatDate(item.tanggal_permintaan)}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.lokasi}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.jenis_konsumsi}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.cost_center}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.jumlah_box_pesan}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center">
                                                    <div className={`h-4 w-4 rounded-full inline-block mr-2 ${item.status === "Disetujui" ? "bg-green-700" : item.status === "Ditolak" ? "bg-red-700" : item.status === "Perbaiki" ? "bg-yellow-600" : "bg-blue-600"}`}></div>
                                                    <span className={`pl-[10px] pr-[10px] pt-[4px] pb-[4px] rounded-xl text-[12px] ${item.status === "Disetujui" ? "bg-green-200 text-green-800" : item.status === "Ditolak" ? "bg-red-200 text-red-800" : item.status === "Perbaiki" ? "bg-yellow-200 text-yellow-800" : "bg-blue-200 text-blue-800"}`}>
                                                        {item.status || 'Belum dikonfirmasi '}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center space-x-4">
                                                    <EditButton id={item.id} onUpdateSuccess={handleUpdateSuccess} />
                                                    <DetailButton id={item.id} itemId={item.id} />
                                                    <DeleteButton id={item.id} onDelete={fetchData} />
                                                    {role === 'admin' && (
                                                        <PersetujuanButton id={item.id} onUpdateSuccess={handleUpdateSuccess} />
                                                    )}                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="p-4 text-center">
                                            Data tidak ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </motion.table>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Tampilkan</span>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                {optionsPerPage.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">entri</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{`Page ${currentPage} of ${totalPages}`}</span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.section >
        </>
    );
}
