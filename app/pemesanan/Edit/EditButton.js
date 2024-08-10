import React, { useState, useEffect } from 'react';
import EditModal from './EditModal';

const EditButton = ({ id, onUpdateSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(null); // Menyimpan data form
    const [loading, setLoading] = useState(true); // Menandakan status loading data
    const [dataKey, setDataKey] = useState(0); // Menandakan status data untuk trigger

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await fetch(`/api/pemesanan/GetDetail?id=${id}`);
                const data = await res.json();
                setFormData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id, dataKey]); // Tambahkan dataKey untuk memicu fetch ulang

    const toggleModal = () => {
        if (!isModalOpen) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
            setDataKey(prevKey => prevKey + 1); // Trigger data reload when modal closes
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={toggleModal}
                className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 -ml-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 010 2H4v10h10v-4a1 1 112 0v4a2 2 012 2H4a2 2 012-2V6z"
                        clipRule="evenodd"
                    />
                </svg>
                Edit
            </button>
            {isModalOpen && !loading && formData && (
                <EditModal
                    formData={formData}
                    setFormData={setFormData}
                    toggleModal={toggleModal}
                    initialData={formData}
                    onUpdateSuccess={() => {
                        onUpdateSuccess(); // Panggil fungsi onUpdateSuccess
                        setDataKey(prevKey => prevKey + 1); // Trigger data reload on update
                    }}
                />
            )}
        </>
    );
};

export default EditButton;
