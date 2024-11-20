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
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `idcourse` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) DEFAULT NULL,
  `sid` int DEFAULT NULL,
  `tid` int DEFAULT NULL,
  PRIMARY KEY (`idcourse`),
  KEY `idstudent_idx` (`sid`),
  KEY `studentid_idx` (`sid`),
  KEY `teacherid_idx` (`tid`),
  CONSTRAINT `studentid` FOREIGN KEY (`sid`) REFERENCES `student` (`idstudent`),
  CONSTRAINT `teacherid` FOREIGN KEY (`tid`) REFERENCES `teacher` (`idteacher`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'Plant-Based Cooking and Nutrition',8,2),(2,'The Art of Plating and Presentation',NULL,3),(3,'Vegetarian and Vegan Cooking Essentials',NULL,4),(4,'Grilling, Smoking, and BBQ Mastery',NULL,5),(5,'Fermentation and Pickling Techniques',NULL,6),(6,'Sushi Making and Japanese Cuisine',NULL,2),(7,'Meal Prep and Planning for the Week',NULL,3),(8,'Baking Basics: Bread, Pastry, and Desserts',NULL,4),(9,'Advanced Knife Skills and Kitchen Techniques',NULL,5),(10,'Classic French Cooking Techniques',NULL,6),(11,'Italian Cuisine: Pasta, Pizza, and More',NULL,NULL),(12,'The Science of Cooking and Flavor Pairing',NULL,NULL);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
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
