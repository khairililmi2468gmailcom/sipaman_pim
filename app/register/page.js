"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Register() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const toggleModal = () => {
        if (!isModalOpen) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
            router.back();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Reset error message when user changes the input
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let formIsValid = true;
        const newErrors = {};

        // Check if all fields are filled
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                newErrors[key] = `${key} tidak boleh kosong!`;
                formIsValid = false;
            }
        }

        // Check if passwords match
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password dan konfirmasi password tidak sama!';
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setLoading(true); // Mulai loading ketika form dikirim

        const { name, email, password, role } = formData;

        const data = {
            nama: name,
            email,
            password,
            role
        };

        try {
            const response = await fetch('/api/user/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setLoading(false); // Hentikan loading setelah berhasil
                router.back();
            } else {
                const result = await response.json();
                setErrors({ general: result.error || 'Gagal menambahkan user' });
                setLoading(false); // Hentikan loading jika ada error

            }
        } catch (error) {
            setErrors({ general: 'Gagal menambahkan user. Coba lagi.' });
        }
    };
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordKonfirmasi, setShowPasswordKonfirmasi] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const toggleShowPasswordKonfirmasi = () => {
        setShowPasswordKonfirmasi(prevState => !prevState);
    }
    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <ClipLoader size={50} color={"#ffffff"} loading={loading} />
                </div>
            )}
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Tambah User</h2>
                    <form onSubmit={handleSubmit} className="shadow-lg p-8">
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama User/Departement</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    placeholder="Masukkan nama"
                                    required
                                />
                                {errors.name && <div className="text-red-600 mt-2 text-sm">{errors.name}</div>}
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    placeholder="Masukkan Email"
                                    required
                                />
                                {errors.email && <div className="text-red-600 mt-2 text-sm">{errors.email}</div>}
                            </div>
                            <div className="w-full">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.password && <div className="text-red-600 mt-2 text-sm">{errors.password}</div>}
                            </div>
                            <div className="w-full">
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Konfirmasi Password</label>
                                <div className="relative">

                                    <input
                                        type={showPasswordKonfirmasi ? "text" : "password"}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleShowPasswordKonfirmasi}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPasswordKonfirmasi ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.confirmPassword && <div className="text-red-600 mt-2 text-sm">{errors.confirmPassword}</div>}
                            </div>
                            <div>
                                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                                <select
                                    name="role"
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${errors.role ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                >
                                    <option value="" disabled>Pilih Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="pemesan">Departement</option>
                                </select>
                                {errors.role && <div className="text-red-600 mt-2 text-sm">{errors.role}</div>}
                            </div>
                        </div>
                        {errors.general && <div className="text-red-600 mt-4 text-sm">{errors.general}</div>}
                        <div className="flex items-center space-x-4 mt-8">
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Tambah Pemesan
                            </button>
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="text-gray-600 inline-flex items-center hover:text-white border border-grey-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
