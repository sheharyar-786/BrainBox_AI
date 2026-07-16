-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "career_interests" TEXT[],
ADD COLUMN     "career_path" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "graduation_year" INTEGER,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "learning_goals" TEXT[],
ADD COLUMN     "major" TEXT,
ADD COLUMN     "study_target" INTEGER NOT NULL DEFAULT 30;
