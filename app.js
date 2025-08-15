// Pickerl-Sammler App - JavaScript
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
                },
                {
                    "id": "panini-fussball-2024",
                    "name": "Panini Fußball EM 2024",
                    "totalStickers": 728,
                    "description": "Alle Spieler der Europameisterschaft",
                    "theme": "football",
                    "categories": [
                        {"name": "Österreich", "count": 25},
                        {"name": "Deutschland", "count": 25},
                        {"name": "Andere Teams", "count": 678}
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
            friends: [
                {"name": "Anna", "level": 12, "collections": 2, "tradableStickers": 45, "avatar": "🐻"},
                {"name": "Max", "level": 8, "collections": 1, "tradableStickers": 23, "avatar": "🦁"},
                {"name": "Emma", "level": 15, "collections": 3, "tradableStickers": 67, "avatar": "🐨"}
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
        this.currentView = 'dashboard';
        this.currentCollection = null;
        this.filterMode = 'all';
    }

    init() {
        console.log('Initializing app...');
        this.setupEventListeners();
        
        // Check onboarding after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.checkOnboarding();
        }, 50);
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

    saveUserData() {
        try {
            localStorage.setItem('pickerl-sammler-user', JSON.stringify(this.user));
            console.log('User data saved');
        } catch (e) {
            console.log('Failed to save user data:', e);
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

        // Onboarding
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        const startButton = document.getElementById('startAdventure');
        if (startButton) {
            startButton.addEventListener('click', () => {
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

        // Navigation - Bottom nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                console.log('Nav clicked:', view);
                this.switchView(view);
            });
        });

        // Quick action buttons - use delegation for better reliability
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // New Collection Button
            if (target.id === 'newCollectionBtn') {
                e.preventDefault();
                console.log('New collection button clicked');
                this.switchView('collections');
                return;
            }
            
            // Trade Center Button
            if (target.id === 'tradeCenterBtn') {
                e.preventDefault();
                console.log('Trade center button clicked');
                this.switchView('tradeCenter');
                return;
            }
            
            // Friends Button (header)
            if (target.id === 'friendsBtn') {
                e.preventDefault();
                console.log('Friends button clicked');
                this.switchView('friends');
                return;
            }

            // Back buttons
            if (target.id === 'backToDashboard' || target.id === 'backToDashboardFromFriends' || target.id === 'backToDashboardFromTrade') {
                e.preventDefault();
                this.switchView('dashboard');
                return;
            }

            if (target.id === 'backToCollections') {
                e.preventDefault();
                this.switchView('collections');
                return;
            }

            // Share collection button
            if (target.id === 'shareCollectionBtn') {
                e.preventDefault();
                this.shareProgress();
                return;
            }

            // Invite friend button
            if (target.id === 'inviteFriendBtn') {
                e.preventDefault();
                this.showInviteModal();
                return;
            }

            // Bulk mode buttons
            if (target.id === 'bulkModeBtn') {
                e.preventDefault();
                const panel = document.getElementById('bulkModePanel');
                if (panel) panel.classList.toggle('hidden');
                return;
            }

            if (target.id === 'cancelBulk') {
                e.preventDefault();
                const panel = document.getElementById('bulkModePanel');
                const input = document.getElementById('bulkInput');
                if (panel) panel.classList.add('hidden');
                if (input) input.value = '';
                return;
            }

            if (target.id === 'addBulkStickers') {
                e.preventDefault();
                this.addBulkStickers();
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

            // Modal close buttons
            if (target.classList.contains('modal-close')) {
                target.closest('.modal').classList.add('hidden');
                return;
            }
        });

        // Search functionality
        const stickerSearch = document.getElementById('stickerSearch');
        if (stickerSearch) {
            stickerSearch.addEventListener('input', (e) => {
                this.searchStickers(e.target.value);
            });
        }

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    switchView(viewName) {
        console.log('Switching to view:', viewName);
        
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
            console.log('View activated:', viewName);
        } else {
            console.error('View not found:', viewName + 'View');
        }
        
        this.currentView = viewName;

        // Load view-specific content
        setTimeout(() => {
            if (viewName === 'collections') {
                this.renderCollections();
            } else if (viewName === 'friends') {
                this.renderFriends();
            } else if (viewName === 'tradeCenter') {
                this.renderTradeSuggestions();
            } else if (viewName === 'dashboard') {
                this.renderDashboard();
            }
        }, 10);
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
            return sum + Object.keys(collection.collected || {}).length;
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
            const collected = Object.keys(userCollection.collected || {}).length;
            const progress = (collected / collection.totalStickers) * 100;

            return `
                <div class="collection-card" onclick="app.openCollection('${collectionId}')">
                    <div class="collection-header">
                        <h4 class="collection-title">${collection.name}</h4>
                        <p class="collection-description">${collection.description}</p>
                        <div class="collection-stats">
                            <span>${collected}/${collection.totalStickers} Pickerl</span>
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
            const collected = isStarted ? Object.keys(userCollection.collected || {}).length : 0;
            const progress = (collected / collection.totalStickers) * 100;

            return `
                <div class="collection-card" onclick="app.${isStarted ? 'openCollection' : 'startCollection'}('${collection.id}')">
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
                            <div class="progress-text">${collected}/${collection.totalStickers} (${Math.round(progress)}%)</div>
                        </div>
                    ` : `
                        <div class="collection-progress-card">
                            <button class="btn btn--primary btn--full-width">Sammlung starten</button>
                        </div>
                    `}
                </div>
            `;
        }).join('');
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
        const collected = Object.keys(userCollection?.collected || {}).length;
        const progress = (collected / collection.totalStickers) * 100;

        const progressText = document.getElementById('progressText');
        const collectionProgress = document.getElementById('collectionProgress');

        if (progressText) {
            progressText.textContent = `${collected} / ${collection.totalStickers} (${Math.round(progress)}%)`;
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
            if (count === 1) status = 'collected';
            if (count > 1) status = 'duplicate';
            
            stickers.push({ number: i, status, count });
        }

        // Apply filters
        if (this.filterMode !== 'all') {
            stickers = stickers.filter(sticker => sticker.status === this.filterMode);
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
            <div class="sticker-item ${sticker.status}" onclick="app.toggleSticker(${sticker.number})">
                ${sticker.number}
            </div>
        `).join('');
    }

    toggleSticker(number) {
        console.log('Toggling sticker:', number);
        if (!this.currentCollection) return;

        const userCollection = this.user.collections[this.currentCollection];
        if (!userCollection.collected) userCollection.collected = {};

        const currentCount = userCollection.collected[number] || 0;
        const newCount = currentCount + 1;

        if (newCount > 3) {
            delete userCollection.collected[number];
        } else {
            userCollection.collected[number] = newCount;
        }

        if (newCount === 1) {
            this.addXP(10);
            this.checkCollectionProgress();
            this.showToast(`Pickerl ${number} gesammelt! +10 XP`);
        } else if (newCount === 2) {
            this.showToast(`Pickerl ${number} ist jetzt doppelt!`);
        }

        this.saveUserData();
        this.updateCollectionProgress();
        this.renderStickers();
        this.updateStats();
    }

    renderFriends() {
        console.log('Rendering friends');
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
            <div class="friend-card">
                <div class="friend-info">
                    <div class="friend-avatar">${friend.avatar || '👤'}</div>
                    <div class="friend-details">
                        <h4>${friend.name}</h4>
                        <div class="friend-stats">
                            Level ${friend.level} • ${friend.collections} Sammlungen • ${friend.tradableStickers} tauschbare Pickerl
                        </div>
                    </div>
                </div>
                <div class="friend-actions">
                    <button class="btn btn--outline btn--sm" onclick="app.proposeTrade('${friend.name}')">
                        🔄 Tauschen
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="app.viewFriendProfile('${friend.name}')">
                        👁️ Profil
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderTradeSuggestions() {
        console.log('Rendering trade suggestions');
        const container = document.getElementById('tradeSuggestions');
        if (!container) return;
        
        // Generate example trade suggestions
        const suggestions = [
            {
                friend: 'Anna',
                give: [23, 45, 67],
                get: [12, 34, 56],
                collection: 'BILLA Wald Sammlung 2024'
            },
            {
                friend: 'Max',
                give: [89, 90],
                get: [78, 79, 80],
                collection: 'SPAR Oskar & Bo Abenteuer'
            }
        ];

        container.innerHTML = `
            <h3>Empfohlene Tausche 🔄</h3>
            <div class="suggestions-grid">
                ${suggestions.map(suggestion => `
                    <div class="trade-suggestion">
                        <div class="trade-header">
                            <div class="friend-avatar">${this.data.friends.find(f => f.name === suggestion.friend)?.avatar || '👤'}</div>
                            <div>
                                <h4>Tausch mit ${suggestion.friend}</h4>
                                <p>${suggestion.collection}</p>
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
                        <button class="btn btn--primary btn--full-width" onclick="app.proposeTrade('${suggestion.friend}')">
                            Tausch vorschlagen
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
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
        const collected = Object.keys(userCollection.collected || {}).length;

        if (collected === 50) {
            this.checkAchievement('Fleißiger Sammler');
        }
        
        if (collected === collection.totalStickers) {
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
        const colors = ['#218085', '#50b8c6', '#ff5459', '#e6815f'];
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
        const collected = Object.keys(userCollection?.collected || {}).length;
        const progress = Math.round((collected / collection.totalStickers) * 100);

        const message = `🎉 Ich sammle gerade "${collection.name}" und habe schon ${collected}/${collection.totalStickers} Pickerl (${progress}%)! 📚✨`;

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

    viewFriendProfile(friendName) {
        this.showToast(`Profil von ${friendName} wird geladen... 👤`);
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
    console.log('DOM loaded, initializing app...');
    app = new PickerlSammlerApp();
    app.init();
});

// Add styles for animations
const styles = document.createElement('style');
styles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styles);