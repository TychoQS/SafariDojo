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