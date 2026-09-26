import { SubjectGrade } from '../types/index.js';

export interface UniversityConfig {
  code: string;
  name: string;
  state: string;
  gradingSystem: string;
  scale: 10 | 7 | 4;
  formulaDescription: string;
  calculatePercentage: (cgpa: number) => number;
}

export const UNIVERSITIES: Record<string, UniversityConfig> = {
  AKTU: {
    code: 'AKTU',
    name: 'Dr. A.P.J. Abdul Kalam Technical University',
    state: 'Uttar Pradesh',
    gradingSystem: '10-Point Absolute Credit System',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.75) × 10',
    calculatePercentage: (cgpa: number) => Math.max(0, parseFloat(((cgpa - 0.75) * 10).toFixed(2)))
  },
  VTU: {
    code: 'VTU',
    name: 'Visvesvaraya Technological University',
    state: 'Karnataka',
    gradingSystem: '10-Point CBCS Scale',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.75) × 10 (2018) / CGPA × 10 (2022 Scheme)',
    calculatePercentage: (cgpa: number) => Math.max(0, parseFloat(((cgpa - 0.75) * 10).toFixed(2)))
  },
  DU: {
    code: 'DU',
    name: 'University of Delhi (DU)',
    state: 'Delhi',
    gradingSystem: 'UGC-CBCS 10-Point Scale',
    scale: 10,
    formulaDescription: 'Percentage = CGPA × 9.5',
    calculatePercentage: (cgpa: number) => Math.min(100, parseFloat((cgpa * 9.5).toFixed(2)))
  },
  SPPU: {
    code: 'SPPU',
    name: 'Savitribai Phule Pune University',
    state: 'Maharashtra',
    gradingSystem: '10-Point Credit System',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA × 10) - 7.5 (for CGPA ≥ 7.0)',
    calculatePercentage: (cgpa: number) => {
      if (cgpa >= 7.0) return Math.max(0, parseFloat(((cgpa * 10) - 7.5).toFixed(2)));
      if (cgpa >= 6.0) return Math.max(0, parseFloat(((cgpa * 10) - 5.0).toFixed(2)));
      return Math.max(0, parseFloat((cgpa * 6.6).toFixed(2)));
    }
  },
  MU: {
    code: 'MU',
    name: 'University of Mumbai',
    state: 'Maharashtra',
    gradingSystem: '10-Point CBSGS Scale',
    scale: 10,
    formulaDescription: 'Percentage = 7.1 + 0.1 × (CGPA - 7) × 10 (CGPA ≥ 7.0) or 7.25 × CGPA',
    calculatePercentage: (cgpa: number) => {
      if (cgpa >= 7.0) return Math.min(100, parseFloat((7.1 + (cgpa - 7.0) * 9.6).toFixed(2)));
      return Math.max(0, parseFloat((cgpa * 7.25).toFixed(2)));
    }
  },
  ANNA: {
    code: 'ANNA',
    name: 'Anna University',
    state: 'Tamil Nadu',
    gradingSystem: '10-Point Scale (Regulation 2021)',
    scale: 10,
    formulaDescription: 'Percentage = CGPA × 10',
    calculatePercentage: (cgpa: number) => Math.min(100, parseFloat((cgpa * 10).toFixed(2)))
  },
  MAKAUT: {
    code: 'MAKAUT',
    name: 'Maulana Abul Kalam Azad University of Technology (WBUT)',
    state: 'West Bengal',
    gradingSystem: '10-Point CBCS Scale',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.75) × 10',
    calculatePercentage: (cgpa: number) => Math.max(0, parseFloat(((cgpa - 0.75) * 10).toFixed(2)))
  },
  JNTU: {
    code: 'JNTU',
    name: 'Jawaharlal Nehru Technological University',
    state: 'Telangana & AP',
    gradingSystem: '10-Point Academic Scale',
    scale: 10,
    formulaDescription: 'Percentage = (CGPA - 0.5) × 10',
    calculatePercentage: (cgpa: number) => Math.max(0, parseFloat(((cgpa - 0.5) * 10).toFixed(2)))
  },
  GTU: {
    code: 'GTU',
    name: 'Gujarat Technological University',
    state: 'Gujarat',
    gradingSystem: '10-Point CPI / SPI Scale',
    scale: 10,
    formulaDescription: 'Percentage = (CPI - 0.5) × 10',
    calculatePercentage: (cgpa: number) => Math.max(0, parseFloat(((cgpa - 0.5) * 10).toFixed(2)))
  }
};

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

export function predictRequiredMarks(
  internalMarks: number,
  maxInternal: number,
  targetGradePoint: number,
  maxExternal: number = 70
) {
  const targetTotalPercent = targetGradePoint * 10;
  const totalMax = maxInternal + maxExternal;
  const targetScore = (targetTotalPercent / 100) * totalMax;
  const neededExternal = Math.ceil(targetScore - internalMarks);

  if (neededExternal <= 0) {
    return {
      requiredExternal: 0,
      achievable: true,
      message: 'You have high internal marks. Scoring passing marks in end-sem secures this grade!'
    };
  }

  if (neededExternal > maxExternal) {
    return {
      requiredExternal: neededExternal,
      achievable: false,
      message: `Requires ${neededExternal}/${maxExternal}, which exceeds max examination marks.`
    };
  }

  return {
    requiredExternal: neededExternal,
    achievable: true,
    message: `Need at least ${neededExternal} out of ${maxExternal} marks in the End-Sem written exam.`
  };
}
