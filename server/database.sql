CREATE DATABASE IF NOT EXISTS Matcha;
USE Matcha;
CREATE TABLE IF NOT EXISTS `Users` (
    `IdUserOwner` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `UserName` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `FirstName` VARCHAR(100) NOT NULL,
    `LastName` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `DataBirthday` DATE NOT NULL,
    `Latitude` VARCHAR(255),
    `Longitude` VARCHAR(255),
    `City` VARCHAR(255) NOT NULL,
    `Gender` VARCHAR(55) NOT NULL,
    `Sexual` VARCHAR(55) NOT NULL,
    `Biography` VARCHAR(255) NOT NULL,
    `Token` VARCHAR(255) NOT NULL,
    `ListInterest` VARCHAR(255) NOT NULL,
    `Images` VARCHAR(1255) NOT NULL,
    `IsActive` INT
);
CREATE TABLE IF NOT EXISTS `Friends` (
    `IdFriends` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `Match` INT NOT NULL,
    FOREIGN KEY (`IdUserOwner`) REFERENCES `Users`(`IdUserOwner`),
    FOREIGN KEY (`IdUserReceiver`) REFERENCES `Users`(`IdUserOwner`)
);
CREATE TABLE IF NOT EXISTS `Notification` (
    `IdNotification` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `Category` VARCHAR(255) NOT NULL,
    `DateCreation` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`IdUserOwner`) REFERENCES `Users`(`IdUserOwner`),
    FOREIGN KEY (`IdUserReceiver`) REFERENCES `Users`(`IdUserOwner`)
);
CREATE TABLE IF NOT EXISTS `Messages` (
    `IdMessages` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `Content` VARCHAR(255) NOT NULL,
    `DateCreation` VARCHAR(255) NOT NULL,
    FOREIGN KEY (IdUserOwner) REFERENCES `Users`(IdUserOwner),
    FOREIGN KEY (IdUserReceiver) REFERENCES `Users`(IdUserOwner)
);
CREATE TABLE IF NOT EXISTS Rating (
    `IdRating` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `RatingValue` DECIMAL (10,2) NOT NULL,
    FOREIGN KEY (IdUserOwner) REFERENCES `Users`(IdUserOwner),
    FOREIGN KEY (IdUserReceiver) REFERENCES `Users`(IdUserOwner)
);
CREATE TABLE IF NOT EXISTS `Hitory` (
    `IdHitory` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `DateCreation` VARCHAR(255),
    FOREIGN KEY (IdUserOwner) REFERENCES `Users`(IdUserOwner),
    FOREIGN KEY (IdUserReceiver) REFERENCES `Users`(IdUserOwner)
);