const http = require('http');
const assert = require('assert');
const app = require('../server');

const PORT = 4044;
const server = app.listen(PORT, async () => {
  console.log(`🧪 Testing StudyVerse Backend API on port ${PORT}...`);
  try {
    // 1. Health check
    const health = await fetchJSON(`http://localhost:${PORT}/api/health`);
    assert.strictEqual(health.status, 'UP');
    console.log('✅ Health Check PASSED');

    // 2. Courses API
    const courses = await fetchJSON(`http://localhost:${PORT}/api/courses`);
    assert.strictEqual(courses.success, true);
    assert.ok(courses.data.length >= 4, 'Should have at least 4 courses');
    console.log(`✅ Courses Endpoint PASSED (Retrieved ${courses.data.length} enrolled subjects)`);

    // 3. Assignments API
    const assignments = await fetchJSON(`http://localhost:${PORT}/api/assignments`);
    assert.strictEqual(assignments.success, true);
    console.log(`✅ Assignments Endpoint PASSED (Retrieved ${assignments.data.length} assignments)`);

    // 4. AI Summarizer API
    const summary = await postJSON(`http://localhost:${PORT}/api/ai/summarize`, {
      subject: 'Operating Systems',
      content: 'Process synchronization ensures shared memory consistency between cooperating processes. Mutex locks provide mutual exclusion. Semaphores solve the producer consumer synchronization problem.'
    });
    assert.strictEqual(summary.success, true);
    assert.ok(summary.data.keyTakeaways.length > 0);
    console.log(`✅ AI Note Summarizer PASSED (${summary.data.keyTakeaways.length} key takeaways generated)`);

    // 5. AI Flashcard Generator
    const flashcard = await postJSON(`http://localhost:${PORT}/api/ai/flashcards`, {
      courseCode: 'CS301',
      content: 'Virtual memory allows execution of processes that are not completely in memory using Demand Paging.'
    });
    assert.strictEqual(flashcard.success, true);
    assert.ok(flashcard.data.length > 0);
    console.log(`✅ AI Flashcard Generator PASSED (${flashcard.data.length} flashcards created)`);

    console.log('\n🎉 ALL STUDYVERSE BACKEND API TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function postJSON(url, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const urlObj = new URL(url);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}
