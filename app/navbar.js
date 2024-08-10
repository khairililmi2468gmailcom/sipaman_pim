"use client";
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const NavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const getLinkClass = (path) => {
        if (pathname === path) {
            return 'text-blue-500 dark:text-blue-500 hover:text-blue-700';
        } else {
            return 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black';
        }
    };

    const handleLogout = () => {
        // Remove the token cookie immediately
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Optionally clear session storage if it stores user data
        sessionStorage.clear();

        // Use router.replace for a faster redirect
        router.replace('/');
    };

    const [role, setRole] = useState("");
    const [idUser, setIdUser] = useState("");
    const [namaDepartement, setNamaDepartement] = useState("");

    useEffect(() => {
        const storedRole = sessionStorage.getItem("role");
        const storedIdUser = sessionStorage.getItem("id_user");
        const storedNamaDepartement = sessionStorage.getItem("nama");
        setRole(storedRole || "");
        setIdUser(storedIdUser || "");
        setNamaDepartement(storedNamaDepartement || "");
    }, []);

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image src="/pim_logo.png" className="h-8" alt="Flowbite Logo" width={32} height={32} />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">SIPAMAN</span>
                </Link>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

                    <p className='text-sm text-gray-900 dark:text-white mr-4 '>{namaDepartement}</p>
                    <button
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        id="user-menu-button"
                        aria-expanded={isDropdownOpen}
                        onClick={toggleDropdown}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full bg-white" src="/pim_logo.png" alt="user photo" />
                    </button>
                    {isDropdownOpen && (
                        <div
                            className="z-50 absolute right-0 mt-32 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                            id="user-dropdown"
                        >
                            <ul className="py-2" aria-labelledby="user-menu-button">
                                {/* <li>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    >
                                        Profile
                                    </Link>
                                </li> */}

                                <li>
                                    <Link
                                        href={'#'}
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    >
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                    <button
                        onClick={toggleMenu}
                        data-collapse-toggle="navbar-user"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-user"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? '' : 'hidden'}`}
                    id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link
                                href={"/beranda"}
                                className={`block py-2 px-3 rounded md:p-0 ${getLinkClass('/beranda')}`}
                                aria-current="page"
                            >
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={"/pemesanan"}
                                className={`block py-2 px-3 rounded md:p-0 ${getLinkClass('/pemesanan')}`}
                                aria-current="page"
                            >
                                Pemesanan
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={"/laporan"}
                                className={`block py-2 px-3 rounded md:p-0 ${getLinkClass('/laporan')}`}
                            >
                                Laporan
                            </Link>
                        </li>
                        <li>
                            {role === 'admin' && (
                                <Link href="/register"
                                    className={`block py-2 px-3 rounded md:p-0 ${getLinkClass('/register')}`}
                                > Tambah User
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
