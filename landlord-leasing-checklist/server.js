const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Store application state
const appState = {
  completedTasks: new Set(),
  collapsedPhases: new Set(),
  users: new Map() // socketId -> user info
};

// Load initial state from file if it exists (optional persistence)
const fs = require('fs');
const stateFile = path.join(__dirname, 'state.json');

function loadState() {
  try {
    if (fs.existsSync(stateFile)) {
      const data = fs.readFileSync(stateFile, 'utf8');
      const saved = JSON.parse(data);
      appState.completedTasks = new Set(saved.completedTasks || []);
      appState.collapsedPhases = new Set(saved.collapsedPhases || []);
      console.log('State loaded from file');
    }
  } catch (error) {
    console.log('No saved state found, starting fresh');
  }
}

function saveState() {
  try {
    const data = {
      completedTasks: Array.from(appState.completedTasks),
      collapsedPhases: Array.from(appState.collapsedPhases),
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(stateFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

// Load state on startup
loadState();

// Generate random user color
function getUserColor() {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Generate user info
  const userInfo = {
    id: socket.id,
    name: `User ${socket.id.substring(0, 6)}`,
    color: getUserColor(),
    connectedAt: new Date().toISOString()
  };
  
  appState.users.set(socket.id, userInfo);
  
  // Send current state to newly connected user
  socket.emit('state-sync', {
    completedTasks: Array.from(appState.completedTasks),
    collapsedPhases: Array.from(appState.collapsedPhases),
    users: Array.from(appState.users.values())
  });
  
  // Broadcast user joined
  socket.broadcast.emit('user-joined', userInfo);
  
  // Handle task toggle
  socket.on('task-toggle', (data) => {
    const { taskId, completed } = data;
    
    if (completed) {
      appState.completedTasks.add(taskId);
    } else {
      appState.completedTasks.delete(taskId);
    }
    
    saveState();
    
    // Broadcast to all other clients
    socket.broadcast.emit('task-updated', {
      taskId,
      completed,
      updatedBy: userInfo
    });
  });
  
  // Handle phase toggle
  socket.on('phase-toggle', (data) => {
    const { phaseNum, collapsed } = data;
    
    if (collapsed) {
      appState.collapsedPhases.add(phaseNum);
    } else {
      appState.collapsedPhases.delete(phaseNum);
    }
    
    saveState();
    
    // Broadcast to all other clients
    socket.broadcast.emit('phase-updated', {
      phaseNum,
      collapsed,
      updatedBy: userInfo
    });
  });
  
  // Handle user name update
  socket.on('update-name', (data) => {
    if (appState.users.has(socket.id)) {
      appState.users.get(socket.id).name = data.name;
      io.emit('user-updated', {
        id: socket.id,
        name: data.name
      });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    appState.users.delete(socket.id);
    socket.broadcast.emit('user-left', { id: socket.id });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Collaborative checklist ready!`);
});

