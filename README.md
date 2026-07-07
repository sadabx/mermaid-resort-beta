# Mermaid Resort Mobile App

A React Native mobile application for the Mermaid Resort booking system. This app allows users to browse rooms, view details, and manage hotel reservations.

## 📱 Features

- **Room Browsing** - View available rooms and their details
- **Booking Management** - Create and manage room reservations
- **Admin Dashboard** - Administrative interface for managing bookings
- **User-Friendly Interface** - Intuitive navigation and design
- **Cross-Platform** - Works on both iOS and Android

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **JavaScript** - Programming language
- **React Navigation** - Navigation library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Expo CLI** - `npm install -g expo-cli`
- **Mobile emulator** or physical device:
  - iOS: Xcode simulator (macOS only)
  - Android: Android Studio emulator
  - Expo Go app on your phone

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sadabx/Resort-react.git
   cd Resort-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   Or if using yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API endpoints and configuration
   ```

## 📁 Project Structure

```
Resort-react/
├── src/
│   ├── screens/        # Screen components
│   │   ├── HomeScreen.js
│   │   ├── RoomDetailsScreen.js
│   │   ├── BookingFormScreen.js
│   │   └── AdminDashboardScreen.js
│   ├── data/
│   │   └── rooms.js    # Room data and utilities
│   └── api.js          # API calls and services
├── assets/             # Images, logos, icons, and photos
├── App.js              # Root app component
├── index.js            # Entry point
├── app.json            # Expo configuration
├── package.json        # Project dependencies
└── README.md           # This file
```

## 🎯 Getting Started

### Development Mode

1. **Start the Expo development server**
   ```bash
   npm start
   ```
   Or:
   ```bash
   expo start
   ```

2. **Run on device/emulator**
   - **iOS Simulator**: Press `i`
   - **Android Emulator**: Press `a`
   - **Mobile Device**: Scan the QR code with Expo Go app

### Build for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## 🔌 API Integration

The app connects to backend services through the `src/api.js` file. Update API endpoints:

```javascript
// src/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

Update your `.env` file:
```
REACT_APP_API_URL=https://your-api-endpoint.com/api
```

## 📱 Screens Overview

- **HomeScreen** - Main landing page with room listings
- **RoomDetailsScreen** - Detailed view of a selected room
- **BookingFormScreen** - Form to book a room
- **AdminDashboardScreen** - Admin panel for managing bookings

## 🐛 Troubleshooting

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port already in use?**
```bash
expo start --tunnel
```

**Clear cache:**
```bash
npm start -- --clear
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://your-api-url.com
REACT_APP_API_KEY=your_api_key
```

**Note:** Never commit `.env` file with real secrets. Use `.env.example` as a template.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

You may contribute via pull requests, but you may not copy, redistribute, or sell this code.

## 👨‍💻 Author

Mermaid Resort Development Team

## 📞 Support

For issues and questions, please create an issue in the repository or contact the development team.
