// StudyVerse Client Application Engine

const API_BASE = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  loadCourses();
  loadFlashcards();
  loadAssignments();
  loadResources();
  setupEventListeners();
});

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const panes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  const titles = {
    'courses': { title: 'Enrolled Courses & Academic Metrics', sub: 'Track course syllabus progress, real-time attendance thresholds, and grade targets.' },
    'ai-assistant': { title: 'AI Study Assistant & Note Condenser', sub: 'Transform dense lecture notes into executive takeaways and high-yield exam insights.' },
    'flashcards': { title: 'Active Recall Flashcard Deck', sub: 'Practice spaced repetition and test active retrieval on core CSE subjects.' },
    'assignments': { title: 'Assignment & Deadline Radar', sub: 'Monitor upcoming semester project deadlines, weightages, and submission statuses.' },
    'resources': { title: 'Resource Vault & PYQ Library', sub: 'Curated cheat sheets, formula guides, and previous year university papers.' }
  };

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      navItems.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${tab}`)?.classList.add('active');

      if (titles[tab]) {
        pageTitle.textContent = titles[tab].title;
        pageSubtitle.textContent = titles[tab].sub;
      }
    });
  });
}

async function loadCourses() {
  try {
    const res = await fetch(`${API_BASE}/api/courses`);
    const json = await res.json();
    const container = document.getElementById('courses-grid');
    container.innerHTML = '';

    json.data.forEach(c => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.style.setProperty('--card-color', c.color);
      card.innerHTML = `
        <div class="course-header">
          <span class="course-code">${c.code}</span>
          <span class="course-credits">${c.credits} Credits</span>
        </div>
        <h3>${c.name}</h3>
        <p class="course-instructor">${c.instructor}</p>
        <div class="metric-box">
          <div class="metric-label">
            <span>Attendance</span>
            <strong>${c.attendance.percentage}% (${c.attendance.attended}/${c.attendance.total})</strong>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${c.attendance.percentage}%"></div>
          </div>
        </div>
        <div class="metric-box">
          <div class="metric-label">
            <span>Syllabus Covered</span>
            <strong>${c.syllabusProgress}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${c.syllabusProgress}%; background: ${c.color}"></div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error('Failed to load courses:', e);
  }
}

async function loadFlashcards() {
  try {
    const res = await fetch(`${API_BASE}/api/ai/flashcards`);
    const json = await res.json();
    const container = document.getElementById('flashcards-container');
    container.innerHTML = '';

    json.data.forEach(fc => {
      const card = document.createElement('div');
      card.className = 'flashcard';
      card.innerHTML = `
        <div class="flashcard-course">${fc.courseCode} • ${fc.mastery}</div>
        <h4>${fc.question}</h4>
        <div class="flashcard-answer">${fc.answer.replace(/\n/g, '<br>')}</div>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error('Failed to load flashcards:', e);
  }
}

async function loadAssignments() {
  try {
    const res = await fetch(`${API_BASE}/api/assignments`);
    const json = await res.json();
    const container = document.getElementById('assignments-list');
    container.innerHTML = '';

    json.data.forEach(asg => {
      const badgeClass = asg.priority.toLowerCase() === 'urgent' ? 'badge-urgent' : (asg.priority.toLowerCase() === 'high' ? 'badge-high' : 'badge-normal');
      const item = document.createElement('div');
      item.className = 'assignment-item';
      item.innerHTML = `
        <div>
          <h4>${asg.title}</h4>
          <div class="asg-meta">
            <span>${asg.courseCode}</span> • 
            <span>Due: ${asg.dueDate}</span> • 
            <span>Weight: ${asg.weightage}</span>
          </div>
        </div>
        <div>
          <span class="${badgeClass}">${asg.priority}</span>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (e) {
    console.error('Failed to load assignments:', e);
  }
}

async function loadResources() {
  try {
    const res = await fetch(`${API_BASE}/api/resources`);
    const json = await res.json();
    const container = document.getElementById('resources-container');
    container.innerHTML = '';

    json.data.forEach(r => {
      const card = document.createElement('div');
      card.className = 'resource-card';
      card.innerHTML = `
        <span class="course-code">${r.courseCode} • ${r.category}</span>
        <h4 style="margin-top: 8px;"><a href="${r.link}" target="_blank" style="color: #fff; text-decoration: none;">${r.title} ↗</a></h4>
        <div class="resource-tags">
          ${r.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
        </div>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error('Failed to load resources:', e);
  }
}

function setupEventListeners() {
  // AI Note Summarizer
  document.getElementById('btn-run-ai')?.addEventListener('click', async () => {
    const text = document.getElementById('ai-input-notes').value;
    const subject = document.getElementById('ai-subject-select').value;
    const outputPanel = document.getElementById('ai-output-content');

    if (!text.trim()) {
      alert('Please enter lecture notes to summarize.');
      return;
    }

    outputPanel.innerHTML = '<span style="color: #3b82f6;">Processing notes with AI NLP engine...</span>';

    try {
      const res = await fetch(`${API_BASE}/api/ai/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, subject })
      });
      const json = await res.json();

      if (json.success) {
        outputPanel.innerHTML = `
          <h4 style="color: #60a5fa; margin-bottom: 8px;">Concept Overview</h4>
          <p style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">${json.data.executiveSummary}</p>
          
          <h4 style="color: #34d399; margin-bottom: 8px;">Key Takeaways (${json.data.wordCountOriginal} words analyzed)</h4>
          <ul class="ai-takeaways">
            ${json.data.keyTakeaways.map(p => `<li>${p}</li>`).join('')}
          </ul>

          <div class="exam-tip-box">
            💡 <strong>Exam Strategy:</strong> ${json.data.examFocusTip}
          </div>
        `;
      }
    } catch (e) {
      outputPanel.innerHTML = '<span style="color: #ef4444;">Failed to analyze notes.</span>';
    }
  });

  // Assignment Form
  document.getElementById('form-add-assignment')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('asg-title').value;
    const courseCode = document.getElementById('asg-course').value;
    const dueDate = document.getElementById('asg-due').value;
    const priority = document.getElementById('asg-priority').value;

    try {
      const res = await fetch(`${API_BASE}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, courseCode, dueDate, priority })
      });
      const json = await res.json();
      if (json.success) {
        document.getElementById('asg-title').value = '';
        loadAssignments();
      }
    } catch (err) {
      alert('Failed to add assignment');
    }
  });

  // Generate Flashcards
  document.getElementById('btn-generate-ai-cards')?.addEventListener('click', async () => {
    const promptText = prompt('Enter a concept to generate flashcards for (e.g., Cache Coherence Protocols):', 'Cache Coherence Protocols');
    if (!promptText) return;

    try {
      const res = await fetch(`${API_BASE}/api/ai/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: promptText, courseCode: 'CS301' })
      });
      const json = await res.json();
      if (json.success) {
        loadFlashcards();
        alert(`Successfully generated ${json.count} new flashcards!`);
      }
    } catch (e) {
      alert('Failed to generate flashcards');
    }
  });
}
