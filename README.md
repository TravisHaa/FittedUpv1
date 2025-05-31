# FittedUp - AI-Powered Clothing Listing App

FittedUp is a mobile application that streamlines the process of listing clothing items across multiple e-commerce platforms by leveraging AI to analyze images and autofill listing details.

## Overview

The app allows users to:

- Upload two images of a clothing item (front and back)
- Generate a description and categorize details (size, brand, color) using AI
- Post listings to multiple platforms (eBay, Depop, Facebook Marketplace)

## Tech Stack

### Frontend

- React Native with Expo
- NativeWind (Tailwind CSS for React Native)
- TypeScript
- Expo Router for navigation

### Backend

- Node.js with Express
- OpenAI ChatGPT API (for image analysis in production)

## Project Structure

```
fittedup/
├── app/                     # Frontend app screens and navigation
│   ├── (tabs)/              # Tab-based navigation screens
│   │   ├── _layout.tsx      # Tab navigation setup
│   │   ├── index.tsx        # Marketplace screen
│   │   ├── sell.tsx         # Sell screen (core feature)
│   │   └── closet.tsx       # Closet screen
├── components/              # Reusable UI components
├── utils/                   # Utility functions
│   └── api.ts               # API client for backend
├── backend/                 # Backend server
│   ├── routes/              # API route handlers
│   ├── utils/               # Utility functions
│   └── server.js            # Main server file
└── assets/                  # Static assets
```

## Features

### Sell Screen (Core Feature)

- Image upload (front and back)
- AI-powered listing generation
- Multiple platform posting

### Marketplace Screen (Static UI for MVP)

- Mock feed of clothing listings
- Filtering by category
- Item detail cards

### Closet Screen (Static UI for MVP)

- List of user's posted items
- Platform indicators

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Expo development server:
   ```
   npx expo start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with required environment variables (see backend/README.md)
4. Start the server:
   ```
   npm start
   ```

## MVP Scope

The current MVP focuses on:

- Sell screen with image upload and mock AI listing generation
- Static UI for Marketplace and Closet screens
- Backend API structure (with mock responses for now)

## Future Development

- Google Lens-powered visual search
- Barcode scanning for quick listing
- Aesthetic-based filtering
- Outfit recommendations
- Mathematical pricing algorithms based on brand/condition
- Dynamic web scraping for competitive pricing

## License

This project is proprietary and not licensed for redistribution.
