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
DROP TABLE IF EXISTS Shapes;
DROP TABLE IF EXISTS DominoMasterShapes;
DROP TABLE IF EXISTS LetterSoup;
DROP TABLE IF EXISTS Geography;
DROP TABLE IF EXISTS DetectiveLupin;
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
                                                                ('Mistery Doors', TRUE, FALSE, 'https://youtu.be/rw-i_AwR7G8'),
                                                                ('Cross Math', FALSE, FALSE, NULL),
                                                                ('Crossword', FALSE, FALSE, NULL),
                                                                ('Letter Soup', FALSE, TRUE, 'https://youtu.be/mdDlEF4_kG4'),
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
VALUES
    ('easy',
     '[["M","S","R","F","C","A","T","Q","D","P","B"],
       ["X","U","N","I","T","R","V","W","O","A","I"],
       ["B","N","S","S","A","B","A","L","L","Z","R"],
       ["D","T","T","H","R","J","T","N","G","X","D"],
       ["R","A","Z","X","E","M","P","O","Y","Q","L"],
       ["T","E","Q","Y","E","O","N","I","F","W","K"],
       ["G","R","R","M","Y","O","B","V","H","E","J"],
       ["H","T","E","N","I","N","U","B","A","R","I"],
       ["A","S","E","W","P","J","S","T","T","K","T"],
       ["T","Q","F","I","S","H","T","Z","O","L","Y"],
       ["V","N","M","C","H","A","M","R","E","E","U"]]',
     '["CAT","DOG","SUN","MOON","STAR","FISH","BIRD","TREE","BALL","HAT"]'),

    ('easy',
     '[["P","V","B","X","Z","C","A","R","L","M","Q"],
       ["E","C","T","O","Y","U","W","R","Y","I","J"],
       ["N","U","O","P","L","P","E","S","T","L","S"],
       ["M","P","Y","C","A","K","E","H","U","K","H"],
       ["I","G","B","O","O","K","O","Y","V","N","O"],
       ["L","W","A","C","Z","P","Q","R","M","T","E"],
       ["K","A","G","R","E","I","W","K","P","Z","X"],
       ["B","I","R","C","T","R","X","I","W","L","V"],
       ["K","N","T","S","F","D","J","T","G","K","C"],
       ["T","E","H","B","T","O","Y","E","M","Z","D"],
       ["J","Q","R","V","W","X","Y","P","I","N","M"]]',
     '["PEN","BOOK","TOY","CAKE","MILK","CUP","SHOE","BAG","KITE","CAR"]'),

    ('easy',
     '[["C","Z","F","P","O","W","X","V","Q","P","U"],
       ["X","P","O","I","A","R","G","Y","I","I","J"],
       ["B","I","X","G","O","A","T","U","C","K","H"],
       ["R","G","J","W","H","F","S","D","G","E","F"],
       ["A","L","Z","E","E","K","J","U","S","N","G"],
       ["T","H","E","N","N","L","H","C","H","S","O"],
       ["M","B","E","E","Z","B","G","K","E","L","A"],
       ["D","V","C","Q","T","P","F","K","E","V","T"],
       ["W","G","Y","X","R","A","N","T","P","B","J"],
       ["C","O","W","J","K","L","Q","W","R","Z","C"],
       ["U","I","O","P","A","D","F","G","H","J","K"]]',
     '["COW","PIG","HEN","DUCK","GOAT","SHEEP","RAT","ANT","BEE","FOX"]'),

    ('easy',
     '[["S","F","H","G","K","Q","W","E","Y","P","M"],
       ["K","O","C","L","O","U","D","R","A","Z","O"],
       ["Y","G","D","X","J","K","I","P","D","S","O"],
       ["D","M","A","Z","R","G","T","Y","A","N","N"],
       ["A","B","Y","X","W","I","N","D","Y","O","S"],
       ["Y","V","W","S","N","O","W","F","O","G","T"],
       ["R","N","S","U","N","R","K","M","V","C","A"],
       ["T","M","W","Z","X","L","Q","W","E","Y","R"],
       ["R","P","A","O","I","U","Y","T","R","E","K"],
       ["A","I","S","O","P","A","D","F","G","H","J"],
       ["I","N","Z","X","M","C","V","B","N","M","P"]]',
     '["SKY","CLOUD","RAIN","WIND","SNOW","FOG","SUN","MOON","STAR","DAY"]'),

    ('easy',
     '[["R","L","K","P","I","N","K","W","A","J","F"],
       ["E","X","W","G","P","L","S","H","M","U","G"],
       ["D","Z","Y","B","L","A","C","K","Q","V","R"],
       ["G","G","U","R","F","B","T","I","Z","D","A"],
       ["R","O","B","L","U","E","T","W","H","I","T"],
       ["E","L","O","E","G","S","Y","P","C","U","E"],
       ["E","D","P","N","H","Q","V","Y","V","T","H"],
       ["N","Y","E","L","L","O","W","D","B","I","G"],
       ["Y","B","R","O","W","N","N","C","N","P","M"],
       ["K","L","S","Z","X","C","M","R","M","Q","A"],
       ["J","H","G","O","L","D","T","E","Z","F","D"]]',
     '["RED","BLUE","GREEN","YELLOW","PINK","BLACK","WHITE","GRAY","BROWN","GOLD"]'),

    ('easy',
     '[["A","P","Q","W","E","M","H","Y","U","I","O"],
       ["R","Z","N","E","C","K","E","C","V","B","N"],
       ["M","X","O","S","R","F","A","H","J","K","L"],
       ["F","C","S","D","O","I","D","A","H","E","A"],
       ["O","V","E","E","Y","E","F","N","A","D","R"],
       ["O","B","J","F","O","L","J","D","N","Z","X"],
       ["T","N","M","E","A","R","C","P","D","N","M"],
       ["Z","M","O","U","T","H","O","A","S","D","F"],
       ["X","O","G","H","J","E","L","E","G","Z","X"],
       ["C","U","V","B","N","M","L","Q","W","R","T"],
       ["L","T","H","W","Z","X","C","V","B","N","M"]]',
     '["ARM","LEG","HAND","FOOT","HEAD","EYE","EAR","NOSE","MOUTH","NECK"]'),

    ('easy',
     '[["A","P","P","L","E","A","Y","T","U","I","P"],
       ["Q","W","R","X","M","F","Z","C","V","B","E"],
       ["G","R","A","P","E","A","W","E","R","T","A"],
       ["F","G","H","P","K","N","P","L","S","D","C"],
       ["T","P","L","U","M","G","D","E","G","H","H"],
       ["B","U","I","Q","W","O","E","M","T","Y","U"],
       ["A","K","I","W","I","Z","X","O","E","M","O"],
       ["N","P","M","S","D","F","G","N","H","J","N"],
       ["A","I","E","M","A","N","G","O","L","Z","X"],
       ["N","V","B","P","E","A","R","E","Q","W","E"],
       ["A","A","L","I","M","E","T","Y","U","O","P"]]',
     '["APPLE","BANANA","GRAPE","PEAR","PLUM","KIWI","MANGO","LEMON","LIME","PEACH"]'),

    ('medium',
     '[["H","L","K","F","V","X","B","F","Z","E","F"],
       ["O","A","P","A","T","H","R","O","X","T","A"],
       ["U","K","M","R","Q","C","I","R","C","L","R"],
       ["S","E","V","M","H","I","D","E","V","A","M"],
       ["E","G","C","B","V","L","G","S","B","K","R"],
       ["L","W","R","R","O","A","D","T","N","E","O"],
       ["A","E","I","T","Y","K","N","M","X","Z","A"],
       ["K","R","V","G","A","R","D","E","N","V","D"],
       ["E","F","E","F","G","H","J","K","H","Q","W"],
       ["R","O","R","I","L","L","Z","X","O","I","B"],
       ["H","I","L","U","I","O","P","A","U","D","F"]]',
     '["HOUSE","GARDEN","RIVER","BRIDGE","FOREST","PATH","HILL","LAKE","ROAD","FARM"]'),

    ('medium',
     '[["T","W","A","G","O","N","Z","O","P","L","C"],
       ["R","Q","G","H","J","K","L","Q","T","A","A"],
       ["A","W","E","R","T","Y","U","I","R","N","R"],
       ["I","O","P","B","U","S","D","F","U","E","V"],
       ["N","E","N","I","C","G","H","V","C","B","A"],
       ["Z","R","A","C","K","L","Z","A","K","O","N"],
       ["X","T","L","Y","J","Q","X","N","Z","A","Q"],
       ["C","Y","P","C","W","S","C","X","X","T","W"],
       ["V","U","B","L","E","H","V","C","C","V","E"],
       ["B","I","C","Y","C","L","E","V","B","B","R"],
       ["S","H","I","P","T","P","N","B","N","N","T"]]',
     '["TRAIN","PLANE","CAR","BOAT","BICYCLE","BUS","TRUCK","SHIP","WAGON","VAN"]'),

    ('medium',
     '[["D","R","I","V","E","R","Q","E","R","T","Y"],
       ["O","W","F","G","H","J","K","L","Q","K","R"],
       ["C","E","A","S","D","F","G","H","J","Z","E"],
       ["T","R","R","X","C","V","B","N","U","X","H"],
       ["O","T","M","N","U","R","S","E","D","C","C"],
       ["R","Y","E","Q","W","E","R","T","G","V","A"],
       ["B","U","R","P","I","L","O","T","E","B","E"],
       ["A","I","C","O","O","K","P","A","S","N","T"],
       ["K","O","L","J","F","D","J","B","H","M","J"],
       ["E","P","E","S","D","Z","C","A","K","E","R"],
       ["R","A","R","K","F","G","H","J","K","L","Q"]]',
     '["DOCTOR","NURSE","TEACHER","FARMER","COOK","PILOT","DRIVER","CLERK","JUDGE","BAKER"]'),

    ('medium',
     '[["P","W","H","O","R","N","Q","P","T","I","O"],
       ["I","E","R","T","Y","D","I","O","R","P","A"],
       ["A","R","F","G","H","R","K","L","U","Q","S"],
       ["N","T","Z","X","C","U","B","N","M","W","D"],
       ["O","Y","F","L","U","T","E","R","P","E","F"],
       ["V","U","A","S","D","G","H","J","E","R","G"],
       ["I","I","V","I","O","L","I","N","T","T","H"],
       ["O","O","S","A","S","D","F","G","H","Y","J"],
       ["G","U","I","T","A","R","K","L","Z","U","K"],
       ["Z","X","S","A","X","V","B","N","M","Q","L"],
       ["B","E","L","L","W","H","A","R","P","Z","X"]]',
     '["PIANO","GUITAR","DRUM","FLUTE","VIOLIN","HARP","TRUMPET","SAX","BELL","HORN"]'),

    ('medium',
     '[["T","Z","L","I","O","N","C","R","X","Y","R"],
       ["I","X","Q","W","E","R","T","Y","U","I","A"],
       ["G","R","A","S","D","F","G","H","J","K","B"],
       ["E","R","Z","X","C","V","B","E","B","B","B"],
       ["R","A","B","Q","W","E","R","A","Y","E","I"],
       ["Z","O","W","L","K","L","Z","R","C","V","T"],
       ["X","C","N","M","Q","D","F","O","X","Y","U"],
       ["V","B","N","D","E","E","R","P","A","S","D"],
       ["E","A","G","L","E","R","G","H","J","K","L"],
       ["Z","X","C","V","S","N","A","K","E","W","E"],
       ["W","O","L","F","S","D","F","G","H","J","K"]]',
     '["TIGER","LION","BEAR","WOLF","DEER","FOX","RABBIT","SNAKE","EAGLE","OWL"]'),

    ('medium',
     '[["B","K","F","L","E","A","V","E","S","X","G"],
       ["I","E","X","M","W","I","F","E","T","H","I"],
       ["R","Y","Z","H","S","Z","X","C","G","U","R"],
       ["D","S","C","A","R","V","B","N","B","M","L"],
       ["Q","W","V","M","T","O","O","T","H","A","F"],
       ["E","R","B","S","Y","Q","W","E","R","N","R"],
       ["T","Y","N","T","P","E","T","R","T","D","I"],
       ["U","I","M","E","Q","W","E","R","Y","T","E"],
       ["R","O","L","R","Z","X","C","V","B","N","N"],
       ["T","L","K","J","H","U","S","B","A","N","D"],
       ["E","P","A","S","D","F","G","H","J","K","L"]]',
     '["BIRD","GIRLFRIEND","HAMSTER","HUSBAND","KEYS","LEAVES","PET","TOOTH","TURTLE","WIFE"]'),

    ('medium',
     '[["S","U","M","M","E","R","X","Q","W","E","F"],
       ["P","Z","X","C","V","B","Z","X","C","V","A"],
       ["R","W","I","N","T","E","R","W","E","R","L"],
       ["I","Q","W","E","R","A","P","O","I","U","L"],
       ["N","C","Y","X","S","I","C","Z","C","S","W"],
       ["G","L","W","Z","T","N","V","L","V","N","I"],
       ["X","O","Q","C","O","S","B","N","O","W","N"],
       ["R","U","W","V","R","W","M","P","W","Z","D"],
       ["A","D","E","B","M","Q","Y","Z","Q","X","X"],
       ["I","X","R","N","Q","S","U","N","W","E","C"],
       ["N","Z","T","M","Z","X","C","V","B","N","M"]]',
     '["SUMMER","WINTER","SPRING","FALL","CLOUD","STORM","SNOW","RAIN","WIND","SUN"]'),

    ('medium',
     '[["T","A","B","L","E","X","Q","R","S","O","F"],
       ["H","Z","X","C","V","C","Z","U","C","V","A"],
       ["C","B","E","D","Q","H","G","G","H","J","B"],
       ["L","P","O","I","U","A","Y","T","L","R","E"],
       ["O","X","Z","C","V","I","B","A","E","I","D"],
       ["C","L","A","M","P","R","Q","S","D","F","S"],
       ["K","Q","W","E","R","T","D","K","F","G","H"],
       ["J","K","D","E","S","K","V","B","N","M","E"],
       ["Q","W","M","I","R","R","O","R","W","E","L"],
       ["R","T","Y","U","I","O","P","A","S","D","F"],
       ["G","H","J","K","L","Z","X","C","V","B","N"]]',
     '["TABLE","CHAIR","BED","SOFA","DESK","LAMP","SHELF","RUG","MIRROR","CLOCK"]'),

    ('hard',
     '[["E","L","E","P","H","A","N","T","X","Q","W"],
       ["G","I","R","A","F","F","E","Z","X","C","V"],
       ["C","R","O","C","O","D","I","L","E","P","O"],
       ["H","I","P","P","O","P","O","T","A","M","U"],
       ["R","H","I","N","O","C","E","R","O","S","X"],
       ["C","H","E","E","T","A","H","Q","W","E","R"],
       ["L","E","O","P","A","R","D","Z","X","C","V"],
       ["Z","E","B","R","A","P","O","I","U","Y","T"],
       ["G","O","R","I","L","L","A","X","Z","C","V"],
       ["P","A","N","D","A","Q","W","E","R","T","Y"],
       ["X","Z","C","V","B","N","M","L","K","J","H"]]',
     '["ELEPHANT","GIRAFFE","CROCODILE","HIPPOPOTAMUS","RHINOCEROS","CHEETAH","LEOPARD","ZEBRA","GORILLA","PANDA"]'),

    ('hard',
     '[["A","S","T","R","O","N","A","U","T","X","G"],
       ["Z","T","E","L","E","S","C","O","P","E","A"],
       ["P","A","S","A","T","E","L","L","I","T","E"],
       ["L","R","X","C","E","P","Q","W","E","R","T"],
       ["A","X","O","K","O","L","A","Z","C","V","B"],
       ["N","C","R","E","R","A","N","Q","O","R","T"],
       ["E","O","B","T","B","N","E","P","M","B","Y"],
       ["T","M","I","M","I","E","T","Z","E","I","U"],
       ["G","E","T","Q","T","T","X","R","T","T","I"],
       ["A","T","S","W","E","G","A","L","A","X","Y"],
       ["L","A","Z","C","V","B","N","M","L","K","J"]]',
     '["ASTRONAUT","TELESCOPE","SATELLITE","ROCKET","PLANET","GALAXY","COMET","METEOR","ORBIT","STAR"]'),

    ('hard',
     '[["M","I","C","R","O","S","C","O","P","E","N"],
       ["T","E","L","E","P","H","O","N","E","Z","G"],
       ["C","O","M","P","U","T","E","R","Q","W","I"],
       ["C","A","M","E","R","A","P","O","I","U","N"],
       ["R","A","D","I","O","X","Z","C","V","B","E"],
       ["R","O","B","O","T","Q","W","E","R","T","Y"],
       ["E","N","G","I","N","E","X","Z","C","V","B"],
       ["B","A","T","T","E","R","Y","P","O","I","U"],
       ["C","I","R","C","U","I","T","Q","W","E","R"],
       ["S","E","N","S","O","R","X","Z","C","V","B"],
       ["X","Z","C","V","B","N","M","L","K","J","H"]]',
     '["MICROSCOPE","TELEPHONE","COMPUTER","CAMERA","RADIO","ROBOT","ENGINE","BATTERY","CIRCUIT","SENSOR"]'),

    ('hard',
     '[["V","O","L","C","A","N","O","X","Q","W","T"],
       ["E","A","R","T","H","Q","U","A","K","E","S"],
       ["T","O","R","N","A","D","O","P","O","I","U"],
       ["H","U","R","R","I","C","A","N","E","X","N"],
       ["F","T","S","U","N","A","M","I","Q","W","A"],
       ["L","L","F","L","O","O","D","Z","C","V","M"],
       ["O","D","R","O","U","G","H","T","P","O","I"],
       ["O","B","L","I","Z","Z","A","R","D","Q","W"],
       ["D","L","A","N","D","S","L","I","D","E","X"],
       ["A","V","A","L","A","N","C","H","E","P","O"],
       ["X","Z","C","V","B","N","M","L","K","J","H"]]',
     '["VOLCANO","EARTHQUAKE","TORNADO","HURRICANE","TSUNAMI","FLOOD","DROUGHT","BLIZZARD","LANDSLIDE","AVALANCHE"]'),

    ('hard',
     '[["S","Y","M","P","H","O","N","Y","X","Q","W"],
       ["O","R","C","H","E","S","T","R","A","Z","X"],
       ["C","O","N","D","U","C","T","O","R","P","O"],
       ["V","I","O","L","I","N","I","S","T","Q","W"],
       ["P","I","A","N","I","S","T","X","Z","C","V"],
       ["C","O","M","P","O","S","E","R","P","O","I"],
       ["H","A","R","M","O","N","Y","Q","W","E","R"],
       ["R","H","Y","T","H","M","X","Z","C","V","B"],
       ["M","E","L","O","D","Y","P","O","I","U","Y"],
       ["S","O","N","A","T","A","Q","W","E","R","T"],
       ["X","Z","C","V","B","N","M","L","K","J","H"]]',
     '["SYMPHONY","ORCHESTRA","CONDUCTOR","VIOLINIST","PIANIST","COMPOSER","HARMONY","RHYTHM","MELODY","SONATA"]');

CREATE TABLE Geography (
                           id CHAR(2) PRIMARY KEY,
                           name VARCHAR(100),
                           capital VARCHAR(100),
                           continent VARCHAR(50),
                           difficulty ENUM('Easy', 'Medium', 'Hard'),
                           image TEXT,
                           hint TEXT
);


INSERT INTO Geography (id, name, capital, continent, difficulty, image, hint) VALUES
                                                                                  ('ES', 'Spain', 'Madrid', 'Europe', 'Easy', '', 'Known for flamenco dancing and bullfighting.'),
                                                                                  ('FR', 'France', 'Paris', 'Europe', 'Easy', '', 'Famous for the Eiffel Tower and fine wines.'),
                                                                                  ('DE', 'Germany', 'Berlin', 'Europe', 'Easy', '', 'Home to Oktoberfest and historic castles.'),
                                                                                  ('IT', 'Italy', 'Rome', 'Europe', 'Easy', '', 'Birthplace of pizza and the Colosseum.'),
                                                                                  ('GB', 'UK', 'London', 'Europe', 'Easy', '', 'Famous for Big Ben and the Royal Family.'),
                                                                                  ('PT', 'Portugal', 'Lisbon', 'Europe', 'Medium', '', 'Renowned for port wine and explorers like Vasco da Gama.'),
                                                                                  ('NL', 'Netherlands', 'Amsterdam', 'Europe', 'Medium', '', 'Known for tulips and extensive canal systems.'),
                                                                                  ('BE', 'Belgium', 'Brussels', 'Europe', 'Medium', '', 'Famous for chocolate and waffles.'),
                                                                                  ('CH', 'Switzerland', 'Bern', 'Europe', 'Medium', '', 'Renowned for the Alps and luxury watches.'),
                                                                                  ('AT', 'Austria', 'Vienna', 'Europe', 'Medium', '', 'Birthplace of Mozart and alpine skiing.'),
                                                                                  ('PL', 'Poland', 'Warsaw', 'Europe', 'Medium', '', 'Known for pierogi and historic salt mines.'),
                                                                                  ('CZ', 'Czech Republic', 'Prague', 'Europe', 'Medium', '', 'Famous for its fairy-tale castles and beer.'),
                                                                                  ('GR', 'Greece', 'Athens', 'Europe', 'Medium', '', 'Cradle of Western civilization and ancient ruins.'),
                                                                                  ('NO', 'Norway', 'Oslo', 'Europe', 'Medium', '', 'Known for fjords and the Northern Lights.'),
                                                                                  ('SE', 'Sweden', 'Stockholm', 'Europe', 'Medium', '', 'Famous for IKEA and ABBA.'),
                                                                                  ('DK', 'Denmark', 'Copenhagen', 'Europe', 'Medium', '', 'Home to LEGO and Viking history.'),
                                                                                  ('IE', 'Ireland', 'Dublin', 'Europe', 'Medium', '', 'Known for St. Patrick’s Day and lush green landscapes.'),
                                                                                  ('FI', 'Finland', 'Helsinki', 'Europe', 'Medium', '', 'Famous for saunas and Santa Claus.'),
                                                                                  ('UA', 'Ukraine', 'Kyiv', 'Europe', 'Medium', '', 'Famous for borscht and the Carpathian Mountains.'),
                                                                                  ('IS', 'Iceland', 'Reykjavik', 'Europe', 'Medium', '', 'Land of geysers, volcanoes, and the Blue Lagoon.'),
                                                                                  ('RO', 'Romania', 'Bucharest', 'Europe', 'Hard', '', 'Home to Transylvania and Dracula legends.'),
                                                                                  ('HU', 'Hungary', 'Budapest', 'Europe', 'Hard', '', 'Known for thermal baths and paprika.'),
                                                                                  ('BG', 'Bulgaria', 'Sofia', 'Europe', 'Hard', '', 'Famous for rose oil and ancient Thracian ruins.'),
                                                                                  ('SK', 'Slovakia', 'Bratislava', 'Europe', 'Hard', '', 'Known for its medieval castles and Carpathian Mountains.'),
                                                                                  ('SI', 'Slovenia', 'Ljubljana', 'Europe', 'Hard', '', 'Famous for Lake Bled and alpine scenery.'),
                                                                                  ('HR', 'Croatia', 'Zagreb', 'Europe', 'Hard', '', 'Known for its Adriatic coastline and Dubrovnik.'),
                                                                                  ('LT', 'Lithuania', 'Vilnius', 'Europe', 'Hard', '', 'Famous for its Baltic heritage and amber.'),
                                                                                  ('LV', 'Latvia', 'Riga', 'Europe', 'Hard', '', 'Known for Art Nouveau architecture and folk songs.'),
                                                                                  ('EE', 'Estonia', 'Tallinn', 'Europe', 'Hard', '', 'Famous for its medieval old town and digital innovation.'),
                                                                                  ('AL', 'Albania', 'Tirana', 'Europe', 'Hard', '', 'Known for its rugged mountains and Ottoman heritage.'),
                                                                                  ('AM', 'Armenia', 'Yerevan', 'Europe', 'Hard', '', 'Home to ancient monasteries and Mount Ararat.'),
                                                                                  ('BY', 'Belarus', 'Minsk', 'Europe', 'Hard', '', 'Known for its Soviet-era architecture and vast forests.'),
                                                                                  ('AD', 'Andorra', 'Andorra la Vella', 'Europe', 'Hard', '', 'A tiny principality nestled in the Pyrenees.'),
                                                                                  ('CY', 'Cyprus', 'Nicosia', 'Europe', 'Hard', '', 'Known for its beaches and ancient Greek ruins.'),
                                                                                  ('RS', 'Serbia', 'Belgrade', 'Europe', 'Hard', '', 'Known for its vibrant nightlife and Orthodox monasteries.'),
                                                                                  ('BA', 'Bosnia and Herzegovina', 'Sarajevo', 'Europe', 'Hard', '', 'Known for its Ottoman bridge and diverse cultures.'),
                                                                                  ('ME', 'Montenegro', 'Podgorica', 'Europe', 'Hard', '', 'Famous for its dramatic coastline and Bay of Kotor.'),
                                                                                  ('MD', 'Moldova', 'Chișinău', 'Europe', 'Hard', '', 'Known for its wine tours and Soviet history.'),
                                                                                  ('MK', 'North Macedonia', 'Skopje', 'Europe', 'Hard', '', 'Home to Lake Ohrid and ancient monasteries.');

CREATE TABLE Shapes (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(50) NOT NULL UNIQUE,
        Shape VARCHAR(50) NOT NULL UNIQUE,
        ImageURL VARCHAR(255) NOT NULL
);

INSERT INTO Shapes (Name, Shape, ImageURL) VALUES
       ('Circle', 'circle', '/images/Games/Art/DominoMaster/circle.svg'),
       ('Cone', 'cone', '/images/Games/Art/DominoMaster/cone.svg'),
       ('Cube', 'cube', '/images/Games/Art/DominoMaster/cube.svg'),
       ('Cylinder', 'cylinder', '/images/Games/Art/DominoMaster/cylinder.svg'),
       ('Diamond', 'diamond', '/images/Games/Art/DominoMaster/diamond.svg'),
       ('Square', 'square', '/images/Games/Art/DominoMaster/square.svg'),
       ('Triangle', 'triangle', '/images/Games/Art/DominoMaster/triangle.svg'),
       ('Rectangle', 'rectangle', '/images/Games/Art/DominoMaster/rectangle.svg'),
       ('Pentagon', 'pentagon', '/images/Games/Art/DominoMaster/pentagon.svg'),
       ('Hexagon', 'hexagon', '/images/Games/Art/DominoMaster/hexagon.svg'),
       ('Octagon', 'octagon', '/images/Games/Art/DominoMaster/octagon.svg'),
       ('Parallelogram', 'parallelogram', '/images/Games/Art/DominoMaster/parallelogram.svg'),
       ('Polyhedron', 'polyhedron', '/images/Games/Art/DominoMaster/polyhedron.svg'),
       ('Pyramid', 'pyramid', '/images/Games/Art/DominoMaster/pyramid.svg'),
       ('Sphere', 'sphere', '/images/Games/Art/DominoMaster/sphere.svg'),
       ('Star', 'star', '/images/Games/Art/DominoMaster/star.svg');

CREATE TABLE DominoMasterShapes (
        ShapeId INT,
        Difficulty VARCHAR(10) NOT NULL,
        PRIMARY KEY (ShapeId, Difficulty),
        FOREIGN KEY (ShapeId) REFERENCES Shapes(Id),
        CONSTRAINT valid_difficulty CHECK (Difficulty IN ('easy', 'medium', 'hard'))
);

INSERT INTO DominoMasterShapes (ShapeId, Difficulty) VALUES
         ((SELECT Id FROM Shapes WHERE Shape = 'circle'), 'easy'),
         ((SELECT Id FROM Shapes WHERE Shape = 'rectangle'), 'easy'),
         ((SELECT Id FROM Shapes WHERE Shape = 'triangle'), 'easy'),
         ((SELECT Id FROM Shapes WHERE Shape = 'square'), 'easy'),

         ((SELECT Id FROM Shapes WHERE Shape = 'circle'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'rectangle'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'triangle'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'square'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'pentagon'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'hexagon'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'octagon'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'star'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'pyramid'), 'medium'),
         ((SELECT Id FROM Shapes WHERE Shape = 'diamond'), 'medium'),

         ((SELECT Id FROM Shapes WHERE Shape = 'pentagon'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'hexagon'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'octagon'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'star'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'pyramid'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'diamond'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'cone'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'cube'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'cylinder'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'parallelogram'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'polyhedron'), 'hard'),
         ((SELECT Id FROM Shapes WHERE Shape = 'sphere'), 'hard');

CREATE TABLE DetectiveLupin (
                           id INT PRIMARY KEY,
                           name VARCHAR(100),
                           artist VARCHAR(100),
                           difficulty ENUM('Easy', 'Medium', 'Hard'),
                           image TEXT
);

INSERT INTO Paintings (id, name, artist, difficulty, image) VALUES
                                                                (1, 'Mona Lisa', 'Leonardo da Vinci', 'Easy', '/images/Games/Art/MonaLisa.avif'),
                                                                (2, 'The Starry Night', 'Vincent van Gogh', 'Easy', '/images/Games/Art/TheStarryNight.avif'),
                                                                (3, 'Sunflowers', 'Vincent van Gogh', 'Easy', '/images/Games/Art/Sunflowers.avif'),
                                                                (4, 'Water Lilies', 'Claude Monet', 'Easy', '/images/Games/Art/WaterLilies.avif'),
                                                                (5, 'A Sunday on La Grande Jatte', 'Georges Seurat', 'Easy', '/images/Games/Art/ASundayOnLaGrandeJatte.avif'),
                                                                (6, 'The Sleeping Gypsy', 'Henri Rousseau', 'Easy', '/images/Games/Art/TheSleepingGypsy.avif'),
                                                                (7, 'Composition II in Red, Blue, and Yellow', 'Piet Mondrian', 'Easy', '/images/Games/Art/CompositionIiInRedBlueAndYellow.avif'),
                                                                (8, 'The Snail', 'Henri Matisse', 'Easy', '/images/Games/Art/TheSnail.avif'),
                                                                (9, 'Dogs Playing Poker', 'Cassius Marcellus Coolidge', 'Easy', '/images/Games/Art/DogsPlayingPoker.avif'),
                                                                (10, 'Balloon Girl', 'Banksy', 'Easy', '/images/Games/Art/BalloonGirl.avif'),

                                                                (11, 'The Last Supper', 'Leonardo da Vinci', 'Medium', '/images/Games/Art/TheLastSupper.avif'),
                                                                (12, 'Girl with a Pearl Earring', 'Johannes Vermeer', 'Medium', '/images/Games/Art/GirlWithAPearlEarring.avif'),
                                                                (13, 'The Scream', 'Edvard Munch', 'Medium', '/images/Games/Art/TheScream.avif'),
                                                                (14, 'The Hay Wain', 'John Constable', 'Medium', '/images/Games/Art/TheHayWain.avif'),
                                                                (15, 'Liberty Leading the People', 'Eugène Delacroix', 'Medium', '/images/Games/Art/LibertyLeadingThePeople.avif'),
                                                                (16, 'Dance at Le Moulin de la Galette', 'Pierre-Auguste Renoir', 'Medium', '/images/Games/Art/DanceAtLeMoulinDeLaGalette.avif'),
                                                                (17, 'Whistler’s Mother', 'James McNeill Whistler', 'Medium', '/images/Games/Art/WhistlersMother.avif'),
                                                                (18, 'The Treachery of Images', 'René Magritte', 'Medium', '/images/Games/Art/TheTreacheryOfImages.avif'),
                                                                (19, 'Olympia', 'Édouard Manet', 'Medium', '/images/Games/Art/Olympia.avif'),
                                                                (20, 'The Sleeping Venus', 'Giorgione', 'Medium', '/images/Games/Art/TheSleepingVenus.avif'),

                                                                (21, 'The Birth of Venus', 'Sandro Botticelli', 'Hard', '/images/Games/Art/TheBirthOfVenus.avif'),
                                                                (22, 'American Gothic', 'Grant Wood', 'Hard', '/images/Games/Art/AmericanGothic.avif'),
                                                                (23, 'Guernica', 'Pablo Picasso', 'Hard', '/images/Games/Art/Guernica.avif'),
                                                                (24, 'The Garden of Earthly Delights', 'Hieronymus Bosch', 'Hard', '/images/Games/Art/TheGardenOfEarthlyDelights.avif'),
                                                                (25, 'Las Meninas', 'Diego Velázquez', 'Hard', '/images/Games/Art/LasMeninas.avif'),
                                                                (26, 'Arnolfini Portrait', 'Jan van Eyck', 'Hard', '/images/Games/Art/ArnolfiniPortrait.avif'),
                                                                (27, 'The Night Watch', 'Rembrandt', 'Hard', '/images/Games/Art/TheNightWatch.avif'),
                                                                (28, 'Libyan Sibyl (Sistine Chapel)', 'Michelangelo', 'Hard', '/images/Games/Art/LibyanSibylSistineChapel.avif'),
                                                                (29, 'The Raft of the Medusa', 'Théodore Géricault', 'Hard', '/images/Games/Art/TheRaftOfTheMedusa.avif'),
                                                                (30, 'Napoleon Crossing the Alps', 'Jacques-Louis David', 'Hard', '/images/Games/Art/NapoleonCrossingTheAlps.avif');


show tables;
select * from Users;
select * from Quizzes;
select * from UserQuizzes;
select * from Subjects;
select * from SubjectQuizzes;
select * from Multimedia;
select * from MultimediaSubjects;
select * from WeeklyGoals;
select * from UserWeeklyGoals;
select * from CookTheBook_Stories;
select * from CookTheBook_StoryPieces;
select * from Mahjong;
select * from Geography;
select * from DetectiveLupin;
select * from Shapes;
select * from DominoMasterShapes;
SET sql_notes = 1;