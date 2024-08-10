import React, { useState, useEffect } from 'react';
import PerbaikanModal from './PerbaikanModal';

const PerbaikanButton = ({ id, onUpdateSuccess, onUpdatePerbaiki }) => { // Destructure props
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataKey, setDataKey] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await fetch(`/api/pemesanan/GetDetail?id=${id}`);
                const data = await res.json();
                console.log('Fetched data:', data);
                setFormData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id, dataKey]);


    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
        if (isModalOpen) {
            setDataKey(prevKey => prevKey + 1);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={toggleModal}
                className="text-white w-full inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-1.5 -ml-1 text-white-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0l-9 9A2 2 0 005 13.414V16a2 2 0 002 2h2.586a2 2 0 001.414-.586l9-9a2 2 0 000-2.828l-3-3zm-6.586 9.828l-3 3V14h2.586l3-3L10.828 12.414zm-3-3L6.586 10H4V7.414L9.414 2h2.828l-5 5H7.414l-1.586 1.586zm8.586 5l-1.586-1.586 2-2L18 8.414l1.586 1.586-2 2L16.828 14.828zM8 16H6v-2l1-1h2v2H8z" />
                </svg>
                Perbaiki
            </button>
            {isModalOpen && !loading && formData && (
                <PerbaikanModal
                    toggleModal={toggleModal}
                    initialData={formData}
                    onUpdateSuccess={onUpdateSuccess}
                    onUpdatePerbaik={onUpdatePerbaiki}
                />
            )}
        </>
    );
};

export default PerbaikanButton;
