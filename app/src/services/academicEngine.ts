import { UniversityConfig, SubjectGrade } from '../types';

export const INDIAN_UNIVERSITIES: UniversityConfig[] = [
  {
    code: 'AKTU',
    name: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU / UPTU)',
    state: 'Uttar Pradesh',
    gradingSystem: '10-Point Absolute Credit System',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.75) × 10',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.max(0, parseFloat(((cgpa - 0.75) * 10).toFixed(2)));
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '90 - 100%' },
      { grade: 'A+', points: 9, description: 'Excellent', marksRange: '80 - 89%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '70 - 79%' },
      { grade: 'B+', points: 7, description: 'Good', marksRange: '65 - 69%' },
      { grade: 'B', points: 6, description: 'Above Average', marksRange: '60 - 64%' },
      { grade: 'C', points: 5, description: 'Average', marksRange: '50 - 59%' },
      { grade: 'P', points: 4, description: 'Pass', marksRange: '40 - 49%' },
      { grade: 'F', points: 0, description: 'Fail', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: 'KCS501', name: 'Database Management Systems', credits: 4 },
      { code: 'KCS502', name: 'Compiler Design', credits: 4 },
      { code: 'KCS503', name: 'Design and Analysis of Algorithms', credits: 4 },
      { code: 'KCS051', name: 'Data Analytics / ML', credits: 3 },
      { code: 'KNC501', name: 'Constitution of India', credits: 2 },
      { code: 'KCS551', name: 'DBMS Lab', credits: 1 },
      { code: 'KCS552', name: 'DAA Lab', credits: 1 },
      { code: 'KCS553', name: 'Mini Project / Internship', credits: 2 },
    ]
  },
  {
    code: 'VTU',
    name: 'Visvesvaraya Technological University (VTU)',
    state: 'Karnataka',
    gradingSystem: '10-Point CBCS (Choice Based Credit System)',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.75) × 10 (2018) / CGPA × 10 (2022 Scheme)',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.max(0, parseFloat(((cgpa - 0.75) * 10).toFixed(2)));
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '90 - 100%' },
      { grade: 'A+', points: 9, description: 'Excellent', marksRange: '80 - 89%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '70 - 79%' },
      { grade: 'B+', points: 7, description: 'Good', marksRange: '60 - 69%' },
      { grade: 'B', points: 6, description: 'Above Average', marksRange: '55 - 59%' },
      { grade: 'C', points: 5, description: 'Average', marksRange: '50 - 54%' },
      { grade: 'P', points: 4, description: 'Pass', marksRange: '40 - 49%' },
      { grade: 'F', points: 0, description: 'Fail', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: '21CS51', name: 'Automata Theory & Computability', credits: 3 },
      { code: '21CS52', name: 'Computer Networks', credits: 4 },
      { code: '21CS53', name: 'Database Management System', credits: 3 },
      { code: '21CS54', name: 'Artificial Intelligence & ML', credits: 3 },
      { code: '21CSL55', name: 'DBMS Laboratory with Mini Project', credits: 1.5 },
      { code: '21RMI56', name: 'Research Methodology & IPR', credits: 2 },
      { code: '21CIV57', name: 'Environmental Studies', credits: 1 },
    ]
  },
  {
    code: 'DU',
    name: 'University of Delhi (Delhi University - DU)',
    state: 'Delhi',
    gradingSystem: 'UGC-CBCS 10-Point Grading Scale',
    scale: 10,
    formulaDescription: 'Percentage = CGPA × 9.5 (Official UGC Conversion)',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.min(100, parseFloat((cgpa * 9.5).toFixed(2)));
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '90 - 100%' },
      { grade: 'A+', points: 9, description: 'Excellent', marksRange: '80 - 89%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '70 - 79%' },
      { grade: 'B+', points: 7, description: 'Good', marksRange: '60 - 69%' },
      { grade: 'B', points: 6, description: 'Above Average', marksRange: '50 - 59%' },
      { grade: 'C', points: 5, description: 'Average', marksRange: '45 - 49%' },
      { grade: 'P', points: 4, description: 'Pass', marksRange: '40 - 44%' },
      { grade: 'F', points: 0, description: 'Fail', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: 'DSC-13', name: 'Operating Systems Architecture', credits: 4 },
      { code: 'DSC-14', name: 'Computer System Architecture', credits: 4 },
      { code: 'DSC-15', name: 'Software Engineering Methodologies', credits: 4 },
      { code: 'DSE-01', name: 'Cloud Computing Technologies', credits: 4 },
      { code: 'SEC-03', name: 'Advanced Python Programming', credits: 2 },
    ]
  },
  {
    code: 'SPPU',
    name: 'Savitribai Phule Pune University (SPPU / Pune Univ)',
    state: 'Maharashtra',
    gradingSystem: '10-Point Credit System (Pune Pattern)',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA × 10) - 7.5 (for CGPA ≥ 7.0)',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      if (cgpa >= 7.0) {
        return Math.max(0, parseFloat(((cgpa * 10) - 7.5).toFixed(2)));
      } else if (cgpa >= 6.0) {
        return Math.max(0, parseFloat(((cgpa * 10) - 5.0).toFixed(2)));
      } else if (cgpa >= 5.0) {
        return Math.max(0, parseFloat(((cgpa * 10) - 2.5).toFixed(2)));
      } else {
        return Math.max(0, parseFloat((cgpa * 6.6).toFixed(2)));
      }
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '80 - 100%' },
      { grade: 'A+', points: 9, description: 'Excellent', marksRange: '70 - 79%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '60 - 69%' },
      { grade: 'B+', points: 7, description: 'Good', marksRange: '55 - 59%' },
      { grade: 'B', points: 6, description: 'Above Average', marksRange: '50 - 54%' },
      { grade: 'C', points: 5, description: 'Average', marksRange: '45 - 49%' },
      { grade: 'P', points: 4, description: 'Pass', marksRange: '40 - 44%' },
      { grade: 'F', points: 0, description: 'Fail', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: '310241', name: 'Database Management Systems', credits: 3 },
      { code: '310242', name: 'Theory of Computation', credits: 3 },
      { code: '310243', name: 'Systems Programming & OS', credits: 3 },
      { code: '310244', name: 'Computer Networks and Security', credits: 3 },
      { code: '310245', name: 'Elective I (IoT / Data Science)', credits: 3 },
      { code: '310246', name: 'DBMS Lab Practical', credits: 2 },
      { code: '310247', name: 'CN & Security Lab', credits: 2 },
    ]
  },
  {
    code: 'MU',
    name: 'University of Mumbai (Mumbai University - MU)',
    state: 'Maharashtra',
    gradingSystem: '10-Point CBSGS Scale',
    scale: 10,
    formulaDescription: 'Percentage = 7.1 + 0.1 × (CGPA - 7) × 10 (CGPA ≥ 7.0) or 7.25 × CGPA',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      if (cgpa >= 7.0) {
        return Math.min(100, parseFloat((7.1 + (cgpa - 7.0) * 9.6).toFixed(2)));
      } else {
        return Math.max(0, parseFloat((cgpa * 7.25).toFixed(2)));
      }
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '80 - 100%' },
      { grade: 'A', points: 9, description: 'Excellent', marksRange: '75 - 79%' },
      { grade: 'B', points: 8, description: 'Very Good', marksRange: '70 - 74%' },
      { grade: 'C', points: 7, description: 'Good', marksRange: '60 - 69%' },
      { grade: 'D', points: 6, description: 'Fair', marksRange: '50 - 59%' },
      { grade: 'E', points: 5, description: 'Average', marksRange: '45 - 49%' },
      { grade: 'P', points: 4, description: 'Pass', marksRange: '40 - 44%' },
      { grade: 'F', points: 0, description: 'Fail', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: 'CSC501', name: 'Theoretical Computer Science', credits: 3 },
      { code: 'CSC502', name: 'Software Engineering', credits: 3 },
      { code: 'CSC503', name: 'Computer Network', credits: 3 },
      { code: 'CSC504', name: 'Data Warehousing & Mining', credits: 3 },
      { code: 'CSDLO501', name: 'Department Level Optional Course', credits: 3 },
      { code: 'CSL501', name: 'Software Engineering Lab', credits: 1 },
      { code: 'CSL502', name: 'Computer Network Lab', credits: 1 },
      { code: 'CSM501', name: 'Mini Project 2A', credits: 2 },
    ]
  },
  {
    code: 'ANNA',
    name: 'Anna University (Chennai / Affiliated Colleges)',
    state: 'Tamil Nadu',
    gradingSystem: '10-Point Relative / Absolute Scale (Regulation 2021)',
    scale: 10,
    formulaDescription: 'Percentage = CGPA × 10',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.min(100, parseFloat((cgpa * 10).toFixed(2)));
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '91 - 100%' },
      { grade: 'A+', points: 9, description: 'Excellent', marksRange: '81 - 90%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '71 - 80%' },
      { grade: 'B+', points: 7, description: 'Good', marksRange: '61 - 70%' },
      { grade: 'B', points: 6, description: 'Average', marksRange: '50 - 60%' },
      { grade: 'RA', points: 0, description: 'Re-Appearance (Fail)', marksRange: 'Below 50%' },
    ],
    defaultSubjects: [
      { code: 'CS3591', name: 'Computer Networks', credits: 4 },
      { code: 'CS3501', name: 'Compiler Design', credits: 4 },
      { code: 'CB3491', name: 'Cryptography and Cyber Security', credits: 3 },
      { code: 'CS3551', name: 'Distributed Computing', credits: 3 },
      { code: 'CS3561', name: 'Compiler Laboratory', credits: 2 },
      { code: 'CS3581', name: 'Computer Networks Laboratory', credits: 2 },
    ]
  },
  {
    code: 'MAKAUT',
    name: 'MAKAUT (West Bengal University of Technology - WBUT)',
    state: 'West Bengal',
    gradingSystem: '10-Point CBCS Engineering Scale',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.75) × 10',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.max(0, parseFloat(((cgpa - 0.75) * 10).toFixed(2)));
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '90 - 100%' },
      { grade: 'E', points: 9, description: 'Excellent', marksRange: '80 - 89%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '70 - 79%' },
      { grade: 'B', points: 7, description: 'Good', marksRange: '60 - 69%' },
      { grade: 'C', points: 6, description: 'Fair', marksRange: '50 - 59%' },
      { grade: 'D', points: 5, description: 'Below Average', marksRange: '40 - 49%' },
      { grade: 'F', points: 0, description: 'Failed', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: 'PCC-CS501', name: 'Compiler Design', credits: 3 },
      { code: 'PCC-CS502', name: 'Operating Systems', credits: 3 },
      { code: 'PCC-CS503', name: 'Object Oriented Programming', credits: 3 },
      { code: 'HSMC-501', name: 'Introduction to Industrial Management', credits: 3 },
      { code: 'PEC-IT501A', name: 'Theory of Computation', credits: 3 },
      { code: 'PCC-CS592', name: 'OS Lab', credits: 1.5 },
    ]
  },
  {
    code: 'JNTU',
    name: 'Jawaharlal Nehru Technological University (JNTU Hyderabad/Kakinada)',
    state: 'Telangana & Andhra Pradesh',
    gradingSystem: '10-Point Academic CBCS (R18 / R22 Scheme)',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.5) × 10',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.max(0, parseFloat(((cgpa - 0.5) * 10).toFixed(2)));
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '90 - 100%' },
      { grade: 'A+', points: 9, description: 'Excellent', marksRange: '80 - 89%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '70 - 79%' },
      { grade: 'B+', points: 7, description: 'Good', marksRange: '60 - 69%' },
      { grade: 'B', points: 6, description: 'Average', marksRange: '50 - 59%' },
      { grade: 'C', points: 5, description: 'Pass', marksRange: '40 - 49%' },
      { grade: 'F', points: 0, description: 'Fail', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: 'CS501PC', name: 'Design and Analysis of Algorithms', credits: 4 },
      { code: 'CS502PC', name: 'Data Mining & Data Warehousing', credits: 4 },
      { code: 'CS503PC', name: 'Computer Networks', credits: 4 },
      { code: 'CS504PC', name: 'Web Technologies', credits: 3 },
      { code: 'CS505PC', name: 'Software Engineering', credits: 3 },
      { code: 'CS506PC', name: 'Web Technologies Lab', credits: 1.5 },
    ]
  },
  {
    code: 'GTU',
    name: 'Gujarat Technological University (GTU)',
    state: 'Gujarat',
    gradingSystem: '10-Point SPI / CPI / CGPA Scale',
    scale: 10,
    formulaDescription: 'Percentage = (CPI / CGPA - 0.5) × 10',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.max(0, parseFloat(((cgpa - 0.5) * 10).toFixed(2)));
    },
    gradeScale: [
      { grade: 'AA', points: 10, description: 'Outstanding', marksRange: '85 - 100%' },
      { grade: 'AB', points: 9, description: 'Excellent', marksRange: '75 - 84%' },
      { grade: 'BB', points: 8, description: 'Very Good', marksRange: '65 - 74%' },
      { grade: 'BC', points: 7, description: 'Good', marksRange: '55 - 64%' },
      { grade: 'CC', points: 6, description: 'Fair', marksRange: '45 - 54%' },
      { grade: 'CD', points: 5, description: 'Average', marksRange: '40 - 44%' },
      { grade: 'DD', points: 4, description: 'Pass', marksRange: '35 - 39%' },
      { grade: 'FF', points: 0, description: 'Fail', marksRange: 'Below 35%' },
    ],
    defaultSubjects: [
      { code: '3150703', name: 'Analysis and Design of Algorithms', credits: 4 },
      { code: '3150710', name: 'Computer Networks', credits: 4 },
      { code: '3150711', name: 'Software Engineering', credits: 4 },
      { code: '3150713', name: 'Python Programming', credits: 3 },
      { code: '3150714', name: 'Cyber Security', credits: 2 },
    ]
  },
  {
    code: 'GENERIC_10',
    name: 'Standard UGC / Autonomous College (10-Point Scale)',
    state: 'All India (National Standard)',
    gradingSystem: 'Standard 10-Point Credit Scale',
    scale: 10,
    formulaDescription: 'Percentage = CGPA × 10',
    calculatePercentage: (cgpa: number) => {
      if (cgpa <= 0) return 0;
      return Math.min(100, parseFloat((cgpa * 10).toFixed(2)));
    },
    gradeScale: [
      { grade: 'O', points: 10, description: 'Outstanding', marksRange: '90 - 100%' },
      { grade: 'A+', points: 9, description: 'Excellent', marksRange: '80 - 89%' },
      { grade: 'A', points: 8, description: 'Very Good', marksRange: '70 - 79%' },
      { grade: 'B+', points: 7, description: 'Good', marksRange: '60 - 69%' },
      { grade: 'B', points: 6, description: 'Above Average', marksRange: '50 - 59%' },
      { grade: 'C', points: 5, description: 'Average', marksRange: '40 - 49%' },
      { grade: 'F', points: 0, description: 'Fail', marksRange: 'Below 40%' },
    ],
    defaultSubjects: [
      { code: 'SUB101', name: 'Advanced Engineering Mathematics', credits: 4 },
      { code: 'SUB102', name: 'Data Structures & Algorithms', credits: 4 },
      { code: 'SUB103', name: 'Operating Systems & System Architecture', credits: 3 },
      { code: 'SUB104', name: 'Computer Architecture & Org', credits: 3 },
      { code: 'SUB105', name: 'Data Structures Lab', credits: 2 },
    ]
  }
];

export function calculateSGPA(subjects: SubjectGrade[]): number {
  if (!subjects || subjects.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach(sub => {
    const cred = sub.credits || 0;
    const pts = sub.gradePoints || 0;
    totalPoints += cred * pts;
    totalCredits += cred;
  });

  if (totalCredits === 0) return 0;
  return parseFloat((totalPoints / totalCredits).toFixed(2));
}

export function calculateMarksFromGrade(
  internalMarks: number,
  maxInternal: number,
  targetGradePoint: number,
  maxExternal: number = 70
): { requiredExternal: number; achievable: boolean; message: string } {
  // Target percentage mapping approx
  const targetTotalPercent = targetGradePoint * 10; // e.g. 9 -> 90%
  const totalMax = maxInternal + maxExternal;
  const targetScore = (targetTotalPercent / 100) * totalMax;
  
  const neededExternal = Math.ceil(targetScore - internalMarks);

  if (neededExternal <= 0) {
    return {
      requiredExternal: 0,
      achievable: true,
      message: 'You already have enough internal marks! Scoring minimum passing marks guarantees this grade.'
    };
  }

  if (neededExternal > maxExternal) {
    return {
      requiredExternal: neededExternal,
      achievable: false,
      message: `Requires ${neededExternal}/${maxExternal} in End-Sem, which exceeds the maximum marks. Aim for next realistic grade.`
    };
  }

  return {
    requiredExternal: neededExternal,
    achievable: true,
    message: `Need at least ${neededExternal} out of ${maxExternal} (${Math.round((neededExternal / maxExternal) * 100)}%) in End-Sem exam.`
  };
}
