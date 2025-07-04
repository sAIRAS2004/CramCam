# CramCam – Study Together

**CramCam** is a minimalist Zoom-inspired video conferencing web application designed specifically for students and friends who want to study together online. With real-time video, audio, and chat, CramCam creates a focused, lightweight virtual study room experience with a soft and friendly aesthetic.

## Features

- Peer-to-peer video conferencing using WebRTC (via PeerJS)
- Real-time group chat via Socket.IO
- Clean, responsive UI with a pink, calming theme
- Dynamic room generation and sharing
- No sign-up required — just enter your name and start

## Tech Stack

- **Backend:** Node.js, Express, Socket.IO, PeerJS
- **Frontend:** HTML, CSS, JavaScript, EJS templates
- **Other Tools:** UUID for room generation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A modern browser with webcam and microphone permissions enabled

### Installation

1. Clone the repository:
'''bash
git clone https://github.com/sAIRAS2004/CramCam.git
cd CramCam


Install dependencies:
npm install
Start the server:
npm start
Open your browser:
http://localhost:3030
Folder Structure
CramCam/
│
├── static/             # Public CSS, JS, images
├── views/              # EJS templates
├── server.js           # Main application logic
├── package.json        # Project metadata and dependencies
├── .gitignore          # Files and folders to ignore in Git
└── README.md
Notes
node_modules/ and environment files are excluded from version control.

Designed with simplicity and accessibility in mind.

Author
Developed by Saira Shakeel
© 2025 Saira Shakeel. All rights reserved.

