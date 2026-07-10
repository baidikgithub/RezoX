# 🏠 RezoX — Enterprise AI Real Estate Intelligence Platform

RezoX is a full-stack, AI-powered real estate intelligence platform that combines modern property listings, machine-learning price prediction, multi-LLM chat assistants, interactive maps, and rich analytics dashboards — all within a single, responsive, and visually immersive user interface.

Built with a **Next.js** frontend, **Express.js** backend, and a dedicated **FastAPI ML service**, RezoX enables buyers, agents, and admins to discover, compare, tour, finance, and predict premium properties through one intelligent command center.

---

## 📸 Screenshots

*(Add screenshots here)*

---

## 🚀 Features

### 🏡 Property Management
- Browse, search, and filter real estate listings with advanced filters (price range, BHK, location, sort order)
- Detailed property views with images, amenities, and agent information
- Interactive map integration for geospatial context
- Save and manage favorite properties
- Book property visits directly from the platform
- CSV import for bulk listing uploads

### 🤖 AI Price Prediction
- Machine learning model trained on historical real estate data
- Predict property prices based on location, square footage, bathrooms, and BHK
- Dedicated FastAPI microservice for ML inference (CatBoost model)
- Real-time predictions from the frontend

### 💬 Multi-Model AI Chat Assistant
- Conversational AI powered by multiple LLM providers:
  - **Gemini** (Google)
  - **Groq** (fast inference)
  - **Cohere**
  - **Mistral**
  - **OpenRouter** (multi-model gateway)
- Intelligent LLM router selects the best model based on query type
- Chat history persisted to PostgreSQL
- Context-aware property recommendations

### 📊 Analytics & Insights Dashboard
- Real-time market statistics: total listings, average price, locations covered
- Average price by location (bar chart)
- BHK distribution (pie chart)
- Listings by price range (line chart)
- Top location share (donut chart)
- Average price trend by BHK (area chart)

### 👤 User System
- Role-based authentication (admin, agent, buyer, user)
- JWT with access + refresh tokens
- Password reset flow
- Personalized dashboard with role-based routing
- Property memory — recently viewed and saved searches

### 🎨 Premium UI/UX
- 3D interactive hero scene built with Three.js / React Three Fiber
- Ant Design component library with glassmorphism card designs
- Smooth animations powered by Framer Motion & GSAP
- Fully responsive — mobile-first layout
- Dark/light compatible theming

---

## 🧱 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Next.js)                  │
│  Port 3000  ·  React 19  ·  TypeScript  ·  AntD     │
└────────────────┬────────────────────────────────────┘
                 │  HTTP / REST
┌────────────────▼────────────────────────────────────┐
│                Server (Express.js)                   │
│  Port 8000  ·  Prisma ORM  ·  PostgreSQL             │
│  Auth · Listings · Chat · Analytics · Import         │
└────────────────┬────────────────────────────────────┘
                 │  HTTP / REST
┌────────────────▼────────────────────────────────────┐
│              ML Service (FastAPI)                    │
│  Port 8002  ·  CatBoost  ·  Pandas / Scikit-learn    │
│  Price Prediction · Feature Engineering              │
└─────────────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│              PostgreSQL 16 (Docker)                  │
│                 Port 5432                            │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology       | Purpose                              |
|------------------|--------------------------------------|
| Next.js 15       | React framework with App Router      |
| React 19         | UI library                           |
| TypeScript       | Type safety                          |
| Ant Design 5     | UI component library                 |
| Framer Motion    | Page & component animations          |
| GSAP             | Advanced scroll & reveal animations  |
| React Three Fiber| 3D hero scene                        |
| Recharts         | Analytics charts (bar, pie, line)    |
| React Leaflet    | Interactive maps                     |
| SWR              | Data fetching & caching              |
| Zustand          | Lightweight state management         |

### Backend (`server/`)
| Technology       | Purpose                              |
|------------------|--------------------------------------|
| Express.js       | Web framework                        |
| Prisma ORM       | Database ORM                         |
| PostgreSQL       | Relational database                  |
| JWT              | Access & refresh token auth          |
| bcryptjs         | Password hashing                     |
| Multer           | File uploads                         |
| Google APIs      | Google Drive integration             |
| csv-parser       | CSV import processing                |

### ML Service (`ml/`)
| Technology       | Purpose                              |
|------------------|--------------------------------------|
| FastAPI          | Python web framework                 |
| CatBoost         | Gradient boosting model              |
| Pandas           | Data manipulation                    |
| Scikit-learn     | Preprocessing & evaluation           |
| Jupyter          | Experiment notebooks                 |

### DevOps
| Technology       | Purpose                              |
|------------------|--------------------------------------|
| Docker           | Containerization                     |
| Docker Compose   | Multi-service orchestration          |

---

## 📁 Project Structure

```
RezoX/
├── client/                        # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (user)/            # User-facing pages
│   │   │   │   ├── page.tsx       # Home page with 3D hero
│   │   │   │   ├── dashboard/     # Role-based dashboard redirect
│   │   │   │   ├── insights/      # Analytics & charts
│   │   │   │   ├── listings/      # Property listings + filters
│   │   │   │   ├── listings/[id]/ # Property detail page
│   │   │   │   ├── predict/       # AI price prediction
│   │   │   │   └── profile/       # User profile
│   │   │   ├── (auth)/            # Auth pages
│   │   │   │   ├── signin/
│   │   │   │   ├── signup/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   ├── (admin)/admin/     # Admin dashboard
│   │   │   ├── api/gemini/        # Gemini API route
│   │   │   ├── globals.css        # Global styles
│   │   │   └── layout.tsx         # Root layout
│   │   ├── components/
│   │   │   ├── AppShell.tsx       # Main shell (sidebar, header)
│   │   │   ├── ListingCard.tsx    # Property card
│   │   │   ├── MapView.tsx        # Map component
│   │   │   ├── MapComponent.tsx   # Low-level map
│   │   │   ├── EmiCalculator.tsx  # EMI calculator widget
│   │   │   ├── PremiumHeroScene.tsx # 3D interactive hero
│   │   │   ├── FloatingChat.tsx   # Floating chat bubble
│   │   │   ├── GeminiChat.tsx     # AI chat interface
│   │   │   ├── PropertyCompareDrawer.tsx # Compare properties
│   │   │   ├── AnimatedStatistic.tsx # Animated numbers
│   │   │   ├── MotionShell.tsx    # Animation wrapper
│   │   │   └── ScrollEffects.tsx  # Scroll reveal effects
│   │   ├── lib/
│   │   │   ├── api.ts             # API helpers & types
│   │   │   ├── useAuth.ts         # Auth hook
│   │   │   └── usePropertyMemory.ts # Recently viewed memory
│   │   └── middleware.ts          # Next.js middleware
│   ├── public/
│   └── ...config files
│
├── server/                        # Express.js backend
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── config/db.js           # Database connection
│   │   ├── routes/                # Route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── listingRoutes.js
│   │   │   ├── predictionRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   └── importRoutes.js
│   │   ├── controllers/           # Route handlers
│   │   ├── middleware/            # Auth, error handling, upload
│   │   ├── models/               # Mongoose/Prisma models
│   │   ├── services/             # LLM services & business logic
│   │   │   ├── gemini.service.js
│   │   │   ├── groq.service.js
│   │   │   ├── cohere.service.js
│   │   │   ├── mistral.service.js
│   │   │   ├── openrouter.service.js
│   │   │   └── llmRouter.js      # Smart LLM router
│   │   └── utils/                # Validators, helpers
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── config/                   # Config files
│   └── uploads/                  # Uploaded files
│
├── ml/                            # ML prediction service
│   ├── src/
│   │   ├── api/
│   │   │   ├── app.py            # FastAPI entry point
│   │   │   ├── routes.py         # Prediction endpoints
│   │   │   └── schemas.py        # Request/response schemas
│   │   ├── inference/
│   │   │   └── predictor.py      # Model inference logic
│   │   ├── models/
│   │   │   └── load_model.py     # Model loading
│   │   └── utils/
│   │       ├── config.py
│   │       └── logger.py
│   ├── notebooks/                # Jupyter notebooks
│   │   ├── 01_data_collection.ipynb
│   │   ├── 02_data_cleaning.ipynb
│   │   ├── 03_exploratory_data_analysis.ipynb
│   │   ├── 04_feature_engineering.ipynb
│   │   ├── 05_model_training.ipynb
│   │   └── 06_model_evaluation.ipynb
│   └── reports/
│       └── metrics.csv
│
├── docker-compose.yml             # Multi-service orchestration
├── .gitignore
└── README.md                      # You are here
```

---

## 🗄️ Database Schema (PostgreSQL)

The database is managed via Prisma ORM with the following primary models:

| Model              | Description                          |
|--------------------|--------------------------------------|
| **User**           | Users with role-based access (admin, agent, buyer, user) |
| **Listing**        | Property listings with pricing, location, BHK, amenities |
| **Favorite**       | User-to-listing favorites (unique pair) |
| **Booking**        | Property visit bookings              |
| **Review**         | User reviews on listings             |
| **Notification**   | User notifications                   |
| **Conversation**   | AI chat conversations                |
| **Message**        | Individual chat messages within conversations |
| **RefreshToken**   | JWT refresh token storage            |
| **PasswordResetToken** | Password reset flow              |

---

## 🧪 ML Model

The price prediction model is a **CatBoost regressor** trained on real estate data.

### Model Pipeline
1. **Data Collection** — scraped/sourced property data
2. **Data Cleaning** — handling missing values, outliers
3. **EDA** — exploratory data analysis & visualization
4. **Feature Engineering** — location encoding, price per sqft, etc.
5. **Model Training** — CatBoost with hyperparameter tuning
6. **Evaluation** — RMSE, R², MAE metrics

### Feature Input
| Feature    | Type     | Example              |
|------------|----------|----------------------|
| location   | string   | "Koramangala"        |
| sqft       | float    | 1500                 |
| bath       | integer  | 2                    |
| bhk        | integer  | 3                    |

### Output
- **Predicted Price** in lakhs (₹)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- Docker & Docker Compose (for PostgreSQL & full stack)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/baidikgithub/RezoX.git
cd RezoX
```

### 2. Environment Variables

#### Server (`server/.env`)
```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rezox
JWT_SECRET=replace-with-a-long-random-secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_DAYS=30
RESET_TOKEN_MINUTES=30
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
ML_API_URL=http://localhost:8002
GEMINI_API_KEY=
GROQ_API_KEY=
COHERE_API_KEY=
MISTRAL_API_KEY=
OPENROUTER_API_KEY=
```

#### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start with Docker (Recommended)

```bash
# Start PostgreSQL, API server, and ML service
docker compose up -d

# The API server will be at http://localhost:8000
# The ML service will be at http://localhost:8002
# PostgreSQL will be at localhost:5432
```

### 4. Run the Frontend Separately

```bash
cd client
npm install
npm run dev
# Opens at http://localhost:3000
```

### 5. Run the Server Separately (without Docker)

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
# Starts at http://localhost:8000
```

### 6. Run the ML Service Separately

```bash
cd ml
pip install -r requirements.txt
python src/api/app.py
# Starts at http://localhost:8002
```

---

## 🔌 API Endpoints

### Health
| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | `/api/health`   | Health check         |

### Authentication (`/api/auth`)
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| POST   | `/api/auth/signup`    | Register a new user     |
| POST   | `/api/auth/signin`    | Sign in                 |
| POST   | `/api/auth/refresh`   | Refresh access token    |
| POST   | `/api/auth/logout`    | Sign out                |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password`  | Reset password      |

### Listings (`/api/listings`)
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/listings`             | Get all listings (with filters & sort) |
| GET    | `/api/listings/:id`         | Get single listing       |
| POST   | `/api/listings`             | Create a listing         |
| PUT    | `/api/listings/:id`         | Update a listing         |
| DELETE | `/api/listings/:id`         | Delete a listing         |

### Predictions (`/api/predict`)
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | `/api/predict/predict-price`  | Predict property price   |

### Chat (`/api/chat`)
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/api/chat/message`   | Send a chat message          |
| GET    | `/api/chat/conversations` | List conversations       |
| GET    | `/api/chat/conversations/:id` | Get conversation messages |

### Users (`/api/users`)
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/users/profile`  | Get user profile         |
| PUT    | `/api/users/profile`  | Update user profile      |
| GET    | `/api/users/favorites`| Get user favorites       |
| POST   | `/api/users/favorites`| Add listing to favorites |
| DELETE | `/api/users/favorites/:listingId` | Remove from favorites |

### Notifications (`/api/notifications`)
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/notifications`        | Get user notifications   |
| PUT    | `/api/notifications/:id/read` | Mark as read          |

### Analytics (`/api/analytics`)
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/analytics`      | Get analytics data       |

### Import (`/api/import`)
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/import/csv`     | Import listings via CSV  |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows existing patterns and includes appropriate error handling.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [Ant Design](https://ant.design/) — UI component library
- [Prisma](https://www.prisma.io/) — Database ORM
- [CatBoost](https://catboost.ai/) — ML gradient boosting
- [React Three Fiber](https://r3f.docs.pmnd.rs/) — 3D rendering
- [Recharts](https://recharts.org/) — Charting library
- All LLM providers (Gemini, Groq, Cohere, Mistral, OpenRouter)

---

<p align="center">Built with ❤️ by the Baidik Mazumdar</p>