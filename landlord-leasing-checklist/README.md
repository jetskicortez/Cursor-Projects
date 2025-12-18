# Landlord Representation Leasing Checklist - Collaborative Edition

A real-time collaborative web application for managing the landlord representation retail leasing checklist. Multiple users can work together simultaneously, with changes syncing automatically across all connected clients.

## Features

- ✅ **Real-time Collaboration**: Multiple users can work on the checklist simultaneously
- 🔄 **Auto-sync**: Changes are automatically synchronized across all connected users
- 👥 **User Presence**: See who else is currently working on the checklist
- 📊 **Progress Tracking**: Visual progress bar and task counter
- 🔍 **Search & Filter**: Quickly find specific tasks
- 💾 **Persistent State**: Server saves state to disk (survives restarts)
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd landlord-leasing-checklist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Enter Your Name**: Type your name in the input field at the top
2. **Check Tasks**: Click checkboxes to mark tasks as complete
3. **Collaborate**: Other users' changes will appear in real-time
4. **See Who's Online**: View active users in the header
5. **Search**: Use the search bar to filter tasks
6. **Expand/Collapse**: Click phase headers to expand or collapse sections

## How It Works

- The server uses **Socket.io** for real-time WebSocket communication
- All state (completed tasks, collapsed phases) is stored on the server
- When a user makes a change, it's broadcast to all other connected clients
- State is saved to `state.json` for persistence across server restarts

## Deployment

To deploy this application:

1. **Local Network**: Other users on your network can access it at `http://YOUR_IP:3000`
2. **Cloud Hosting**: Deploy to services like:
   - Heroku
   - Railway
   - Render
   - DigitalOcean
   - AWS EC2

Make sure to:
- Set the `PORT` environment variable if needed
- Allow WebSocket connections through your firewall
- Use HTTPS in production (Socket.io works with HTTPS)

## File Structure

```
landlord-leasing-checklist/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── app.js          # Client-side JavaScript
├── server.js       # Node.js server with Socket.io
├── package.json    # Dependencies
├── state.json      # Saved state (created automatically)
└── README.md       # This file
```

## Troubleshooting

- **Can't connect**: Make sure the server is running on port 3000
- **Changes not syncing**: Check browser console for errors
- **Port already in use**: Change the PORT in server.js or set PORT environment variable

## License

MIT

