# PaperMark AI — MVP Frontend

## Run
1. Open this folder in VS Code.
2. Use Command Prompt terminal if PowerShell blocks npm.
3. Run:
   npm install
   npm run dev
4. Open http://localhost:3000

## Current MVP
- Modular instructor dashboard
- Assignment list
- New evaluation setup
- Question/model-answer PDF selection UI
- Instructor marking rules UI
- Assignment detail/review screen
- Students, analytics and settings placeholders
- LocalStorage for demo assignments
- Backend API client in `lib/api.ts`

## Next integration
- Supabase Auth
- Supabase Storage for PDFs
- PDF text extraction/OCR
- Batch student submission upload
- FastAPI `/evaluate` integration
- Persist rubric/question data in PostgreSQL
- Instructor review and final grade publishing
