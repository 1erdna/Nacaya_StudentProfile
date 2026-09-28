-- Safe Activity 7 migration for an existing database.
USE nacaya_student_profile;

-- Base64 camera images can exceed the 64 KB TEXT limit.
ALTER TABLE student_profiles
    MODIFY COLUMN profile_image MEDIUMTEXT NULL;
