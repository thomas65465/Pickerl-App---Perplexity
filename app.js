// ==============================================
// PICKERL-SAMMLER APP - SUPABASE INTEGRATION
// ==============================================

class PickerlSammlerApp {
    constructor() {
        this.currentUser = null;
        this.userCollections = {};
        this.currentCollection = null;
        this.friends = [];
        
        // Warten bis Supabase geladen ist
        this.initializeApp();
    }
    
    async initializeApp() {
        // Warten bis DOM und Supabase bereit sind
        if (typeof window.supabase === 'undefined') {
            setTimeout(() => this.initializeApp(), 100);
            return;
        }
        
        console.log('App wird initialisiert...');
        
        // Event Listeners setzen
        this.setupEventListeners();
        
        // Versuche bestehenden User zu laden
        await this.loadCurrentUser();
        
        // UI entsprechend anzeigen
        this.updateUI();
        
        console.log('App erfolgreich initialisiert');
    }
    
    async loadCurrentUser() {
        this.currentUser = await getCurrentUser();
        
        if (this.currentUser) {
            console.log('User geladen:', this.currentUser);
            await this.loadUserData();
            this.hideOnboardingModal();
        } else {
            console.log('Kein User gefunden - Onboarding anzeigen');
            this.showOnboardingModal();
        }
    }
    
    async loadUserData() {
        if (!this.currentUser) return;
        
        // Sammlungen laden
        const collections = await loadAllCollections();
        this.userCollections = {};
        
        collections.forEach(collection => {
            this.userCollections[collection.collection_type] = collection.stickers;
        });
        
        // Freunde laden  
        this.friends = await loadFriends();
        
        console.log('User-Daten geladen:', {
            collections: this.userCollections,
            friends: this.friends
        });
    }
    
    setupEventListeners() {
        // Onboarding
        const startBtn = document.getElementById('startAdventure');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.handleOnboardingComplete());
        }
        
        // Avatar-Auswahl
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectAvatar(e.target.dataset.avatar));
        });
        
        // Navigation Buttons
        const newCollectionBtn = document.getElementById('newCollectionBtn');
        const tradeCenterBtn = document.getElementById('tradeCenterBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const friendsBtn = document.getElementById('friendsBtn');
        
        if (newCollectionBtn) {
            newCollectionBtn.addEventListener('click', () => this.showCollectionsView());
        }
        if (tradeCenterBtn) {
            tradeCenterBtn.addEventListener('click', () => this.showTradeCenterView());
        }
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsView());
        }
        if (friendsBtn) {
            friendsBtn.addEventListener('click', () => this.showFriendsView());
        }
        
        // Back Buttons
        const backToDashboard = document.getElementById('backToDashboard');
        const backToCollections = document.getElementById('backToCollections');
        const backToDashboardFromFriends = document.getElementById('backToDashboardFromFriends');
        const backToDashboardFromTrade = document.getElementById('backToDashboardFromTrade');
        const backToDashboardFromSettings = document.getElementById('backToDashboardFromSettings');
        
        if (backToDashboard) {
            backToDashboard.addEventListener('click', () => this.showDashboardView());
        }
        if (backToCollections) {
            backToCollections.addEventListener('click', () => this.showCollectionsView());
        }
        if (backToDashboardFromFriends) {
            backToDashboardFromFriends.addEventListener('click', () => this.showDashboardView());
        }
        if (backToDashboardFromTrade) {
            backToDashboardFromTrade.addEventListener('click', () => this.showDashboardView());
        }
        if (backToDashboardFromSettings) {
            backToDashboardFromSettings.addEventListener('click', () => this.showDashboardView());
        }
        
        // Bottom Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
        
        // Profile Settings
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfileSettings());
        }
        
        console.log('Event Listeners eingerichtet');
    }
    
    async handleOnboardingComplete() {
        const nameInput = document.getElementById('playerName');
        const selectedAvatar = document.querySelector('.avatar-option.selected');
        
        if (!nameInput?.value || !selectedAvatar) {
            alert('Bitte wähle einen Namen und Avatar!');
            return;
        }
        
        const name = nameInput.value.trim();
        const avatar = selectedAvatar.dataset.avatar;
        
        console.log('Erstelle User:', name, avatar);
        
        // User in Supabase erstellen oder laden
        this.currentUser = await createOrLoadUser(name, avatar);
        
        if (this.currentUser) {
            await this.loadUserData();
            this.hideOnboardingModal();
            this.updateUI();
            console.log('Onboarding abgeschlossen für:', this.currentUser);
        } else {
            alert('Fehler beim Erstellen des Accounts. Bitte versuche es erneut.');
        }
    }
    
    selectAvatar(avatar) {
        // Alle Avatar-Optionen deselektieren
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Gewählten Avatar markieren
        document.querySelector(`[data-avatar="${avatar}"]`)?.classList.add('selected');
    }
    
    async saveProfileSettings() {
        if (!this.currentUser) return;
        
        const nameInput = document.getElementById('settingsName');
        const selectedAvatar = document.querySelector('#avatarSelector .avatar-option.selected');
        
        const updates = {};
        
        if (nameInput?.value && nameInput.value !== this.currentUser.name) {
            updates.name = nameInput.value.trim();
        }
        
        if (selectedAvatar && selectedAvatar.dataset.avatar !== this.currentUser.avatar) {
            updates.avatar = selectedAvatar.dataset.avatar;
        }
        
        if (Object.keys(updates).length > 0) {
            const updatedUser = await updateUser(updates);
            if (updatedUser) {
                this.currentUser = updatedUser;
                this.updateUI();
                alert('Profil erfolgreich gespeichert!');
            } else {
                alert('Fehler beim Speichern des Profils.');
            }
        }
    }
    
    // View Switching
    switchView(viewName) {
        switch(viewName) {
            case 'dashboard':
                this.showDashboardView();
                break;
            case 'collections':
                this.showCollectionsView();
                break;
            case 'tradeCenter':
                this.showTradeCenterView();
                break;
            case 'friends':
                this.showFriendsView();
                break;
        }
    }
    
    showDashboardView() {
        this.hideAllViews();
        document.getElementById('dashboardView')?.classList.add('active');
        this.updateActiveNavItem('dashboard');
    }
    
    showCollectionsView() {
        this.hideAllViews();
        document.getElementById('collectionsView')?.classList.add('active');
        this.updateActiveNavItem('collections');
    }
    
    showTradeCenterView() {
        this.hideAllViews();
        document.getElementById('tradeCenterView')?.classList.add('active');
        this.updateActiveNavItem('tradeCenter');
    }
    
    showFriendsView() {
        this.hideAllViews();
        document.getElementById('friendsView')?.classList.add('active');
        this.updateActiveNavItem('friends');
    }
    
    showSettingsView() {
        this.hideAllViews();
        document.getElementById('settingsView')?.classList.add('active');
        // Settings in aktuellen Name und Avatar laden
        const nameInput = document.getElementById('settingsName');
        if (nameInput && this.currentUser) {
            nameInput.value = this.currentUser.name;
        }
    }
    
    hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
    }
    
    updateActiveNavItem(activeView) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-view="${activeView}"]`)?.classList.add('active');
    }
    
    updateUI() {
        this.updateUserInfo();
        this.updateStats();
        this.updateCollectionsUI();
        this.updateFriendsUI();
    }
    
    updateUserInfo() {
        if (!this.currentUser) return;
        
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const userLevel = document.getElementById('userLevel');
        const welcomeName = document.getElementById('welcomeName');
        const currentXP = document.getElementById('currentXP');
        const nextLevelXP = document.getElementById('nextLevelXP');
        const xpProgress = document.getElementById('xpProgress');
        
        if (userName) userName.textContent = this.currentUser.name;
        if (userAvatar) userAvatar.textContent = this.currentUser.avatar;
        if (userLevel) userLevel.textContent = this.currentUser.level;
        if (welcomeName) welcomeName.textContent = this.currentUser.name;
        
        // XP Progress Bar
        const currentXPValue = this.currentUser.xp || 0;
        const nextLevelXPValue = this.currentUser.level * 100;
        const progressPercent = ((currentXPValue % 100) / 100) * 100;
        
        if (currentXP) currentXP.textContent = currentXPValue;
        if (nextLevelXP) nextLevelXP.textContent = nextLevelXPValue;
        if (xpProgress) xpProgress.style.width = `${progressPercent}%`;
    }
    
    updateStats() {
        const totalStickers = document.getElementById('totalStickers');
        const totalTrades = document.getElementById('totalTrades');
        const achievementCount = document.getElementById('achievementCount');
        
        // Gesammelte Sticker zählen
        let stickerCount = 0;
        Object.values(this.userCollections).forEach(collection => {
            stickerCount += Object.values(collection).filter(s => s.collected).length;
        });
        
        if (totalStickers) totalStickers.textContent = stickerCount;
        if (totalTrades) totalTrades.textContent = '0'; // TODO: Tausch-System
        if (achievementCount) achievementCount.textContent = Math.floor(stickerCount / 10); // Beispiel
    }
    
    updateCollectionsUI() {
        // Collections UI aktualisieren
        const activeCollections = document.getElementById('activeCollections');
        if (activeCollections) {
            activeCollections.innerHTML = '';
            
            Object.keys(this.userCollections).forEach(collectionType => {
                const progress = this.calculateProgress(collectionType);
                const collectionCard = document.createElement('div');
                collectionCard.className = 'collection-card';
                collectionCard.innerHTML = `
                    <h4>${collectionType}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <p>${progress}% abgeschlossen</p>
                `;
                activeCollections.appendChild(collectionCard);
            });
        }
    }
    
    updateFriendsUI() {
        // Freunde UI aktualisieren
        const friendsList = document.getElementById('friendsList');
        if (!friendsList) return;
        
        friendsList.innerHTML = '';
        
        this.friends.forEach(friendship => {
            const friend = friendship.friend_user;
            const friendElement = document.createElement('div');
            friendElement.className = 'friend-item';
            friendElement.innerHTML = `
                <div class="friend-avatar">${friend.avatar}</div>
                <div class="friend-info">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-level">Level ${friend.level}</div>
                </div>
            `;
            
            friendsList.appendChild(friendElement);
        });
    }
    
    calculateProgress(collectionType) {
        const collection = this.userCollections[collectionType];
        if (!collection) return 0;
        
        const collected = Object.values(collection).filter(sticker => sticker.collected).length;
        const total = Object.keys(collection).length;
        
        return total > 0 ? Math.round((collected / total) * 100) : 0;
    }
    
    showOnboardingModal() {
        const modal = document.getElementById('onboardingModal');
        const app = document.getElementById('app');
        
        if (modal) modal.style.display = 'flex';
        if (app) app.classList.add('hidden');
    }
    
    hideOnboardingModal() {
        const modal = document.getElementById('onboardingModal');
        const app = document.getElementById('app');
        
        if (modal) modal.style.display = 'none';
        if (app) app.classList.remove('hidden');
    }
}

// App starten
let app;
document.addEventListener('DOMContentLoaded', function() {
    // Kurz warten damit Supabase sicher geladen ist
    setTimeout(() => {
        app = new PickerlSammlerApp();
        window.app = app; // Für Console-Zugriff
        console.log('✅ Pickerl-Sammler App gestartet!');
    }, 500);
});

// CSS für bessere Interaktionen
const style = document.createElement('style');
style.textContent = `
    .avatar-option {
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        border-radius: 8px;
        padding: 8px;
    }
    
    .avatar-option:hover {
        background-color: #f0f0f0;
        transform: scale(1.05);
    }
    
    .avatar-option.selected {
        border: 3px solid #33808a;
        background-color: #e8f5f6;
        transform: scale(1.1);
    }
    
    .collection-card {
        background: white;
        border-radius: 8px;
        padding: 16px;
        margin: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin: 8px 0;
    }
    
    .progress-fill {
        height: 100%;
        background-color: #33808a;
        transition: width 0.3s ease;
    }
    
    .friend-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .friend-avatar {
        font-size: 32px;
        margin-right: 12px;
    }
    
    .friend-info {
        flex: 1;
    }
    
    .friend-name {
        font-weight: bold;
        margin-bottom: 4px;
    }
    
    .friend-level {
        color: #666;
        font-size: 14px;
    }
`;
document.head.appendChild(style);
