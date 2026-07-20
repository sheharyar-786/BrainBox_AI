-- AlterTable
ALTER TABLE "interview_sessions" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "missing_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "weaknesses" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_materials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "flashcards" JSONB NOT NULL,
    "quiz" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
