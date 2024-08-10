import React from 'react';

const ProgressBar = ({ show }) => {
    return (
        show ? (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg">
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                                Loading...
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-full bg-gray-200 rounded-full">
                                <div className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default ProgressBar;
