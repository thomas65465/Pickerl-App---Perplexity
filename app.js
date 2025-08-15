// ==============================================
// ANGEPASSTE APP.JS - SUPABASE INTEGRATION
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
        
        // Sticker sammeln
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sticker-item') && !e.target.classList.contains('collected')) {
                this.collectSticker(e.target);
            }
        });
        
        // Freund hinzufügen (falls Button existiert)
        const addFriendBtn = document.getElementById('addFriendBtn');
        if (addFriendBtn) {
            addFriendBtn.addEventListener('click', () => this.showAddFriendDialog());
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
        document.querySelector(`[data-avatar="${avatar}"]`).classList.add('selected');
    }
    
    async collectSticker(stickerElement) {
        if (!this.currentUser) {
            alert('Bitte melde dich erst an!');
            return;
        }
        
        const stickerId = stickerElement.dataset.stickerId;
        const collectionType = stickerElement.dataset.collection || 'default';
        
        // Animation hinzufügen
        stickerElement.classList.add('collecting');
        
        // Sticker in lokalen Daten markieren
        if (!this.userCollections[collectionType]) {
            this.userCollections[collectionType] = {};
        }
        
        this.userCollections[collectionType][stickerId] = {
            collected: true,
            date: new Date().toISOString()
        };
        
        // Fortschritt berechnen
        const progress = this.calculateProgress(collectionType);
        
        // In Supabase speichern
        const saved = await saveCollection(
            collectionType, 
            this.userCollections[collectionType], 
            progress
        );
        
        if (saved) {
            // XP berechnen und User updaten
            const xpGain = 10; // 10 XP pro Sticker
            const newXP = this.currentUser.xp + xpGain;
            const newLevel = Math.floor(newXP / 100) + 1;
            
            this.currentUser = await updateUser({
                xp: newXP,
                level: newLevel
            });
            
            // UI aktualisieren
            stickerElement.classList.remove('collecting');
            stickerElement.classList.add('collected');
            
            this.updateUI();
            this.showStickerCollectedFeedback(xpGain);
            
            console.log('Sticker gesammelt:', stickerId, 'XP:', xpGain);
        } else {
            // Fehler beim Speichern
            stickerElement.classList.remove('collecting');
            alert('Fehler beim Speichern. Bitte versuche es erneut.');
            
            // Lokale Änderung rückgängig machen
            delete this.userCollections[collectionType][stickerId];
        }
    }
    
    calculateProgress(collectionType) {
        const collection = this.userCollections[collectionType];
        if (!collection) return 0;
        
        const collected = Object.values(collection).filter(sticker => sticker.collected).length;
        const total = Object.keys(collection).length;
        
        return total > 0 ? Math.round((collected / total) * 100) : 0;
    }
    
    async addFriend(friendName) {
        if (!this.currentUser) return false;
        
        const success = await addFriend(friendName);
        
        if (success) {
            // Freundesliste neu laden
            this.friends = await loadFriends();
            this.updateFriendsUI();
            return true;
        }
        
        return false;
    }
    
    showStickerCollectedFeedback(xpGain) {
        // Einfaches Feedback (kann später verschönert werden)
        const feedback = document.createElement('div');
        feedback.className = 'xp-feedback';
        feedback.textContent = `+${xpGain} XP!`;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 2000);
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
        // Sammlungs-UI aktualisieren (abhängig von deinem HTML-Aufbau)
        Object.keys(this.userCollections).forEach(collectionType => {
            const progress = this.calculateProgress(collectionType);
            const progressBar = document.querySelector(`[data-collection="${collectionType}"] .progress-bar`);
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        });
    }
    
    updateFriendsUI() {
        // Freunde-UI aktualisieren (falls vorhanden)
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
    
    showAddFriendDialog() {
        const friendName = prompt('Gib den Namen deines Freundes ein:');
        if (friendName) {
            this.addFriend(friendName.trim()).then(success => {
                if (success) {
                    alert('Freund erfolgreich hinzugefügt!');
                } else {
                    alert('Freund konnte nicht hinzugefügt werden. Überprüfe den Namen.');
                }
            });
        }
    }
}

// App starten
let app;
document.addEventListener('DOMContentLoaded', function() {
    // Kurz warten damit Supabase sicher geladen ist
    setTimeout(() => {
        app = new PickerlSammlerApp();
        window.app = app; // Für Console-Zugriff
    }, 500);
});

// CSS für XP-Feedback Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .avatar-option.selected {
        border: 3px solid #33808a;
        background-color: #e8f5f6;
        transform: scale(1.1);
    }
    
    .sticker-item.collecting {
        animation: pulse 0.5s ease-in-out;
    }
    
    .sticker-item.collected {
        opacity: 0.6;
        filter: grayscale(0.5);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
