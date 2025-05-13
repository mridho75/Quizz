-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 13, 2025 at 06:08 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`) VALUES
(1, 'admin', 'labug-025');

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int NOT NULL,
  `npm` varchar(20) DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `answer` text,
  `quiz_type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `npm`, `question_id`, `answer`, `quiz_type`) VALUES
(266, '10122980', 16, '1', 'A'),
(267, '10122980', 17, '2', 'A'),
(268, '10122980', 18, '1', 'A'),
(269, '101', 26, 'asd', 'B'),
(275, '10122980', 19, '1', 'A'),
(276, '10122980', 20, '2', 'A'),
(277, '10122980', 21, '2', 'A'),
(278, '10122980', 22, '3', 'A'),
(279, '10122980', 23, '3', 'A'),
(280, '10122980', 24, '3', 'A'),
(281, '10122980', 25, '3', 'A'),
(282, '123321', 16, '1', 'A'),
(283, '123321', 17, '1', 'A'),
(284, '123321', 18, '1', 'A'),
(285, '123321', 19, '3', 'A'),
(286, '123321', 20, '3', 'A'),
(287, '123321', 21, '3', 'A'),
(288, '123321', 22, '3', 'A'),
(289, '123321', 23, '3', 'A'),
(290, '123321', 24, '3', 'A'),
(291, '123321', 25, '3', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `pcs`
--

CREATE TABLE `pcs` (
  `id` int NOT NULL,
  `pc_number` int NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pcs`
--

INSERT INTO `pcs` (`id`, `pc_number`, `password`) VALUES
(1, 1, 'pc1'),
(2, 2, 'pc2'),
(3, 3, 'pc3'),
(4, 4, 'pc4'),
(5, 5, 'pc5'),
(6, 6, 'pc6'),
(7, 7, 'pc7'),
(8, 8, 'pc8'),
(9, 9, 'pc9'),
(10, 10, 'pc10'),
(11, 11, 'pc11'),
(12, 12, 'pc12'),
(13, 13, 'pc13'),
(14, 14, 'pc14'),
(15, 15, 'pc15'),
(16, 16, 'pc16'),
(17, 17, 'pc17'),
(18, 18, 'pc18'),
(19, 19, 'pc19'),
(20, 20, 'pc20'),
(21, 21, 'pc21'),
(22, 22, 'pc22'),
(23, 23, 'pc23'),
(24, 24, 'pc24'),
(25, 25, 'pc25'),
(26, 26, 'pc26'),
(27, 27, 'pc27'),
(28, 28, 'pc28'),
(29, 29, 'pc29'),
(30, 30, 'pc30'),
(31, 31, 'pc31'),
(32, 32, 'pc32'),
(33, 33, 'pc33'),
(34, 34, 'pc34'),
(35, 35, 'pc35'),
(36, 36, 'pc36'),
(37, 37, 'pc37'),
(38, 38, 'pc38'),
(39, 39, 'pc39'),
(40, 40, 'pc40');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `quiz_type` enum('A','B') NOT NULL,
  `question_type` enum('multiple_choice','essay') NOT NULL,
  `question_text` text NOT NULL,
  `options` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `quiz_type`, `question_type`, `question_text`, `options`) VALUES
(16, 'A', 'multiple_choice', 'What is the capital of France?', '[\"Paris\", \"London\", \"Berlin\", \"Rome\"]'),
(17, 'A', 'multiple_choice', 'Which planet is known as the Red Planet?', '[\"Mars\", \"Earth\", \"Jupiter\", \"Saturn\"]'),
(18, 'A', 'multiple_choice', 'What is the largest ocean on Earth?', '[\"Pacific Ocean\", \"Atlantic Ocean\", \"Indian Ocean\", \"Arctic Ocean\"]'),
(19, 'A', 'multiple_choice', 'Who wrote \"Romeo and Juliet\"?', '[\"William Shakespeare\", \"Charles Dickens\", \"Jane Austen\", \"Mark Twain\"]'),
(20, 'A', 'multiple_choice', 'What is the square root of 64?', '[\"8\", \"6\", \"10\", \"4\"]'),
(21, 'A', 'multiple_choice', 'Which country is famous for the Great Wall?', '[\"China\", \"India\", \"Japan\", \"Russia\"]'),
(22, 'A', 'multiple_choice', 'Who is the first President of the United States?', '[\"George Washington\", \"Abraham Lincoln\", \"Thomas Jefferson\", \"John Adams\"]'),
(23, 'A', 'multiple_choice', 'What is the chemical symbol for water?', '[\"H2O\", \"CO2\", \"O2\", \"NaCl\"]'),
(24, 'A', 'multiple_choice', 'What is the largest continent?', '[\"Asia\", \"Africa\", \"North America\", \"Europe\"]'),
(25, 'A', 'multiple_choice', 'What is the boiling point of water?', '[\"100°C\", \"50°C\", \"0°C\", \"212°C\"]'),
(26, 'B', 'essay', 'Explain the process of photosynthesis in plants.', NULL),
(27, 'B', 'essay', 'Describe the role of the heart in the circulatory system.', NULL),
(28, 'B', 'essay', 'Explain the significance of the industrial revolution.', NULL),
(29, 'B', 'essay', 'Discuss the impact of technology on modern society.', NULL),
(30, 'B', 'essay', 'Describe the concept of relativity in physics.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_types`
--

CREATE TABLE `quiz_types` (
  `id` enum('A','B') NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quiz_types`
--

INSERT INTO `quiz_types` (`id`, `description`) VALUES
('A', 'Quiz Type A'),
('B', 'Quiz Type B');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `npm` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kelas` varchar(50) NOT NULL,
  `pc_number` int DEFAULT NULL,
  `quiz_type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`npm`, `nama`, `kelas`, `pc_number`, `quiz_type`) VALUES
('101', 'asd', '3ka04', 1, 'B'),
('10122980', 'ridho', '3ka04', 1, 'A'),
('1092', 'asd', '3ka04', 1, 'A'),
('123321', 'dodo', '3ka04', 1, 'A');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `npm` (`npm`,`question_id`);

--
-- Indexes for table `pcs`
--
ALTER TABLE `pcs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pc_number` (`pc_number`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_type` (`quiz_type`);

--
-- Indexes for table `quiz_types`
--
ALTER TABLE `quiz_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`npm`),
  ADD KEY `pc_number` (`pc_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=292;

--
-- AUTO_INCREMENT for table `pcs`
--
ALTER TABLE `pcs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_type`) REFERENCES `quiz_types` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`pc_number`) REFERENCES `pcs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
