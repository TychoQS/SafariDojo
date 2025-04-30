CREATE DATABASE IF NOT EXISTS SafariDojoDB;
USE SafariDojoDB;
SET sql_notes = 0;
    /* First we remove all in order to evade errors of "already exists" when creating the DB*/
DROP TABLE IF EXISTS UserQuizzes;
DROP TABLE IF EXISTS UserWeeklyGoals;
DROP TABLE IF EXISTS WeeklyGoals;
DROP TABLE IF EXISTS PinThePlace;
DROP TABLE IF EXISTS SubjectQuizzes;
DROP TABLE IF EXISTS UserQuizzes;
DROP TABLE IF EXISTS MultimediaSubjects;
DROP TABLE IF EXISTS Multimedia;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Quizzes;
DROP PROCEDURE IF EXISTS FillSubjectQuizzes;
DROP PROCEDURE IF EXISTS FillUserQuizzes;
DROP TRIGGER IF EXISTS PostUserCreation;
DROP TRIGGER IF EXISTS PostQuizAddition;
DROP TRIGGER IF EXISTS PostSubjectAddition;
DROP TRIGGER IF EXISTS PostQuizAdditionOnSubjectQuizzes;
/* Now we start creating the tables and inserting the registers */
CREATE TABLE Users ( -- Users table
                       Id INT AUTO_INCREMENT PRIMARY KEY,
                       Name VARCHAR(100) NOT NULL,
                       Email VARCHAR(255) NOT NULL UNIQUE,
                       Password VARCHAR(255) NOT NULL,
                       ProfileIcon VARCHAR(64) DEFAULT 'Sheep',
                       Premium BOOLEAN DEFAULT FALSE,
                       Lifes TINYINT DEFAULT 5,
                       RegisterDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (Name, Email, Password, ProfileIcon) VALUES
                                                           ('Nelson Monzón', 'nelson@example.com', '9a400da2fc27de967acb85a0b50dbbcd9536c60da1eee1e4bb1f1c05a6036068', 'Lion'),
                                                           ('Ayman Asbai', 'ayman@example.com', '9a400da2fc27de967acb85a0b50dbbcd9536c60da1eee1e4bb1f1c05a6036068', 'Pig'),
                                                           ('Alejandro De Olózaga', 'alejandro@example.com', '9a400da2fc27de967acb85a0b50dbbcd9536c60da1eee1e4bb1f1c05a6036068', 'Monkey'),
                                                           ('Dylan Castrillón', 'dylan@example.com', '9a400da2fc27de967acb85a0b50dbbcd9536c60da1eee1e4bb1f1c05a6036068', 'Shark'),
                                                           ('Laura Herrera', 'laura@example.com', '9a400da2fc27de967acb85a0b50dbbcd9536c60da1eee1e4bb1f1c05a6036068', 'Seal'),
                                                           ('Luis Martín', 'luis@example.com', '9a400da2fc27de967acb85a0b50dbbcd9536c60da1eee1e4bb1f1c05a6036068', 'Tiger'),
                                                           ('Tycho Quintana', 'tycho@example.com', '9a400da2fc27de967acb85a0b50dbbcd9536c60da1eee1e4bb1f1c05a6036068', 'Koala');


CREATE TABLE Quizzes ( -- Quiz table
                         Id INT AUTO_INCREMENT PRIMARY KEY,
                         QuizName VARCHAR(100) NOT NULL UNIQUE,
                         Premium BOOLEAN NOT NULL,
                         Register BOOLEAN NOT NULL
);

INSERT INTO Quizzes (QuizName, Premium, Register) VALUES
                                                      ('Pin The Place',TRUE,FALSE),
                                                      ('Detective MrWorldWide',FALSE,FALSE),
                                                      ('Where Is My Country?',FALSE,TRUE),
                                                      ('Domino Master',TRUE,FALSE),
                                                      ('Detective Lupin',FALSE,FALSE),
                                                      ('Make The Film',FALSE,TRUE),
                                                      ('Math Invasors',FALSE,TRUE),
                                                      ('Mistery Doors',TRUE,FALSE),
                                                      ('Cross Math',FALSE,FALSE),
                                                      ('CrosswordTable',FALSE,FALSE),
                                                      ('Letter Soup',FALSE,TRUE),
                                                      ('Mahjong',TRUE,FALSE),
                                                      ('Call Of The Clan',FALSE,FALSE),
                                                      ('Snake Maze',FALSE,TRUE),
                                                      ('Memory',TRUE, FALSE);

CREATE TABLE UserQuizzes ( -- Users and Quizzes Joint Table
                             UserId INT,
                             QuizId INT,
                             Done BOOLEAN NOT NULL DEFAULT FALSE,
                             BestScore TINYINT DEFAULT 0,
                             GoldMedal BOOLEAN NOT NULL DEFAULT FALSE,
                             SilverMedal BOOLEAN NOT NULL DEFAULT FALSE,
                             BronzeMedal BOOLEAN NOT NULL DEFAULT FALSE,
                             PlatinumMedal BOOLEAN NOT NULL DEFAULT FALSE,
                             DiamondMedal BOOLEAN NOT NULL DEFAULT FALSE,
                             PRIMARY KEY (UserId, QuizId),
                             FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
                             FOREIGN KEY (QuizId) REFERENCES Quizzes(Id) ON DELETE CASCADE
);

SET SQL_SAFE_UPDATES = 0;
DELIMITER //
CREATE PROCEDURE FillUserQuizzes()
BEGIN
    DECLARE userId INT;
    DECLARE quizId INT;
DELETE FROM UserQuizzes;
SET userId = 1;
    WHILE userId <= 7 DO
        SET quizId = 1;
        WHILE quizId <= 15 DO
                INSERT INTO UserQuizzes (UserId, QuizId) VALUES (userId, quizId);
            SET quizId = quizId + 1;
END WHILE;
        SET userId = userId + 1;
END WHILE;
END//
DELIMITER ;
CALL FillUserQuizzes();
SET SQL_SAFE_UPDATES = 1;

DELIMITER //

CREATE TRIGGER PostUserCreation
    AFTER INSERT ON Users
    FOR EACH ROW
BEGIN
    INSERT INTO UserQuizzes (UserId, QuizId)
    SELECT NEW.Id, q.Id
    FROM Quizzes q;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER PostQuizAddition
    AFTER INSERT ON Quizzes
    FOR EACH ROW
BEGIN
    INSERT INTO UserQuizzes (UserId, QuizId)
    SELECT u.Id, NEW.Id
    FROM Users u;
END //

DELIMITER ;

CREATE TABLE Subjects (
                          Id INT AUTO_INCREMENT PRIMARY KEY,
                          Name VARCHAR(100) NOT NULL UNIQUE,
                          PrimaryColor CHAR(6) NOT NULL,
                          SecondaryColor CHAR(6) NOT NULL,
                          Mascot VARCHAR(50) NOT NULL,
                          TeacherName VARCHAR(50) NOT NULL
);

INSERT INTO Subjects (Name, PrimaryColor, SecondaryColor, Mascot, TeacherName) VALUES
                                                                                   ('Art', 'F67C6E', 'F2C1BB', 'Platypus', 'Perry'),
                                                                                   ('Science', '6EF68B', 'C9F1D2', 'Frog', 'Freddy'),
                                                                                   ('Maths', '1BA8E4', '9BD6EF', 'Elephant', 'Emily'),
                                                                                   ('Geography', 'ED6EF6', 'E8B1EC', 'Kangaroo', 'Kanye'),
                                                                                   ('English', 'EFF66E', 'FDFFCE', 'Owl', 'Owling');


CREATE TABLE SubjectQuizzes (
                                SubjectId INT,
                                QuizId INT,
                                Difficulty TINYINT NOT NULL,  -- 0: easy, 1: normal, 2: hard
                                CompletedCount INT DEFAULT 0,
                                PRIMARY KEY (SubjectId, QuizId, Difficulty),
                                FOREIGN KEY (SubjectId) REFERENCES Subjects(Id),
                                FOREIGN KEY (QuizId) REFERENCES Quizzes(Id)
);

INSERT INTO SubjectQuizzes(SubjectId, QuizId, Difficulty) VALUES (1, 5, 0),
                                                              (1, 5, 1),
                                                              (1, 5, 2),
                                                              (1, 6, 0),
                                                              (1, 6, 1),
                                                              (1, 6, 2),
                                                              (1, 4, 0),
                                                              (1, 4, 1),
                                                              (1, 4, 2),
                                                              (2, 13, 0),
                                                              (2, 13, 1),
                                                              (2, 13, 2),
                                                              (2, 14, 0),
                                                              (2, 14, 1),
                                                              (2, 14, 2),
                                                              (2, 15, 0),
                                                              (2, 15, 1),
                                                              (2, 15, 2),
                                                              (3, 7, 0),
                                                              (3, 7, 1),
                                                              (3, 7, 2),
                                                              (3, 8, 0),
                                                              (3, 8, 1),
                                                              (3, 8, 2),
                                                              (3, 9, 0),
                                                              (3, 9, 1),
                                                              (3, 9, 2),
                                                              (4, 1, 0),
                                                              (4, 1, 1),
                                                              (4, 1, 2),
                                                              (4, 2, 0),
                                                              (4, 2, 1),
                                                              (4, 2, 2),
                                                              (4, 3, 0),
                                                              (4, 3, 1),
                                                              (4, 3, 2),
                                                              (5, 10, 0),
                                                              (5, 10, 1),
                                                              (5, 10, 2),
                                                              (5, 12, 0),
                                                              (5, 12, 1),
                                                              (5, 12, 2),
                                                              (5, 11, 0),
                                                              (5, 11, 1),
                                                              (5, 11, 2);

DELIMITER //

CREATE TRIGGER PostQuizAdditionOnSubjectQuizzes
    AFTER INSERT ON Quizzes
    FOR EACH ROW
BEGIN
    INSERT INTO SubjectQuizzes (SubjectId, QuizId, Difficulty)
    SELECT s.Id, NEW.Id, d.Difficulty
    FROM Subjects s
             CROSS JOIN (SELECT 0 AS Difficulty UNION ALL SELECT 1 UNION ALL SELECT 2) d;
END //

DELIMITER ;

CREATE TABLE Multimedia (
                            Id INT AUTO_INCREMENT PRIMARY KEY,
                            Name VARCHAR(100) NOT NULL UNIQUE,
                            URL VARCHAR(2048) NOT NULL,
                            Alt VARCHAR(100),
                            Type VARCHAR(50) NOT NULL
);

CREATE TABLE MultimediaSubjects (
                                    PageName VARCHAR(255),
                                    IdSubject INT,
                                    URL VARCHAR(2048) NOT NULL,
                                    Alt VARCHAR(100),
                                    PRIMARY KEY (PageName, IdSubject),
                                    FOREIGN KEY (IdSubject) REFERENCES Subjects(Id)
);

CREATE TABLE PinThePlace (
                             CountryId INT PRIMARY KEY,
                             Name VARCHAR(100),
                             Capital VARCHAR(100),
                             Continent VARCHAR(50),
                             Difficulty TINYINT
);


CREATE TABLE WeeklyGoals (
                             Id INT AUTO_INCREMENT PRIMARY KEY,
                             Type VARCHAR(50),
                             Number INT,
                             Subject VARCHAR(100)
);


CREATE TABLE UserWeeklyGoals (
                                 UserId INT,
                                 WeeklyGoalId INT,
                                 CompletedGoals INT DEFAULT 0,
                                 PRIMARY KEY (UserId, WeeklyGoalId),
                                 FOREIGN KEY (UserId) REFERENCES Users(Id),
                                 FOREIGN KEY (WeeklyGoalId) REFERENCES WeeklyGoals(Id)
);

show tables;
select * from Users;
select * from Quizzes;
select * from UserQuizzes;
select * from Subjects;
select * from SubjectQuizzes;
select * from Multimedia;
select * from MultimediaSubjects;
select * from PinThePlace;
select * from WeeklyGoals;
select * from UserWeeklyGoals;
SET sql_notes = 1;
