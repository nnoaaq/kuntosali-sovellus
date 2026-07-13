# Kuntosali - sovellus

## Tarkoitus harjoitella FullStack - sovelluksen kehitystä

### Näillä tarkoitus tehdä

- Next.js
- TailwindCSS
- TypeScript
- Supabase
- PostgreSQL

```dbml
Table Users {
  id integer [pk, increment]
  email text [unique]
  passwordHash text
}
Table Exercises {
  id integer [pk, increment]
  name text [unique]
}
Table WorkoutTemplates {
  id integer [pk, increment]
  name text
}
Table WorkoutTemplateExercises {
  id integer [pk, increment]
  exerciseId integer [ref: > Exercises.id]
  workoutTemplateId integer [ref : > WorkoutTemplates.id]
}
Table WorkoutTemplateSets {
  id integer [pk, increment]
  reps integer
  weight integer
  workoutTemplateExerciseId integer [ref: > WorkoutTemplateExercises.id]
}
Table Workouts {
  id integer [pk, increment]
  name text
  startTime timestamp [default: `now()`]
  endTime timestamp
  userId integer [ref : > Users.id]
  workoutTemplateId integer [ref: > WorkoutTemplates.id]
}
Table WorkoutExercises {
  id integer [pk, increment]
  exerciseId integer [ref : > Exercises.id]
  workoutId integer [ref : > Workouts.id]
}
Table WorkoutSets {
  id integer [pk, increment]
  reps integer
  weight integer
  order integer
  workoutExerciseId integer [ref : > WorkoutExercises.id]
}
```

## PLPGSQL funktio, joka tallentaa WorkoutTemplaten

```text
drop function IF exists saveworkout (jsonb);

create or replace function saveWorkout (workout JSONB) RETURNS int as $$
DECLARE
    workoutName TEXT;
    workoutExercise RECORD;
    workoutSet RECORD;
    workoutTemplateId int;
    workoutTemplateExerciseId int;
    workoutTemplateSetId int;
BEGIN
    workoutName := workout->>'name';
    -- Luodaan WorkoutTemplate ja tallennetaan ID
    insert into
    "WorkoutTemplates" (name)
    values(workoutName)
    RETURNING id INTO workoutTemplateId;
    -- WorkoutTemplates id ja name OK
    FOR workoutExercise IN
        SELECT id, sets
        FROM jsonb_to_recordset(workout->'exercises') AS x(id INT, sets JSONB)
    LOOP
    -- { id: 1, sets: [ { reps: 0, order: 1, weight: 0 } ] }
    -- id = workoutin liike
    -- exerciseId = workoutExercise.id
    -- workoutTemplateId = äsken luodun workoutin id
    insert into
    "WorkoutTemplateExercises"
    ("exerciseId", "workoutTemplateId")
    values(workoutExercise.id,workoutTemplateId)
    returning id into workoutTemplateExerciseId;
        FOR workoutSet IN
            SELECT "order", reps, weight
            FROM jsonb_to_recordset(workoutExercise.sets) AS x("order" INT, reps INT, weight INT)
        LOOP
        -- WorkoutTemplateSets
        -- reps, weight, workoutTemplateExerciseId
        insert into
        "WorkoutTemplateSets"
        ("reps","weight","order","workoutTemplateExerciseId")
        values(workoutSet.reps,workoutSet.weight,workoutSet.order,workoutTemplateExerciseId)
        returning id into workoutTemplateSetId;
        END LOOP;
    END LOOP;
    RETURN workoutTemplateId;
END;
$$ LANGUAGE plpgsql;
```
