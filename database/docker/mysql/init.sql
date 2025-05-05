CREATE DATABASE IF NOT EXISTS SafariDojoDB;
    USE SafariDojoDB;
    SET sql_notes = 0;
        /* Node server user in the database */
    CREATE USER 'node_server'@'%' IDENTIFIED BY 'Ps20242025';
    GRANT ALL PRIVILEGES ON SafariDojoDB.* TO 'node_server'@'%';
    FLUSH PRIVILEGES;

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
DROP VIEW IF EXISTS AllSubjectQuizzes;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS CookTheBook_StoryPieces;
DROP TABLE IF EXISTS CookTheBook_Stories;
DROP TABLE IF EXISTS Mahjong;
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
                       RegisterDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       LastLogoutTime TIMESTAMP DEFAULT NULL
);
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
    DROP TABLE IF EXISTS CookTheBook_StoryPieces;
    DROP TABLE IF EXISTS CookTheBook_Stories;
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
                           RegisterDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           LastLogoutTime TIMESTAMP DEFAULT NULL
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
                         Register BOOLEAN NOT NULL,
                         Tutorial VARCHAR(255)
);

INSERT INTO Quizzes (QuizName, Premium, Register, Tutorial) VALUES
                                                                ('Pin The Place', TRUE, FALSE, NULL),
                                                                ('Detective MrWorldWide', FALSE, FALSE, NULL),
                                                                ('Where Is My Country?', FALSE, TRUE, NULL),
                                                                ('Domino Master', TRUE, FALSE, NULL),
                                                                ('Detective Lupin', FALSE, FALSE, NULL),
                                                                ('Cook The Book', FALSE, TRUE, 'https://youtu.be/EUbBz0BaD3Y'),
                                                                ('Math Invasors', FALSE, TRUE, 'https://youtu.be/przb2puT3lg'),
                                                                ('Mistery Doors', TRUE, FALSE, NULL),
                                                                ('Cross Math', FALSE, FALSE, NULL),
                                                                ('Crossword', FALSE, FALSE, NULL),
                                                                ('Letter Soup', FALSE, TRUE, NULL),
                                                                ('Mahjong', TRUE, FALSE, 'https://youtu.be/6VlVbPj-4FY'),
                                                                ('Call Of The Clan', FALSE, FALSE, NULL),
                                                                ('Snake Maze', FALSE, TRUE, NULL),
                                                                ('Memory', TRUE, FALSE, NULL);
CREATE TABLE UserQuizzes ( -- Users and Quizzes Joint Table
                             UserId INT,
                             QuizId INT,
                             Done BOOLEAN NOT NULL DEFAULT FALSE,
                             BestScoreEasy TINYINT DEFAULT 0,
                             BestScoreMedium TINYINT DEFAULT 0,
                             BestScoreHard TINYINT DEFAULT 0,
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
                                CompletedCount INT DEFAULT 1,
                                PRIMARY KEY (SubjectId, QuizId, Difficulty),
                                FOREIGN KEY (SubjectId) REFERENCES Subjects(Id),
                                FOREIGN KEY (QuizId) REFERENCES Quizzes(Id)
);

INSERT INTO SubjectQuizzes(SubjectId, QuizId, Difficulty, CompletedCount) VALUES
                                                                              -- Subject 1
                                                                              (1, 5, 0, 87), -- Detective Lupin
                                                                              (1, 5, 1, 81),
                                                                              (1, 5, 2, 74),
                                                                              (1, 6, 0, 82), -- Cook the Book
                                                                              (1, 6, 1, 75),
                                                                              (1, 6, 2, 68),
                                                                              (1, 4, 0, 50), -- Domino Master
                                                                              (1, 4, 1, 44),
                                                                              (1, 4, 2, 38),

                                                                              -- Subject 2
                                                                              (2, 13, 0, 98), -- Call of the Clan
                                                                              (2, 13, 1, 93),
                                                                              (2, 13, 2, 87),
                                                                              (2, 14, 0, 83), -- Snake Maze
                                                                              (2, 14, 1, 76),
                                                                              (2, 14, 2, 70),
                                                                              (2, 15, 0, 49), -- Memory
                                                                              (2, 15, 1, 42),
                                                                              (2, 15, 2, 35),

                                                                              -- Subject 3
                                                                              (3, 7, 0, 97), -- Math Invasors
                                                                              (3, 7, 1, 91),
                                                                              (3, 7, 2, 84),
                                                                              (3, 8, 0, 48), -- Mistery Doors
                                                                              (3, 8, 1, 42),
                                                                              (3, 8, 2, 36),
                                                                              (3, 9, 0, 88), -- Cross Math
                                                                              (3, 9, 1, 80),
                                                                              (3, 9, 2, 70),

                                                                              -- Subject 4
                                                                              (4, 2, 0, 77), -- Detective MrWorldwide
                                                                              (4, 2, 1, 70),
                                                                              (4, 2, 2, 63),
                                                                              (4, 1, 0, 85), -- Pin the Place
                                                                              (4, 1, 1, 78),
                                                                              (4, 1, 2, 70),
                                                                              (4, 3, 0, 95), -- Where is my country
                                                                              (4, 3, 1, 89),
                                                                              (4, 3, 2, 82),

                                                                              -- Subject 5
                                                                              (5, 10, 0, 79), -- Crossword
                                                                              (5, 10, 1, 72),
                                                                              (5, 10, 2, 75),
                                                                              (5, 11, 0, 79), -- Letter Soup
                                                                              (5, 11, 1, 73),
                                                                              (5, 11, 2, 66),
                                                                              (5, 12, 0, 99), -- Mahjong
                                                                              (5, 12, 1, 94),
                                                                              (5, 12, 2, 88);

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

CREATE VIEW AllSubjectQuizzes AS
SELECT
    s.Name AS SubjectName,
    q.QuizName,
    MIN(CASE
            WHEN q.Premium = 0 AND q.Register = 1 THEN 1
            WHEN q.Premium = 0 AND q.Register = 0 THEN 2
            WHEN q.Premium = 1 AND q.Register = 0 THEN 3
        END) AS Priority
FROM SubjectQuizzes sq
         LEFT JOIN Quizzes q ON q.Id = sq.QuizId
         LEFT JOIN Subjects s ON s.Id = SubjectId
GROUP BY s.Name, q.QuizName;

CREATE TABLE Multimedia (
                            Id INT AUTO_INCREMENT PRIMARY KEY,
                            Name VARCHAR(100) NOT NULL UNIQUE,
                            URL VARCHAR(2048) NOT NULL,
                            Alt VARCHAR(100),
                            Type VARCHAR(50) NOT NULL
);

INSERT INTO Multimedia (Name, URL, Alt, Type) VALUES
                                                  ('BaseIconEnglish', '/images/SubjectAnimals/Owl.png', 'OwlingBase', 'Image'),
                                                  ('BaseIconMath', '/images/SubjectAnimals/Elephant.png', 'EmilyBase', 'Image'),
                                                  ('BaseIconGeography', '/images/SubjectAnimals/Kangaroo.png', 'KanyeBase', 'Image'),
                                                  ('BaseIconScience', '/images/SubjectAnimals/Frog.png', 'FreddyBase', 'Image'),
                                                  ('BaseIconArt', '/images/SubjectAnimals/Platypus.png', 'PerryBase', 'Image'),

                                                  ('SelectGameIconEnglish', '/images/SubjectAnimals/Owl2.png', 'OwlingSelectGame', 'Image'),
                                                  ('SelectGameIconMath', '/images/SubjectAnimals/Elephant2.png', 'EmilySelectGame', 'Image'),
                                                  ('SelectGameIconGeography', '/images/SubjectAnimals/Kangaroo2.png', 'KanyeSelectGame', 'Image'),
                                                  ('SelectGameIconScience', '/images/SubjectAnimals/Frog2.png', 'FreddySelectGame', 'Image'),
                                                  ('SelectGameIconArt', '/images/SubjectAnimals/Platypus2.png', 'PerrySelectGame', 'Image'),

                                                  ('PreviewGameIconEnglish', '/images/SubjectAnimals/Preview/PreviewOwl.png', 'OwlingPreviewGame', 'Image'),
                                                  ('PreviewGameIconMath', '/images/SubjectAnimals/Preview/PreviewElephant.png', 'EmilyPreviewGame', 'Image'),
                                                  ('PreviewGameIconGeography', '/images/SubjectAnimals/Preview/PreviewKangaroo.png', 'KanyePreviewGame', 'Image'),
                                                  ('PreviewGameIconScience', '/images/SubjectAnimals/Preview/PreviewFrog.png', 'FreddyPreviewGame', 'Image'),
                                                  ('PreviewGameIconArt', '/images/SubjectAnimals/Preview/PreviewPlatypus.png', 'PerryPreviewGame', 'Image');

CREATE TABLE MultimediaSubjects (
                                    Id INT AUTO_INCREMENT PRIMARY KEY,
                                    IdMultimedia INT,
                                    IdSubject INT,
                                    FOREIGN KEY (IdSubject) REFERENCES Subjects(Id),
                                    FOREIGN KEY (IdMultimedia) REFERENCES Multimedia(Id)
);

INSERT INTO MultimediaSubjects (IdMultimedia, IdSubject) VALUES (1, 5),
                                                                (2, 3),
                                                                (3, 4),
                                                                (4, 2),
                                                                (5, 1),
                                                                (6, 5),
                                                                (7, 3),
                                                                (8, 4),
                                                                (9, 2),
                                                                (10, 1),
                                                                (11, 5),
                                                                (12, 3),
                                                                (13, 4),
                                                                (14, 2),
                                                                (15, 1);

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

    CREATE TABLE CookTheBook_Stories (
                                         Id INTEGER AUTO_INCREMENT PRIMARY KEY,
                                         Title TEXT NOT NULL
    );

    -- Tabla para piezas de historias con dificultad
    CREATE TABLE CookTheBook_StoryPieces (
                                             Id INTEGER AUTO_INCREMENT,
                                             StoryId INTEGER NOT NULL,
                                             Difficulty VARCHAR(10) NOT NULL, -- Columna de dificultad: 'easy', 'medium', 'hard'
                                             PieceOrder INTEGER NOT NULL,
                                             Text TEXT NOT NULL,
                                             PRIMARY KEY (Id, Difficulty),  -- Clave primaria compuesta
                                             FOREIGN KEY (StoryId) REFERENCES CookTheBook_Stories(Id) ON DELETE CASCADE,
                                             UNIQUE KEY (StoryId, Difficulty, PieceOrder)  -- Asegura que no hay duplicados para la misma historia, dificultad y orden
    );

    INSERT INTO CookTheBook_Stories (Title) VALUES
                                                ('Little Red Riding Hood'),
                                                ('The Three Little Pigs'),
                                                ('Hansel and Gretel'),
                                                ('Goldilocks and the Three Bears');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (1, 'easy', 1, 'A little girl went to visit her grandmother in the woods.'),
                                                                                    (1, 'easy', 2, 'On her way, she met a wicked wolf.'),
                                                                                    (1, 'easy', 3, 'The wolf rushed to grandmother''s house and disguised himself.'),
                                                                                    (1, 'easy', 4, 'A hunter rescued Little Red and her grandmother.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (1, 'medium', 1, 'Little Red Riding Hood lived near the forest.'),
                                                                                    (1, 'medium', 2, 'Her mother sent her to visit her sick grandmother.'),
                                                                                    (1, 'medium', 3, 'She met a wolf who tricked her into taking the long path.'),
                                                                                    (1, 'medium', 4, 'The wolf ate grandmother and disguised himself.'),
                                                                                    (1, 'medium', 5, 'A hunter rescued them from the wolf''s belly.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (1, 'hard', 1, 'A girl always wore a red hood that her grandmother gave her.'),
                                                                                    (1, 'hard', 2, 'She went to bring food to her sick grandmother in the forest.'),
                                                                                    (1, 'hard', 3, 'The wolf tricked her into taking the longer path while he hurried ahead.'),
                                                                                    (1, 'hard', 4, 'The wolf ate grandmother and wore her clothes.'),
                                                                                    (1, 'hard', 5, '"What big teeth you have, Grandmother!" said the girl.'),
                                                                                    (1, 'hard', 6, 'The hunter cut open the wolf and saved both of them.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (2, 'easy', 1, 'Three pigs decided to build their own houses.'),
                                                                                    (2, 'easy', 2, 'The first two built houses of straw and sticks.'),
                                                                                    (2, 'easy', 3, 'The third pig built a strong brick house.'),
                                                                                    (2, 'easy', 4, 'The wolf fell into a pot when trying to enter by the chimney.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (2, 'medium', 1, 'Three little pigs left home to build their own houses.'),
                                                                                    (2, 'medium', 2, 'The first built a straw house the wolf blew down.'),
                                                                                    (2, 'medium', 3, 'The second built a stick house the wolf also destroyed.'),
                                                                                    (2, 'medium', 4, 'The third built a brick house the wolf couldn''t blow down.'),
                                                                                    (2, 'medium', 5, 'The wolf fell into boiling water trying to enter by the chimney.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (2, 'hard', 1, 'A mother pig sent her three children out into the world.'),
                                                                                    (2, 'hard', 2, 'The lazy first pig quickly built a house of straw.'),
                                                                                    (2, 'hard', 3, 'The second pig built a slightly better house of sticks.'),
                                                                                    (2, 'hard', 4, 'The third pig worked hard to build a house of bricks.'),
                                                                                    (2, 'hard', 5, 'The wolf blew down the houses of straw and sticks.'),
                                                                                    (2, 'hard', 6, 'The wolf fell into a pot trying to enter the brick house chimney.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (3, 'easy', 1, 'Two children were abandoned in the forest by their parents.'),
                                                                                    (3, 'easy', 2, 'They found a house made of candy and began to eat it.'),
                                                                                    (3, 'easy', 3, 'The witch captured them and planned to eat them.'),
                                                                                    (3, 'easy', 4, 'Gretel pushed the witch into the oven and they escaped.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (3, 'medium', 1, 'A father was convinced to abandon his children in the forest.'),
                                                                                    (3, 'medium', 2, 'The children got lost in the depths of the forest.'),
                                                                                    (3, 'medium', 3, 'They found a delicious house made of candy and sweets.'),
                                                                                    (3, 'medium', 4, 'The witch locked Hansel in a cage to fatten him up.'),
                                                                                    (3, 'medium', 5, 'Gretel pushed the witch into the oven and they took her jewels.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (3, 'hard', 1, 'During a famine, a stepmother convinced a father to abandon his children.'),
                                                                                    (3, 'hard', 2, 'Hansel dropped pebbles to find their way back home.'),
                                                                                    (3, 'hard', 3, 'Later he used breadcrumbs, but birds ate them all.'),
                                                                                    (3, 'hard', 4, 'Starving, they found a house made of bread and cake.'),
                                                                                    (3, 'hard', 5, 'The witch locked Hansel in a cage and enslaved Gretel.'),
                                                                                    (3, 'hard', 6, 'Gretel tricked the witch into the oven and freed her brother.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (4, 'easy', 1, 'Goldilocks found an empty house in the forest.'),
                                                                                    (4, 'easy', 2, 'She ate porridge, broke a chair, and fell asleep in a bed.'),
                                                                                    (4, 'easy', 3, 'The bears came home and found someone had been there.'),
                                                                                    (4, 'easy', 4, 'They found her sleeping and she ran away scared.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (4, 'medium', 1, 'Goldilocks wandered into the forest and found a bear house.'),
                                                                                    (4, 'medium', 2, 'She tasted three bowls of porridge and ate the just right one.'),
                                                                                    (4, 'medium', 3, 'She sat in three chairs and broke Baby Bear''s chair.'),
                                                                                    (4, 'medium', 4, 'She tried all beds and fell asleep in the smallest one.'),
                                                                                    (4, 'medium', 5, 'The bears found her and she jumped out the window in fright.');

    INSERT INTO CookTheBook_StoryPieces (StoryId, Difficulty, PieceOrder, Text) VALUES
                                                                                    (4, 'hard', 1, 'Three bears made porridge for breakfast in their forest home.'),
                                                                                    (4, 'hard', 2, 'They went for a walk while waiting for it to cool.'),
                                                                                    (4, 'hard', 3, 'Goldilocks found their house and went inside uninvited.'),
                                                                                    (4, 'hard', 4, 'She tried each porridge and ate Baby Bear''s bowl.'),
                                                                                    (4, 'hard', 5, 'She sat in each chair and broke the smallest one.'),
                                                                                    (4, 'hard', 6, 'She fell asleep in Baby Bear''s bed until the bears returned.');


CREATE TABLE Mahjong (
                         Age VARCHAR(50),
                         form1 VARCHAR(50),
                         form2 VARCHAR(255)
);


INSERT INTO Mahjong (Age , form1, form2) VALUES
    -- EASY
    ('easy', 'RED', '/images/Mahjong/red.svg'),
    ('easy', 'BLUE', '/images/Mahjong/blue.svg'),
    ('easy', 'PINK', '/images/Mahjong/pink.svg'),
    ('easy', 'GREEN', '/images/Mahjong/green.svg'),
    ('easy', 'YELLOW', '/images/Mahjong/yellow.svg'),
    ('easy', 'ORANGE', '/images/Mahjong/orange.svg'),
    ('easy', 'BROWN', '/images/Mahjong/brown.svg'),
    ('easy', 'WHITE', '/images/Mahjong/white.svg'),
    ('easy', 'BLACK', '/images/Mahjong/black.svg'),
    ('easy', 'ONE', '/images/Mahjong/1.svg'),
    ('easy', 'TWO', '/images/Mahjong/2.svg'),
    ('easy', 'THREE', '/images/Mahjong/3.svg'),
    ('easy', 'FOUR', '/images/Mahjong/4.svg'),
    ('easy', 'FIVE', '/images/Mahjong/5.svg'),
    ('easy', 'SIX', '/images/Mahjong/6.svg'),
    ('easy', 'SEVEN', '/images/Mahjong/7.svg'),
    ('easy', 'EIGHT', '/images/Mahjong/8.svg'),
    ('easy', 'NINE', '/images/Mahjong/9.svg'),

    -- MEDIUM
    ('medium', 'CLOUDY', '/images/Mahjong/cloudy.svg'),
    ('medium', 'RAINY', '/images/Mahjong/rainy.svg'),
    ('medium', 'SNOWY', '/images/Mahjong/snowy.svg'),
    ('medium', 'STORMY', '/images/Mahjong/stormy.svg'),
    ('medium', 'SUNNY', '/images/Mahjong/sunny.svg'),
    ('medium', 'WINDY', '/images/Mahjong/windy.svg'),
    ('medium', '+ BIG', 'BIGGEST'),
    ('medium', '< BIG', 'BIGGER'),
    ('medium', '+ SMALL', 'SMALLEST'),
    ('medium', '< SMALL', 'SMALLER'),
    ('medium', '+ IMPORTANT', 'MOST IMPORTANT'),
    ('medium', '< IMPORTANT', 'MORE IMPORTANT'),
    ('medium', '+ FAST', 'FASTEST'),
    ('medium', '< FAST', 'FASTER'),
    ('medium', '+ SLOW', 'SLOWEST'),
    ('medium', '< SLOW', 'SLOWER'),
    ('medium', '+ HIGH', 'HIGHEST'),
    ('medium', '< HIGH', 'HIGHER'),
    ('medium', '+ LOW', 'LOWEST'),
    ('medium', '< LOW', 'LOWER'),
    ('medium', '+ STRONG', 'STRONGEST'),
    ('medium', '< STRONG', 'STRONGER'),

    -- HARD
    ('hard', 'BE', 'WAS/WERE'),
    ('hard', 'BEGIN', 'BEGAN'),
    ('hard', 'COME', 'CAME'),
    ('hard', 'DO', 'DID'),
    ('hard', 'EAT', 'ATE'),
    ('hard', 'GO', 'WENT'),
    ('hard', 'HAVE', 'HAD'),
    ('hard', 'MAKE', 'MADE'),
    ('hard', 'SEE', 'SAW'),
    ('hard', 'TAKE', 'TOOK'),
    ('hard', 'WRITE', 'WROTE'),
    ('hard', 'SLEEP', 'SLEPT'),
    ('hard', 'SPEAK', 'SPOKE'),
    ('hard', 'SWIM', 'SWAM'),
    ('hard', 'RUN', 'RAN'),
    ('hard', 'DRIVE', 'DROVE'),
    ('hard', 'SING', 'SANG'),
    ('hard', 'BUY', 'BOUGHT'),
    ('hard', 'CHOOSE', 'CHOSE'),
    ('hard', 'ABOVE', '/images/Mahjong/above.png'),
    ('hard', 'BEHIND', '/images/Mahjong/behind.png'),
    ('hard', 'BESIDE', '/images/Mahjong/beside.png'),
    ('hard', 'BETWEEN', '/images/Mahjong/between.png'),
    ('hard', 'IN', '/images/Mahjong/in.png'),
    ('hard', 'IN FRONT OF', '/images/Mahjong/infrontof.png'),
    ('hard', 'NEAR', '/images/Mahjong/near.png'),
    ('hard', 'ON', '/images/Mahjong/on.png'),
    ('hard', 'UNDER', '/images/Mahjong/under.png')
;

CREATE TABLE LetterSoup (
                            Difficulty VARCHAR(50),
                            Grid TEXT,
                            Words TEXT
);

INSERT INTO LetterSoup (Difficulty, Grid, Words)
VALUES ('easy',
        '[["C","A","T","X","Q","W","E","R","T","Y","U"],\
          ["Z","S","U","N","P","O","I","U","Y","T","R"],\
          ["X","T","R","E","E","K","J","H","G","F","D"],\
          ["M","O","O","N","L","K","J","H","G","F","S"],\
          ["S","T","A","R","P","Q","W","E","R","T","Y"],\
          ["F","I","S","H","Z","X","C","V","B","N","M"],\
          ["B","I","R","D","Q","W","E","R","T","Y","U"],\
          ["A","X","Z","C","V","B","N","M","L","K","J"],\
          ["L","L","Q","W","E","R","T","Y","U","I","O"],\
          ["H","A","T","P","O","I","U","Y","T","R","E"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["CAT","DOG","SUN","MOON","STAR","FISH","BIRD","TREE","BALL","HAT"]'),

       ('easy',
        '[["P","E","N","X","Q","W","E","R","T","Y","U"],\
          ["B","O","O","K","Z","X","C","V","B","N","M"],\
          ["T","O","Y","Q","W","E","R","T","Y","U","I"],\
          ["C","A","K","E","P","O","I","U","Y","T","R"],\
          ["M","I","L","K","Z","X","C","V","B","N","M"],\
          ["C","U","P","Q","W","E","R","T","Y","U","I"],\
          ["S","H","O","E","P","O","I","U","Y","T","R"],\
          ["B","A","G","X","Z","C","V","B","N","M","L"],\
          ["K","I","T","E","Q","W","E","R","T","Y","U"],\
          ["C","A","R","P","O","I","U","Y","T","R","E"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["PEN","BOOK","TOY","CAKE","MILK","CUP","SHOE","BAG","KITE","CAR"]'),

       ('easy',
        '[["C","O","W","X","Q","W","E","R","T","Y","U"],\
          ["P","I","G","Z","X","C","V","B","N","M","L"],\
          ["H","E","N","Q","W","E","R","T","Y","U","I"],\
          ["D","U","C","K","P","O","I","U","Y","T","R"],\
          ["G","O","A","T","Z","X","C","V","B","N","M"],\
          ["S","H","E","E","P","Q","W","E","R","T","Y"],\
          ["R","A","T","X","Z","C","V","B","N","M","L"],\
          ["A","N","T","Q","W","E","R","T","Y","U","I"],\
          ["B","E","E","P","O","I","U","Y","T","R","E"],\
          ["F","O","X","Z","X","C","V","B","N","M","L"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["COW","PIG","HEN","DUCK","GOAT","SHEEP","RAT","ANT","BEE","FOX"]'),

       ('easy',
        '[["S","K","Y","X","Q","W","E","R","T","Y","U"],\
          ["C","L","O","U","D","Z","X","C","V","B","N"],\
          ["R","A","I","N","Q","W","E","R","T","Y","U"],\
          ["W","I","N","D","P","O","I","U","Y","T","R"],\
          ["S","N","O","W","Z","X","C","V","B","N","M"],\
          ["F","O","G","Q","W","E","R","T","Y","U","I"],\
          ["S","U","N","X","Z","C","V","B","N","M","L"],\
          ["M","O","O","N","P","O","I","U","Y","T","R"],\
          ["S","T","A","R","Z","X","C","V","B","N","M"],\
          ["D","A","Y","Q","W","E","R","T","Y","U","I"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["SKY","CLOUD","RAIN","WIND","SNOW","FOG","SUN","MOON","STAR","DAY"]'),

       ('easy',
        '[["R","E","D","X","Q","W","E","R","T","Y","U"],\
          ["B","L","U","E","Z","X","C","V","B","N","M"],\
          ["G","R","E","E","N","Q","W","E","R","T","Y"],\
          ["Y","E","L","L","O","W","P","O","I","U","Y"],\
          ["P","I","N","K","Z","X","C","V","B","N","M"],\
          ["B","L","A","C","K","Q","W","E","R","T","Y"],\
          ["W","H","I","T","E","X","Z","C","V","B","N"],\
          ["G","R","A","Y","P","O","I","U","Y","T","R"],\
          ["B","R","O","W","N","Z","X","C","V","B","N"],\
          ["G","O","L","D","Q","W","E","R","T","Y","U"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["RED","BLUE","GREEN","YELLOW","PINK","BLACK","WHITE","GRAY","BROWN","GOLD"]'),

       ('easy',
        '[["A","R","M","X","Q","W","E","R","T","Y","U"],\
          ["L","E","G","Z","X","C","V","B","N","M","L"],\
          ["H","A","N","D","Q","W","E","R","T","Y","U"],\
          ["F","O","O","T","P","O","I","U","Y","T","R"],\
          ["H","E","A","D","Z","X","C","V","B","N","M"],\
          ["E","Y","E","Q","W","E","R","T","Y","U","I"],\
          ["E","A","R","X","Z","C","V","B","N","M","L"],\
          ["N","O","S","E","P","O","I","U","Y","T","R"],\
          ["M","O","U","T","H","Z","X","C","V","B","N"],\
          ["N","E","C","K","Q","W","E","R","T","Y","U"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["ARM","LEG","HAND","FOOT","HEAD","EYE","EAR","NOSE","MOUTH","NECK"]'),

       ('easy',
        '[["A","P","P","L","E","X","Q","W","E","R","T"],\
          ["B","A","N","A","N","A","Z","X","C","V","B"],\
          ["G","R","A","P","E","Q","W","E","R","T","Y"],\
          ["P","E","A","R","P","O","I","U","Y","T","R"],\
          ["P","L","U","M","Z","X","C","V","B","N","M"],\
          ["K","I","W","I","Q","W","E","R","T","Y","U"],\
          ["M","A","N","G","O","X","Z","C","V","B","N"],\
          ["L","E","M","O","N","P","O","I","U","Y","T"],\
          ["L","I","M","E","Z","X","C","V","B","N","M"],\
          ["P","E","A","C","H","Q","W","E","R","T","Y"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["APPLE","BANANA","GRAPE","PEAR","PLUM","KIWI","MANGO","LEMON","LIME","PEACH"]'),

       ('medium',
        '[["H","O","U","S","E","X","Q","W","E","R","T"],\
          ["G","A","R","D","E","N","Z","X","C","V","B"],\
          ["R","I","V","E","R","Q","W","E","R","T","Y"],\
          ["B","R","I","D","G","E","P","O","I","U","Y"],\
          ["F","O","R","E","S","T","Z","X","C","V","B"],\
          ["P","A","T","H","X","Q","W","E","R","T","Y"],\
          ["H","I","L","L","Z","X","C","V","B","N","M"],\
          ["L","A","K","E","P","O","I","U","Y","T","R"],\
          ["R","O","A","D","Z","X","C","V","B","N","M"],\
          ["F","A","R","M","Q","W","E","R","T","Y","U"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["HOUSE","GARDEN","RIVER","BRIDGE","FOREST","PATH","HILL","LAKE","ROAD","FARM"]'),

       ('medium',
        '[["T","R","A","I","N","X","Q","W","E","R","T"],\
          ["P","L","A","N","E","Z","X","C","V","B","N"],\
          ["C","A","R","Q","W","E","R","T","Y","U","I"],\
          ["B","O","A","T","P","O","I","U","Y","T","R"],\
          ["B","I","C","Y","C","L","E","Z","X","C","V"],\
          ["B","U","S","X","Q","W","E","R","T","Y","U"],\
          ["T","R","U","C","K","P","O","I","U","Y","T"],\
          ["S","H","I","P","Z","X","C","V","B","N","M"],\
          ["W","A","G","O","N","Q","W","E","R","T","Y"],\
          ["V","A","N","X","Z","C","V","B","N","M","L"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["TRAIN","PLANE","CAR","BOAT","BICYCLE","BUS","TRUCK","SHIP","WAGON","VAN"]'),

       ('medium',
        '[["D","O","C","T","O","R","X","Q","W","E","R"],\
          ["N","U","R","S","E","Z","X","C","V","B","N"],\
          ["T","E","A","C","H","E","R","P","O","I","U"],\
          ["F","A","R","M","E","R","Q","W","E","R","T"],\
          ["C","O","O","K","X","Z","C","V","B","N","M"],\
          ["P","I","L","O","T","Q","W","E","R","T","Y"],\
          ["D","R","I","V","E","R","P","O","I","U","Y"],\
          ["C","L","E","R","K","Z","X","C","V","B","N"],\
          ["J","U","D","G","E","Q","W","E","R","T","Y"],\
          ["B","A","K","E","R","X","Z","C","V","B","N"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["DOCTOR","NURSE","TEACHER","FARMER","COOK","PILOT","DRIVER","CLERK","JUDGE","BAKER"]'),

       ('medium',
        '[["P","I","A","N","O","X","Q","W","E","R","T"],\
          ["G","U","I","T","A","R","Z","X","C","V","B"],\
          ["D","R","U","M","Q","W","E","R","T","Y","U"],\
          ["F","L","U","T","E","P","O","I","U","Y","T"],\
          ["V","I","O","L","I","N","X","Z","C","V","B"],\
          ["H","A","R","P","Q","W","E","R","T","Y","U"],\
          ["T","R","U","M","P","E","T","P","O","I","U"],\
          ["S","A","X","Q","W","E","R","T","Y","U","I"],\
          ["B","E","L","L","Z","X","C","V","B","N","M"],\
          ["H","O","R","N","X","Z","C","V","B","N","M"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["PIANO","GUITAR","DRUM","FLUTE","VIOLIN","HARP","TRUMPET","SAX","BELL","HORN"]'),

       ('medium',
        '[["T","I","G","E","R","X","Q","W","E","R","T"],\
          ["L","I","O","N","Z","X","C","V","B","N","M"],\
          ["B","E","A","R","Q","W","E","R","T","Y","U"],\
          ["W","O","L","F","P","O","I","U","Y","T","R"],\
          ["D","E","E","R","X","Z","C","V","B","N","M"],\
          ["F","O","X","Q","W","E","R","T","Y","U","I"],\
          ["R","A","B","B","I","T","P","O","I","U","Y"],\
          ["S","N","A","K","E","Z","X","C","V","B","N"],\
          ["E","A","G","L","E","Q","W","E","R","T","Y"],\
          ["O","W","L","X","Z","C","V","B","N","M","L"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["TIGER","LION","BEAR","WOLF","DEER","FOX","RABBIT","SNAKE","EAGLE","OWL"]'),

       ('medium',
        '[["G","L","B","K","F","X","Y","V","O","I","I"],\
          ["U","I","I","L","T","B","A","Z","O","I","G"],\
          ["P","X","R","J","E","S","J","W","C","J","U"],\
          ["H","H","D","L","T","A","M","I","Q","P","S"],\
          ["U","G","A","H","F","M","V","F","Q","F","B"],\
          ["S","R","J","M","W","R","K","E","Y","S","T"],\
          ["B","U","K","Y","S","C","I","Y","S","T","I"],\
          ["A","P","T","U","R","T","L","E","P","G","E"],\
          ["N","K","D","J","X","P","E","G","N","S","F"],\
          ["D","X","D","H","M","E","E","R","D","D","U"],\
          ["U","A","L","E","T","O","O","T","H","V","S"]]',
        '["BIRD","GIRLFRIEND","HAMSTER","HUSBAND","KEYS","LEAVES","PET","TOOTH","TURTLE","WIFE"]'),

       ('medium',
        '[["S","U","M","M","E","R","X","Q","W","E","R"],\
          ["W","I","N","T","E","R","Z","X","C","V","B"],\
          ["S","P","R","I","N","G","Q","W","E","R","T"],\
          ["F","A","L","L","P","O","I","U","Y","T","R"],\
          ["C","L","O","U","D","X","Z","C","V","B","N"],\
          ["S","T","O","R","M","Q","W","E","R","T","Y"],\
          ["S","N","O","W","X","Z","C","V","B","N","M"],\
          ["R","A","I","N","P","O","I","U","Y","T","R"],\
          ["W","I","N","D","Z","X","C","V","B","N","M"],\
          ["S","U","N","Q","W","E","R","T","Y","U","I"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["SUMMER","WINTER","SPRING","FALL","CLOUD","STORM","SNOW","RAIN","WIND","SUN"]'),

       ('medium',
        '[["T","A","B","L","E","X","Q","W","E","R","T"],\
          ["C","H","A","I","R","Z","X","C","V","B","N"],\
          ["B","E","D","Q","W","E","R","T","Y","U","I"],\
          ["S","O","F","A","P","O","I","U","Y","T","R"],\
          ["D","E","S","K","X","Z","C","V","B","N","M"],\
          ["L","A","M","P","Q","W","E","R","T","Y","U"],\
          ["S","H","E","L","F","P","O","I","U","Y","T"],\
          ["R","U","G","X","Z","C","V","B","N","M","L"],\
          ["M","I","R","R","O","R","Q","W","E","R","T"],\
          ["C","L","O","C","K","Z","X","C","V","B","N"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["TABLE","CHAIR","BED","SOFA","DESK","LAMP","SHELF","RUG","MIRROR","CLOCK"]'),

       ('hard',
        '[["E","L","E","P","H","A","N","T","X","Q","W"],\
          ["G","I","R","A","F","F","E","Z","X","C","V"],\
          ["C","R","O","C","O","D","I","L","E","P","O"],\
          ["H","I","P","P","O","P","O","T","A","M","U"],\
          ["R","H","I","N","O","C","E","R","O","S","X"],\
          ["C","H","E","E","T","A","H","Q","W","E","R"],\
          ["L","E","O","P","A","R","D","Z","X","C","V"],\
          ["Z","E","B","R","A","P","O","I","U","Y","T"],\
          ["G","O","R","I","L","L","A","X","Z","C","V"],\
          ["P","A","N","D","A","Q","W","E","R","T","Y"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["ELEPHANT","GIRAFFE","CROCODILE","HIPPOPOTAMUS","RHINOCEROS","CHEETAH","LEOPARD","ZEBRA","GORILLA","PANDA"]'),

       ('hard',
        '[["A","S","T","R","O","N","A","U","T","X","Q"],\
          ["T","E","L","E","S","C","O","P","E","Z","X"],\
          ["S","A","T","E","L","L","I","T","E","P","O"],\
          ["R","O","C","K","E","T","Q","W","E","R","T"],\
          ["P","L","A","N","E","T","X","Z","C","V","B"],\
          ["G","A","L","A","X","Y","Q","W","E","R","T"],\
          ["C","O","M","E","T","P","O","I","U","Y","T"],\
          ["M","E","T","E","O","R","X","Z","C","V","B"],\
          ["O","R","B","I","T","Q","W","E","R","T","Y"],\
          ["S","T","A","R","X","Z","C","V","B","N","M"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["ASTRONAUT","TELESCOPE","SATELLITE","ROCKET","PLANET","GALAXY","COMET","METEOR","ORBIT","STAR"]'),

       ('hard',
        '[["M","I","C","R","O","S","C","O","P","E","X"],\
          ["T","E","L","E","P","H","O","N","E","Z","X"],\
          ["C","O","M","P","U","T","E","R","Q","W","E"],\
          ["C","A","M","E","R","A","P","O","I","U","Y"],\
          ["R","A","D","I","O","X","Z","C","V","B","N"],\
          ["R","O","B","O","T","Q","W","E","R","T","Y"],\
          ["E","N","G","I","N","E","X","Z","C","V","B"],\
          ["B","A","T","T","E","R","Y","P","O","I","U"],\
          ["C","I","R","C","U","I","T","Q","W","E","R"],\
          ["S","E","N","S","O","R","X","Z","C","V","B"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["MICROSCOPE","TELEPHONE","COMPUTER","CAMERA","RADIO","ROBOT","ENGINE","BATTERY","CIRCUIT","SENSOR"]'),

       ('hard',
        '[["V","O","L","C","A","N","O","X","Q","W","E"],\
          ["E","A","R","T","H","Q","U","A","K","E","Z"],\
          ["T","O","R","N","A","D","O","P","O","I","U"],\
          ["H","U","R","R","I","C","A","N","E","X","Z"],\
          ["T","S","U","N","A","M","I","Q","W","E","R"],\
          ["F","L","O","O","D","X","Z","C","V","B","N"],\
          ["D","R","O","U","G","H","T","P","O","I","U"],\
          ["B","L","I","Z","Z","A","R","D","Q","W","E"],\
          ["L","A","N","D","S","L","I","D","E","X","Z"],\
          ["A","V","A","L","A","N","C","H","E","P","O"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["VOLCANO","EARTHQUAKE","TORNADO","HURRICANE","TSUNAMI","FLOOD","DROUGHT","BLIZZARD","LANDSLIDE","AVALANCHE"]'),

       ('hard',
        '[["S","Y","M","P","H","O","N","Y","X","Q","W"],\
          ["O","R","C","H","E","S","T","R","A","Z","X"],\
          ["C","O","N","D","U","C","T","O","R","P","O"],\
          ["V","I","O","L","I","N","I","S","T","Q","W"],\
          ["P","I","A","N","I","S","T","X","Z","C","V"],\
          ["C","O","M","P","O","S","E","R","P","O","I"],\
          ["H","A","R","M","O","N","Y","Q","W","E","R"],\
          ["R","H","Y","T","H","M","X","Z","C","V","B"],\
          ["M","E","L","O","D","Y","P","O","I","U","Y"],\
          ["S","O","N","A","T","A","Q","W","E","R","T"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["SYMPHONY","ORCHESTRA","CONDUCTOR","VIOLINIST","PIANIST","COMPOSER","HARMONY","RHYTHM","MELODY","SONATA"]'),

       ('hard',
        '[["D","E","M","O","C","R","A","C","Y","X","Q"],\
          ["E","L","E","C","T","I","O","N","Z","X","C"],\
          ["P","A","R","L","I","A","M","E","N","T","P"],\
          ["P","R","E","S","I","D","E","N","T","Q","W"],\
          ["C","O","N","S","T","I","T","U","T","I","O"],\
          ["F","R","E","E","D","O","M","X","Z","C","V"],\
          ["J","U","S","T","I","C","E","P","O","I","U"],\
          ["L","I","B","E","R","T","Y","Q","W","E","R"],\
          ["E","Q","U","A","L","I","T","Y","X","Z","C"],\
          ["R","I","G","H","T","S","P","O","I","U","Y"],\
          ["X","Z","C","V","B","N","M","L","K","J","H"]]',
        '["DEMOCRACY","ELECTION","PARLIAMENT","PRESIDENT","CONSTITUTION","FREEDOM","JUSTICE","LIBERTY","EQUALITY","RIGHTS"]');

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
select * from CookTheBook_Stories;
select * from CookTheBook_StoryPieces;
select * from Mahjong;
SET sql_notes = 1;