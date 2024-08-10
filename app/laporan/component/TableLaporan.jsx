"use client";

import { useEffect, useState, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { format } from "date-fns"; // Import date-fns for date formatting
import { id as idLocale } from "date-fns/locale"; // Import Indonesian locale
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const TableLaporan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const loadingBar = useRef(null);
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/Get");
      const users = await response.json();
      return users.map((user) => ({ id: user.id, nama: user.nama }));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  };
  const optionsPerPage = [
    10, 15, 20, 30, 40, 50, 100, 250, 500, 1000, 2000, 5000, 10000,
  ];
  // Calculate the current data to display based on the current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle change of items per page
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
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

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return format(date, "dd MMMM yyyy", { locale: idLocale });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        loadingBar.current.continuousStart();
        // Fetch data from both APIs
        const [users, response] = await Promise.all([
          fetchUser(),
          fetch("/api/pemesanan/Get"),
        ]);

        const result = await response.json();

        // Add userName from fetchUser to result
        const resultWithNames = result.map((item) => {
          const user = users.find((u) => u.id === item.id_user);
          return {
            ...item,
            userName: user ? user.nama : "Unknown Departement",
          };
        });

        // Apply the original filter logic
        let filteredResult;

        if (role === "pemesan") {
          filteredResult = resultWithNames.filter(
            (item) => item.id_user === parseInt(idUser, 10)
          );
        } else {
          filteredResult = resultWithNames;
        }

        // Set filtered data to state
        setData(filteredResult);
        loadingBar.current.complete();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        loadingBar.current.complete();
        setLoading(false);
      }
    };

    fetchData();
  }, [role, idUser]);

  const downloadPDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const imgLeftSrc = "/pim_logo.png";
    const imgRightSrc = "/pupuk_indonesia.png";

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    try {
      const imgLeft = await loadImage(imgLeftSrc);
      const imgRight = await loadImage(imgRightSrc);

      const leftLogoWidth = 30; // Besarkan logo kiri
      const leftLogoHeight = (imgLeft.height / imgLeft.width) * leftLogoWidth;
      const rightLogoWidth = 60; // Besarkan logo kanan
      const rightLogoHeight =
        (imgRight.height / imgRight.width) * rightLogoWidth;

      doc.addImage(imgLeft, "PNG", 14, 10, leftLogoWidth, leftLogoHeight);

      doc.addImage(
        imgRight,
        "PNG",
        doc.internal.pageSize.getWidth() - rightLogoWidth - 14,
        10,
        rightLogoWidth,
        rightLogoHeight
      );

      // Calculate headerY as the maximum height of the logos plus some padding
      const headerY = Math.max(leftLogoHeight, rightLogoHeight) + 25;

      // Draw the line below the logos
      doc.line(
        14,
        headerY - 16,
        doc.internal.pageSize.getWidth() - 14,
        headerY - 16
      );

      const centerX = doc.internal.pageSize.getWidth() / 2;

      // Add the title and header text above the line
      doc.setFontSize(20);
      doc.text("Laporan Pemesanan Makanan", centerX, headerY - 40, {
        align: "center",
      });

      doc.setFontSize(16);
      doc.text("PT. Pupuk Iskandar Muda", centerX, headerY - 30, {
        align: "center",
      });

      doc.setFontSize(8);
      doc.text(
        "Aceh Utara, Indonesia Jl. Medan - Banda Aceh PO. Box 021 Telp (62-645) 56222; Fax (62-645) 56095",
        centerX,
        headerY - 20,
        {
          align: "center",
        }
      );

      doc.setFontSize(14);
      const subHeaderText =
        role === "pemesan"
          ? `Laporan Pemesanan Makanan Departemen ${namaDepartement}`
          : "Laporan Pemesanan Makanan Seluruh Departemen PIM";
      doc.text(subHeaderText, centerX, headerY, { align: "center" });
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.tanggal_permintaan) - new Date(a.tanggal_permintaan)
      );

      doc.autoTable({
        startY: headerY + 5, // Adjust the margin to start after the header text
        head: [
          [
            "No",
            "Nama Departemen",
            "Nama Kegiatan",
            "Waktu Mulai Acara",
            "Lokasi",
            "Jenis Konsumsi",
            "Cost Center",
            "Status",
            "Jumlah Box Diminta",
            "Jumlah Box Disetujui",
            "Tanggal Permintaan",
            "Tanggal Persetujuan",
            "Keterangan",
            "Catatan",
          ],
        ],
        body: sortedData.map((item, index) => [
          index + 1,
          item.userName,
          item.kegiatan,
          item.waktu,
          item.lokasi,
          item.jenis_konsumsi,
          item.cost_center,
          item.status || "Belum dikonfirmasi",
          item.jumlah_box_pesan,
          item.jumlah_box_disetujui || 0,
          formatDate(item.tanggal_permintaan),
          item.tanggal_persetujuan
            ? formatDate(item.tanggal_persetujuan)
            : "Sedang Proses",
          item.keterangan || "Tidak ada keterangan",
          item.catatan || "Tidak ada catatan",
        ]),
      });

      doc.save("Laporan_Pemesanan_Makanan.pdf");
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  const downloadExcel = () => {
    // Define the data
    const header = [
      "No",
      "Nama Departemen",
      "Nama Kegiatan",
      "Waktu Mulai Acara",
      "Lokasi",
      "Jenis Konsumsi",
      "Cost Center",
      "Status",
      "Jumlah Box Diminta",
      "Jumlah Box Disetujui",
      "Tanggal Permintaan",
      "Tanggal Persetujuan",
      "Keterangan",
      "Catatan",
    ];
    const sortedData = data.sort(
      (a, b) => new Date(b.tanggal_permintaan) - new Date(a.tanggal_permintaan)
    );

    const body = sortedData.map((item, index) => [
      index + 1,
      item.userName,
      item.kegiatan,
      item.waktu,
      item.lokasi,
      item.jenis_konsumsi,
      item.cost_center,
      item.status || "Belum dikonfirmasi",
      item.jumlah_box_pesan,
      item.jumlah_box_disetujui || 0,
      formatDate(item.tanggal_permintaan),
      item.tanggal_persetujuan
        ? formatDate(item.tanggal_persetujuan)
        : "Sedang Proses",
      item.keterangan || "Tidak ada keterangan",
      item.catatan || "Tidak ada catatan",
    ]);

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[]]);

    // Add the header text
    XLSX.utils.sheet_add_aoa(ws, [["Laporan Pemesanan Makanan"]], {
      origin: "A1",
    });
    XLSX.utils.sheet_add_aoa(ws, [["PT. Pupuk Iskandar Muda"]], {
      origin: "A2",
    });
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "Aceh Utara, Indonesia Jl. Medan - Banda Aceh PO. Box 021 Telp (62-645) 56222; Fax (62-645) 56095",
        ],
      ],
      { origin: "A3" }
    );

    // Conditionally add the text below the header based on role
    const subHeaderText =
      role === "pemesan"
        ? `Laporan Departemen ${namaDepartement}`
        : "Laporan Pemesanan Makanan Seluruh Departemen PIM";

    XLSX.utils.sheet_add_aoa(ws, [[subHeaderText]], {
      origin: "A4",
    });

    // Add the table header
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A6" });

    // Add the data
    XLSX.utils.sheet_add_aoa(ws, body, { origin: "A7" });

    // Adjust column widths
    const wscols = [
      { wch: 5 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
    ];
    ws["!cols"] = wscols;

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");

    // Write the workbook to a binary string
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to an array buffer
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xff;

    // Save the file
    const blob = new Blob([buf], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Laporan_Pemesanan_Makanan.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <LoadingBar color="#f11946" ref={loadingBar} />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader">
            <ClipLoader size={50} color={"#ffffff"} loading={loading} />
          </div>
        </div>
      )}
      <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div class="flex-1 flex justify-start space-x-2">
              <h1 class="flex items-center text-5xl font-extrabold dark:text-white">
                Table
                <span class="bg-orange-100 text-orange-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2">
                  Laporan
                </span>
              </h1>
            </div>
          </div>
          <div class="flex md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div class="w-full flex flex-col md:flex-row md:space-x-3 items-stretch md:items-center justify-end">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onClick={downloadPDF}
                type="button"
                class="m-1 text-white flex items-center justify-center bg-red-500 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full md:w-auto text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="h-4 w-4 mr-1.5 -ml-1 text-white-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Download PDF
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onClick={downloadExcel}
                type="button"
                class="m-1 flex items-center justify-center text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full md:w-auto text-center dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  class="h-4 w-4 mr-1.5 -ml-1 text-white-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Download Excel
              </motion.button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <motion.table
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="p-4">
                    No
                  </th>
                  <th scope="col" className="p-4">
                    Nama Departement
                  </th>

                  <th scope="col" class="p-4">
                    Nama Kegiatan
                  </th>
                  <th scope="col" class="p-4">
                    Waktu Mulai Acara
                  </th>
                  <th scope="col" class="p-4">
                    Lokasi
                  </th>
                  <th scope="col" class="p-4">
                    Jenis Konsumsi
                  </th>
                  <th scope="col" class="p-4">
                    Cost Center
                  </th>
                  <th scope="col" class="p-4">
                    Status
                  </th>
                  <th scope="col" class="p-4">
                    Jumlah Box Diminta
                  </th>
                  <th scope="col" class="p-4">
                    Jumlah Box Disetujui
                  </th>
                  <th scope="col" class="p-4">
                    Tanggal Permintaan
                  </th>
                  <th scope="col" class="p-4">
                    Tanggal Persetujuan
                  </th>
                  <th scope="col" class="p-4">
                    Keterangan
                  </th>
                  <th scope="col" class="p-4">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData
                  .sort(
                    (a, b) =>
                      new Date(b.tanggal_permintaan) -
                      new Date(a.tanggal_permintaan)
                  )
                  .map((item, index) => {
                    const nomor = index + 1; // Sequential numbering
                    const tanggalPersetujuan = item.tanggal_persetujuan
                      ? formatDate(item.tanggal_persetujuan)
                      : "Sedang Proses";
                    const jumlah_box_disetujui = item.jumlah_box_disetujui || 0;
                    const keterangan =
                      item.keterangan || "Tidak ada keterangan";
                    const catatan = item.catatan || "Tidak ada catatan";

                    return (
                      <tr
                        key={item.id}
                        className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">{nomor}</div>
                        </td>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <div className="flex items-center mr-3">
                            <img
                              src="/pim_logo.png"
                              alt="iMac Front Image"
                              className="h-8 w-auto mr-3"
                            />
                            {item.userName}
                          </div>
                        </th>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <div className="flex items-center mr-3">
                            <img
                              src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png"
                              alt="iMac Front Image"
                              className="h-8 w-auto mr-3"
                            />
                            {item.kegiatan}
                          </div>
                        </th>
                        <td className="px-4 py-3">
                          <div className="flex items-center mr-3 font-medium text-gray-700">
                            {item.waktu}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">{item.lokasi}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.jenis_konsumsi}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.cost_center}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <div
                              className={`h-4 w-4 rounded-full inline-block mr-2 ${
                                item.status === "Disetujui"
                                  ? "bg-green-700"
                                  : item.status === "Ditolak"
                                  ? "bg-red-700"
                                  : item.status === "Perbaiki"
                                  ? "bg-yellow-600"
                                  : "bg-blue-600"
                              }`}
                            ></div>
                            <span
                              className={`pl-[10px] pr-[10px] pt-[4px] pb-[4px] rounded-xl text-[12px] ${
                                item.status === "Disetujui"
                                  ? "bg-green-200 text-green-800"
                                  : item.status === "Ditolak"
                                  ? "bg-red-200 text-red-800"
                                  : item.status === "Perbaiki"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-blue-200 text-blue-800"
                              }`}
                            >
                              {item.status || "Belum dikonfirmasi"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-gray-400 mr-2"
                              aria-hidden="true"
                            >
                              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                            </svg>
                            {item.jumlah_box_pesan}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-gray-400 mr-2"
                              aria-hidden="true"
                            >
                              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                            </svg>
                            {jumlah_box_disetujui}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {formatDate(item.tanggal_permintaan)}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <span
                            className={`pl-[10px] pr-[10px] pt-[4px] pb-[4px] rounded-xl text-[12px] ${
                              tanggalPersetujuan === "Sedang Proses"
                                ? "bg-yellow-400 text-black-200"
                                : "bg-green-300 text-black-800"
                            }`}
                          >
                            {" "}
                            {tanggalPersetujuan}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {keterangan}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {catatan}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </motion.table>
          </div>

          {/* pagenation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-4 flex justify-between items-center"
          >
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {optionsPerPage.map((option) => (
                <option key={option} value={option}>
                  {option} items per page
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-4 py-2 rounded-md ${
                      pageNumber === currentPage
                        ? "bg-primary-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"></script>
    </>
  );
};

export default TableLaporan;
