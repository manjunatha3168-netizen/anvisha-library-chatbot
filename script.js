// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSwFIZppWBQLjHn4ZDRk0aYZ_n9qrgroE",
    authDomain: "kcw-library-bot.firebaseapp.com",
    projectId: "kcw-library-bot",
    databaseURL: "https://kcw-library-bot-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let libraryData = [];

// Fetch Knowledge Base
db.ref('library_knowledge').on('value', snapshot => {
    const data = snapshot.val();
    if (data) {
        libraryData = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
        renderFAQList();
    }
});

// Message Handling
function appendMsg(content, type) {
    const chat = document.getElementById("chat");
    const row = document.createElement("div");
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    row.className = `msg-row ${type}-row`;
    row.innerHTML = type === 'bot' 
        ? `<div class="bot-avatar">A</div><div class="bot">${content}<span class="timestamp">${time}</span></div>`
        : `<div class="user">${content}<span class="timestamp">${time}</span></div>`;
    
    chat.appendChild(row);
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
}

function botResponse(content) {
    const typing = document.getElementById("typing");
    typing.style.display = "block";
    const delay = Math.min(Math.max(content.length * 12, 600), 1800);
    
    setTimeout(() => {
        typing.style.display = "none";
        appendMsg(content, "bot");
    }, delay);
}

// Search Logic (Information Retrieval)
function matchAndReply(input) {
    const query = input.toLowerCase().trim();
    
    // Greeting Match
    const wishPattern = /^(hi+|hello+|hey+|hai+|vanakkam|வணக்கம்)/i;
    if (wishPattern.test(query)) {
        botResponse("Vanakam! 🙏 Welcome to KCW Library. How can I assist you today?");
        return;
    }

    // CMS Trigger
    if (query === "cms") {
        switchTab('faq');
        document.getElementById('admin-login-screen').style.display = 'block';
        return;
    }

    // Weighted Keyword Scoring
    let bestMatch = { score: 0, answer: "" };
    libraryData.forEach(item => {
        let currentScore = 0;
        const keywords = item.k ? item.k.toLowerCase().split(',') : [];
        
        keywords.forEach(kw => {
            if (query.includes(kw.trim())) currentScore += 0.6;
        });

        if (query.includes(item.q.toLowerCase())) currentScore += 0.8;

        if (currentScore > bestMatch.score) {
            bestMatch = { score: currentScore, answer: item.a };
        }
    });

    if (bestMatch.score >= 0.5) {
        botResponse(bestMatch.answer);
    } else {
        showFallback(query);
    }
}

// UI Controls
function toggleChat() {
    const win = document.getElementById("bot-window");
    win.style.display = win.style.display === "flex" ? "none" : "flex";
}

function send() {
    const msgInput = document.getElementById("msg");
    if (!msgInput.value.trim()) return;
    
    appendMsg(msgInput.value, "user");
    matchAndReply(msgInput.value);
    msgInput.value = "";
    document.getElementById("suggestion-container").style.display = "none";
}

// Initial Welcome
window.onload = () => botResponse("Welcome to KCW Library and Information Centre. I am Anvisha, your virtual assistant.");
