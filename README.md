# STEAM100

## Production-grade full-stack analytics dashboard for tracking the **Top 100 games on Steam** using live activity metrics, historical trend data, and user-driven engagement systems.

![Dashboard](assets/screenshots/Dashboard.png)

---

## Overview

STEAM100 is a data-focused dashboard application designed to monitor and visualize the performance of Steam’s most active titles. The platform aggregates key metrics such as:

- Concurrent Players (CCU)
- Historical 14-day activity trends
- Engagement ratios derived from playtime data
- Community ratings and recommendations
- Personalized favorites tracking

The project was built with a scalable client-server architecture using modern frontend and backend technologies.

---

## Key Features

### Analytics Dashboard
- Tracks Top 100 Steam games
- Daily refreshed activity data
- Sortable performance metrics
- Pagination and search system

### Trend Visualization
- Historical 14-day sparkline trends
- Comparative performance indicators
- Engagement scoring based on average vs median playtime

### Authentication System
- JWT-based authentication
- Google OAuth login
- Protected user actions
- Persistent login sessions

### User Features
- Favorite games system
- Ratings & recommendation voting
- Profile management

### UI / UX
- Fully responsive layout
- Dark mode / Light mode / Retro CRT theme
- Custom visual identity
- Data-dense dashboard design

---

## Screenshots

### Main Dashboard

![Main Dashboard](assets/screenshots/Dashboard.png)

### Retro Theme

![Retro Theme](assets/screenshots/Retro%20Theme.png)

### Game Detail Modal

![Game Modal](assets/screenshots/Game%20Modal.png)

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- TanStack Query
- Axios

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB

### Authentication
- JWT
- Google OAuth 2.0
- Passport.js

### Security / Middleware
- Helmet
- CORS
- Rate Limiting
- Validation Middleware

---

## Architecture

STEAM100 follows a decoupled full-stack architecture:

```text
Frontend (React + Vite)
        ↓
REST API (Express + Node.js)
        ↓
MongoDB Database
