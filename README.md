# 🏡 HavenSeek – Property Dealing Platform

**HavenSeek** is a full-stack real estate web application built to facilitate smooth, transparent, and role-based property dealing among four key users: **Sellers**, **Buyers**, **Dealers**, and **Agents**. It allows property listing, discovery, interest expression, messaging, and deal management in a user-friendly and scalable system.

---

## 🚀 Features

### 👤 Role-Based Access
- **Seller**: List, edit, delete properties; track buyer interest.
- **Buyer**: Browse/filter properties; express interest; schedule visits.
- **Dealer**: Manage property deals; handle negotiations; track commissions.
- **Agent**: Share listings; assist in visits; support buyer-seller interaction.

### 🏠 Property Listings
- Add detailed listings with images, price, location, property type, documents.
- Verified property tagging.
- Upload to cloud storage.

### 🔍 Advanced Search & Filters
- Search by city, price range, property type, ownership, etc.
- Real-time filtering without page reloads.

### 💬 Real-Time Chat
- Chat system for buyers, sellers, dealers, and agents.
- Role-restricted messaging logic.

### 📅 Booking & Visit Scheduling
- Buyers can request appointments.
- Agents/Sellers manage requests through their dashboard.

### 📄 PDF Generation
- Generate downloadable PDFs for property or deal summaries.

---

## 🤖 AI Integration (In Progress)

- Integrated **Google Gemini AI** as an AI Assistant.
- AI converts user natural language into structured JSON data.
- Strict rules are applied to extract only required fields:
  - `type`, `size`, `purpose`, `price`, `area`, `city`, `state`
- Extracted JSON is used to dynamically build MongoDB queries.
- Properties are fetched based on user requirements.
- AI summarizes fetched listings and sends a user-friendly response.
- If no matching listing is found, a fallback response is returned.
- Greeting messages (e.g., "hello") do not trigger database queries.

**Example Query:**
> Show me a flat in Lucknow below 50 lakh

**Flow:**
1. User message → AI
2. AI extracts structured JSON
3. Backend runs DB query
4. Listings are fetched
5. AI generates response

---

## 💻 Tech Stack

| Technology | Purpose |
|----------|--------|
| HTML, CSS, JavaScript | Frontend UI (MVC) |
| Tailwind CSS / Bootstrap | Responsive styling |
| Node.js + Express.js | Backend APIs |
| MongoDB Atlas | Database |
| Google Gemini AI | AI Assistant |
| Cloudinary | Media storage |
| JWT | Authentication |
| Socket.io | Real-time chat (optional) |
| PDFKit / jsPDF | PDF generation |

---

## 👨‍💻 Developer

**Sahil Jayant**  
📧 www.jayantsahil2054@gmail.com  
🔗 LinkedIn: www.linkedin.com/in/sahil-jayant
