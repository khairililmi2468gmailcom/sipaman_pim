"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClipLoader from "react-spinners/ClipLoader";
import Link from 'next/link'; // Import Link from next/link

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/Post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `token=${data.token}; path=/; max-age=3600; SameSite=Strict;`;
        console.log('Login successful, token set:', data.token);

        console.log('Role:', data.user?.role);
        console.log('ID User:', data.user?.id);
        console.log('Nama:', data.user?.nama);

        // Save role and id_user to sessionStorage
        sessionStorage.setItem('role', data.user?.role || '');
        sessionStorage.setItem('id_user', data.user?.id || '');
        sessionStorage.setItem('nama', data.user?.nama || '');
        setShowSuccessModal(true);
        setTimeout(() => {
          setModalVisible(true);
        }, 30);
        setTimeout(() => {
          router.push('/beranda');
        }, 1500);
      } else {
        console.error('Login failed:', data.error);
        setError(data.error);
      }
    } catch (error) {
      console.error('Failed to login:', error);
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/bg_login.png)' }}>
      <section className="bg-gray-50 bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-50 min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center px-8 py-8 mx-auto lg:py-0">
          <Link href="#" className="mt-10 flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-16 h-16 mr-2" src="/pim_logo.png" alt="logo" />
            SIPAMAN
          </Link>
          <div className="w-full max-w-lg bg-white rounded-lg shadow dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-8 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Masuk ke Akun
              </h1>
              <form className="space-y-4 md:space-y-8" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={handleInputChange(setEmail)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      value={password}
                      onChange={handleInputChange(setPassword)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 dark:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Sembunyi" : "Lihat"}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Login
                </button>

                {error && <p className="text-red-500 text-center">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader">
            <ClipLoader size={50} color={"#ffffff"} loading={loading} />
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-lg shadow p-8 text-center transition-transform duration-300 ${modalVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
          >
            <div className={`checkmark-container ${modalVisible ? 'animate-checkmark' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Berhasil Login!</h2>
            <p className="text-center">Anda akan diarahkan ke halaman beranda.</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .checkmark-container {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
        }

        .checkmark {
          width: 100%;
          height: 100%;
          stroke: #4CAF50;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .animate-checkmark {
          animation: checkmark-animation 1s ease-in-out forwards;
        }

        @keyframes checkmark-animation {
          0% {
            stroke-dasharray: 0, 100;
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            stroke-dasharray: 50, 100;
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            stroke-dasharray: 100, 100;
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
