// Initialize Socket.io connection
const socket = io();
let currentUserId = null;
let currentUserName = '';

// Checklist Data Structure
const checklistData = [
    {
        phase: 1,
        title: "LANDLORD ENGAGEMENT & LISTING SETUP",
        milestone: "Signed exclusive listing agreement",
        goals: [
            {
                title: "Identify & Target the Property",
                description: "Confirm this is a real leasing opportunity worth time.",
                tasks: [
                    {
                        id: "1-1",
                        text: "Confirm ownership entity and decision maker",
                        dependencies: "Ownership data (tax records, CoStar, deed)",
                        doneWhen: "You can explain the space in 2 sentences without guessing"
                    },
                    {
                        id: "1-2",
                        text: "Confirm vacancy status (vacant, coming vacant, expansion space)",
                        dependencies: "Ownership data (tax records, CoStar, deed)",
                        doneWhen: "You can explain the space in 2 sentences without guessing"
                    },
                    {
                        id: "1-3",
                        text: "Confirm retail zoning and allowed uses",
                        dependencies: "Ownership data (tax records, CoStar, deed)",
                        doneWhen: "You can explain the space in 2 sentences without guessing"
                    },
                    {
                        id: "1-4",
                        text: "Rough size confirmation (SF, divisible or not)",
                        dependencies: "Ownership data (tax records, CoStar, deed)",
                        doneWhen: "You can explain the space in 2 sentences without guessing"
                    },
                    {
                        id: "1-5",
                        text: "Quick market sanity check (is this leaseable?)",
                        dependencies: "Ownership data (tax records, CoStar, deed)",
                        doneWhen: "You can explain the space in 2 sentences without guessing"
                    }
                ]
            },
            {
                title: "Initial Landlord Conversation",
                description: "Understand motivation and align expectations.",
                tasks: [
                    {
                        id: "1-6",
                        text: "Ask why the space is vacant",
                        dependencies: "Live conversation or meeting",
                        doneWhen: "You can clearly state landlord priorities in writing"
                    },
                    {
                        id: "1-7",
                        text: "Ask previous rent, concessions, broker history",
                        dependencies: "Live conversation or meeting",
                        doneWhen: "You can clearly state landlord priorities in writing"
                    },
                    {
                        id: "1-8",
                        text: "Ask urgency (timeline pressure?)",
                        dependencies: "Live conversation or meeting",
                        doneWhen: "You can clearly state landlord priorities in writing"
                    },
                    {
                        id: "1-9",
                        text: "Ask flexibility (TI, rent, term, uses)",
                        dependencies: "Live conversation or meeting",
                        doneWhen: "You can clearly state landlord priorities in writing"
                    },
                    {
                        id: "1-10",
                        text: "Ask decision process (who signs off?)",
                        dependencies: "Live conversation or meeting",
                        doneWhen: "You can clearly state landlord priorities in writing"
                    }
                ]
            },
            {
                title: "Property Evaluation & Info Intake",
                description: "Gather the raw inputs needed to lease the space.",
                tasks: [
                    {
                        id: "1-11",
                        text: "Walk the space in person",
                        dependencies: "Physical access to space",
                        doneWhen: "You can describe the space without being onsite"
                    },
                    {
                        id: "1-12",
                        text: "Take photos (interior, exterior, visibility, parking)",
                        dependencies: "Physical access to space",
                        doneWhen: "You can describe the space without being onsite"
                    },
                    {
                        id: "1-13",
                        text: "Measure or confirm square footage",
                        dependencies: "Physical access to space",
                        doneWhen: "You can describe the space without being onsite"
                    },
                    {
                        id: "1-14",
                        text: "Confirm utilities (gas, electric, HVAC, grease trap, venting)",
                        dependencies: "Physical access to space",
                        doneWhen: "You can describe the space without being onsite"
                    },
                    {
                        id: "1-15",
                        text: "Identify delivery condition (as-is, vanilla shell, white box)",
                        dependencies: "Physical access to space",
                        doneWhen: "You can describe the space without being onsite"
                    }
                ]
            },
            {
                title: "Pricing & Strategy Alignment",
                description: "Agree on a realistic leasing strategy.",
                tasks: [
                    {
                        id: "1-16",
                        text: "Pull 5–10 nearby lease comps",
                        dependencies: "Market data access",
                        doneWhen: "Landlord verbally agrees to pricing and positioning"
                    },
                    {
                        id: "1-17",
                        text: "Identify competing availabilities",
                        dependencies: "Market data access",
                        doneWhen: "Landlord verbally agrees to pricing and positioning"
                    },
                    {
                        id: "1-18",
                        text: "Recommend asking rent, term, escalations",
                        dependencies: "Market data access",
                        doneWhen: "Landlord verbally agrees to pricing and positioning"
                    },
                    {
                        id: "1-19",
                        text: "Recommend TI strategy",
                        dependencies: "Market data access",
                        doneWhen: "Landlord verbally agrees to pricing and positioning"
                    },
                    {
                        id: "1-20",
                        text: "Discuss target tenant profile",
                        dependencies: "Market data access",
                        doneWhen: "Landlord verbally agrees to pricing and positioning"
                    }
                ]
            },
            {
                title: "Secure Exclusive Listing Agreement",
                description: "Lock in representation and authority.",
                tasks: [
                    {
                        id: "1-21",
                        text: "Draft listing agreement",
                        dependencies: "Strategy alignment",
                        doneWhen: "Agreement signed and saved to folder"
                    },
                    {
                        id: "1-22",
                        text: "Confirm fee, term, exclusivity",
                        dependencies: "Strategy alignment",
                        doneWhen: "Agreement signed and saved to folder"
                    },
                    {
                        id: "1-23",
                        text: "Confirm marketing authority",
                        dependencies: "Strategy alignment",
                        doneWhen: "Agreement signed and saved to folder"
                    },
                    {
                        id: "1-24",
                        text: "Obtain signature",
                        dependencies: "Strategy alignment",
                        doneWhen: "Agreement signed and saved to folder"
                    }
                ]
            }
        ]
    },
    {
        phase: 2,
        title: "MARKETING PREP & LAUNCH",
        milestone: "Listing live everywhere",
        goals: [
            {
                title: "Build the Listing Asset Package",
                description: "Create everything needed to market once, properly.",
                tasks: [
                    {
                        id: "2-1",
                        text: "Clean photos (rename + organize)",
                        dependencies: "Property info complete",
                        doneWhen: "You could email this to a tenant rep with confidence"
                    },
                    {
                        id: "2-2",
                        text: "Site plan or floor plan",
                        dependencies: "Property info complete",
                        doneWhen: "You could email this to a tenant rep with confidence"
                    },
                    {
                        id: "2-3",
                        text: "Google Map + aerial screenshot",
                        dependencies: "Property info complete",
                        doneWhen: "You could email this to a tenant rep with confidence"
                    },
                    {
                        id: "2-4",
                        text: "One-page flyer draft",
                        dependencies: "Property info complete",
                        doneWhen: "You could email this to a tenant rep with confidence"
                    },
                    {
                        id: "2-5",
                        text: "Listing description (use, size, rent, highlights)",
                        dependencies: "Property info complete",
                        doneWhen: "You could email this to a tenant rep with confidence"
                    }
                ]
            },
            {
                title: "Publish Listings",
                description: "Maximum visibility with consistency.",
                tasks: [
                    {
                        id: "2-6",
                        text: "CoStar listing live",
                        dependencies: "Marketing package complete",
                        doneWhen: "You can paste one link that shows the space publicly"
                    },
                    {
                        id: "2-7",
                        text: "Crexi listing live",
                        dependencies: "Marketing package complete",
                        doneWhen: "You can paste one link that shows the space publicly"
                    },
                    {
                        id: "2-8",
                        text: "Company website (if applicable)",
                        dependencies: "Marketing package complete",
                        doneWhen: "You can paste one link that shows the space publicly"
                    },
                    {
                        id: "2-9",
                        text: "Internal database blast prepared",
                        dependencies: "Marketing package complete",
                        doneWhen: "You can paste one link that shows the space publicly"
                    },
                    {
                        id: "2-10",
                        text: "Signage ordered or installed",
                        dependencies: "Marketing package complete",
                        doneWhen: "You can paste one link that shows the space publicly"
                    }
                ]
            },
            {
                title: "Targeted Tenant Outreach",
                description: "Proactively bring tenants, not just wait.",
                tasks: [
                    {
                        id: "2-11",
                        text: "Build tenant hit list (brands, operators, reps)",
                        dependencies: "Listing live",
                        doneWhen: "At least 15–25 direct touches completed"
                    },
                    {
                        id: "2-12",
                        text: "Email tenant reps directly",
                        dependencies: "Listing live",
                        doneWhen: "At least 15–25 direct touches completed"
                    },
                    {
                        id: "2-13",
                        text: "Call top 10 logical users",
                        dependencies: "Listing live",
                        doneWhen: "At least 15–25 direct touches completed"
                    },
                    {
                        id: "2-14",
                        text: "Send listing to internal brokers",
                        dependencies: "Listing live",
                        doneWhen: "At least 15–25 direct touches completed"
                    },
                    {
                        id: "2-15",
                        text: "Track outreach in CRM or sheet",
                        dependencies: "Listing live",
                        doneWhen: "At least 15–25 direct touches completed"
                    }
                ]
            }
        ]
    },
    {
        phase: 3,
        title: "LEAD MANAGEMENT & TOURS",
        milestone: "Qualified LOI in hand",
        goals: [
            {
                title: "Inquiry Response & Qualification",
                description: "Filter tire-kickers early.",
                tasks: [
                    {
                        id: "3-1",
                        text: "Respond same day",
                        dependencies: "Inbound inquiry",
                        doneWhen: "You know if this prospect is real or not"
                    },
                    {
                        id: "3-2",
                        text: "Ask use, timing, budget, credit",
                        dependencies: "Inbound inquiry",
                        doneWhen: "You know if this prospect is real or not"
                    },
                    {
                        id: "3-3",
                        text: "Confirm fit with landlord criteria",
                        dependencies: "Inbound inquiry",
                        doneWhen: "You know if this prospect is real or not"
                    },
                    {
                        id: "3-4",
                        text: "Log inquiry and notes",
                        dependencies: "Inbound inquiry",
                        doneWhen: "You know if this prospect is real or not"
                    }
                ]
            },
            {
                title: "Tours & Follow-Up",
                description: "Convert interest into intent.",
                tasks: [
                    {
                        id: "3-5",
                        text: "Schedule tour",
                        dependencies: "Qualified prospect",
                        doneWhen: "Clear next step agreed (LOI or no)"
                    },
                    {
                        id: "3-6",
                        text: "Walk space with tenant",
                        dependencies: "Qualified prospect",
                        doneWhen: "Clear next step agreed (LOI or no)"
                    },
                    {
                        id: "3-7",
                        text: "Ask direct closing questions",
                        dependencies: "Qualified prospect",
                        doneWhen: "Clear next step agreed (LOI or no)"
                    },
                    {
                        id: "3-8",
                        text: "Send follow-up recap same day",
                        dependencies: "Qualified prospect",
                        doneWhen: "Clear next step agreed (LOI or no)"
                    },
                    {
                        id: "3-9",
                        text: "Push toward LOI",
                        dependencies: "Qualified prospect",
                        doneWhen: "Clear next step agreed (LOI or no)"
                    }
                ]
            }
        ]
    },
    {
        phase: 4,
        title: "LOI → LEASE",
        milestone: "Executed lease",
        goals: [
            {
                title: "LOI Negotiation",
                description: "Lock business terms.",
                tasks: [
                    {
                        id: "4-1",
                        text: "Review LOI with landlord",
                        dependencies: "Serious tenant",
                        doneWhen: "All business terms settled"
                    },
                    {
                        id: "4-2",
                        text: "Highlight non-negotiables",
                        dependencies: "Serious tenant",
                        doneWhen: "All business terms settled"
                    },
                    {
                        id: "4-3",
                        text: "Counter quickly",
                        dependencies: "Serious tenant",
                        doneWhen: "All business terms settled"
                    },
                    {
                        id: "4-4",
                        text: "Get written agreement on key terms",
                        dependencies: "Serious tenant",
                        doneWhen: "All business terms settled"
                    }
                ]
            },
            {
                title: "Lease Drafting & Execution",
                description: "Get signatures without losing momentum.",
                tasks: [
                    {
                        id: "4-5",
                        text: "Coordinate landlord attorney",
                        dependencies: "Agreed LOI",
                        doneWhen: "Lease executed and deposit received"
                    },
                    {
                        id: "4-6",
                        text: "Track draft versions",
                        dependencies: "Agreed LOI",
                        doneWhen: "Lease executed and deposit received"
                    },
                    {
                        id: "4-7",
                        text: "Keep parties moving",
                        dependencies: "Agreed LOI",
                        doneWhen: "Lease executed and deposit received"
                    },
                    {
                        id: "4-8",
                        text: "Resolve sticking points",
                        dependencies: "Agreed LOI",
                        doneWhen: "Lease executed and deposit received"
                    },
                    {
                        id: "4-9",
                        text: "Collect signed lease",
                        dependencies: "Agreed LOI",
                        doneWhen: "Lease executed and deposit received"
                    }
                ]
            }
        ]
    },
    {
        phase: 5,
        title: "CLOSE-OUT & RELATIONSHIP",
        milestone: "Space delivered + future business protected",
        goals: [
            {
                title: "Lease Close-Out",
                description: "Clean handoff.",
                tasks: [
                    {
                        id: "5-1",
                        text: "Confirm possession date",
                        dependencies: "",
                        doneWhen: "Tenant has keys or possession date"
                    },
                    {
                        id: "5-2",
                        text: "Confirm insurance",
                        dependencies: "",
                        doneWhen: "Tenant has keys or possession date"
                    },
                    {
                        id: "5-3",
                        text: "Confirm build-out responsibilities",
                        dependencies: "",
                        doneWhen: "Tenant has keys or possession date"
                    },
                    {
                        id: "5-4",
                        text: "Deliver closing summary to landlord",
                        dependencies: "",
                        doneWhen: "Tenant has keys or possession date"
                    }
                ]
            },
            {
                title: "Post-Deal System Reset",
                description: "Turn deal into repeat work.",
                tasks: [
                    {
                        id: "5-5",
                        text: "Update CRM",
                        dependencies: "",
                        doneWhen: "Next touch is already scheduled"
                    },
                    {
                        id: "5-6",
                        text: "Send thank-you note",
                        dependencies: "",
                        doneWhen: "Next touch is already scheduled"
                    },
                    {
                        id: "5-7",
                        text: "Send leasing announcement",
                        dependencies: "",
                        doneWhen: "Next touch is already scheduled"
                    },
                    {
                        id: "5-8",
                        text: "Calendar follow-up (90 / 180 days)",
                        dependencies: "",
                        doneWhen: "Next touch is already scheduled"
                    }
                ]
            }
        ]
    }
];

// State Management
let completedTasks = new Set();
let collapsedPhases = new Set();
let allUsers = [];

// Socket.io Event Handlers
socket.on('connect', () => {
    console.log('Connected to server');
    updateConnectionStatus(true);
    currentUserId = socket.id;
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    updateConnectionStatus(false);
});

socket.on('state-sync', (state) => {
    console.log('Received state sync:', state);
    completedTasks = new Set(state.completedTasks || []);
    collapsedPhases = new Set(state.collapsedPhases || []);
    allUsers = state.users || [];
    updateUserList();
    updateProgress();
    renderChecklist();
});

socket.on('task-updated', (data) => {
    const { taskId, completed, updatedBy } = data;
    
    // Don't update if this was our own change
    if (updatedBy.id === currentUserId) return;
    
    if (completed) {
        completedTasks.add(taskId);
    } else {
        completedTasks.delete(taskId);
    }
    
    updateProgress();
    renderChecklist();
    
    // Highlight the updated task
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.classList.add('recent-update');
        setTimeout(() => {
            taskElement.classList.remove('recent-update');
        }, 2000);
    }
    
    showNotification(`${updatedBy.name} ${completed ? 'completed' : 'unchecked'} a task`, 'info');
});

socket.on('phase-updated', (data) => {
    const { phaseNum, collapsed, updatedBy } = data;
    
    // Don't update if this was our own change
    if (updatedBy.id === currentUserId) return;
    
    if (collapsed) {
        collapsedPhases.add(phaseNum);
    } else {
        collapsedPhases.delete(phaseNum);
    }
    
    renderChecklist();
});

socket.on('user-joined', (user) => {
    allUsers.push(user);
    updateUserList();
    if (user.id !== currentUserId) {
        showNotification(`${user.name} joined`, 'info');
    }
});

socket.on('user-left', (data) => {
    allUsers = allUsers.filter(u => u.id !== data.id);
    updateUserList();
});

socket.on('user-updated', (data) => {
    const userIndex = allUsers.findIndex(u => u.id === data.id);
    if (userIndex !== -1) {
        allUsers[userIndex].name = data.name;
        updateUserList();
    }
});

// Update Connection Status
function updateConnectionStatus(connected) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (connected) {
        indicator.classList.add('connected');
        statusText.textContent = 'Connected';
    } else {
        indicator.classList.remove('connected');
        statusText.textContent = 'Disconnected';
    }
}

// Update User List
function updateUserList() {
    const container = document.getElementById('activeUsers');
    container.innerHTML = '';
    
    allUsers.forEach(user => {
        const badge = document.createElement('div');
        badge.className = 'user-badge';
        if (user.id === currentUserId) {
            badge.classList.add('current-user');
        }
        badge.innerHTML = `
            <span class="user-color" style="background: ${user.color}"></span>
            <span>${user.name}</span>
        `;
        container.appendChild(badge);
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderChecklist();
    setupEventListeners();
    updateProgress();
    
    // Handle user name input
    const userNameInput = document.getElementById('userNameInput');
    userNameInput.addEventListener('blur', () => {
        const name = userNameInput.value.trim();
        if (name && name !== currentUserName) {
            currentUserName = name;
            socket.emit('update-name', { name });
        }
    });
    
    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            userNameInput.blur();
        }
    });
});

// Render Checklist
function renderChecklist() {
    const container = document.getElementById('checklistContainer');
    container.innerHTML = '';

    checklistData.forEach(phaseData => {
        const phaseElement = createPhaseElement(phaseData);
        container.appendChild(phaseElement);
    });
}

// Create Phase Element
function createPhaseElement(phaseData) {
    const phaseDiv = document.createElement('div');
    phaseDiv.className = 'phase fade-in';
    phaseDiv.dataset.phase = phaseData.phase;

    const isCollapsed = collapsedPhases.has(phaseData.phase);
    
    phaseDiv.innerHTML = `
        <div class="phase-header ${isCollapsed ? 'collapsed' : ''}" data-phase="${phaseData.phase}">
            <div>
                <span class="phase-number">PHASE ${phaseData.phase}</span>
                <h2>${phaseData.title}</h2>
            </div>
            <span class="toggle-icon">▼</span>
        </div>
        <div class="milestone">Milestone: ${phaseData.milestone}</div>
        <div class="phase-content" ${isCollapsed ? 'style="display: none;"' : ''}>
            ${phaseData.goals.map(goal => createGoalSection(goal)).join('')}
        </div>
    `;

    // Add click handler for phase header
    const header = phaseDiv.querySelector('.phase-header');
    header.addEventListener('click', () => togglePhase(phaseData.phase));

    return phaseDiv;
}

// Create Goal Section
function createGoalSection(goal) {
    return `
        <div class="goal-section">
            <div class="goal-title">${goal.title}</div>
            <p style="color: var(--text-secondary); margin-bottom: 15px; font-style: italic;">${goal.description}</p>
            ${goal.tasks.map(task => createTaskElement(task)).join('')}
        </div>
    `;
}

// Create Task Element
function createTaskElement(task) {
    const isCompleted = completedTasks.has(task.id);
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const isVisible = !searchTerm || 
        task.text.toLowerCase().includes(searchTerm) ||
        (task.dependencies && task.dependencies.toLowerCase().includes(searchTerm)) ||
        (task.doneWhen && task.doneWhen.toLowerCase().includes(searchTerm));

    return `
        <div class="task-item ${isCompleted ? 'completed' : ''}" ${!isVisible ? 'style="display: none;"' : ''} data-task-id="${task.id}">
            <label class="task-checkbox">
                <input type="checkbox" ${isCompleted ? 'checked' : ''} data-task-id="${task.id}">
                <span class="task-label">${task.text}</span>
            </label>
            <div class="task-details">
                ${task.dependencies ? `<div class="dependencies"><strong>Dependencies:</strong> ${task.dependencies}</div>` : ''}
                ${task.doneWhen ? `<div class="done-when"><strong>Done When:</strong> ${task.doneWhen}</div>` : ''}
            </div>
        </div>
    `;
}

// Toggle Phase
function togglePhase(phaseNum) {
    const phaseDiv = document.querySelector(`[data-phase="${phaseNum}"]`);
    const header = phaseDiv.querySelector('.phase-header');
    const content = phaseDiv.querySelector('.phase-content');
    
    const collapsed = !collapsedPhases.has(phaseNum);
    
    if (collapsed) {
        collapsedPhases.add(phaseNum);
        header.classList.add('collapsed');
        content.style.display = 'none';
    } else {
        collapsedPhases.delete(phaseNum);
        header.classList.remove('collapsed');
        content.style.display = '';
    }
    
    // Broadcast to server
    socket.emit('phase-toggle', { phaseNum, collapsed });
}

// Toggle Task
function toggleTask(taskId) {
    const completed = !completedTasks.has(taskId);
    
    if (completed) {
        completedTasks.add(taskId);
    } else {
        completedTasks.delete(taskId);
    }
    
    // Broadcast to server
    socket.emit('task-toggle', { taskId, completed });
    
    updateProgress();
    renderChecklist();
}

// Update Progress
function updateProgress() {
    const totalTasks = checklistData.reduce((sum, phase) => 
        sum + phase.goals.reduce((goalSum, goal) => goalSum + goal.tasks.length, 0), 0
    );
    
    const completed = completedTasks.size;
    const percentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `${percentage}% Complete`;
    document.getElementById('taskCount').textContent = `${completed} / ${totalTasks} tasks completed`;
}

// Setup Event Listeners
function setupEventListeners() {
    // Checkbox clicks
    document.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' && e.target.dataset.taskId) {
            toggleTask(e.target.dataset.taskId);
        }
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        renderChecklist();
    });

    // Expand All
    document.getElementById('expandAll').addEventListener('click', () => {
        collapsedPhases.clear();
        checklistData.forEach(phase => {
            socket.emit('phase-toggle', { phaseNum: phase.phase, collapsed: false });
        });
        renderChecklist();
    });

    // Collapse All
    document.getElementById('collapseAll').addEventListener('click', () => {
        checklistData.forEach(phase => {
            collapsedPhases.add(phase.phase);
            socket.emit('phase-toggle', { phaseNum: phase.phase, collapsed: true });
        });
        renderChecklist();
    });

    // Reset All
    document.getElementById('resetAll').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all completed tasks? This will affect all users.')) {
            completedTasks.clear();
            // Uncheck all tasks by emitting toggle events
            checklistData.forEach(phase => {
                phase.goals.forEach(goal => {
                    goal.tasks.forEach(task => {
                        if (completedTasks.has(task.id)) {
                            socket.emit('task-toggle', { taskId: task.id, completed: false });
                        }
                    });
                });
            });
            updateProgress();
            renderChecklist();
        }
    });
}

