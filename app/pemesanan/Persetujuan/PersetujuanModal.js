import React, { useState, useEffect, useRef } from 'react';
import PerbaikanButton from '../Perbaikan/PerbaikanButton';
import LoadingBar from 'react-top-loading-bar';

const PersetujuanModal = ({ toggleModal, item, onUpdateSuccess }) => {
    const [loading, setLoading] = useState(true);
    const loadingBar = useRef(null);

    if (!item) {
        return null;
    }

    const handleSetujuClick = async () => {
        if (!item.id) {
            console.error('Missing item ID');
            return;
        }

        const updatedItem = {
            ...item,
            id_permintaan: item.id,
            status: 'Disetujui',
            tanggal_persetujuan: formatDateForMySQL(new Date().toISOString()),
            jumlah_box_disetujui: item.jumlah_box_pesan,
            tanggal_permintaan: formatDateForMySQL(item.tanggal_permintaan),
        };

        console.log(updatedItem);

        try {
            const response = await fetch(`/api/pemesanan/Put?id=${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                onUpdateSuccess();
                toggleModal();
            } else {
                console.error('Failed to update data', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formatDateForMySQL = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleTolakClick = async () => {
        if (!item.id) {
            console.error('Missing item ID');
            return;
        }

        const updatedItem = {
            ...item,
            id_permintaan: item.id,
            status: 'Ditolak',
            tanggal_persetujuan: null,
            jumlah_box_disetujui: null,
            tanggal_permintaan: formatDateForMySQL(item.tanggal_permintaan),
        };

        console.log('Updated item:', updatedItem);

        try {
            const response = await fetch(`/api/pemesanan/Put?id=${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                toggleModal();
                onUpdateSuccess();
            } else {
                console.error('Failed to update data', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onUpdatePerbaiki = () => {
        onUpdateSuccess(); // Memanggil kembali fetchData untuk mengambil data terbaru
    };
    return (
        <>
            <LoadingBar color="#f11946" ref={loadingBar} />


            <div className="fixed -inset-4 z-40 flex items-center justify-center bg-black bg-opacity-50">

                <div
                    id="drawer-read-product-advanced"
                    className=" overflow-y-auto fixed top-0 left-0 z-40 p-4 w-full max-w-lg h-screen bg-white transition-transform transform translate-x-0 dark:bg-gray-800"
                    tabIndex="-1"
                    aria-labelledby="drawer-label"
                    aria-hidden="true"
                >
                    <div className="mt-8">
                        <h4 id="read-drawer-label" className="mb-1.5 leading-none text-4xl font-semibold text-gray-900 dark:text-white">Persetujuan Pesanan</h4>
                        <h5 className="mb-5 text-xl font-bold text-gray-900 dark:text-white"></h5>
                    </div>
                    <button
                        type="button"
                        onClick={toggleModal}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>

                    <dl className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Nama Kegiatan</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.kegiatan || 'Tidak ada kegiatan'}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Waktu Acara Mulai</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.waktu || 'Waktu belum ditetapkan'}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Lokasi</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.lokasi || 'Lokasi tidak ada'}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Jenis Konsumsi</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.jenis_konsumsi || 'Tidak ada jenis konsumsi'}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Cost Center</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.cost_center || 'Tidak ada cost center'}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Status</dt>
                            <dd className="flex items-center space-x-2 font-light text-gray-500 dark:text-gray-400">
                                <div className={`flex-shrink-0 w-4 h-4 rounded-full ${item.status === "Disetujui" ? "bg-green-600" : item.status === "Ditolak" ? "bg-red-600" : item.status === "Perbaiki" ? "bg-yellow-600" : "bg-blue-600"}`}></div>
                                <dd className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
                                    {item.status || 'Belum dikonfirmasi'}
                                </dd>
                            </dd>

                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Tanggal Permintaan</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.tanggal_permintaan ? new Date(item.tanggal_permintaan).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Tanggal Permintaan Kosong'}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Tanggal Persetujuan</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.tanggal_persetujuan ? new Date(item.tanggal_persetujuan).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Sedang Proses'}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Jumlah Pesanan</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.jumlah_box_pesan}
                            </dd>
                        </div>
                        <div className="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Jumlah Disetujui</dt>
                            <dd className="flex items-center text-gray-500 dark:text-gray-400">
                                {item.jumlah_box_disetujui || "0"}

                            </dd>
                        </div>
                    </dl>

                    <div className="relative p-6 flex-auto">
                        <dl className="sm:mb-5">
                            <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Keterangan</dt>
                            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400 overflow-hidden text-ellipsis break-words whitespace-normal">
                                {item.keterangan || 'Tidak ada keterangan'}
                            </dd>
                        </dl>
                    </div>
                    <div class="flex bottom-0 left-0 justify-center pb-4 space-x-4 w-full">
                        <button type="button"
                            onClick={handleSetujuClick}
                            class="text-white w-full inline-flex items-center justify-center bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-1.5 -ml-1 text-white-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                            </svg>
                            Setujui
                        </button>
                        <PerbaikanButton id={item.id} onUpdateSuccess={onUpdateSuccess} onUpdatePerbaiki={onUpdatePerbaiki} />
                        <button type="button" onClick={handleTolakClick} class="inline-flex w-full items-center text-white justify-center bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-1.5 -ml-1 text-white-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clip-rule="evenodd" />
                            </svg>

                            Tolak
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PersetujuanModal;
