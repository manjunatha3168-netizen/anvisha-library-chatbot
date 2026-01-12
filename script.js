const firebaseConfig={apiKey:"AIzaSyBSwFIZppWBQLjHn4ZDRk0aYZ_n9qrgroE",authDomain:"kcw-library-bot.firebaseapp.com",projectId:"kcw-library-bot",databaseURL:"https://kcw-library-bot-default-rtdb.firebaseio.com/"};
firebase.initializeApp(firebaseConfig);
const db=firebase.database(),auth=firebase.auth();
let libraryData=[];
db.ref('library_knowledge').on('value',s=>{const d=s.val();if(d){libraryData=Object.entries(d).map(([k,v])=>({id:k,...v}));renderFAQList()}});

function appendMsg(c,t){const h=document.getElementById("chat"),r=document.createElement("div"),tm=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});r.className=`msg-row ${t}-row`;r.innerHTML=t==='bot'?`<div class="bot-avatar">A</div><div class="bot">${c}<span class="timestamp">${tm}</span></div>`:`<div class="user">${c}<span class="timestamp">${tm}</span></div>`;h.appendChild(r);h.scrollTo({top:h.scrollHeight,behavior:'smooth'})}

function botResponse(c){const t=document.getElementById("typing");t.style.display="block";const d=Math.min(Math.max(c.length*12,600),1800);setTimeout(()=>{t.style.display="none";appendMsg(c,"bot")},d)}

function matchAndReply(i){const u=i.toLowerCase().trim();const wishPattern=/^(hi+|hello+|hey+|hai+|helo+|hlo+|hy+|vanakam+|vanakkam+|wanakam+|wanakkam+|வணக்கம்)/i;if(wishPattern.test(u)){botResponse("Vanakam! 🙏 Welcome to KCW Library | Information Center. How can I help you today?");return}if(u==="cms"){switchTab('faq');document.getElementById('admin-login-screen').style.display='block';document.getElementById('faq-search').style.display='none';botResponse("Admin mode triggered. Please login.");return}let b={score:0,a:""};libraryData.forEach(item=>{let s=0;const k=item.k?item.k.toLowerCase().split(','):[];k.forEach(kw=>{if(u.includes(kw.trim()))s+=.6});if(u.includes(item.q.toLowerCase()))s+=.8;if(s>b.score)b={score:s,a:item.a}});if(b.score>=.5)botResponse(b.a);else showFallback(i)}

function showLiveSuggestions(){const v=document.getElementById("msg").value.toLowerCase().trim(),b=document.getElementById("suggestion-container");if(v.length<2){b.style.display="none";return}const f=["when","does","the","is","a","of","to"],m=v.split(" ").filter(w=>!f.includes(w)&&w.length>1);const matches=libraryData.filter(i=>{const k=i.k?i.k.toLowerCase().split(',').map(s=>s.trim()):[];return m.some(w=>k.some(kw=>kw.includes(w)))}).slice(0,3);if(matches.length){b.innerHTML=matches.map(m=>`<div class="suggestion-item" onclick="selectSuggestion('${m.q}')">🔍 ${m.q}</div>`).join('');b.style.display="block"}else b.style.display="none"}

function selectSuggestion(q){document.getElementById("msg").value=q;send()}

function showFallback(q){const id="draft-"+Date.now();botResponse(`<div class="draft-card"><p style="font-size:10px;font-weight:700;color:var(--primary);margin-bottom:8px;">REACH A LIBRARIAN</p><textarea class="draft-textarea" id="${id}">${q}</textarea><div style="display:flex;gap:8px;"><button class="draft-btn" style="background:var(--email);" onclick="sendEmail('${id}')">Email</button><button class="draft-btn" style="background:var(--whatsapp);" onclick="sendWhatsApp('${id}')">WhatsApp</button></div></div>`)}

function sendWhatsApp(id){window.open(`https://wa.me/919994648524?text=${encodeURIComponent(document.getElementById(id).value)}`)}

function sendEmail(id){window.location.href=`mailto:genlib@psgrkcw.ac.in?subject=Library Assistance&body=${encodeURIComponent(document.getElementById(id).value)}`}

function switchTab(t){const is=t==='chat';document.getElementById('chat-content').style.display=is?'flex':'none';document.getElementById('faq-content').style.display=is?'none':'flex';document.getElementById('btn-chat-tab').classList.toggle('active-tab',is);document.getElementById('btn-faq-tab').classList.toggle('active-tab',!is)}

function toggleChat(){const w=document.getElementById("bot-window");w.style.display=w.style.display==="flex"?"none":"flex"}

function send(){const i=document.getElementById("msg");if(!i.value.trim())return;appendMsg(i.value,"user");matchAndReply(i.value);i.value="";document.getElementById("suggestion-container").style.display="none"}

function loginAdmin(){auth.signInWithEmailAndPassword(document.getElementById('admin-email').value,document.getElementById('admin-password').value).then(()=>{document.getElementById('admin-login-screen').style.display='none';document.getElementById('admin-panel').style.display='block'}).catch(err=>alert(err.message))}

function logoutAdmin(){auth.signOut().then(()=>{document.getElementById('admin-panel').style.display='none';switchTab('chat')})}

function cancelAdmin(){document.getElementById('admin-login-screen').style.display='none';switchTab('chat')}

function addFAQ(){const q=document.getElementById('admin-q').value,a=document.getElementById('admin-a').value,k=document.getElementById('admin-k').value;if(q&&a){db.ref('library_knowledge').push({q,a,k});alert("Saved!")}}

function renderFAQList(f=""){const l=document.getElementById('faq-list');l.innerHTML="";libraryData.filter(i=>i.q.toLowerCase().includes(f)).forEach(i=>{const d=document.createElement('div');d.className="faq-item";d.innerHTML=`<strong>${i.q}</strong>`;d.onclick=()=>{switchTab('chat');appendMsg(i.q,"user");botResponse(i.a)};l.appendChild(d)})}

function filterFAQList(){renderFAQList(document.getElementById('faq-search').value.toLowerCase())}

function endChat(){document.getElementById('chat').innerHTML="";botResponse("Session refreshed.")}

window.onload=()=>botResponse("Welcome to KCW Library and Information Centre. I am Anvisha, your virtual assistant. You can type your query below or browse the FAQs for more information.");
