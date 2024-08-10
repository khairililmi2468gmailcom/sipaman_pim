
import React from 'react';

const DetailModal = ({ toggleModal, item }) => {
    if (!item) {
        return null;
    }
    return (
        <div className="fixed -inset-4 z-40 flex items-center justify-center bg-black bg-opacity-50">

            <div
                id="drawer-read-product-advanced"
                className=" overflow-y-auto fixed top-0 left-0 z-40 p-4 w-full max-w-lg h-screen bg-white transition-transform transform translate-x-0 dark:bg-gray-800"
                tabIndex="-1"
                aria-labelledby="drawer-label"
                aria-hidden="true"
            >
                <div className="mt-8">
                    <h4 id="read-drawer-label" className="mb-1.5 leading-none text-4xl font-semibold text-gray-900 dark:text-white">Detail Pesanan</h4>
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

                <div className="relative p-6 flex-auto mb-4">
                    <dl className="sm:mb-5">
                        <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Keterangan</dt>
                        <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400 overflow-hidden text-ellipsis break-words whitespace-normal">
                            {item.keterangan || 'Tidak ada keterangan'}
                        </dd>
                    </dl>
                </div>
                <div className="relative p-6 flex-auto mb-8">
                    <dl className="sm:mb-5">
                        <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Catatan</dt>
                        <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400 overflow-hidden text-ellipsis break-words whitespace-normal">
                            {item.catatan || 'Tidak ada catatan'}
                        </dd>
                    </dl>
                </div>
            </div >
        </div >
    );
};

export default DetailModal;


