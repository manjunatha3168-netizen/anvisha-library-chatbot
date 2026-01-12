const firebaseConfig = {
    apiKey: "AIzaSyBSwFIZppWBQLjHn4ZDRk0aYZ_n9qrgroE",
    authDomain: "kcw-library-bot.firebaseapp.com",
    projectId: "kcw-library-bot",
    databaseURL: "https://kcw-library-bot-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let libraryData = [];

// Load data from Firebase
db.ref('library_knowledge').on('value', s => {
    const d = s.val();
    if (d) {
        libraryData = Object.entries(d).map(([k, v]) => ({ id: k, ...v }));
        renderFAQList();
    }
});

function toggleChat() {
    const w = document.getElementById("bot-window");
    w.style.display = (w.style.display === "flex") ? "none" : "flex";
}

function switchTab(t) {
    const isChat = t === 'chat';
    document.getElementById('chat-content').style.display = isChat ? 'flex' : 'none';
    document.getElementById('faq-content').style.display = isChat ? 'none' : 'block';
    document.getElementById("btn-chat-tab").classList.toggle("active-tab", isChat);
    document.getElementById("btn-faq-tab").classList.toggle("active-tab", !isChat);
}

function appendMsg(content, type) {
    const chat = document.getElementById("chat");
    const row = document.createElement("div");
    row.className = `msg-row ${type}-row`;
    row.innerHTML = `<div class="${type}">${content}</div>`;
    chat.appendChild(row);
    chat.scrollTo(0, chat.scrollHeight);
}

function send() {
    const input = document.getElementById("msg");
    const val = input.value.trim();
    if (!val) return;

    appendMsg(val, "user");
    input.value = "";

    document.getElementById("typing").style.display = "block";

    setTimeout(() => {
        document.getElementById("typing").style.display = "none";
        const query = val.toLowerCase();
        let match = libraryData.find(item => query.includes(item.q.toLowerCase()));
        
        if (match) {
            appendMsg(match.a, "bot");
        } else {
            appendMsg("I couldn't find an exact answer. Try asking about library timings, books, or contact our team via FAQ tab.", "bot");
        }
    }, 800);
}

function renderFAQList() {
    const list = document.getElementById('faq-list');
    list.innerHTML = libraryData.map(i => `
        <div style="padding:12px; border-bottom:1px solid #eee; cursor:pointer; font-size:13px;" 
             onclick="appendMsg('${i.q}','user'); setTimeout(()=>appendMsg('${i.a.replace(/'/g,"")}', 'bot'), 500); switchTab('chat')">
            <strong>Q:</strong> ${i.q}
        </div>
    `).join('');
}

function clearChat() { document.getElementById("chat").innerHTML = ""; }

window.onload = () => appendMsg("Vanakam! I am Anvisha. How can I help you today?", "bot");
