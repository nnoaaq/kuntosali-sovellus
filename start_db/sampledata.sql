-- 1. TYHJENNETÄÄN TAULUT JA NOLLATAAN ID-LASKURIT
-- CASCADE huolehtii, että taulut tyhjennetään oikeassa järjestyksessä viiteavaimista huolimatta.
TRUNCATE TABLE "Sets", "WorkoutLog", "Workouts", "Exercises", "Users" RESTART IDENTITY CASCADE;

-- 2. Luodaan testikäyttäjä (id: 1)
INSERT INTO "Users" ("id", "email", "password_hash")
VALUES (1, 'noa.julkunen@gmail.com', 'hashatty_salasana_tähän');

-- 3. Luodaan perusliikkeet Exercises-tauluun
INSERT INTO "Exercises" ("id", "name") VALUES
(1, 'Vinopenkki - smith'),
(2, 'Vipunostot käsipainoilla'),
(3, 'Kyykky tangolla'),
(4, 'Reiden ojennus laitteessa');

-- 4. Luodaan kaksi erilaista treeniä Workouts-tauluun
INSERT INTO "Workouts" ("id", "userId", "startTime", "endTime", "name") VALUES
(1, 1, '2026-07-11 06:08:00', '2026-07-11 07:15:00', 'RINTATREENI'),
(2, 1, '2026-07-10 16:30:00', '2026-07-10 17:45:00', 'JALKATREENI');

-- 5. Kytketään liikkeet treeneihin (WorkoutLog)
INSERT INTO "WorkoutLog" ("id", "workoutId", "exerciseId") VALUES
(1, 1, 1), -- Rintatreeni -> Vinopenkki
(2, 1, 2), -- Rintatreeni -> Vipunostot
(3, 2, 3), -- Jalkatreeni -> Kyykky
(4, 2, 4); -- Jalkatreeni -> Reiden ojennus

-- 6. Luodaan sarjat (Sets) jokaiseen suoritukseen
-- Vinopenkki (workoutLogId: 1): 2 sarjaa
INSERT INTO "Sets" ("weight", "reps", "workoutLogId") VALUES
(50.0, 23, 1),
(60.0, 25, 1);

-- Vipunostot (workoutLogId: 2): 3 sarjaa
INSERT INTO "Sets" ("weight", "reps", "workoutLogId") VALUES
(12.5, 12, 2),
(12.5, 12, 2),
(15.0, 10, 2);

-- Kyykky (workoutLogId: 3): 3 sarjaa
INSERT INTO "Sets" ("weight", "reps", "workoutLogId") VALUES
(80.0, 8, 3),
(100.0, 6, 3),
(100.0, 5, 3);

-- Reiden ojennus (workoutLogId: 4): 2 sarjaa
INSERT INTO "Sets" ("weight", "reps", "workoutLogId") VALUES
(45.0, 15, 4),
(50.0, 12, 4);