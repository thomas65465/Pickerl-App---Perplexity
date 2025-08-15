// Pickerl-Sammler App - JavaScript mit Bug-Fixes
class PickerlSammlerApp {
    constructor() {
        this.data = {
            sampleCollections: [
                {
                    "id": "billa-wald-2024",
                    "name": "BILLA Wald Sammlung 2024",
                    "totalStickers": 180,
                    "description": "Entdecke die faszinierende Welt des Waldes",
                    "theme": "forest",
                    "categories": [
                        {"name": "Waldtiere", "count": 60},
                        {"name": "Bäume & Pflanzen", "count": 60}, 
                        {"name": "Ökosystem", "count": 60}
                    ]
                },
                {
                    "id": "spar-oskar-bo-2024",
                    "name": "SPAR Oskar & Bo Abenteuer",
                    "totalStickers": 200,
                    "description": "Spannende Abenteuer mit Oskar und Bo",
                    "theme": "adventure",
                    "categories": [
                        {"name": "Abenteuer", "count": 80},
                        {"name": "Länder", "count": 60},
                        {"name": "Kulturen", "count": 60}
                    ]
                }
            ],
            friends: [
                {
                    "id": "friend-1",
                    "name": "Anna",
                    "avatar": "🦸‍♀️", 
                    "level": 12,
                    "xp": 2450,
                    "collections": [
                        {
                            "id": "billa-wald-2024",
                            "progress": 85,
                            "collected": 153,
                            "doubles": [12, 25, 34, 67, 89, 102]
                        }
                    ],
                    "achievements": ["Erste Sammlung", "Fleißiger Sammler", "Tausch-Profi"],
                    "tradableStickers": [
                        {"collectionId": "billa-wald-2024", "stickerNumber": 12, "quantity": 3},
                        {"collectionId": "billa-wald-2024", "stickerNumber": 25, "quantity": 2}
                    ]
                },
                {
                    "id": "friend-2", 
                    "name": "Max",
                    "avatar": "🐻",
                    "level": 8,
                    "xp": 1200,
                    "collections": [
                        {
                            "id": "spar-oskar-bo-2024",
                            "progress": 60,
                            "collected": 120,
                            "doubles": [5, 18, 33, 45]
                        }
                    ],
                    "achievements": ["Erste Sammlung", "Freunde-Finder"],
                    "tradableStickers": [
                        {"collectionId": "spar-oskar-bo-2024", "stickerNumber": 5, "quantity": 2}
                    ]
                },
                {
                    "id": "friend-3",
                    "name": "Emma", 
                    "avatar": "🐨",
                    "level": 15,
                    "xp": 4200,
                    "collections": [
                        {
                            "id": "billa-wald-2024", 
                            "progress": 95,
                            "collected": 171,
                            "doubles": [8, 15, 29, 42, 56, 71, 88, 94, 103, 125]
                        }
                    ],
                    "achievements": ["Erste Sammlung", "Fleißiger Sammler", "Tausch-Profi", "Social Star"],
                    "tradableStickers": [
                        {"collectionId": "billa-wald-2024", "stickerNumber": 42, "quantity": 4},
                        {"collectionId": "billa-wald-2024", "stickerNumber": 71, "quantity": 3}
                    ]
                }
            ],
            achievements: [
                {"name": "Erste Sammlung", "description": "Erste Sammlung gestartet", "icon": "🌟"},
                {"name": "Fleißiger Sammler", "description": "50 Pickerl gesammelt", "icon": "📚"},
                {"name": "Tausch-Profi", "description": "10 erfolgreiche Tausche", "icon": "🔄"},
                {"name": "Komplettierungs-King", "description": "Erste Sammlung vervollständigt", "icon": "👑"},
                {"name": "Freunde-Finder", "description": "3 Freunde hinzugefügt", "icon": "👥"},
                {"name": "Social Star", "description": "10x auf WhatsApp geteilt", "icon": "📱"}
            ],
            gamificationLevels: [
                {"level": 1, "title": "Pickerl-Anfänger", "requiredXP": 0, "rewards": ["Willkommensbonus"]},
                {"level": 5, "title": "Sammler", "requiredXP": 500, "rewards": ["Neue Frames"]},
                {"level": 10, "title": "Experte", "requiredXP": 1500, "rewards": ["Exclusive Sticker"]},
                {"level": 15, "title": "Meister-Sammler", "requiredXP": 3000, "rewards": ["Special Badge"]},
                {"level": 20, "title": "Pickerl-Legende", "requiredXP": 5000, "rewards": ["Goldene Krone"]}
            ]
        };

        this.user = this.loadUserData();
        this.settings = this.loadSettings();
        this.currentView = 'dashboard';
        this.currentCollection = null;
        this.currentFriendProfile = null;
        this.filterMode = 'all';
        this.maxStickerCount = 10;
        this.pendingConfirmAction = null;
    }

    init() {
        console.log('Initializing app with bug fixes...');
        this.applyTheme();
        this.setupEventListeners();
        
        setTimeout(() => {
            this.checkOnboarding();
        }, 100);
    }

    loadUserData() {
        try {
            const saved = localStorage.getItem('pickerl-sammler-user');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log('Failed to load user data:', e);
        }
        
        return {
            name: '',
            avatar: '🦊',
            level: 1,
            xp: 0,
            collections: {},
            achievements: [],
            friends: [],
            trades: 0,
            sharesCount: 0,
            streak: 0,
            lastActive: null
        };
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('pickerl-sammler-settings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log('Failed to load settings:', e);
        }
        
        return {
            notifications: true,
            soundEffects: true,
            theme: 'auto'
        };
    }

    saveUserData() {
        try {
            localStorage.setItem('pickerl-sammler-user', JSON.stringify(this.user));
            console.log('User data saved');
        } catch (e) {
            console.log('Failed to save user data:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('pickerl-sammler-settings', JSON.stringify(this.settings));
            console.log('Settings saved');
        } catch (e) {
            console.log('Failed to save settings:', e);
        }
    }

    applyTheme() {
        if (this.settings.theme === 'light') {
            document.documentElement.setAttribute('data-color-scheme', 'light');
        } else if (this.settings.theme === 'dark') {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-color-scheme');
        }
    }

    checkOnboarding() {
        const onboardingModal = document.getElementById('onboardingModal');
        const app = document.getElementById('app');
        
        if (!this.user.name) {
            console.log('Showing onboarding');
            if (onboardingModal) onboardingModal.classList.remove('hidden');
            if (app) app.classList.add('hidden');
        } else {
            console.log('Showing app');
            if (onboardingModal) onboardingModal.classList.add('hidden');
            if (app) app.classList.remove('hidden');
            this.updateUI();
            this.renderDashboard();
        }
    }

    showApp() {
        const onboardingModal = document.getElementById('onboardingModal');
        const app = document.getElementById('app');
        
        if (onboardingModal) onboardingModal.classList.add('hidden');
        if (app) app.classList.remove('hidden');
        this.updateUI();
        this.renderDashboard();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Onboarding events
        this.setupOnboardingListeners();
        
        // Main app events
        this.setupNavigationListeners();
        this.setupMainAppListeners();
        
        // Modal events
        this.setupModalListeners();
    }

    setupOnboardingListeners() {
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        const startButton = document.getElementById('startAdventure');
        if (startButton) {
            startButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start adventure clicked');
                const nameInput = document.getElementById('playerName');
                const selectedAvatar = document.querySelector('.avatar-option.selected');
                
                const name = nameInput ? nameInput.value.trim() : '';
                
                if (name && selectedAvatar) {
                    this.user.name = name;
                    this.user.avatar = selectedAvatar.dataset.avatar;
                    this.saveUserData();
                    this.showApp();
                } else {
                    alert('Bitte wähle einen Avatar und gib deinen Namen ein!');
                }
            });
        }
    }

    setupNavigationListeners() {
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                console.log('Bottom nav clicked:', view);
                this.switchView(view);
            });
        });

        // Header buttons
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Settings button clicked');
                this.switchView('settings');
            });
        }

        const friendsBtn = document.getElementById('friendsBtn');
        if (friendsBtn) {
            friendsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Friends header button clicked');
                this.switchView('friends');
            });
        }
    }

    setupMainAppListeners() {
        // Quick action buttons - Direct event listeners
        const newCollectionBtn = document.getElementById('newCollectionBtn');
        if (newCollectionBtn) {
            newCollectionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('New collection button clicked');
                this.switchView('collections');
            });
        }

        const tradeCenterBtn = document.getElementById('tradeCenterBtn');
        if (tradeCenterBtn) {
            tradeCenterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Trade center button clicked');
                this.switchView('tradeCenter');
            });
        }

        // Back buttons
        const backToDashboard = document.getElementById('backToDashboard');
        if (backToDashboard) {
            backToDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView('dashboard');
            });
        }

        const backToDashboardFromFriends = document.getElementById('backToDashboardFromFriends');
        if (backToDashboardFromFriends) {
            backToDashboardFromFriends.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView('dashboard');
            });
        }

        const backToDashboardFromTrade = document.getElementById('backToDashboardFromTrade');
        if (backToDashboardFromTrade) {
            backToDashboardFromTrade.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView('dashboard');
            });
        }

        const backToDashboardFromSettings = document.getElementById('backToDashboardFromSettings');
        if (backToDashboardFromSettings) {
            backToDashboardFromSettings.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView('dashboard');
            });
        }

        const backToCollections = document.getElementById('backToCollections');
        if (backToCollections) {
            backToCollections.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView('collections');
            });
        }

        // Global click handler for dynamic content
        document.addEventListener('click', (e) => {
            this.handleDynamicClicks(e);
        });

        // Search functionality
        const stickerSearch = document.getElementById('stickerSearch');
        if (stickerSearch) {
            stickerSearch.addEventListener('input', (e) => {
                this.searchStickers(e.target.value);
            });
        }
    }

    setupModalListeners() {
        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });
    }

    handleDynamicClicks(e) {
        const target = e.target;

        // Counter buttons
        if (target.classList.contains('counter-btn-plus')) {
            e.preventDefault();
            e.stopPropagation();
            const stickerNumber = parseInt(target.dataset.sticker);
            this.increaseSticker(stickerNumber);
            return;
        }

        if (target.classList.contains('counter-btn-minus')) {
            e.preventDefault();
            e.stopPropagation();
            const stickerNumber = parseInt(target.dataset.sticker);
            this.decreaseSticker(stickerNumber);
            return;
        }

        // Filter buttons
        if (target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
            this.filterMode = target.dataset.filter;
            this.renderStickers();
            return;
        }

        // Sticker items
        if (target.classList.contains('sticker-item') && !target.querySelector('.counter-btn')) {
            const stickerNumber = parseInt(target.textContent.trim().split(' ')[0]);
            if (stickerNumber) {
                this.toggleSticker(stickerNumber);
            }
            return;
        }

        // Friend cards
        if (target.closest('.friend-card')) {
            const friendCard = target.closest('.friend-card');
            const friendName = friendCard.dataset.friend;
            if (friendName && !target.closest('.friend-actions')) {
                this.viewFriendProfile(friendName);
            }
            return;
        }

        // Settings-related clicks
        this.handleSettingsClicks(target);

        // Other buttons
        this.handleOtherButtonClicks(target);
    }

    handleSettingsClicks(target) {
        if (target.id === 'saveProfileBtn') {
            this.saveProfileSettings();
            return;
        }

        if (target.id === 'resetDataBtn') {
            this.showConfirmation('Alle Daten löschen?', 
                'Diese Aktion löscht alle deine Sammlungen, Fortschritte und Einstellungen unwiderruflich.', 
                () => this.resetAllData());
            return;
        }

        if (target.id === 'soundToggle') {
            this.settings.soundEffects = target.checked;
            this.saveSettings();
            return;
        }

        if (target.id === 'notificationToggle') {
            this.settings.notifications = target.checked;
            this.saveSettings();
            return;
        }

        if (target.id === 'themeSelect') {
            this.settings.theme = target.value;
            this.saveSettings();
            this.applyTheme();
            return;
        }

        // Avatar selection in settings
        if (target.closest('#avatarSelector') && target.classList.contains('avatar-option')) {
            document.querySelectorAll('#avatarSelector .avatar-option').forEach(o => o.classList.remove('selected'));
            target.classList.add('selected');
            return;
        }
    }

    handleOtherButtonClicks(target) {
        const buttonActions = {
            'shareCollectionBtn': () => this.shareProgress(),
            'inviteFriendBtn': () => this.showInviteModal(),
            'bulkModeBtn': () => {
                const panel = document.getElementById('bulkModePanel');
                if (panel) panel.classList.toggle('hidden');
            },
            'cancelBulk': () => {
                const panel = document.getElementById('bulkModePanel');
                const input = document.getElementById('bulkInput');
                if (panel) panel.classList.add('hidden');
                if (input) input.value = '';
            },
            'addBulkStickers': () => this.addBulkStickers(),
            'confirmYes': () => {
                if (this.pendingConfirmAction) {
                    this.pendingConfirmAction();
                    this.pendingConfirmAction = null;
                }
                document.getElementById('confirmationModal')?.classList.add('hidden');
            },
            'confirmNo': () => {
                this.pendingConfirmAction = null;
                document.getElementById('confirmationModal')?.classList.add('hidden');
            }
        };

        if (buttonActions[target.id]) {
            buttonActions[target.id]();
        }

        // Trade buttons
        if (target.textContent.includes('Tausch vorschlagen') || target.textContent.includes('Tauschen')) {
            const friendName = target.dataset.friend || target.closest('[data-friend]')?.dataset.friend;
            if (friendName) {
                this.proposeTrade(friendName);
            }
        }

        // View profile buttons
        if (target.textContent.includes('Profil')) {
            const friendName = target.dataset.friend || target.closest('[data-friend]')?.dataset.friend;
            if (friendName) {
                this.viewFriendProfile(friendName);
            }
        }
    }

    switchView(viewName) {
        console.log('Switching to view:', viewName);
        
        // Update bottom nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
            console.log('View activated:', viewName);
        } else {
            console.error('View not found:', viewName + 'View');
            return;
        }
        
        this.currentView = viewName;

        // Load view-specific content with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.loadViewContent(viewName);
        }, 50);
    }

    loadViewContent(viewName) {
        switch(viewName) {
            case 'collections':
                this.renderCollections();
                break;
            case 'friends':
                this.renderFriends();
                break;
            case 'tradeCenter':
                this.renderTradeSuggestions();
                break;
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'settings':
                this.renderSettings();
                break;
            case 'collectionDetail':
                if (this.currentCollection) {
                    this.updateCollectionProgress();
                    this.renderStickers();
                }
                break;
        }
    }

    updateUI() {
        if (!this.user.name) return;

        // Update header
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const welcomeName = document.getElementById('welcomeName');
        const userLevel = document.getElementById('userLevel');

        if (userAvatar) userAvatar.textContent = this.user.avatar;
        if (userName) userName.textContent = this.user.name;
        if (welcomeName) welcomeName.textContent = this.user.name;
        if (userLevel) userLevel.textContent = this.user.level;

        // Update XP progress
        this.updateXPProgress();

        // Update stats
        this.updateStats();
    }

    updateXPProgress() {
        const currentLevel = this.data.gamificationLevels.find(l => l.level === this.user.level);
        const nextLevel = this.data.gamificationLevels.find(l => l.level === this.user.level + 1);
        
        let currentXP = this.user.xp;
        let nextLevelXP = nextLevel ? nextLevel.requiredXP : currentLevel.requiredXP;
        let currentLevelXP = currentLevel.requiredXP;
        
        let progress = nextLevel ? ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 100;
        progress = Math.min(100, Math.max(0, progress));
        
        const xpProgress = document.getElementById('xpProgress');
        const currentXPEl = document.getElementById('currentXP');
        const nextLevelXPEl = document.getElementById('nextLevelXP');

        if (xpProgress) xpProgress.style.width = progress + '%';
        if (currentXPEl) currentXPEl.textContent = Math.max(0, currentXP - currentLevelXP);
        if (nextLevelXPEl) nextLevelXPEl.textContent = nextLevel ? (nextLevelXP - currentLevelXP) : 'MAX';
    }

    updateStats() {
        const totalStickers = Object.values(this.user.collections).reduce((sum, collection) => {
            return sum + Object.values(collection.collected || {}).reduce((collSum, count) => collSum + count, 0);
        }, 0);

        const totalStickersEl = document.getElementById('totalStickers');
        const totalTradesEl = document.getElementById('totalTrades');
        const achievementCountEl = document.getElementById('achievementCount');

        if (totalStickersEl) totalStickersEl.textContent = totalStickers;
        if (totalTradesEl) totalTradesEl.textContent = this.user.trades || 0;
        if (achievementCountEl) achievementCountEl.textContent = this.user.achievements.length;
    }

    renderDashboard() {
        console.log('Rendering dashboard');
        this.renderActiveCollections();
        this.renderRecentAchievements();
    }

    renderActiveCollections() {
        const container = document.getElementById('activeCollections');
        if (!container) return;

        const userCollections = Object.keys(this.user.collections);
        
        if (userCollections.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <div class="card__body">
                        <p>Du hast noch keine Sammlungen gestartet. Klicke auf "Neue Sammlung starten" um zu beginnen!</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = userCollections.map(collectionId => {
            const collection = this.data.sampleCollections.find(c => c.id === collectionId);
            if (!collection) return '';
            
            const userCollection = this.user.collections[collectionId];
            const collectedCount = Object.keys(userCollection.collected || {}).length;
            const progress = (collectedCount / collection.totalStickers) * 100;

            return `
                <div class="collection-card" data-collection="${collectionId}" style="cursor: pointer;">
                    <div class="collection-header">
                        <h4 class="collection-title">${collection.name}</h4>
                        <p class="collection-description">${collection.description}</p>
                        <div class="collection-stats">
                            <span>${collectedCount}/${collection.totalStickers} Pickerl</span>
                            <span>${Math.round(progress)}%</span>
                        </div>
                    </div>
                    <div class="collection-progress-card">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">${Math.round(progress)}% vervollständigt</div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click listeners to collection cards
        container.querySelectorAll('.collection-card').forEach(card => {
            card.addEventListener('click', () => {
                const collectionId = card.dataset.collection;
                this.openCollection(collectionId);
            });
        });
    }

    renderRecentAchievements() {
        const container = document.getElementById('recentAchievements');
        if (!container) return;

        const recentAchievements = this.user.achievements.slice(-3);
        
        if (recentAchievements.length === 0) {
            container.innerHTML = `
                <div class="achievement-card">
                    <div class="achievement-icon">🎯</div>
                    <div class="achievement-name">Dein erstes Achievement wartet!</div>
                    <p class="achievement-description">Starte eine Sammlung um dein erstes Achievement zu erhalten.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentAchievements.map(achievementName => {
            const achievement = this.data.achievements.find(a => a.name === achievementName);
            if (!achievement) return '';
            
            return `
                <div class="achievement-card unlocked">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <p class="achievement-description">${achievement.description}</p>
                </div>
            `;
        }).join('');
    }

    renderCollections() {
        console.log('Rendering collections');
        const container = document.getElementById('availableCollections');
        if (!container) return;
        
        container.innerHTML = this.data.sampleCollections.map(collection => {
            const userCollection = this.user.collections[collection.id];
            const isStarted = !!userCollection;
            const collectedCount = isStarted ? Object.keys(userCollection.collected || {}).length : 0;
            const progress = (collectedCount / collection.totalStickers) * 100;

            return `
                <div class="collection-card" data-collection="${collection.id}" data-started="${isStarted}" style="cursor: pointer;">
                    <div class="collection-header">
                        <h4 class="collection-title">${collection.name}</h4>
                        <p class="collection-description">${collection.description}</p>
                        <div class="collection-stats">
                            <span>${collection.totalStickers} Pickerl</span>
                            <span>${isStarted ? 'Gestartet' : 'Neu'}</span>
                        </div>
                    </div>
                    ${isStarted ? `
                        <div class="collection-progress-card">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-text">${collectedCount}/${collection.totalStickers} (${Math.round(progress)}%)</div>
                        </div>
                    ` : `
                        <div class="collection-progress-card">
                            <button class="btn btn--primary btn--full-width">Sammlung starten</button>
                        </div>
                    `}
                </div>
            `;
        }).join('');

        // Add click listeners
        container.querySelectorAll('.collection-card').forEach(card => {
            card.addEventListener('click', () => {
                const collectionId = card.dataset.collection;
                const isStarted = card.dataset.started === 'true';
                
                if (isStarted) {
                    this.openCollection(collectionId);
                } else {
                    this.startCollection(collectionId);
                }
            });
        });
    }

    startCollection(collectionId) {
        console.log('Starting collection:', collectionId);
        if (!this.user.collections[collectionId]) {
            this.user.collections[collectionId] = {
                collected: {},
                started: Date.now()
            };
            this.addXP(50);
            this.checkAchievement('Erste Sammlung');
            this.saveUserData();
            this.showToast('Neue Sammlung gestartet! 🎉');
        }
        this.openCollection(collectionId);
    }

    openCollection(collectionId) {
        console.log('Opening collection:', collectionId);
        const collection = this.data.sampleCollections.find(c => c.id === collectionId);
        if (!collection) return;

        this.currentCollection = collectionId;
        
        // Update UI
        const collectionTitle = document.getElementById('collectionTitle');
        if (collectionTitle) collectionTitle.textContent = collection.name;
        
        this.updateCollectionProgress();
        this.renderStickers();
        this.switchView('collectionDetail');
    }

    updateCollectionProgress() {
        const collection = this.data.sampleCollections.find(c => c.id === this.currentCollection);
        const userCollection = this.user.collections[this.currentCollection];
        const collectedCount = Object.keys(userCollection?.collected || {}).length;
        const progress = (collectedCount / collection.totalStickers) * 100;

        const progressText = document.getElementById('progressText');
        const collectionProgress = document.getElementById('collectionProgress');

        if (progressText) {
            progressText.textContent = `${collectedCount} / ${collection.totalStickers} (${Math.round(progress)}%)`;
        }
        if (collectionProgress) {
            collectionProgress.style.width = progress + '%';
        }
    }

    renderStickers() {
        if (!this.currentCollection) return;

        const collection = this.data.sampleCollections.find(c => c.id === this.currentCollection);
        const userCollection = this.user.collections[this.currentCollection] || { collected: {} };
        const container = document.getElementById('stickersGrid');
        if (!container) return;
        
        let stickers = [];
        for (let i = 1; i <= collection.totalStickers; i++) {
            const count = userCollection.collected[i] || 0;
            
            let status = 'missing';
            if (count >= 1) status = 'collected';
            if (count >= 2) status = 'duplicate';
            
            stickers.push({ number: i, status, count });
        }

        // Apply filters - FIXED: gesammelt shows all collected including duplicates
        if (this.filterMode === 'collected') {
            stickers = stickers.filter(sticker => sticker.count >= 1);
        } else if (this.filterMode === 'missing') {
            stickers = stickers.filter(sticker => sticker.count === 0);
        } else if (this.filterMode === 'duplicates') {
            stickers = stickers.filter(sticker => sticker.count >= 2);
        }

        // Apply search
        const searchInput = document.getElementById('stickerSearch');
        const searchTerm = searchInput ? searchInput.value : '';
        if (searchTerm) {
            stickers = stickers.filter(sticker => 
                sticker.number.toString().includes(searchTerm)
            );
        }

        container.innerHTML = stickers.map(sticker => `
            <div class="sticker-item ${sticker.status}" data-sticker="${sticker.number}" tabindex="0">
                ${sticker.number}
                ${sticker.count >= 2 ? `<span class="sticker-counter">+${sticker.count}</span>` : ''}
                ${sticker.count >= 1 ? `
                    <div class="sticker-controls">
                        <button class="counter-btn counter-btn-minus" data-sticker="${sticker.number}">−</button>
                        <button class="counter-btn counter-btn-plus" data-sticker="${sticker.number}">+</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    toggleSticker(number) {
        this.increaseSticker(number);
    }

    increaseSticker(number) {
        console.log('Increasing sticker:', number);
        if (!this.currentCollection) return;

        const userCollection = this.user.collections[this.currentCollection];
        if (!userCollection.collected) userCollection.collected = {};

        const currentCount = userCollection.collected[number] || 0;
        const newCount = Math.min(currentCount + 1, this.maxStickerCount);

        if (newCount !== currentCount) {
            userCollection.collected[number] = newCount;

            if (newCount === 1) {
                this.addXP(10);
                this.checkCollectionProgress();
                this.showToast(`Pickerl ${number} gesammelt! +10 XP`);
            } else {
                this.showToast(`Pickerl ${number} jetzt ${newCount}x vorhanden!`);
            }

            this.saveUserData();
            this.updateCollectionProgress();
            this.renderStickers();
            this.updateStats();
        }
    }

    decreaseSticker(number) {
        console.log('Decreasing sticker:', number);
        if (!this.currentCollection) return;

        const userCollection = this.user.collections[this.currentCollection];
        if (!userCollection.collected) return;

        const currentCount = userCollection.collected[number] || 0;
        
        if (currentCount > 1) {
            userCollection.collected[number] = currentCount - 1;
            this.showToast(`Pickerl ${number} reduziert auf ${currentCount - 1}x`);
        } else if (currentCount === 1) {
            delete userCollection.collected[number];
            this.showToast(`Pickerl ${number} entfernt`);
        }

        this.saveUserData();
        this.updateCollectionProgress();
        this.renderStickers();
        this.updateStats();
    }

    renderFriends() {
        console.log('Rendering friends with full profiles');
        const container = document.getElementById('friendsList');
        if (!container) return;

        const allFriends = [...this.data.friends];
        
        if (allFriends.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <div class="card__body">
                        <p>Du hast noch keine Freunde hinzugefügt. Lade deine Freunde ein und tauscht gemeinsam Pickerl!</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = allFriends.map(friend => `
            <div class="friend-card" data-friend="${friend.name}" style="cursor: pointer;">
                <div class="friend-info">
                    <div class="friend-avatar">${friend.avatar || '👤'}</div>
                    <div class="friend-details">
                        <h4>${friend.name}</h4>
                        <div class="friend-stats">
                            Level ${friend.level} • ${friend.xp} XP • ${friend.collections.length} Sammlung${friend.collections.length !== 1 ? 'en' : ''} • ${friend.tradableStickers.length} tauschbare Pickerl
                        </div>
                    </div>
                </div>
                <div class="friend-actions">
                    <button class="btn btn--outline btn--sm" data-friend="${friend.name}">
                        🔄 Tauschen
                    </button>
                    <button class="btn btn--secondary btn--sm" data-friend="${friend.name}">
                        👁️ Profil
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewFriendProfile(friendName) {
        console.log('Loading friend profile:', friendName);
        const friend = this.data.friends.find(f => f.name === friendName);
        if (!friend) {
            this.showToast('Profil konnte nicht geladen werden');
            return;
        }

        this.currentFriendProfile = friendName;
        
        // Update profile modal
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileLevel = document.getElementById('profileLevel');
        const profileXP = document.getElementById('profileXP');
        const profileAchievements = document.getElementById('profileAchievements');
        const profileCollections = document.getElementById('profileCollections');
        const profileTradables = document.getElementById('profileTradables');
        
        if (profileAvatar) profileAvatar.textContent = friend.avatar;
        if (profileName) profileName.textContent = friend.name;
        if (profileLevel) profileLevel.textContent = friend.level;
        if (profileXP) profileXP.textContent = friend.xp;
        
        if (profileAchievements) {
            profileAchievements.innerHTML = friend.achievements.map(achievementName => {
                const achievement = this.data.achievements.find(a => a.name === achievementName);
                return `<div class="mini-achievement">${achievement?.icon || '🏆'} ${achievementName}</div>`;
            }).join('');
        }
        
        if (profileCollections) {
            profileCollections.innerHTML = friend.collections.map(collection => {
                const collectionData = this.data.sampleCollections.find(c => c.id === collection.id);
                return `<div class="mini-collection">${collectionData?.name || 'Sammlung'} (${collection.progress}%)</div>`;
            }).join('');
        }
        
        if (profileTradables) {
            profileTradables.innerHTML = friend.tradableStickers.map(tradable => {
                const collectionData = this.data.sampleCollections.find(c => c.id === tradable.collectionId);
                return `
                    <div class="tradable-item">
                        <span>${collectionData?.name || 'Sammlung'}</span>
                        <div class="tradable-numbers">
                            <span class="tradable-number">${tradable.stickerNumber} (${tradable.quantity}x)</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        const friendProfileModal = document.getElementById('friendProfileModal');
        if (friendProfileModal) friendProfileModal.classList.remove('hidden');
    }

    renderTradeSuggestions() {
        console.log('Rendering enhanced trade suggestions');
        const container = document.getElementById('tradeSuggestions');
        if (!container) return;
        
        // Generate intelligent trade suggestions based on duplicates
        const suggestions = this.generateTradeSuggestions();

        container.innerHTML = `
            <h3>Empfohlene Tausche 🔄</h3>
            <div class="suggestions-grid">
                ${suggestions.map(suggestion => `
                    <div class="trade-suggestion">
                        <div class="trade-header">
                            <div class="friend-avatar">${suggestion.friend.avatar || '👤'}</div>
                            <div>
                                <h4>Tausch mit ${suggestion.friend.name}</h4>
                                <p>${suggestion.collectionName}</p>
                            </div>
                        </div>
                        <div class="trade-items">
                            <div class="trade-give">
                                <h5>Du gibst:</h5>
                                <div class="trade-numbers">
                                    ${suggestion.give.map(num => `<span class="trade-number">${num}</span>`).join('')}
                                </div>
                            </div>
                            <div class="trade-arrow">⟷</div>
                            <div class="trade-get">
                                <h5>Du bekommst:</h5>
                                <div class="trade-numbers">
                                    ${suggestion.get.map(num => `<span class="trade-number">${num}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                        <button class="btn btn--primary btn--full-width" data-friend="${suggestion.friend.name}">
                            Tausch vorschlagen
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateTradeSuggestions() {
        const suggestions = [];
        
        // Find user's duplicates and friends' needs
        Object.keys(this.user.collections).forEach(collectionId => {
            const collection = this.data.sampleCollections.find(c => c.id === collectionId);
            const userCollection = this.user.collections[collectionId];
            
            // Find user's duplicates
            const userDuplicates = Object.entries(userCollection.collected || {})
                .filter(([num, count]) => count >= 2)
                .map(([num]) => parseInt(num));
            
            if (userDuplicates.length === 0) return;
            
            // Check each friend
            this.data.friends.forEach(friend => {
                const friendCollection = friend.collections.find(c => c.id === collectionId);
                if (!friendCollection) return;
                
                const friendTradables = friend.tradableStickers
                    .filter(t => t.collectionId === collectionId)
                    .map(t => t.stickerNumber);
                
                if (friendTradables.length === 0) return;
                
                // Create suggestion
                suggestions.push({
                    friend: friend,
                    collectionName: collection.name,
                    give: userDuplicates.slice(0, 3),
                    get: friendTradables.slice(0, 3)
                });
            });
        });
        
        return suggestions.slice(0, 4); // Limit to 4 suggestions
    }

    renderSettings() {
        console.log('Rendering settings page');
        
        // Update avatar selector
        setTimeout(() => {
            const avatarSelector = document.getElementById('avatarSelector');
            if (avatarSelector) {
                avatarSelector.querySelectorAll('.avatar-option').forEach(option => {
                    option.classList.toggle('selected', option.dataset.avatar === this.user.avatar);
                });
            }
            
            // Update form fields
            const settingsName = document.getElementById('settingsName');
            const soundToggle = document.getElementById('soundToggle');
            const notificationToggle = document.getElementById('notificationToggle');
            const themeSelect = document.getElementById('themeSelect');
            
            if (settingsName) settingsName.value = this.user.name;
            if (soundToggle) soundToggle.checked = this.settings.soundEffects;
            if (notificationToggle) notificationToggle.checked = this.settings.notifications;
            if (themeSelect) themeSelect.value = this.settings.theme;
        }, 100);
    }

    saveProfileSettings() {
        const settingsName = document.getElementById('settingsName');
        const selectedAvatar = document.querySelector('#avatarSelector .avatar-option.selected');
        
        if (settingsName?.value.trim()) {
            this.user.name = settingsName.value.trim();
        }
        
        if (selectedAvatar) {
            this.user.avatar = selectedAvatar.dataset.avatar;
        }
        
        this.saveUserData();
        this.updateUI();
        this.showToast('Profil gespeichert! ✨');
    }

    resetAllData() {
        localStorage.removeItem('pickerl-sammler-user');
        localStorage.removeItem('pickerl-sammler-settings');
        location.reload();
    }

    showConfirmation(title, message, action) {
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmModal = document.getElementById('confirmationModal');
        
        if (confirmTitle) confirmTitle.textContent = title;
        if (confirmMessage) confirmMessage.textContent = message;
        if (confirmModal) confirmModal.classList.remove('hidden');
        
        this.pendingConfirmAction = action;
    }

    addXP(amount) {
        this.user.xp += amount;
        this.checkLevelUp();
        this.saveUserData();
        this.updateXPProgress();
    }

    checkLevelUp() {
        const nextLevel = this.data.gamificationLevels.find(l => 
            l.level > this.user.level && this.user.xp >= l.requiredXP
        );
        
        if (nextLevel) {
            this.user.level = nextLevel.level;
            this.showToast(`🎉 Level ${nextLevel.level} erreicht! Du bist jetzt ${nextLevel.title}!`);
            this.createConfetti();
        }
    }

    checkAchievement(achievementName) {
        if (!this.user.achievements.includes(achievementName)) {
            this.user.achievements.push(achievementName);
            this.showAchievementModal(achievementName);
            this.addXP(100);
        }
    }

    checkCollectionProgress() {
        const collection = this.data.sampleCollections.find(c => c.id === this.currentCollection);
        const userCollection = this.user.collections[this.currentCollection];
        const collectedCount = Object.keys(userCollection.collected || {}).length;
        const totalStickers = Object.values(userCollection.collected || {}).reduce((sum, count) => sum + count, 0);

        if (totalStickers >= 50) {
            this.checkAchievement('Fleißiger Sammler');
        }
        
        if (collectedCount === collection.totalStickers) {
            this.checkAchievement('Komplettierungs-King');
            this.createConfetti();
        }
    }

    showAchievementModal(achievementName) {
        const achievement = this.data.achievements.find(a => a.name === achievementName);
        if (!achievement) return;

        const achievementIcon = document.getElementById('achievementIcon');
        const achievementNameEl = document.getElementById('achievementName');
        const achievementDescription = document.getElementById('achievementDescription');
        const achievementModal = document.getElementById('achievementModal');

        if (achievementIcon) achievementIcon.textContent = achievement.icon;
        if (achievementNameEl) achievementNameEl.textContent = achievement.name;
        if (achievementDescription) achievementDescription.textContent = achievement.description;
        if (achievementModal) achievementModal.classList.remove('hidden');
    }

    createConfetti() {
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-particle';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 2000);
            }, i * 50);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-btn-primary-text);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
            font-weight: var(--font-weight-medium);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    shareProgress() {
        const collection = this.data.sampleCollections.find(c => c.id === this.currentCollection);
        const userCollection = this.user.collections[this.currentCollection];
        const collectedCount = Object.keys(userCollection?.collected || {}).length;
        const progress = Math.round((collectedCount / collection.totalStickers) * 100);

        const message = `🎉 Ich sammle gerade "${collection.name}" und habe schon ${collectedCount}/${collection.totalStickers} Pickerl (${progress}%)! 📚✨`;

        if (navigator.share) {
            navigator.share({
                title: 'Pickerl-Sammler',
                text: message
            });
        } else {
            navigator.clipboard?.writeText(message);
            this.showToast('Fortschritt kopiert! 📋');
        }

        this.user.sharesCount = (this.user.sharesCount || 0) + 1;
        if (this.user.sharesCount >= 10) {
            this.checkAchievement('Social Star');
        }
        this.saveUserData();
    }

    showInviteModal() {
        const inviteModal = document.getElementById('inviteModal');
        if (inviteModal) inviteModal.classList.remove('hidden');
    }

    proposeTrade(friendName) {
        const message = `🔄 Hey! Möchtest du Pickerl mit mir tauschen? Ich sammle gerade und hätte ein paar Doppelte für dich! 😊`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Pickerl-Tausch Anfrage',
                text: message
            });
        } else {
            this.showToast('Tausch-Nachricht bereit! 💬');
        }

        this.user.trades = (this.user.trades || 0) + 1;
        if (this.user.trades >= 10) {
            this.checkAchievement('Tausch-Profi');
        }
        this.saveUserData();
        this.updateStats();
    }

    addBulkStickers() {
        const input = document.getElementById('bulkInput');
        if (!input) return;

        const inputValue = input.value.trim();
        if (!inputValue) return;

        const ranges = inputValue.split(',').map(s => s.trim());
        let addedCount = 0;

        ranges.forEach(range => {
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(n => parseInt(n.trim()));
                if (start && end && start <= end) {
                    for (let i = start; i <= end; i++) {
                        if (this.addSingleSticker(i)) addedCount++;
                    }
                }
            } else {
                const num = parseInt(range);
                if (num && this.addSingleSticker(num)) addedCount++;
            }
        });

        input.value = '';
        const panel = document.getElementById('bulkModePanel');
        if (panel) panel.classList.add('hidden');
        
        if (addedCount > 0) {
            this.showToast(`${addedCount} Pickerl hinzugefügt! 🎉`);
            this.updateCollectionProgress();
            this.renderStickers();
            this.updateStats();
        }
    }

    addSingleSticker(number) {
        if (!this.currentCollection) return false;

        const collection = this.data.sampleCollections.find(c => c.id === this.currentCollection);
        if (number < 1 || number > collection.totalStickers) return false;

        const userCollection = this.user.collections[this.currentCollection];
        if (!userCollection.collected) userCollection.collected = {};

        const currentCount = userCollection.collected[number] || 0;
        if (currentCount === 0) {
            userCollection.collected[number] = 1;
            this.addXP(10);
            this.saveUserData();
            return true;
        }
        return false;
    }

    searchStickers(searchTerm) {
        this.renderStickers();
    }
}

// Global functions for onclick handlers
function shareAchievement() {
    const achievementNameEl = document.getElementById('achievementName');
    const achievementName = achievementNameEl ? achievementNameEl.textContent : '';
    const message = `🏆 Ich habe gerade das Achievement "${achievementName}" in Pickerl-Sammler erreicht! 🎉`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Achievement erreicht!',
            text: message
        });
    } else {
        navigator.clipboard?.writeText(message);
        if (window.app) {
            app.showToast('Achievement-Nachricht kopiert! 📋');
        }
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app with bug fixes...');
    app = new PickerlSammlerApp();
    app.init();
});