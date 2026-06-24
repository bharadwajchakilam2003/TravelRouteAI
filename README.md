# TravelRoute AI 🗺️

> **Smart Travel Route Planner** — Discover attractions, weather forecasts, and travel costs between any two destinations.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)](https://www.mongodb.com/)

---

## ✨ Features

- **🔍 Route Search** — Search routes between any two locations
- **🏛️ Attractions Discovery** — Find tourist attractions along your route with images, ratings, and descriptions
- **🌤️ Weather Forecasts** — Real-time weather and 7-day forecasts for cities on your route
- **💰 Cost Estimates** — Compare travel costs across Car, Bus, Train, and Flight
- **🗺️ Interactive Map** — View route, attractions, and points of interest on an interactive map
- **🏨 Hotels** — Find and filter hotels along your route
- **🍽️ Restaurants** — Discover dining options with cuisine filters
- **🤖 AI Travel Assistant** — Get intelligent travel recommendations via chat
- **🔐 Authentication** — JWT-based auth with Google OAuth support
- **📱 Saved Trips** — Save, view, edit, and delete your trip plans
- **📊 Admin Panel** — Dashboard with user management and popular routes analytics
- **📄 PDF Export** — Download trip itineraries
- **📤 Share** — Share trip plans with others

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS 3** | Styling |
| **Vite 5** | Build Tool |
| **React Router 6** | Routing |
| **Framer Motion** | Animations |
| **Leaflet + react-leaflet** | Interactive Maps |
| **Axios** | HTTP Client |
| **React Hot Toast** | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | Server Framework |
| **MongoDB + Mongoose** | Database |
| **JWT** | Authentication |
| **Google OAuth** | Social Login |
| **Node-Cache** | API Caching |
| **Helmet** | Security Headers |
| **express-rate-limit** | Rate Limiting |

### APIs Used
| API | Purpose |
|-----|---------|
| Google Maps API | Geocoding, Routes, Places |
| OpenWeather API | Current weather & forecasts |
| WeatherAPI | Fallback weather data |
| OpenTripMap API | Tourist attractions |
| Geoapify API | Route optimization & geocoding |
| Amadeus API | Flight search |
| Wikipedia API | Attraction images & descriptions |
| OpenAI API | AI chat assistant (optional) |

---

## 📋 Prerequisites

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local or Atlas)
- **npm** >= 9.x
- API keys for services (see below)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/travelroute-ai.git
cd travelroute-ai
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your API keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travelroute_ai
JWT_SECRET=your_jwt_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
OPENWEATHER_API_KEY=your_openweather_key
OPENTRIPMAP_API_KEY=your_opentripmap_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the App

Visit **http://localhost:5173** in your browser.

---

## 🔑 API Keys Required

| API | Free Tier | Get Key |
|-----|-----------|---------|
| **Google Maps** | $200/month free credit | [Google Cloud Console](https://console.cloud.google.com/) |
| **OpenWeatherMap** | 60 calls/min free | [OpenWeather](https://openweathermap.org/api) |
| **OpenTripMap** | 1000 calls/day free | [OpenTripMap](https://opentripmap.io/) |
| **Geoapify** | 3000 calls/day free | [Geoapify](https://www.geoapify.com/) |
| **Amadeus** | Test environment free | [Amadeus Dev](https://developers.amadeus.com/) |
| **WeatherAPI** | 1M calls/month free | [WeatherAPI](https://www.weatherapi.com/) |
| **OpenAI** | $5 free credit | [OpenAI](https://platform.openai.com/) (optional) |

---

## 📁 Project Structure

```
travelroute-ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        # MongoDB connection
│   │   │   └── env.js             # Environment config
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── placesController.js
│   │   │   ├── searchController.js
│   │   │   ├── tripController.js
│   │   │   └── weatherController.js
│   │   ├── middleware/
│   │   │   ├── admin.js
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Search.js
│   │   │   ├── Trip.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── ai.js
│   │   │   ├── auth.js
│   │   │   ├── places.js
│   │   │   ├── search.js
│   │   │   ├── trips.js
│   │   │   └── weather.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── costService.js
│   │   │   ├── mapsService.js
│   │   │   ├── placesService.js
│   │   │   └── weatherService.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── AIChat/
│   │   │   ├── Attractions/
│   │   │   ├── common/
│   │   │   ├── CostEstimator/
│   │   │   ├── Dashboard/
│   │   │   ├── Hero/
│   │   │   ├── Hotels/
│   │   │   ├── Map/
│   │   │   ├── Restaurants/
│   │   │   └── Weather/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSearch.ts
│   │   ├── pages/
│   │   │   ├── Admin.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── TripDetail.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/search` | Search route (optional auth) |
| GET | `/api/search/history` | Get search history |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | Get user's trips |
| POST | `/api/trips` | Save a trip |
| GET | `/api/trips/:id` | Get trip details |
| PUT | `/api/trips/:id` | Update trip |
| DELETE | `/api/trips/:id` | Delete trip |

### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?lat=&lng=` | Get weather data |

### Places
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/places/attractions` | Get attractions |
| GET | `/api/places/nearby` | Get nearby places |
| GET | `/api/places/details/:placeId` | Get place details |
| GET | `/api/places/cities-on-route` | Get cities on route |

### AI Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Send chat message |
| POST | `/api/ai/clear` | Clear chat history |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get admin stats |
| GET | `/api/admin/users` | Get all users |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/searches` | Get search analytics |
| GET | `/api/admin/trips` | Get all trips |

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

Environment variables to set on Vercel:
- `VITE_API_URL` — Your backend URL (e.g., `https://your-backend.onrender.com/api`)

### Backend (Render / Railway)

1. Push to GitHub
2. Create a new Web Service on Render/Railway
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `.env.example`

---

## 🧪 Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend lint
cd frontend
npm run lint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Important Notes

- **API Keys**: Never commit your API keys. Use environment variables.
- **Rate Limits**: Free API tiers have rate limits. The app includes caching to minimize API calls.
- **Train Prices**: Train fare estimates may vary from official IRCTC fares.
- **Google Login**: Requires Google Cloud Console OAuth configuration.
- **AI Assistant**: OpenAI integration is optional. The AI assistant works with rule-based responses when OpenAI is not configured.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Google Maps Platform](https://developers.google.com/maps)
- [OpenWeather](https://openweathermap.org/)
- [OpenTripMap](https://opentripmap.io/)
- [Geoapify](https://www.geoapify.com/)
- [Leaflet](https://leafletjs.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<p align="center">Made with ❤️ for travelers everywhere</p>
