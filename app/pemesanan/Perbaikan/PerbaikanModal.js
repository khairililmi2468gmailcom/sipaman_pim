"use client";
import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const PerbaikanModal = ({ toggleModal, initialData, onUpdateSuccess, onUpdatePerbaiki }) => {
    const [loading, setLoading] = useState(false);
    const [jumlahBoxDisetujui, setJumlahBoxDisetujui] = useState(initialData.jumlah_box_disetujui || 0);
    const [keterangan, setKeterangan] = useState(initialData.keterangan || '');

    if (!initialData) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedItem = {
            ...initialData, // Copy all existing data
            id_permintaan: initialData.id,
            status: 'Perbaiki',
            jumlah_box_disetujui: jumlahBoxDisetujui,
            keterangan: keterangan,
            tanggal_permintaan: formatDateForMySQL(initialData.tanggal_permintaan),
            tanggal_persetujuan: formatDateForMySQL(initialData.tanggal_persetujuan),

        };

        try {
            const response = await fetch(`/api/pemesanan/Put?id=${initialData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });
            if (response.ok) {
                toggleModal();
                onUpdateSuccess();
                onUpdatePerbaiki();
            } else {
                console.error('Failed to update data', await response.json());
            }
        } catch (error) {
            console.error('Error updating data:', error.message);
        } finally {
            setLoading(false);
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

    return (
        <div className="fixed inset-y-14 -inset-x-4 h-full z-40 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-full mx-4 my-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="drawer-update-product-label">
                <div className="flex justify-between items-center">
                    <h5 id="drawer-update-product-label" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Catatan Perbaikan
                    </h5>
                    <button type="button" onClick={toggleModal} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="jumlah_box_disetujui" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jumlah Box Disetujui</label>
                        <input
                            type="number"
                            name="jumlah_box_disetujui"
                            id="jumlah_box_disetujui"
                            value={jumlahBoxDisetujui}
                            onChange={(e) => setJumlahBoxDisetujui(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="0"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="keterangan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keterangan</label>
                        <textarea
                            id="keterangan"
                            name="keterangan"
                            rows="5"
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Tulis keterangan..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={toggleModal} className="inline-flex bg-gray-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-gray-600">
                            Batal
                        </button>
                        <button type="submit" className="inline-flex bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-1.5 -ml-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.927 2.387a.75.75 0 00-1.091.845l1.737 6.105-1.737 6.105a.75.75 0 001.091.845L17.923 9.394a.75.75 0 000-1.288L2.927 2.387zM2.612 8.75l.884-3.108L15.474 10 3.496 8.057a.75.75 0 00-.884-.108z" />
                            </svg>
                            Kirim
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PerbaikanModal;
