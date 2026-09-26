import { Router } from 'express';

export const courseRoutes = Router();

let studentCourses = [
  {
    id: 'cs-301',
    code: 'CS301',
    name: 'Operating Systems & Concurrency',
    instructor: 'Dr. A. Sharma',
    credits: 4,
    attended: 32,
    total: 36,
    color: '#3B82F6',
    syllabusProgress: 75
  },
  {
    id: 'cs-302',
    code: 'CS302',
    name: 'Database Management Systems (DBMS)',
    instructor: 'Prof. R. Verma',
    credits: 4,
    attended: 28,
    total: 30,
    color: '#10B981',
    syllabusProgress: 85
  },
  {
    id: 'cs-303',
    code: 'CS303',
    name: 'Data Structures & Algorithms (DSA)',
    instructor: 'Dr. K. Patel',
    credits: 4,
    attended: 38,
    total: 40,
    color: '#F59E0B',
    syllabusProgress: 90
  },
  {
    id: 'cs-304',
    code: 'CS304',
    name: 'Computer Networks & Security',
    instructor: 'Prof. M. Sen',
    credits: 3,
    attended: 18,
    total: 26,
    color: '#8B5CF6',
    syllabusProgress: 70
  }
];

// Helper to calculate 75% threshold stats
export function computeAttendanceStats(attended: number, total: number) {
  if (total === 0) return { percentage: 0, safeBunks: 0, requiredClasses: 0, isSafe: true };
  const percentage = parseFloat(((attended / total) * 100).toFixed(1));

  if (percentage >= 75) {
    // How many classes can safely miss: (attended / (total + x)) >= 0.75 => x <= (attended / 0.75) - total
    const safeBunks = Math.floor((attended / 0.75) - total);
    return {
      percentage,
      safeBunks: Math.max(0, safeBunks),
      requiredClasses: 0,
      isSafe: true,
      message: safeBunks > 0 
        ? `You can safely bunk ${safeBunks} more class(es) and remain above 75%.` 
        : `On the border (75%). Do not miss the next class!`
    };
  } else {
    // How many consecutive classes to attend: (attended + x) / (total + x) >= 0.75 => x >= (0.75*total - attended) / 0.25
    const requiredClasses = Math.ceil((0.75 * total - attended) / 0.25);
    return {
      percentage,
      safeBunks: 0,
      requiredClasses: Math.max(1, requiredClasses),
      isSafe: false,
      message: `Danger Zone! Attend ${requiredClasses} consecutive class(es) to reach 75%.`
    };
  }
}

// GET /api/courses
courseRoutes.get('/', (req, res) => {
  const coursesWithStats = studentCourses.map(c => {
    const stats = computeAttendanceStats(c.attended, c.total);
    return { ...c, stats };
  });

  const overallAttended = studentCourses.reduce((acc, c) => acc + c.attended, 0);
  const overallTotal = studentCourses.reduce((acc, c) => acc + c.total, 0);
  const overallPercentage = overallTotal > 0 ? parseFloat(((overallAttended / overallTotal) * 100).toFixed(1)) : 0;

  res.json({
    count: studentCourses.length,
    overallAttendance: {
      attended: overallAttended,
      total: overallTotal,
      percentage: overallPercentage,
      isEligible: overallPercentage >= 75
    },
    courses: coursesWithStats
  });
});

// PUT /api/courses/:id/attendance
courseRoutes.put('/:id/attendance', (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'attend' or 'miss' or 'set'

  const course = studentCourses.find(c => c.id === id);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  if (action === 'attend') {
    course.attended += 1;
    course.total += 1;
  } else if (action === 'miss') {
    course.total += 1;
  } else if (action === 'set') {
    course.attended = parseInt(req.body.attended) || course.attended;
    course.total = parseInt(req.body.total) || course.total;
  }

  const stats = computeAttendanceStats(course.attended, course.total);
  res.json({ course: { ...course, stats } });
});

// POST /api/courses - Add course
courseRoutes.post('/', (req, res) => {
  const { code, name, instructor, credits, attended, total } = req.body;
  const newCourse = {
    id: `cs-${Date.now()}`,
    code: code || 'CS305',
    name: name || 'New Elective Course',
    instructor: instructor || 'Faculty Member',
    credits: parseInt(credits) || 3,
    attended: parseInt(attended) || 0,
    total: parseInt(total) || 0,
    color: '#EC4899',
    syllabusProgress: 50
  };

  studentCourses.push(newCourse);
  res.status(201).json({ course: newCourse });
});
