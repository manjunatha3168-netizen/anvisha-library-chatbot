# Anvisha: KCW Library Virtual Assistant 

Anvisha is an intelligent, keyword-based chatbot designed for the **PSGR Krishnammal College for Women (KCW) Library**. It bridges the gap between traditional library services and modern information retrieval needs.

Key Features
- **Keyword-Driven Retrieval:** Uses weighted scoring logic to match user queries with library knowledge.
- **Firebase Integration:** Real-time database (RTDB) for dynamic FAQ management and administrative updates.
- **Library CMS:** Includes a hidden "CMS" mode for librarians to update the knowledge base without coding.
- **Accessibility & Reach:** Integrated WhatsApp and Email fallback systems to connect patrons directly with an Assistant Librarian.
- **Mobile First:** Responsive design optimized for student use on smartphones.

Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Styles), JavaScript (ES6+)
- **Backend:** Firebase Realtime Database
- **Authentication:** Firebase Auth (for Admin CMS access)
- **Fonts:** Google Fonts (Poppins)

MLISc Integration
This project applies core **Library & Information Science** principles:
- **Information Storage & Retrieval:** Optimized search algorithms for library-specific queries.
- **Knowledge Organization:** Structured data mapping for FAQ categorization.
- **User Services:** Enhancing the digital touchpoint for institutional reference services.

How to Deploy
1. Clone the repository.
2. Replace the `firebaseConfig` object in `script.js` with your own Firebase project credentials.
3. Host the `index.html` via GitHub Pages or any web server.
