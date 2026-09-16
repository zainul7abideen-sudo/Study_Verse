# 🎓 StudyVerse — All-in-One Student Workspace & AI Study Engine

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![REST API](https://img.shields.io/badge/REST_API-Verified-blue?style=for-the-badge)](http://localhost:4000/api/health)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**StudyVerse** is a comprehensive academic productivity platform and AI study assistant tailored for Computer Science & Engineering students. It centralizes course attendance tracking, automated AI note summarization, active-recall flashcard decks, semester assignment management, and university resource vaults.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client[StudyVerse Responsive Web Client] -->|REST / JSON| Gateway[Express API Server (Port 4000)]
    Gateway --> CourseService[Course & Attendance Tracker]
    Gateway --> AIService[AI Note Summarizer & Flashcard Gen]
    Gateway --> AssignmentService[Assignment & Deadline Radar]
    Gateway --> ResourceService[Resource Vault & PYQ Library]
    
    CourseService --> DB[(Persistent Store / Database)]
    AIService --> DB
    AssignmentService --> DB
    ResourceService --> DB
```

---

## 🌟 Core Features

1. **📚 Course & Attendance Tracker:**
   - Real-time attendance percentage calculator with statutory 75% threshold indicators.
   - Semester syllabus progress meters and credit load management.

2. **🤖 AI Study Summarizer & Concept Condenser:**
   - Transforms dense textbook paragraphs into high-yield bulleted takeaways and exam tips.

3. **🃏 Active-Recall Flashcard Deck:**
   - Spaced repetition and retrieval practice cards for core subjects (OS, DBMS, DSA, CN).

4. **📝 Assignment & Deadline Radar:**
   - Priority-ranked deadline tracking (`Urgent`, `High`, `Normal`) with course code tagging.

5. **📖 Resource Vault:**
   - Curated cheat sheets, functional dependency guides, and solved Previous Year Questions (PYQs).

---

## 🚀 Quickstart: Running StudyVerse

### 1. Install Dependencies
```bash
cd StudyVerse-Platform
npm install
```

### 2. Run Automated API Tests
```bash
npm test
```

### 3. Start the Server
```bash
npm start
```
Open **[http://localhost:4000](http://localhost:4000)** in your web browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health probe |
| `GET` | `/api/courses` | Fetch enrolled subjects & attendance metrics |
| `GET` | `/api/assignments` | Retrieve upcoming project & assignment deadlines |
| `POST` | `/api/assignments` | Add a new academic task |
| `POST` | `/api/ai/summarize` | AI NLP note condensation and exam tips |
| `POST` | `/api/ai/flashcards` | Auto-generate active-recall flashcards |
| `GET` | `/api/ai/flashcards` | Query flashcard decks |
| `GET` | `/api/resources` | Query subject cheat sheets and exam guides |

---

## 👨‍💻 Author
- **Zainul Abideen** - [GitHub Profile](https://github.com/Zainul9142)
