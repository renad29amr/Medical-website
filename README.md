# Medical Appointments API

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example`.
3. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` - run with ts-node-dev
- `npm run build` - compile TypeScript
- `npm start` - run compiled build

## API Base Paths
- `/api/auth`
- `/api/admin`
- `/api/doctors`
- `/api/schedules`
- `/api/appointments`
- `/api/chatbot`


## Notes
- `GEMINI_API_KEY` is only needed for chatbot routes. The rest of the API can still start without it.
