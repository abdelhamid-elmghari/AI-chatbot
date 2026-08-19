// localstorage - Handles local storage operations

const STORAGE_KEY = "humanityCheck_chats";

export function saveChat(messages) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error("Failed to save chat:", error);
    }
}

export function loadChat() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to load chat:", error);
        return [];
    }
}

export function clearChat() {
    localStorage.removeItem(STORAGE_KEY);
}

export function addMessage(message) {
    const messages = loadChat();
    messages.push({
        ...message,
        timestamp: Date.now()
    });
    saveChat(messages);
}