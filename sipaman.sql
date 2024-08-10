-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: sistem_pemesanan_makanan_pim
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `sistem_pemesanan_makanan_pim`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `sistem_pemesanan_makanan_pim` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `sistem_pemesanan_makanan_pim`;

--
-- Table structure for table `Permintaan_Konsumsi`
--

DROP TABLE IF EXISTS `Permintaan_Konsumsi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permintaan_Konsumsi` (
  `id_permintaan` int NOT NULL AUTO_INCREMENT,
  `kegiatan` varchar(40) NOT NULL,
  `waktu` varchar(10) DEFAULT NULL,
  `lokasi` varchar(30) NOT NULL,
  `jenis_konsumsi` varchar(30) NOT NULL,
  `cost_center` varchar(10) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `tanggal_permintaan` date NOT NULL,
  `tanggal_persetujuan` date DEFAULT NULL,
  `jumlah_box_pesan` int NOT NULL,
  `jumlah_box_disetujui` int DEFAULT NULL,
  `keterangan` varchar(60) DEFAULT NULL,
  `catatan` varchar(60) DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id_permintaan`),
  KEY `fk_user_id` (`id_user`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`id_user`) REFERENCES `User` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permintaan_Konsumsi`
--

LOCK TABLES `Permintaan_Konsumsi` WRITE;
/*!40000 ALTER TABLE `Permintaan_Konsumsi` DISABLE KEYS */;
INSERT INTO `Permintaan_Konsumsi` VALUES (18,'Diskusi Tahunan','10:00','Ruang Diskusi','Kue Basah','CC18','Disetujui','2023-05-20','2024-08-08',20,20,'perbaiki cuma ada 2 hp','Tidak memenuhi syarat',7),(21,'dafa','12:00','fdafda','Kue Kering','adfa','Perbaiki','2024-12-03',NULL,12,NULL,'keterangan',NULL,6),(22,'Kegiatan 2',NULL,'Gedung Rapat Layanan IT','Kue Basah','UOUOISA','Perbaiki','2024-08-09',NULL,12,NULL,NULL,NULL,7),(30,'Kegiatan terbaru',NULL,'kegiatan lokasi','Kue Basah','RADJSA','Perbaiki','2024-12-31','2024-08-10',35,34,NULL,NULL,7),(32,'Kegiatan coba 2 dari pemesanan 1',NULL,'pemesanan 1','Kue Basah','AUOFDS',NULL,'2024-11-02',NULL,21,NULL,NULL,NULL,6),(33,'Kegiatan saja',NULL,'kegiatan saja','Kue Basah','SDAJLA','Disetujui','2024-12-02','2024-08-10',12,12,NULL,NULL,6),(34,'Pesanan Hari ini',NULL,'Lokasi hari ini','Kue Basah','AUIODS',NULL,'2024-08-10',NULL,123,NULL,NULL,NULL,7),(35,'Kegiatan Pemesan 4',NULL,'Di Gedung Pemesan 4','Kue Basah','SADJLSAD',NULL,'2024-08-10',NULL,12,NULL,NULL,NULL,10);
/*!40000 ALTER TABLE `Permintaan_Konsumsi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (5,'Admin2','admin2@example.com','$2a$12$g4A.wEoc6JDBEBF3CkyN4udEkydvrBwmaxUbJFSTCs.Ieq1naxdSi','admin'),(6,'Pemesan','pemesan@example.com','$2a$12$QKhrnMMzkBHYE2fjTDcfj.fSRV3YDFbGXgxgOfOaTyiAz6RMu1kNC','pemesan'),(7,'Pemesan2','pemesan2@example.com','$2a$12$nKvTHicNuIvMhHGgLNirmul6AmS28J6EPKvkHfPp1WTmW2jfwajDi','pemesan'),(8,'Pemesan 3','pemesan3@example.com','$2b$10$J6y2325Anpjq/9uE/cFbWeTQquq17V5jhFXmorPmDlFlaqtijh.rS','pemesan'),(9,'admin3','admin3@example.com','$2b$10$esQM81BrbMiHmEgX4drZGOXEN5AQQb1DId9QuvPvJOypH/M7ZUxBO','admin'),(10,'pemesan4','pemesan4@example.com','$2b$10$kt.9dpgMYDNCO48TU/g9l.4663CMjOlJaCRceJkN4BD35wag2basq','pemesan');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-10 10:09:28
