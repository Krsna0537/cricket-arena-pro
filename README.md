# Cricket Arena Pro

A comprehensive cricket tournament management application built with React, TypeScript, and Vite. This application allows users to create and manage cricket tournaments, teams, players, and track live scores.

## Features

- **Tournament Management:** Create and manage tournaments with different formats (league, knockout, or group + knockout)
- **Team & Player Management:** Add teams, upload logos, manage player information
- **Match Scheduling:** Schedule matches with venues and timings
- **Live Scoring:** Real-time score updates, wickets, overs tracking
- **Statistics & Leaderboards:** Track tournament statistics with dynamic leaderboards
- **Dark Mode:** Modern UI with full dark mode support
- **Import/Export:** CSV import/export functionality for teams and players
- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **Advanced Filtering:** Search and filter tournament data easily

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (Authentication & Database)
- React Router
- React Query
- React Hook Form
- Zod (Validation)

## Getting Started

### Prerequisites

- Node.js 16+ & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account (free tier is sufficient)

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR_GIT_URL>
   cd cricket-arena-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
cricket-arena-pro/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components from shadcn
│   │   ├── layout/      # Layout components
│   │   ├── tournaments/ # Tournament-specific components
│   │   └── ...
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configuration
│   ├── pages/           # Page components
│   ├── services/        # API and data services
│   ├── types/           # TypeScript type definitions
│   └── ...
├── .env                 # Environment variables (not committed)
└── ...
```

## Key Features

### Dark Mode Support

The application now includes a comprehensive dark mode that respects user preferences and can be toggled manually. The color scheme has been enhanced to provide better contrast and readability in both light and dark modes.

### Enhanced Filtering and Search

Advanced filtering and search capabilities have been added to make it easier to find tournaments, teams, and players. The filter interface supports multiple criteria and is responsive across devices.

### CSV Import/Export

A robust CSV import/export feature has been added for teams and players, making it easy to bulk-add data or export it for external analysis. The system includes template generation, validation, and error handling.

### Configuration Management

A centralized configuration system has been implemented to make it easy to manage environment variables, feature flags, and application settings. This makes the application more maintainable and easier to deploy in different environments.

## Contributing

Please feel free to submit issues, fork the repository and send pull requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

