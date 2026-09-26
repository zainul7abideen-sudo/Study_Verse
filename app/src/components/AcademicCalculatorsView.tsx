import React, { useState } from 'react';
import { 
  Calculator, Award, Percent, BookOpen, Plus, Trash2, 
  Download, Save, CheckCircle2, AlertCircle, HelpCircle, 
  Target, Sparkles, Printer, FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_UNIVERSITIES, calculateSGPA, calculateMarksFromGrade } from '../services/academicEngine';
import { SubjectGrade, UniversityConfig } from '../types';

export const AcademicCalculatorsView: React.FC = () => {
  const { currentUser, saveAcademicRecord } = useApp();

  // Selected University
  const [selectedUnivCode, setSelectedUnivCode] = useState<string>(currentUser.university || 'AKTU');
  const [activeCalculatorTab, setActiveCalculatorTab] = useState<'sgpa' | 'cgpa_converter' | 'target_predictor'>('sgpa');

  const selectedUniv: UniversityConfig = INDIAN_UNIVERSITIES.find(u => u.code === selectedUnivCode) || INDIAN_UNIVERSITIES[0];

  // SGPA Subject Matrix State
  const parseSem = (semStr?: string) => {
    if (!semStr) return 5;
    const num = parseInt(semStr.replace(/\D/g, ''), 10);
    return isNaN(num) ? 5 : num;
  };

  const [semesterNumber, setSemesterNumber] = useState<number>(() => parseSem(currentUser.semester));
  const [branchName, setBranchName] = useState<string>(currentUser.branch || 'Computer Science & Engineering');
  const [subjects, setSubjects] = useState<SubjectGrade[]>(() => {
    return selectedUniv.defaultSubjects.map((sub, idx) => ({
      id: `sub-${idx}`,
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      grade: 'A+',
      gradePoints: 9
    }));
  });

  // Sync with currentUser when switching accounts or completing registration
  React.useEffect(() => {
    if (currentUser.university && currentUser.university !== selectedUnivCode) {
      handleUniversityChange(currentUser.university);
    }
    if (currentUser.branch) {
      setBranchName(currentUser.branch);
    }
    if (currentUser.semester) {
      setSemesterNumber(parseSem(currentUser.semester));
    }
  }, [currentUser]);

  // Target Predictor State
  const [internalMarks, setInternalMarks] = useState<number>(24);
  const [maxInternal, setMaxInternal] = useState<number>(30);
  const [maxExternal, setMaxExternal] = useState<number>(70);
  const [targetGradePoint, setTargetGradePoint] = useState<number>(9);

  // Standalone CGPA to % Converter
  const [standaloneCgpa, setStandaloneCgpa] = useState<string>('8.42');

  // Handle University Change
  const handleUniversityChange = (code: string) => {
    setSelectedUnivCode(code);
    const newUniv = INDIAN_UNIVERSITIES.find(u => u.code === code) || INDIAN_UNIVERSITIES[0];
    setSubjects(newUniv.defaultSubjects.map((sub, idx) => ({
      id: `sub-${idx}`,
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      grade: 'A+',
      gradePoints: newUniv.gradeScale[1]?.points || 9
    })));
  };

  // Subject Handlers
  const handleGradeChange = (subjectId: string, gradeStr: string) => {
    const scaleObj = selectedUniv.gradeScale.find(g => g.grade === gradeStr);
    const points = scaleObj ? scaleObj.points : 0;
    
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        return { ...s, grade: gradeStr, gradePoints: points };
      }
      return s;
    }));
  };

  const handleCreditsChange = (subjectId: string, creds: number) => {
    setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, credits: creds } : s));
  };

  const addSubjectRow = () => {
    const newSub: SubjectGrade = {
      id: `sub-${Date.now()}`,
      code: `SUB${subjects.length + 101}`,
      name: 'Elective Course / Practical',
      credits: 3,
      grade: selectedUniv.gradeScale[0].grade,
      gradePoints: selectedUniv.gradeScale[0].points
    };
    setSubjects(prev => [...prev, newSub]);
  };

  const removeSubjectRow = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Calculations
  const calculatedSGPA = calculateSGPA(subjects);
  const calculatedPercentage = selectedUniv.calculatePercentage(calculatedSGPA);
  const totalCredits = subjects.reduce((acc, s) => acc + (s.credits || 0), 0);

  const targetPrediction = calculateMarksFromGrade(
    internalMarks,
    maxInternal,
    targetGradePoint,
    maxExternal
  );

  const handleSaveMarksheet = () => {
    saveAcademicRecord({
      userId: currentUser.id,
      universityCode: selectedUniv.code,
      universityName: selectedUniv.name,
      semester: semesterNumber,
      branch: branchName,
      sgpa: calculatedSGPA,
      cgpa: calculatedSGPA,
      percentage: calculatedPercentage,
      subjects: subjects
    });
  };

  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
            <Calculator className="w-3.5 h-3.5" />
            Official Indian Universities Academic Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-black theme-text-heading">
            CGPA, SGPA & Marks Conversion Engine
          </h1>
          <p className="text-xs sm:text-sm theme-text-muted max-w-xl leading-relaxed">
            Custom-built formulas for AKTU, VTU, DU, SPPU, Mumbai University, Anna Univ, MAKAUT, JNTU, and GTU with target grade predictors.
          </p>
        </div>

        {/* University Selector Dropdown */}
        <div className="w-full md:w-auto theme-card-sub border theme-border rounded-2xl p-3 shadow-lg flex-shrink-0">
          <label htmlFor="university-scheme-select" className="block text-[10px] uppercase font-bold text-amber-500 mb-1">
            Selected University Scheme:
          </label>
          <select
            id="university-scheme-select"
            name="universityScheme"
            aria-label="Selected University Scheme"
            value={selectedUnivCode}
            onChange={(e) => handleUniversityChange(e.target.value)}
            className="w-full theme-input theme-text-heading font-bold text-xs sm:text-sm rounded-xl px-3 py-2 border theme-border focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
          >
            {INDIAN_UNIVERSITIES.map(u => (
              <option key={u.code} value={u.code}>
                {u.name} ({u.state})
              </option>
            ))}
          </select>
          <div className="text-[10px] theme-text-muted mt-1.5 font-mono">
            Formula: <span className="text-amber-500 dark:text-amber-300 font-semibold">{selectedUniv.formulaDescription}</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b theme-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveCalculatorTab('sgpa')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeCalculatorTab === 'sgpa'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25 font-bold'
              : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
          }`}
        >
          <Award className="w-4 h-4" />
          Semester SGPA & Transcript Matrix
        </button>

        <button
          onClick={() => setActiveCalculatorTab('cgpa_converter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeCalculatorTab === 'cgpa_converter'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25 font-bold'
              : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
          }`}
        >
          <Percent className="w-4 h-4" />
          CGPA ⟷ Percentage Converter
        </button>

        <button
          onClick={() => setActiveCalculatorTab('target_predictor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeCalculatorTab === 'target_predictor'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25 font-bold'
              : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
          }`}
        >
          <Target className="w-4 h-4" />
          Internal Marks & Target Predictor
        </button>
      </div>

      {/* TAB 1: SGPA & SEMESTER MARKSHEET MATRIX */}
      {activeCalculatorTab === 'sgpa' && (
        <div className="space-y-6">
          
          {/* Metadata Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 theme-card border theme-border rounded-2xl p-4">
            <div>
              <label htmlFor="academic-semester-select" className="block text-xs font-semibold theme-text-muted mb-1">Academic Semester</label>
              <select
                id="academic-semester-select"
                name="academicSemester"
                aria-label="Academic Semester"
                value={semesterNumber}
                onChange={(e) => setSemesterNumber(parseInt(e.target.value))}
                className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold theme-text-muted mb-1">Branch / Degree Program</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>
          </div>

          {/* Subjects Table */}
          <div className="theme-card border theme-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 theme-card-sub border-b theme-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm theme-text-heading">Course / Subject Credit Breakdown</h3>
                <p className="text-[11px] theme-text-muted">Add or edit your semester courses and expected grades</p>
              </div>
              <button
                onClick={addSubjectRow}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Course
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="theme-card-sub theme-text-muted border-b theme-border">
                    <th className="py-3 px-4">Course Code</th>
                    <th className="py-3 px-4">Course / Subject Name</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Obtained Grade</th>
                    <th className="py-3 px-4 text-center">Grade Points</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border">
                  {subjects.map((sub) => (
                    <tr key={sub.id} className="hover:opacity-90 transition-colors">
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={sub.code}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, code: val } : s));
                          }}
                          className="theme-input border theme-border rounded px-2 py-1 text-xs font-mono text-blue-500 dark:text-cyan-300 w-24 outline-none font-bold"
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, name: val } : s));
                          }}
                          className="theme-input border theme-border rounded px-2 py-1 text-xs theme-text-heading w-full outline-none"
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="10"
                          value={sub.credits}
                          onChange={(e) => handleCreditsChange(sub.id, parseFloat(e.target.value) || 0)}
                          className="theme-input border theme-border rounded px-2 py-1 text-xs text-amber-500 font-bold w-16 text-center outline-none"
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <select
                          id={`subject-grade-${sub.id}`}
                          name={`subjectGrade_${sub.id}`}
                          aria-label={`Obtained Grade for ${sub.name || sub.code || 'Course'}`}
                          value={sub.grade}
                          onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                          className="theme-input border theme-border text-xs font-bold text-emerald-600 dark:text-emerald-400 rounded px-2 py-1 outline-none cursor-pointer"
                        >
                          {selectedUniv.gradeScale.map(g => (
                            <option key={g.grade} value={g.grade}>
                              {g.grade} ({g.description} - {g.points} Pts)
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2.5 px-4 text-center font-bold theme-text-heading">
                        {sub.gradePoints}
                      </td>

                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => removeSubjectRow(sub.id)}
                          className="theme-text-muted hover:text-rose-500 p-1 transition-colors cursor-pointer"
                          title="Remove Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Card & Action Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Score Metric 1: SGPA */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center shadow-lg">
              <div className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">Calculated Semester SGPA</div>
              <div className="text-4xl font-black text-amber-600 dark:text-amber-300 tracking-tight my-2">
                {calculatedSGPA.toFixed(2)}
                <span className="text-sm font-normal theme-text-muted"> / 10.0</span>
              </div>
              <div className="text-[11px] theme-text-muted">
                Total Semester Credits: <b className="theme-text-heading">{totalCredits}</b>
              </div>
            </div>

            {/* Score Metric 2: Equivalent Percentage */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 text-center shadow-lg">
              <div className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 mb-1">Official University Percentage</div>
              <div className="text-4xl font-black text-blue-600 dark:text-blue-300 tracking-tight my-2">
                {calculatedPercentage.toFixed(2)}%
              </div>
              <div className="text-[11px] theme-text-muted font-mono">
                Formula: {selectedUniv.formulaDescription}
              </div>
            </div>

            {/* Save & Print Actions */}
            <div className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-center gap-3">
              <button
                onClick={handleSaveMarksheet}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save to Academic Vault</span>
              </button>

              <button
                onClick={handlePrintTranscript}
                className="w-full py-2.5 px-4 theme-card-sub hover:opacity-80 theme-text-heading font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border theme-border transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-blue-500" />
                <span>Print Marksheet Transcript</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: STANDALONE CGPA TO PERCENTAGE CONVERTER */}
      {activeCalculatorTab === 'cgpa_converter' && (
        <div className="max-w-2xl mx-auto theme-card border theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold theme-text-heading">Direct CGPA to Percentage Calculator</h2>
            <p className="text-xs theme-text-muted">
              Instantly converts your cumulative grade point average using official regulations of <b>{selectedUniv.name}</b>.
            </p>
          </div>

          <div className="p-4 theme-card-sub rounded-2xl border theme-border space-y-3">
            <label className="block text-xs font-semibold theme-text-heading">
              Enter Cumulative CGPA (Scale 0.00 - 10.00):
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={standaloneCgpa}
                onChange={(e) => setStandaloneCgpa(e.target.value)}
                placeholder="e.g. 8.42"
                className="w-full theme-input border theme-border rounded-xl px-4 py-3 text-lg font-bold theme-text-heading focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Results Display */}
          {parseFloat(standaloneCgpa) > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Equivalent Percentage</div>
              <div className="text-5xl font-black text-amber-600 dark:text-amber-300">
                {selectedUniv.calculatePercentage(parseFloat(standaloneCgpa)).toFixed(2)}%
              </div>
              <div className="text-xs theme-text-muted font-mono pt-2">
                Applied University Rule: <span className="theme-text-heading font-semibold">{selectedUniv.formulaDescription}</span>
              </div>
            </div>
          )}

          {/* Comparison Matrix with other Indian Universities */}
          <div className="space-y-3 pt-4 border-t theme-border">
            <h3 className="text-xs font-bold uppercase tracking-wider theme-text-muted">
              Comparison Across Other Indian Universities for CGPA {standaloneCgpa || '8.0'}:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INDIAN_UNIVERSITIES.filter(u => u.code !== selectedUniv.code).slice(0, 6).map(u => {
                const val = parseFloat(standaloneCgpa) || 8.0;
                return (
                  <div key={u.code} className="theme-card-sub border theme-border p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold theme-text-heading">{u.code}</span>
                    <span className="font-bold text-blue-500 dark:text-cyan-300">{u.calculatePercentage(val).toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TARGET MARKS PREDICTOR */}
      {activeCalculatorTab === 'target_predictor' && (
        <div className="max-w-2xl mx-auto theme-card border theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold theme-text-heading flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              End-Semester Target Marks Predictor
            </h2>
            <p className="text-xs theme-text-muted">
              Find out exactly how many marks you need in the End-Semester exam based on your Mid-Term/Internal marks to score your dream grade!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="theme-card-sub border theme-border rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-semibold theme-text-heading">Your Internal / Sessional Marks</label>
              <input
                type="number"
                min="0"
                max={maxInternal}
                value={internalMarks}
                onChange={(e) => setInternalMarks(parseFloat(e.target.value) || 0)}
                className="w-full theme-input border theme-border rounded-xl px-3 py-2 text-sm font-bold theme-text-heading outline-none"
              />
              <div className="text-[10px] theme-text-muted">Out of max {maxInternal} internal marks</div>
            </div>

            <div className="theme-card-sub border theme-border rounded-2xl p-4 space-y-2">
              <label htmlFor="target-grade-select" className="block text-xs font-semibold theme-text-heading">Desired Target Grade</label>
              <select
                id="target-grade-select"
                name="targetGrade"
                aria-label="Desired Target Grade"
                value={targetGradePoint}
                onChange={(e) => setTargetGradePoint(parseInt(e.target.value))}
                className="w-full theme-input border theme-border rounded-xl px-3 py-2 text-sm font-bold text-amber-500 outline-none cursor-pointer"
              >
                {selectedUniv.gradeScale.map(g => (
                  <option key={g.grade} value={g.points}>
                    Grade {g.grade} ({g.description} - {g.points} Pts)
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Prediction Result Card */}
          <div className={`p-6 rounded-2xl border ${
            targetPrediction.achievable 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}>
            <div className="text-xs uppercase font-bold mb-1">Calculation Outcome</div>
            <div className="text-2xl font-black theme-text-heading my-2">
              {targetPrediction.achievable ? (
                <span>Required in End-Sem: <b className="text-amber-500 dark:text-amber-300">{targetPrediction.requiredExternal} / {maxExternal}</b> Marks</span>
              ) : (
                <span className="text-rose-500">Target Grade Not Achievable</span>
              )}
            </div>
            <p className="text-xs leading-relaxed">{targetPrediction.message}</p>
          </div>

        </div>
      )}

    </div>
  );
};
