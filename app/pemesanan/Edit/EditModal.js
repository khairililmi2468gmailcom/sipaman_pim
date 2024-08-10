"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import ClipLoader from 'react-spinners/ClipLoader';

const options = [
    { id: 0, name: 'Pilih Jenis Konsumsi', value: '', color: 'bg-transparent' },
    { id: 1, name: 'Kue Basah', value: 'Kue Basah', avatar: '/jenisKonsumsi/kueBasah.jpg' },
    { id: 2, name: 'Kue Kering', value: 'Kue Kering', avatar: '/jenisKonsumsi/kueKering.jpg' },
];


const statusOptions = [
    { id: 0, name: 'Pilih Status', value: '', color: 'bg-transparent' },
    { id: 1, name: 'Disetujui', value: 'Disetujui', color: 'bg-green-700' },
    { id: 2, name: 'Perbaiki', value: 'Perbaiki', color: 'bg-yellow-500' },
    { id: 3, name: 'Ditolak', value: 'Ditolak', color: 'bg-red-700' },
]

const EditModal = ({ toggleModal, initialData, onUpdateSuccess }) => {
    // jenis konsumsi option
    const [selected, setSelected] = useState(options[0])
    // status option item
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0])
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(true);

    const [loading, setLoading] = useState(false);
    const loadingBar = useRef(null);
    const [errorMessages, setErrorMessages] = useState({
        kegiatan: '',
        lokasi: '',
        jenis_konsumsi: '',
        cost_center: '',
        tanggal_permintaan: '',
        jumlah_box_pesan: ''
    });

    const [role, setRole] = useState('');
    const [idUser, setIdUser] = useState('');
    useEffect(() => {
        const storedRole = sessionStorage.getItem('role');
        const storedIdUser = sessionStorage.getItem('id_user');
        setRole(storedRole || '');
        setIdUser(storedIdUser || '');
    }, []);

    const [formData, setFormData] = useState({
        id_permintaan: initialData.id || '',
        kegiatan: initialData.kegiatan || '',
        waktu: initialData.waktu || '',
        lokasi: initialData.lokasi || '',
        jenis_konsumsi: initialData.jenis_konsumsi || '',
        cost_center: initialData.cost_center || '',
        status: initialData.status || '',
        tanggal_permintaan: initialData.tanggal_permintaan || '',
        tanggal_persetujuan: initialData.tanggal_persetujuan || '',
        jumlah_box_pesan: initialData.jumlah_box_pesan || '',
        jumlah_box_disetujui: initialData.jumlah_box_disetujui || '',
        keterangan: initialData.keterangan || '',
        catatan: initialData.catatan || ''
    });

    useEffect(() => {
        setSelected(options.find(option => {
            if (option.values) {
                return option.values.includes(formData.jenis_konsumsi);
            }
            return option.value === formData.jenis_konsumsi;
        }) || options[0]);

        // setSelectedStatus(statusOptions.find(option => option.value === formData.status) || statusOptions[0]);
    }, [formData.jenis_konsumsi]);

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            tanggal_permintaan: formatDateForInput(prevData.tanggal_permintaan),
            tanggal_persetujuan: formatDateForInput(prevData.tanggal_persetujuan),
        }));
    }, []);

    // useEffect(() => {
    //     const isValid = selectedStatus.value !== '' && selected.value !== '';
    //     setIsSubmitEnabled(isValid);
    // }, [selectedStatus, selected]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Reset error messages
        setErrorMessages({});
        // Validasi input
        const errors = {};
        if (!formData.kegiatan) {
            errors.kegiatan = 'Kegiatan harus diisi';
        } else if (!formData.lokasi) {
            errors.lokasi = "Lokasi harus diisi";
        } else if (!formData.jenis_konsumsi || formData.jenis_konsumsi == '') {
            errors.jenis_konsumsi = "Jenis Konsumsi harus diisi"
        } else if (!formData.cost_center) {
            errors.cost_center = "Cost Center harus diisi"
        } else if (!formData.tanggal_permintaan) {
            errors.tanggal_permintaan = "Tanggal permintaan harus diisi"
        } else if (!formData.jumlah_box_pesan) {
            errors.jumlah_box_pesan = "Jumlah box harus diisi"
        }
        // Jika ada error, set errorMessages dan hentikan proses submit
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        setLoading(true);
        const dataToSubmit = {
            ...formData,
            jenis_konsumsi: selected.value,
            status: selectedStatus.value,
            tanggal_permintaan: formatDateForDatabase(formData.tanggal_permintaan),
            tanggal_persetujuan: formatDateForDatabase(formData.tanggal_persetujuan),
        };

        // if (selectedStatus.value === '' || selected.value === '') {
        //     alert('Tolong pilih status dan jenis konsumsi yang valid');
        //     return;
        // }

        try {
            const response = await fetch(`/api/pemesanan/Put?id=${formData.id_permintaan}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            console.log('Data updated successfully:', result);
            toggleModal();
            onUpdateSuccess();
        } catch (error) {
            console.error('Error updating data:', error.message);
        } finally {
            setLoading(false); // Hentikan loading
        }
    };


    const formatDateForInput = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const year = parsedDate.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const formatDateForDatabase = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <ClipLoader size={50} color={"#ffffff"} loading={loading} />
                </div>
            )}

            <div className="fixed -inset-4 z-40 flex items-center justify-center bg-black bg-opacity-50">
                <div
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-screen overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="drawer-update-product-label"
                >
                    <div className="flex justify-between items-center">
                        <h5
                            id="drawer-update-product-label"
                            className="text-lg font-semibold text-gray-700 dark:text-gray-200"
                        >
                            Edit Pesanan
                        </h5>
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className="space-y-6 mt-4">
                        <div>
                            <label
                                htmlFor="kegiatan"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Kegiatan
                            </label>
                            <input
                                type="text"
                                name="kegiatan"
                                id="kegiatan"
                                value={formData.kegiatan}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Masukkan Kegiatan"
                                required
                            />

                            {errorMessages.kegiatan && (
                                <p className="mt-2 text-sm text-red-600">{errorMessages.kegiatan}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="lokasi" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lokasi</label>
                            <input type="text" name="lokasi" id="lokasi" value={formData.lokasi}
                                onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Contoh: Gedung Rapat Umum PIM" />
                            {errorMessages.lokasi && (
                                <p className="mt-2 text-sm text-red-600">{errorMessages.lokasi}</p>
                            )}
                        </div>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="waktu"
                                    onChange={handleChange} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Waktu Mulai Kegiatan</label>
                                <input type="time" name="waktu" id="waktu" value={formData.waktu || ''}
                                    onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="09.00 AM" />
                            </div>

                            {/* list jenis konsumsi */}

                            <div className="mb-4">
                                <label htmlFor="jenisKonsumsi" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jenis Konsumsi</label>
                                <Listbox value={selected} onChange={setSelected}>
                                    <div className="relative mt-2">
                                        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm">
                                            <span className="flex items-center">
                                                <img src={selected.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                <span className="ml-3 block truncate">{selected.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </ListboxButton>
                                        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {options.map((option) => (
                                                <ListboxOption
                                                    key={option.id}
                                                    value={option}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-orange-600 text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <span className="flex items-center">
                                                            <img src={option.avatar} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                                            <span className={`ml-3 block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                {option.name}
                                                            </span>
                                                        </span>
                                                    )}
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </div>
                                    {errorMessages.jenis_konsumsi && (
                                        <p className="mt-2 text-sm text-red-600">{errorMessages.jenis_konsumsi}</p>
                                    )}
                                </Listbox>

                            </div>
                            <div>
                                <label htmlFor="costCenter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cost Center</label>
                                <input type="text" name="cost_center" id="costCenter" value={formData.cost_center}
                                    onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Contoh: A1B21R"
                                    required />
                                {errorMessages.cost_center && (
                                    <p className="mt-2 text-sm text-red-600">{errorMessages.cost_center}</p>
                                )}
                            </div>

                            {/* status option */}
                            <div className="mb-4">
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Status
                                </label>
                                <Listbox
                                    value={selectedStatus}
                                    onChange={(value) => {
                                        setSelectedStatus(value);
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            status: value.value,
                                        }));
                                    }}
                                    disabled={role === 'pemesan'}
                                >
                                    <div className="relative mt-2">
                                        <Listbox.Button className={`relative w-full cursor-default rounded-md bg-gray-50 py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-primary-500 ${role === 'pemesan' ? 'bg-yellow-100' : ''
                                            }`}>
                                            <span className="flex items-center">
                                                <span className={`h-4 w-4 rounded-full inline-block mr-2 ${selectedStatus.color}`}></span>
                                                <span className="ml-3 block truncate">{selectedStatus.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-700 dark:text-white">
                                            {statusOptions.map((option) => (
                                                <Listbox.Option
                                                    key={option.id}
                                                    value={option}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-orange-600 text-white' : 'text-gray-900'
                                                        } dark:${active ? 'bg-orange-600 text-white' : 'text-gray-100'}`
                                                    }
                                                >
                                                    <span className="flex items-center">
                                                        <span className={`h-4 w-4 rounded-full inline-block mr-2 ${option.color}`}></span>
                                                        <span className={`ml-3 block truncate`}>{option.name}</span>
                                                    </span>
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </div>
                                </Listbox>
                                {role === 'pemesan' && (
                                    <p className="text-yellow-600 text-sm mt-1">
                                        Hanya admin yang bisa mengubah status.
                                    </p>
                                )}
                            </div>

                            {/* Tanggal permintaan hanya untuk pemesan */}
                            <div>
                                <label htmlFor="tanggalPermintaan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal Permintaan</label>
                                <input
                                    type="date"
                                    name="tanggal_permintaan"
                                    id="tanggalPermintaan"
                                    value={formData.tanggal_permintaan}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    required
                                />
                                {errorMessages.tanggal_permintaan && (
                                    <p className="mt-2 text-sm text-red-600">{errorMessages.tanggal_permintaan}</p>
                                )}
                            </div>
                            {/* Tanggal Persetujuan hanya untuk admin */}
                            <div>
                                <label htmlFor="tanggalPersetujuan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tanggal Persetujuan
                                </label>
                                <input
                                    type="date"
                                    name="tanggal_persetujuan"
                                    id="tanggalPersetujuan"
                                    value={formData.tanggal_persetujuan}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${role === 'pemesan' ? 'bg-yellow-100' : ''
                                        }`}
                                    disabled={role === 'pemesan'}
                                />
                                {role === 'pemesan' && (
                                    <p className="text-yellow-600 text-sm mt-1">
                                        Hanya admin yang bisa mengubah.
                                    </p>
                                )}
                            </div>

                            {/* Jumlah box pesan hanya untuk pemesan */}
                            <div>
                                <label htmlFor="jumlahBoxDiminta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jumlah Box Diminta</label>
                                <input type="number" name="jumlah_box_pesan" id="jumlahBoxDiminta" value={formData.jumlah_box_pesan}
                                    onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="0"
                                    required />
                                {errorMessages.jumlah_box_pesan && (
                                    <p className="mt-2 text-sm text-red-600">{errorMessages.jumlah_box_pesan}</p>
                                )}
                            </div>
                            {/* Jumlah box disetujui hanya untuk admin */}
                            <div>
                                <label htmlFor="jumlahBoxDisetujui" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Jumlah Box Disetujui
                                </label>
                                <input
                                    type="number"
                                    name="jumlah_box_disetujui"
                                    id="jumlahBoxDisetujui"
                                    value={formData.jumlah_box_disetujui}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${role === 'pemesan' ? 'bg-yellow-100' : ''
                                        }`}
                                    placeholder="0"
                                    disabled={role === 'pemesan'}
                                />
                                {role === 'pemesan' && (
                                    <p className="text-yellow-600 text-sm mt-1">
                                        Hanya admin yang bisa mengubah
                                    </p>
                                )}
                            </div>

                            {/* deskripsi */}
                            <div className="sm:col-span-2">
                                <label htmlFor="keterangan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keterangan</label>
                                <textarea
                                    id="keterangan"
                                    name="keterangan"
                                    rows="5"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Tulis keterangan..."
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Catatan</label>
                                <textarea
                                    name="catatan"
                                    id="catatan"
                                    rows="3"
                                    value={formData.catatan}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${role === 'pemesan' ? 'bg-yellow-100' : ''
                                        }`}
                                    placeholder="Catatan tambahan"
                                    disabled={role === 'pemesan'}
                                />
                                {role === 'pemesan' && (
                                    <p className="text-yellow-600 text-sm mt-1">
                                        Catatan ini hanya bisa diisi oleh admin.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-gray-600"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isSubmitEnabled}
                                className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 ${!isSubmitEnabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditModal;
