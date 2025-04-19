## HealthHub - Telehealth application

HealthHub is a comprehensive telehealth mobile application designed to connect patients with healthcare providers. The platform offers virtual and in-person consultation options, appointment scheduling, secure messaging, and medical records management. HealthHub aims to make healthcare more accessible and efficient for everyone.

<div align="center">
    <img src="/frontend/assets/icon.png" alt="HealthHub Logo" width="200" height="200">
</div>

## Features

- **User Authentication**:

  - Secure login and registration for patients and healthcare providers
  - Profile management with medical history and preferences

- **Appointment Management**:

  - Schedule virtual or in-clinic appointments
  - View available time slots for healthcare providers
  - Automatic appointment reminders
  - Appointment cancellation with notifications

- **Healthcare Provider Search**:

  - Find doctors by specialty, location, and availability
  - View doctor profiles and credentials

- **Telemedicine**:

  - Secure virtual consultations
  - Real-time chat with healthcare providers
  - Typing indicators during chat sessions

- **Medical Records**:

  - Medical records management
  - Share medical documents securely
  - Receive notifications when new records are added

- **Notifications**:
  - Push notifications for appointments, messages, and medical updates
  - Real-time alerts for healthcare providers about new appointments

## Technologies Used

### Frontend

- **React Native**: Core framework for mobile app development
- **Expo**: Development toolchain for React Native
- **Firebase Authentication**: User authentication system
- **Firebase Firestore**: Real-time database for app data
- **Firebase Cloud Messaging**: Push notifications implementation
- **React Navigation**: App navigation management

### Backend

- **Node.js**: Server environment
- **Express**: Web application framework
- **Socket.io**: Real-time bidirectional event-based communication
- **Firebase Admin SDK**: Server-side Firebase management
- **Node-cron**: Task scheduling for reminders and cleanup operations
- **Date-fns**: Date manipulation library

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Expo CLI (for frontend development)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your environment variables
# Add your Firebase Admin SDK credentials as FIREBASE_ADMIN environment variable

# Start the server
node server.js
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file with your environment variables
cp .env.sample .env
# Edit .env with your Firebase configuration

# Start the development server
npx expo run android # or npx expo run ios for iOS
```

## Project Structure

```
HealthHub/
├── backend/              # Node.js Express server
│   ├── server.js         # Server entry point
│   └── package.json      # Backend dependencies
│
├── frontend/            # React Native Expo app
│   ├── App.js           # App entry point
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── navigations/     # Navigation configuration
│   ├── screens/         # App screens
│   └── utils/           # Helper functions
│
└── README.md            # Project documentation
```

## Key Backend Features

- **Real-time Messaging**: Using Socket.io for instant communication between patients and doctors
- **Appointment Reminders**: Automated notifications sent to patients 30 minutes before appointments
- **Doctor Notifications**: Alerts for new appointments, cancellations, and chat messages
- **Medical Records Management**: Notification system when new records are added
- **Automatic Cleanup**: Daily cron job to remove expired appointment slots

## Screenshots

<table>
    <tr>
        <td><img src="/frontend/assets/screenshots/PatientLogin.jpg" width="200" alt="Patient Login"/></td>
        <td><img src="/frontend/assets/screenshots/PatientHome.jpg" width="200" alt="Patient Home Screen"/></td>
        <td><img src="/frontend/assets/screenshots/DoctorHome.jpg" width="200" alt="Doctor Home Screen"/></td>
    </tr>
    <tr>
        <td><img src="/frontend/assets/screenshots/VideoCall.jpg" width="200" alt="Video Call"/></td>
        <td><img src="/frontend/assets/screenshots/Chat.jpg" width="200" alt="Chat Interface"/></td>
        <td><img src="/frontend/assets/screenshots/DoctorProfile.jpg" width="200" alt="Doctor Profile"/></td>
    </tr>
    <tr>
        <td><img src="/frontend/assets/screenshots/PatientProfile.jpg" width="200" alt="Patient Profile"/></td>
        <td><img src="/frontend/assets/screenshots/DoctorSearch.jpg" width="200" alt="Doctor Search"/></td>
        <td><img src="/frontend/assets/screenshots/SlotSchedule.jpg" width="200" alt="Slot Schedule"/></td>
    </tr>
</table>

## Running the App

- **Expo Development Client**: Use `npx expo run` in the frontend directory
- **Android/iOS Simulator**: Select the running emulator after running the above command
- **Physical Device**: Connect via USB or wirelessly using adb
- **Backend Server**: Must be running for full functionality (`node server.js`)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Aditya Goriwale - [aditya.goriwale@gmail.com](mailto:aditya.goriwale@gmail.com)

Project Link: [https://github.com/RundownTrex/HealthHub](https://github.com/RundownTrex/HealthHub)
