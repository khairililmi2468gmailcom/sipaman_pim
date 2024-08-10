import React, { useState } from 'react';
import PersetujuanModal from './PersetujuanModal';
import ProgressBar from '../../progress';

const PersetujuanButton = ({ id, onUpdateSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleClick = async () => {
        setLoading(true); // Show the progress bar
        console.log('itemId:', id);
        try {
            const response = await fetch(`/api/pemesanan/GetDetail?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                setItem(data);
                setIsModalOpen(true);  // Open the modal after data is fetched
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Hide the progress bar
        }
    };
    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                className="py-2 px-3 flex items-center text-sm font-medium text-center text-green-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-green-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-1.5 -ml-1 text-white-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                </svg>
                Persetujuan
            </button>
            {loading && <ProgressBar show={loading} />}
            {isModalOpen && <PersetujuanModal toggleModal={() => setIsModalOpen(false)} item={item} onUpdateSuccess={onUpdateSuccess} />}
        </>
    );
};

export default PersetujuanButton;
