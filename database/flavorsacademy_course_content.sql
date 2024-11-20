-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: flavorsacademy
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course_content`
--

DROP TABLE IF EXISTS `course_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_content` (
  `idcourse_content` int NOT NULL AUTO_INCREMENT,
  `cid` int DEFAULT NULL,
  `content_name` varchar(1000) DEFAULT NULL,
  `text` longtext,
  `tid` int DEFAULT NULL,
  PRIMARY KEY (`idcourse_content`),
  KEY `cid_idx` (`cid`),
  KEY `tid_idx` (`tid`),
  CONSTRAINT `cid` FOREIGN KEY (`cid`) REFERENCES `course` (`idcourse`),
  CONSTRAINT `tid` FOREIGN KEY (`tid`) REFERENCES `teacher` (`idteacher`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_content`
--

LOCK TABLES `course_content` WRITE;
/*!40000 ALTER TABLE `course_content` DISABLE KEYS */;
INSERT INTO `course_content` VALUES (1,1,'course description','Discover the essentials of plant-based cooking and nutrition in this interactive class! Learn how to prepare delicious, nutrient-packed meals using a variety of plant-based ingredients, explore the health benefits of plant-based diets, and gain practical tips for sustainable, balanced eating. Perfect for beginners and seasoned cooks alike!',2),(2,6,NULL,NULL,2),(4,1,'syllabus','https://firebasestorage.googleapis.com/v0/b/flavorsacademy-c688e.firebasestorage.app/o/syllabus%2F1_2%2FENPM613%20Syllabus.pdf?alt=media&token=c2e224c4-c6fb-4d1a-b5e9-40cc50bae8fc',2);
/*!40000 ALTER TABLE `course_content` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-19 23:02:10
