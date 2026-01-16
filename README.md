# BTX Admin Panel

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **HeroUI** - UI components
- **Tailwind CSS** - styling
- **SCSS** - global styles and modules
- **Zustand** - state management
- **TanStack Query** - API requests
- **Socket.IO** - real-time communication
- **JWT** - authentication (token in cookies)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://test-api.live-server.xyz
```

### 3. Run the application

Start the Next.js application:

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### 4. Run Socket.IO server (in a separate terminal)

```bash
npm run socket
```

The Socket server will be available at: http://localhost:3001
