import React, { useState } from 'react';
import DetailModal from './DetailModal';
import ProgressBar from '../../progress';

const DetailButton = ({ itemId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true); // Show the progress bar
        console.log('itemId:', itemId);
        try {
            const response = await fetch(`/api/pemesanan/GetDetail?id=${itemId}`);
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
                className="py-2 px-3 flex items-center text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2 -ml-0.5">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
                </svg>
                Detail
            </button>
            {loading && <ProgressBar show={loading} />}
            {isModalOpen && <DetailModal toggleModal={() => setIsModalOpen(false)} item={item} />}
        </>
    );
};

export default DetailButton;
