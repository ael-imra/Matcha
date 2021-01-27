CREATE DATABASE IF NOT EXISTS Matcha;
USE Matcha;
CREATE TABLE IF NOT EXISTS `Users` (
    `IdUserOwner` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `UserName` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `FirstName` VARCHAR(100) NOT NULL,
    `LastName` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `DataBirthday` DATE DEFAULT '1997-02-14',
    `Latitude` VARCHAR(255) DEFAULT 'x',
    `Longitude` VARCHAR(255) DEFAULT 'x',
    `City` VARCHAR(255) DEFAULT 'xxx',
    `Gender` VARCHAR(55) DEFAULT 'x',
    `Sexual` VARCHAR(55) DEFAULT 'x',
    `Biography` VARCHAR(255) DEFAULT 'x',
    `Token` VARCHAR(255) NOT NULL,
    `ListInterest` VARCHAR(255) DEFAULT 'x',
    `Images` VARCHAR(1255),
    `IsActive` INT,
    `JWT` VARCHAR(1024),
    `LastLogin` DateTime DEFAULT NOW(),
    `Active` INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS `Friends` (
    `IdFriends` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `Match` INT DEFAULT 0,
    FOREIGN KEY (`IdUserOwner`) REFERENCES `Users`(`IdUserOwner`),
    FOREIGN KEY (`IdUserReceiver`) REFERENCES `Users`(`IdUserOwner`)
);
CREATE TABLE IF NOT EXISTS `Notifications` (
    `IdNotification` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `Type` VARCHAR(255) NOT NULL,
    `DateCreation` DateTime DEFAULT NOW(),
    `IsRead` INT DEFAULT 0,
    FOREIGN KEY (`IdUserOwner`) REFERENCES `Users`(`IdUserOwner`),
    FOREIGN KEY (`IdUserReceiver`) REFERENCES `Users`(`IdUserOwner`)
);
CREATE TABLE IF NOT EXISTS `Messages` (
    `IdMessages` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `IdUserOwner` INT NOT NULL,
    `IdUserReceiver` INT NOT NULL,
    `Content` VARCHAR(255) NOT NULL,
    `DateCreation` DateTime DEFAULT NOW(),
    `IsRead` INT DEFAULT 0,
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
DELIMITER $$
CREATE FUNCTION CalcDistance (lat decimal, lng decimal,Id INT) 
RETURNS decimal
DETERMINISTIC
BEGIN 
  DECLARE myLat decimal;
  DECLARE myLng decimal;
  DECLARE distance decimal;
  SET myLat = (SELECT Latitude FROM Users WHERE IdUserOwner=Id);
  SET myLng = (SELECT Longitude FROM Users WHERE IdUserOwner=Id);
  SET distance = (3959*acos(cos(radians(myLat))*cos(radians(lat))*cos(radians(lng)-radians(myLng))+sin(radians(myLat))*sin(radians(lat))));
  RETURN distance;
END$$
DELIMITER ;