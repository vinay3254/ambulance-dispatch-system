# SwiftResponse AI Ambulance Dispatch Dashboard

A production-ready emergency dispatch command center built with React + Vite + TailwindCSS. Features real-time fleet tracking, AI-powered insights, and comprehensive analytics for Delhi-NCR region ambulance operations.

![SwiftResponse Dashboard](https://via.placeholder.com/800x400?text=SwiftResponse+AI+Dashboard)

## Features

### 🗺️ Map View
- Interactive dark-themed map (CartoDB dark tiles)
- Real-time ambulance position tracking with live simulation
- Color-coded incident markers by severity (Critical/High/Medium)
- Route visualization for En Route units
- Dispatch actions directly from map popups
- Hospital markers with bed availability

### 📱 Mobile Tracking
- Fleet status grid with battery, GPS signal, and speed indicators
- Live activity feed (auto-updating every 4 seconds)
- Device health monitoring table
- CSV export functionality
- Real-time position updates with visual feedback

### 📊 Analytics
- 5 KPI cards with sparkline trends
- Response time trend chart with target reference line
- Incident type breakdown (grouped bar chart)
- Zone hotspot heatmap (64 Delhi-NCR zones)
- Hourly distribution area chart
- Sortable fleet performance table

### 🤖 AI Insights
- **Real Anthropic Claude API integration**
- Multi-turn conversation context
- Character-by-character streaming responses
- Quick action chips for common queries
- AI-powered dispatch recommendations
- Risk assessment alerts
- Demand forecasting
- Decision activity log

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React-Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Anthropic API** - AI capabilities

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Anthropic API key

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key for AI features |

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Top navigation with tabs and badges
│   ├── Sidebar.jsx     # Left incident list panel
│   └── Toast.jsx       # Notification system
├── context/
│   └── AppContext.jsx  # Global state management
├── data/
│   └── mockData.js     # Mock data for Delhi-NCR region
├── pages/
│   ├── MapView.jsx     # Tab 1: Interactive map
│   ├── MobileTracking.jsx  # Tab 2: Fleet monitoring
│   ├── Analytics.jsx   # Tab 3: Charts and KPIs
│   └── AIInsights.jsx  # Tab 4: AI chat and recommendations
├── App.jsx             # Router and layout
└── index.css           # Design system and global styles
```

## Design System

- **Dark tactical aesthetic**: Military command center energy
- **Fonts**: Sora (UI), JetBrains Mono (data), Space Mono (AI)
- **Colors**: Navy base (#060b14), status colors (red/amber/green/cyan)
- **Components**: 8px border-radius, subtle shadows, glass morphism

## Mock Data

Pre-configured with Delhi-NCR region data:
- 5 Incidents (Trauma, Cardiac, Respiratory, Accident, Medical)
- 5 Ambulances (various statuses and locations)
- 4 Hospitals (AIIMS, Safdarjung, Max Noida, Medanta)
- 64 Zone heatmap (Connaught Place, Karol Bagh, Noida, etc.)

## AI Features

The AI Insights tab connects to Anthropic's Claude API with a system prompt containing current fleet status. Supports:

- Active incident summaries
- Unit dispatch recommendations
- Hospital routing suggestions
- Risk assessments (battery, signal issues)
- Demand forecasting

## License

MIT

---

Built with ❤️ for emergency response operations
