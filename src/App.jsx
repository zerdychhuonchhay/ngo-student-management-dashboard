import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Menu, X, Users, DollarSign, Archive, Settings, Filter, PlusCircle, ArrowUpDown, BookOpen, FileText, BarChart2, Mail, CreditCard, Building, Edit, Eye, User, Mail as MailIcon, Phone, GraduationCap, School, Briefcase, BookCopy, Trash2, Calendar, ArrowLeft, ChevronDown, MapPin } from 'lucide-react';

// ===================================================================================
// --- DATA (data.js) ---
// In a larger application, this data would come from an API or a separate file.
// ===================================================================================

const initialStudents = [
    { "StudentID": "CPB00039", "Given Name": "Kunthea", "Family Name": "Yim", "Sex": "F", "DOB": "2003-05-12", "Grade": "University", "School": { "name": "RULE", "campus": "" }, "financials": [{ "category": "Education", "item": "Tuition Fee", "amount": "300", "frequency": "Monthly", "date": "2022-09-01" }, { "category": "Supplies", "item": "Textbooks", "amount": "150", "frequency": "Yearly", "date": "2022-09-01" }], "guardians": [{ "name": "Chan Makara", "relationship": "Mother", "contact": "012345678", "job": "Vendor", "income": 250 }], "Major": "Laws", "Comments": "Top 5 in school", "EnrollmentDate": "2022-09-01", "Location": "Phnom Penh" },
    { "StudentID": "CPG00025", "Given Name": "Sopheaktra", "Family Name": "Nim", "Sex": "F", "DOB": "2002-09-20", "Grade": "University", "School": { "name": "RUPP", "campus": "" }, "financials": [{ "category": "Education", "item": "Tuition Fee", "amount": "175", "frequency": "Monthly", "date": "2022-09-01" }], "guardians": [], "Major": "Business", "EnrollmentDate": "2022-09-01", "Location": "Phnom Penh" },
    { "StudentID": "CPB00041", "Given Name": "Dara", "Family Name": "Yim", "Sex": "M", "DOB": "2001-01-30", "Grade": "University", "School": { "name": "RULE", "campus": "" }, "financials": [{ "category": "Education", "item": "Tuition Fee", "amount": "750", "frequency": "Quarterly", "date": "2021-09-01" }], "guardians": [], "Major": "Laws", "EnrollmentDate": "2021-09-01", "Location": "Phnom Penh" },
    { "StudentID": "CPG00026", "Given Name": "Manita", "Family Name": "Run", "Sex": "F", "DOB": "2004-03-15", "Grade": "University", "School": { "name": "UEF", "campus": "" }, "financials": [{ "category": "Education", "item": "Tuition Fee", "amount": "620", "frequency": "Semester", "date": "2023-09-01" }], "guardians": [{ "name": "Mom Sopheap", "relationship": "Mother", "contact": "965455371", "job": "Factory Worker", "income": 200 }], "Major": "Accounting and Finance", "EnrollmentDate": "2023-09-01", "Location": "Railroad" },
    { "StudentID": "CPB00042", "Given Name": "Songha", "Family Name": "Run", "Sex": "M", "DOB": "2000-11-05", "Grade": "University", "School": { "name": "PPIU", "campus": "" }, "financials": [{ "category": "Education", "item": "Tuition Fee", "amount": "449.4", "frequency": "Semester", "date": "2020-09-01" }], "guardians": [{ "name": "Mom Sopheap", "relationship": "Mother", "contact": "965455371", "job": "Factory Worker", "income": 200 }], "Major": "Business", "EnrollmentDate": "2020-09-01", "Location": "Railroad" },
    { "StudentID": "CPG00027", "Given Name": "SivKheu", "Family Name": "Ny", "Sex": "F", "DOB": "2003-08-22", "Grade": "University", "School": { "name": "UEF", "campus": "" }, "financials": [{ "category": "Education", "item": "Tuition Fee", "amount": "310", "frequency": "Monthly", "date": "2023-09-01" }], "guardians": [{ "name": "Sor Sokhom", "relationship": "Mother", "contact": "89217867", "job": "Cleaner", "income": 180 }], "Major": "Accounting and Finance", "EnrollmentDate": "2023-09-01", "Location": "Railroad" },
    { "StudentID": "CPB00043", "Given Name": "Sreypich", "Family Name": "Chan", "Sex": "F", "DOB": "2005-02-10", "Grade": "12", "School": { "name": "SPS", "campus": "Tep" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "1500", "frequency": "Yearly", "date": "2018-09-01" }], "guardians": [], "EnrollmentDate": "2018-09-01", "Location": "Sorla" },
    { "StudentID": "CPG00028", "Given Name": "Raveen", "Family Name": "Samnang", "Sex": "M", "DOB": "2009-07-18", "Grade": "9", "School": { "name": "NewLife", "campus": "" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "70", "frequency": "Monthly", "date": "2015-09-01" }], "guardians": [{ "name": "Say Sotheary", "relationship": "Mother", "contact": "977408378", "job": "Vendor", "income": 150 }], "EnrollmentDate": "2015-09-01", "Location": "Steang MeanChey" },
    { "StudentID": "CPB00002", "Given Name": "Sovanna", "Family Name": "Sok (Mao)", "Sex": "M", "DOB": "2008-10-07", "Grade": "4", "School": { "name": "NewLife", "campus": "" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "60", "frequency": "Monthly", "date": "2023-09-01" }], "guardians": [{ "name": "Sok Khoeun", "relationship": "Father", "contact": "095 927592", "job": "Construction", "income": 220 }], "Major": "", "Comments": "", "EnrollmentDate": "", "Location": "Hope House" },
    { "StudentID": "CPB00008", "Given Name": "Chanvie", "Family Name": "Sophan", "Sex": "M", "DOB": "2010-09-10", "Grade": "6", "School": { "name": "", "campus": "" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "149", "frequency": "Monthly", "date": "2015-10-28" }], "guardians": [{ "name": "Sophan Chankakada", "relationship": "Father", "contact": "", "job": "", "income": 0 }], "Major": "", "Comments": "", "EnrollmentDate": "2015-10-28", "Location": "" },
    { "StudentID": "CPB00009", "Given Name": "Meng", "Family Name": "Sorn", "Sex": "M", "DOB": "2005-05-15", "Grade": "10", "School": { "name": "SPS", "campus": "TK" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "70", "frequency": "Monthly", "date": "2023-09-01" }], "guardians": [{ "name": "Ti Ra", "relationship": "Mother", "contact": "096 3378336", "job": "Vendor", "income": 120 }], "Major": "", "Comments": "Trying, abcent a lot, not catching up, not attending math tutoring", "EnrollmentDate": "", "Location": "Packaging" },
    { "StudentID": "CPB00018", "Given Name": "Chantha", "Family Name": "Samnang", "Sex": "M", "DOB": "2006-06-12", "Grade": "11", "School": { "name": "NewLife", "campus": "" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "10", "frequency": "Monthly", "date": "2023-09-01" }], "guardians": [{ "name": "Say Sotheary", "relationship": "Mother", "contact": "097 7408378", "job": "Vendor", "income": 150 }], "Major": "", "Comments": "", "EnrollmentDate": "", "Location": "Steang MeanChey" },
    { "StudentID": "CPB00021", "Given Name": "Raveen", "Family Name": "Samnang", "Sex": "M", "DOB": "2009-02-01", "Grade": "9", "School": { "name": "NewLife", "campus": "" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "70", "frequency": "Monthly", "date": "2023-09-01" }], "guardians": [{ "name": "Say Sotheary", "relationship": "Mother", "contact": "097 7408378", "job": "Vendor", "income": 150 }], "Major": "", "Comments": "Try hard but couldn’t catch the lessons, attendance regularly", "EnrollmentDate": "", "Location": "Steang MeanChey" },
    { "StudentID": "CPB00031", "Given Name": "Parin", "Family Name": "Proseur", "Sex": "M", "DOB": "2010-02-03", "Grade": "7", "School": { "name": "NewLife", "campus": "" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "70", "frequency": "Monthly", "date": "2023-09-01" }], "guardians": [], "Major": "", "Comments": "", "EnrollmentDate": "", "Location": "Steang MeanChey" },
    { "StudentID": "CPB00035", "Given Name": "Daravichen", "Family Name": "Sem", "Sex": "M", "DOB": "2009-03-21", "Grade": "9", "School": { "name": "SPS", "campus": "Tep" }, "financials": [{ "category": "Education", "item": "School Fee", "amount": "130", "frequency": "Monthly", "date": "2023-09-01" }], "guardians": [{ "name": "Chan Thom", "relationship": "Mother", "contact": "", "job": "N/A", "income": 0 }], "Major": "", "Comments": "Getting better, but still limited, not attend math tutoring regualarly", "EnrollmentDate": "", "Location": "Railroad" }
];


const initialGrades = [
  { "StudentID": "CPB00039", "Date": "2025-01-15", "Subject": "Contract Law", "Score": 88 },
  { "StudentID": "CPB00039", "Date": "2025-01-15", "Subject": "Constitutional Law", "Score": 91 },
  { "StudentID": "CPB00039", "Date": "2025-07-15", "Subject": "Criminal Law", "Score": 90 },
  { "StudentID": "CPB00039", "Date": "2025-07-15", "Subject": "Legal Research", "Score": 89 },
  { "StudentID": "CPG00025", "Date": "2025-01-15", "Subject": "Corporate Finance", "Score": 75 },
  { "StudentID": "CPG00025", "Date": "2025-01-15", "Subject": "Macroeconomics", "Score": 68 },
  { "StudentID": "CPG00025", "Date": "2025-07-15", "Subject": "Investment Analysis", "Score": 78 },
  { "StudentID": "CPG00025", "Date": "2025-07-15", "Subject": "International Trade", "Score": 71 },
  { "StudentID": "CPB00043", "Date": "2025-01-15", "Subject": "Math", "Score": 80 },
  { "StudentID": "CPB00043", "Date": "2025-01-15", "Subject": "Science", "Score": 75 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Essay (KGE-WR)", "Score": 30.60 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Dictation (KGE-DI)", "Score": 21.50 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Math (KGE-MA)", "Score": 42.00 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Physics (KGE-PS)", "Score": 19.50 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Chemistry (KGE-CHE)", "Score": 14.40 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Biology (KGE-BIO)", "Score": 22.30 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Earth Studies (KGE-ES)", "Score": 18.00 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Geography (KGE-GE)", "Score": 23.60 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "History (KGE-HI)", "Score": 30.90 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Moral Studies (KGE-MO)", "Score": 28.30 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "English (KGE-EN)", "Score": 31.00 },
  { "StudentID": "CPB00035", "Date": "2025-04-30", "Subject": "Morality & Attendance (KGE-ATT)", "Score": 35.24 }
];

const initialCurriculum = {
    "NewLife": {
        "": {
            "4": ["Math", "Science", "Khmer", "English"],
            "6": ["Math", "Science", "Khmer", "English"],
            "7": ["Math", "Science", "Khmer", "English"],
            "9": ["Math", "Science", "Khmer", "English", "Social Studies"],
            "10": ["Algebra", "Biology", "Khmer Literature", "English II", "World History"],
            "11": ["Algebra II", "Chemistry", "Khmer Literature", "English III", "World History"],
        }
    },
    "SPS": {
        "Tep": {
            "9": ["Math", "Physics", "Khmer", "English"],
            "12": ["Calculus", "Physics", "Chemistry", "Advanced English", "Cambodian History"]
        },
        "TK": {
            "10": ["Math", "Science", "Khmer", "English"]
        }
    },
    "UEF": {
        "": {
            "Accounting and Finance": {
                "Year 1": {
                    "Semester 1": ["Business English I", "History", "Contract Law", "Business Mathematics", "Microeconomics", "Accounting in Business I (FI)"],
                    "Semester 2": ["Business English II", "Philosophy", "Business Statistics", "Macroeconomics", "Human Resource Management"]
                }
            }
        }
    },
    "RULE": {
        "": {
            "Laws": {
                "Year 1": {
                    "Semester 1": ["Contract Law", "Constitutional Law"],
                    "Semester 2": ["Criminal Law", "Legal Research"]
                }
            }
        }
    },
    "RUPP": {
        "": {
            "Business": {
                 "Year 1": {
                    "Semester 1": ["Principles of Management", "Principles of Marketing"],
                    "Semester 2": ["Business Law", "Business Communication"]
                }
            }
        }
    },
    "PPIU": {
        "": {
            "Business": {
                 "Year 1": {
                    "Semester 1": ["Intro to Business", "Accounting I"],
                    "Semester 2": ["Microeconomics", "Business Statistics"]
                }
            }
        }
    }
};

const initialFollowUps = {};

// ===================================================================================
// --- HOOKS (hooks.js) ---
// Custom hooks for reusable logic like persisting state to localStorage.
// ===================================================================================

function useStickyState(defaultValue, key) {
    const [value, setValue] = useState(() => {
        try {
            const stickyValue = window.localStorage.getItem(key);
            return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
        } catch (error) {
            console.error("Error parsing JSON from localStorage", error);
            return defaultValue;
        }
    });
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}

function useOnClickOutside(ref, handler, menuRef) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target) || (menuRef && menuRef.current && menuRef.current.contains(event.target))) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, menuRef]);
}


// ===================================================================================
// --- LAYOUT COMPONENTS (components/layout.js) ---
// Components responsible for the main structure of the app, like sidebars and top bars.
// ===================================================================================

const TopBar = ({ onMenuClick, menuBtnRef }) => (
    <div className="p-4 bg-white shadow-md">
        <button onClick={onMenuClick} ref={menuBtnRef}><Menu /></button>
    </div>
);

const Sidebar = ({ activeTab, setActiveTab, isOpen, setOpen, onOpenSettings, menuRef }) => {
    const sidebarRef = useRef();
    useOnClickOutside(sidebarRef, () => setOpen(false), menuRef);

    const Tab = ({ id, icon, children }) => (
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab(id); setOpen(false); }}
           className={`w-full text-left font-semibold flex items-center gap-3 transition hover:bg-gray-50 p-2 rounded-md ${activeTab === id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'}`}>
            {icon} <span>{children}</span>
        </a>
    );
    return (
        <aside ref={sidebarRef} className={`bg-white w-64 h-full shadow-lg p-4 flex flex-col flex-shrink-0 absolute transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); setOpen(false); }} className="text-2xl font-bold text-gray-800 px-2 mb-2 block">Dashboard</a>
            <nav className="mt-4 space-y-1">
                <Tab id="dashboard" icon={<Users className="w-5 h-5" />}>Student List</Tab>
                <Tab id="school-center" icon={<Building className="w-5 h-5" />}>School Center</Tab>
                <Tab id="curriculum" icon={<BookCopy className="w-5 h-5" />}>Curriculum</Tab>
                <Tab id="archive" icon={<Archive className="w-5 h-5" />}>Archived</Tab>
                <Tab id="manual-instructions" icon={<FileText className="w-5 h-5" />}>Manual Instructions</Tab>
            </nav>
            <div className="mt-auto">
                <a href="#" onClick={(e) => { e.preventDefault(); onOpenSettings(); setOpen(false); }} className="w-full text-left font-semibold text-gray-700 flex items-center gap-3 transition hover:bg-gray-50 p-2 rounded-md mt-4 border-t pt-4">
                    <Settings className="w-5 h-5" /> <span>Settings</span>
                </a>
            </div>
        </aside>
    );
};


// ===================================================================================
// --- PAGE COMPONENTS (pages/*.js) ---
// Each component here represents a major view/page in the application.
// ===================================================================================

const DashboardPage = ({ students, onSort, sort, visibleColumns, allColumns, onOpenModal, setCategory, category, totals, onSelectSchool, onSelectStudent }) => (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow min-h-0">
        <header className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Information</h1>
                    <p className="text-gray-600 mt-1">Search, filter, and manage student records.</p>
                </div>
                <div className="flex gap-6 text-right mt-4 md:mt-0">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Students</h3>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">{totals.count}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Monthly Costs</h3>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">${totals.costs.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
                <CategoryFilters setCategory={setCategory} activeCategory={category} />
                <div className="flex space-x-2">
                    <button onClick={() => onOpenModal('filter')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 flex items-center gap-2"><Filter size={16} /> Filter</button>
                    <button onClick={() => onOpenModal('add', null)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 flex items-center gap-2"><PlusCircle size={16} /> Add Student</button>
                </div>
            </div>
        </header>
        <main className="flex-grow overflow-y-auto bg-white shadow-md rounded-lg">
            <StudentTable students={students} onSort={onSort} sort={sort} visibleColumns={visibleColumns} allColumns={allColumns} onSelectStudent={onSelectStudent} onSelectSchool={onSelectSchool} />
        </main>
    </div>
);

const CategoryFilters = ({ setCategory, activeCategory }) => {
    const categories = ['all', 'university', 'high-school', 'middle-school', 'elementary'];
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md shadow-sm capitalize ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                    {cat.replace('-', ' ')}
                </button>
            ))}
        </div>
    );
};

const StudentTable = ({ students, onSort, sort, visibleColumns, allColumns, onSelectStudent, onSelectSchool }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
                <tr>
                    {allColumns.map(col => visibleColumns[col.key] && (
                        <th key={col.key} onClick={() => onSort(col.key)}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            <span className="flex items-center gap-2">
                                {col.label}
                                {sort.column === col.key ? (sort.direction === 'asc' ? '↑' : '↓') : <ArrowUpDown size={12} />}
                            </span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {students.map(student => (
                    <tr key={student.StudentID} className="hover:bg-gray-50">
                        {allColumns.map(col => visibleColumns[col.key] && (
                            <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {col.key === 'Given Name' ? (
                                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectStudent(student); }}
                                       className="font-semibold text-indigo-600 hover:underline">
                                        {student[col.key] || 'N/A'}
                                    </a>
                                ) : col.key === 'School' ? (
                                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectSchool(); }}
                                       className="font-semibold text-blue-600 hover:underline">
                                        {student.School.name}{student.School.campus && ` (${student.School.campus})`}
                                    </a>
                                ) : col.key === 'MonthlyCosts' ? (
                                    `$${(student.financials || []).reduce((total, item) => {
                                        if (item.frequency !== 'One-time') {
                                           return total + calculateMonthlyEquivalent(item.amount, item.frequency)
                                        }
                                        return total;
                                    }, 0).toFixed(2)} / Monthly Eq.`
                                ) : (
                                    student[col.key] || 'N/A'
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        {students.length === 0 && <p className="p-8 text-center text-gray-500">No matching students found.</p>}
    </div>
);

const getCambodianGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600' };
    if (score >= 50) return { grade: 'E', color: 'text-red-600' };
    return { grade: 'F', color: 'text-red-800' };
};

const GradesPage = ({ student, grades, onOpenModal, onBack, schoolAverages }) => {
    const performanceTrendData = useMemo(() => {
        if (!grades || grades.length === 0) return [];
        
        const dataByDate = grades.reduce((acc, grade) => {
            const dateKey = grade.Date.substring(0, 7); // Group by month (YYYY-MM)
            if (!acc[dateKey]) {
                acc[dateKey] = { total: 0, count: 0, date: grade.Date };
            }
            acc[dateKey].total += grade.Score;
            acc[dateKey].count++;
            return acc;
        }, {});

        return Object.values(dataByDate)
            .map(({ date, total, count }) => ({
                date: new Date(date).toLocaleString('default', { month: 'short', year: 'numeric' }),
                "Average Score": parseFloat((total / count).toFixed(2)),
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

    }, [grades]);
    
    const subjectComparisonData = useMemo(() => {
        if (!grades || grades.length === 0) return [];
        const subjectScores = {};
        grades.forEach(grade => {
            if (!subjectScores[grade.Subject]) {
                subjectScores[grade.Subject] = [];
            }
            subjectScores[grade.Subject].push(grade.Score);
        });

        return Object.entries(subjectScores).map(([subject, scores]) => {
            const studentAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
            const schoolAvgKey = `${student.School.name}-${student.Grade}-${subject}`;
            return {
                subject,
                "Student Score": parseFloat(studentAvg.toFixed(2)),
                "School Average": schoolAverages[schoolAvgKey] || 0,
            };
        });
    }, [grades, student, schoolAverages]);

    if (!student) {
        return <div className="p-8 text-center text-gray-600">Please select a student from the dashboard to view their grades.</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow min-h-0 overflow-y-auto">
            <header className="bg-white shadow-md rounded-lg p-6 mb-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <button onClick={onBack} className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-2">
                            <ArrowLeft size={14} /> Back to Profile
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Grade Center: {student['Given Name']}</h1>
                        <p className="text-gray-600">Student ID: {student.StudentID}</p>
                    </div>
                    <button onClick={() => onOpenModal('add-grades', student)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 flex items-center gap-2"><PlusCircle size={16} /> Add Grades</button>
                </div>
            </header>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Performance Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Average Score" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Subject Strengths & Weaknesses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis domain={[0, 100]}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Student Score" fill="#8884d8" />
                            <Bar dataKey="School Average" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">All Grade Records</h2>
                <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Subject</th>
                                <th className="px-4 py-2 text-left">Score</th>
                                <th className="px-4 py-2 text-left">School Average</th>
                                <th className="px-4 py-2 text-left">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                        {grades.map((gradeItem, index) => {
                            const cambodianGrade = getCambodianGrade(gradeItem.Score);
                            const schoolAvgKey = `${student.School.name}-${student.Grade}-${gradeItem.Subject}`;
                            const schoolAvg = schoolAverages[schoolAvgKey] ? schoolAverages[schoolAvgKey].toFixed(2) : 'N/A';
                            return (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2">{gradeItem.Date}</td>
                                    <td className="px-4 py-2">{gradeItem.Subject}</td>
                                    <td className="px-4 py-2 font-semibold">{gradeItem.Score}</td>
                                    <td className="px-4 py-2">{schoolAvg}</td>
                                    <td className={`px-4 py-2 font-bold ${cambodianGrade.color}`}>{cambodianGrade.grade}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SchoolCenterPage = ({ students, grades, onSelectStudent, getCategoryForStudent }) => {
    const schoolData = useMemo(() => {
        const schools = {};

        students.forEach(student => {
            if (!student.School || !student.School.name) return;

            const schoolName = student.School.name;
            if (!schools[schoolName]) {
                schools[schoolName] = {
                    name: schoolName,
                    students: [],
                    grades: [],
                    gradeLevels: {},
                    category: getCategoryForStudent(student) === 'university' ? 'university' : 'k12'
                };
            }
            schools[schoolName].students.push(student);
            if (getCategoryForStudent(student) === 'university') {
                schools[schoolName].category = 'university';
            }
            if (!schools[schoolName].gradeLevels[student.Grade]) {
                schools[schoolName].gradeLevels[student.Grade] = 0;
            }
            schools[schoolName].gradeLevels[student.Grade]++;
        });

        grades.forEach(grade => {
            const student = students.find(s => s.StudentID === grade.StudentID);
            if (student && student.School && student.School.name && schools[student.School.name]) {
                schools[student.School.name].grades.push(grade);
            }
        });

        const categorizedSchools = { university: [], k12: [] };

        Object.values(schools).forEach(school => {
            const totalScore = school.grades.reduce((sum, g) => sum + g.Score, 0);
            const averageScore = school.grades.length > 0 ? (totalScore / school.grades.length).toFixed(2) : 'N/A';
            
            const studentsWithAvg = school.students.map(stud => {
                 const studentGrades = grades.filter(g => g.StudentID === stud.StudentID);
                 const total = studentGrades.reduce((sum, g) => sum + g.Score, 0);
                 const avg = studentGrades.length > 0 ? (total / studentGrades.length).toFixed(2) : 'N/A';
                 return {...stud, averageScore: avg };
            });

            const finalSchoolData = {
                ...school,
                averageScore,
                students: studentsWithAvg,
            };

            if (school.category === 'university') {
                categorizedSchools.university.push(finalSchoolData);
            } else {
                categorizedSchools.k12.push(finalSchoolData);
            }
        });

        return categorizedSchools;

    }, [students, grades, getCategoryForStudent]);

    const SchoolCard = ({ school }) => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">{school.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-500 uppercase">Total Students</h4>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">{school.students.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-500 uppercase">Avg. Performance</h4>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">{school.averageScore}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 uppercase text-center mb-2">Students by Grade</h4>
                    <div className="text-xs text-center">
                        {Object.entries(school.gradeLevels).map(([grade, count]) => (
                            <span key={grade} className="inline-block bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 mr-1 mb-1">
                                Grade {grade}: <strong>{count}</strong>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div>
               <h4 className="text-lg font-semibold mb-2">Student List</h4>
               <div className="max-h-72 overflow-y-auto border rounded-md">
                   <table className="min-w-full">
                       <thead className="bg-gray-50 sticky top-0">
                           <tr>
                               <th className="px-4 py-2 text-left text-sm">Name</th>
                               <th className="px-4 py-2 text-left text-sm">Grade</th>
                               <th className="px-4 py-2 text-left text-sm">Average Score</th>
                           </tr>
                       </thead>
                       <tbody>
                           {school.students.map(student => (
                               <tr key={student.StudentID} className="border-b">
                                   <td className="px-4 py-2">
                                       <a href="#" onClick={(e) => { e.preventDefault(); onSelectStudent(student); }} className="text-indigo-600 hover:underline">{student['Given Name']} {student['Family Name']}</a>
                                   </td>
                                   <td className="px-4 py-2">{student.Grade}</td>
                                   <td className="px-4 py-2 font-semibold">{student.averageScore}</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">School Center</h1>
                <p className="text-gray-600 mt-1">An overview of all schools, organized by level.</p>
            </header>
            <div>
                <h2 className="text-3xl font-bold text-gray-700 border-b-2 border-indigo-300 pb-2 mb-4">Universities</h2>
                {schoolData.university.length > 0 ? schoolData.university.map(school => <SchoolCard key={school.name} school={school} />) : <p className="text-gray-500">No university data available.</p>}
            </div>
            <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-700 border-b-2 border-indigo-300 pb-2 mb-4">K-12 Schools</h2>
                {schoolData.k12.length > 0 ? schoolData.k12.map(school => <SchoolCard key={school.name} school={school} />) : <p className="text-gray-500">No K-12 school data available.</p>}
            </div>
        </div>
    );
};


const ArchivePage = ({ archivedStudents, onRestore, onDelete, onViewProfile }) => (
     <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow min-h-0">
        <header className="bg-white shadow-md rounded-lg p-6 mb-6"><h1 className="text-3xl font-bold text-gray-900">Archived Students</h1></header>
        <main className="flex-grow overflow-y-auto bg-white shadow-md rounded-lg">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason for Leaving</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Left</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {archivedStudents.map(student => (
                            <tr key={student.StudentID}>
                                <td className="px-6 py-4">{student.StudentID}</td>
                                <td className="px-6 py-4">
                                    <a href="#" onClick={(e) => { e.preventDefault(); onViewProfile(student); }} className="font-semibold text-indigo-600 hover:underline">
                                        {student['Given Name']} {student['Family Name']}
                                    </a>
                                </td>
                                <td className="px-6 py-4">{student.ReasonLeft}</td>
                                <td className="px-6 py-4">{student.DateLeft}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => onRestore(student)} className="text-indigo-600 hover:underline">Restore</button>
                                    <button onClick={() => onDelete(student)} className="text-red-600 hover:underline ml-4">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {archivedStudents.length === 0 && <p className="p-8 text-center text-gray-500">No archived students.</p>}
            </div>
        </main>
    </div>
);

const CurriculumPage = ({ curriculum, setCurriculum }) => {
    
    const handleSubjectChange = (path, newSubjects) => {
        setCurriculum(prev => {
            const newCurriculum = JSON.parse(JSON.stringify(prev));
            let current = newCurriculum;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = newSubjects.split(',').map(s => s.trim()).filter(Boolean);
            return newCurriculum;
        });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Curriculum Management</h1>
                <p className="text-gray-600 mt-1">Define subjects for different schools, grades, and majors.</p>
            </header>
            <div className="space-y-8">
                {Object.entries(curriculum).map(([schoolName, schoolData]) => (
                    <div key={schoolName} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">{schoolName}</h2>
                        <div className="space-y-4">
                            {Object.entries(schoolData).map(([campus, campusData]) => (
                                <div key={campus} className="pl-4 border-l-2 border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-700">{campus || 'Main Campus'}</h3>
                                    <div className="space-y-3 mt-2">
                                        {Object.entries(campusData).map(([gradeOrMajor, gradeOrMajorData]) => {
                                            if (Array.isArray(gradeOrMajorData)) {
                                                return (
                                                    <div key={gradeOrMajor}>
                                                        <label className="block text-lg font-semibold text-gray-700">Grade {gradeOrMajor}</label>
                                                        <textarea
                                                            className="w-full p-2 border rounded-md mt-1"
                                                            rows="2"
                                                            defaultValue={gradeOrMajorData.join(', ')}
                                                            onChange={(e) => handleSubjectChange([schoolName, campus, gradeOrMajor], e.target.value)}
                                                        />
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div key={gradeOrMajor} className="pl-4 border-l-2 border-indigo-200">
                                                        <h4 className="text-lg font-semibold text-gray-600">{gradeOrMajor}</h4>
                                                        <div className="space-y-2 mt-1">
                                                            {Object.entries(gradeOrMajorData).map(([year, yearData]) => (
                                                                <div key={year} className="pl-4">
                                                                    <h5 className="font-semibold text-gray-500">{year}</h5>
                                                                    {Object.entries(yearData).map(([semester, subjects]) => (
                                                                        <div key={semester} className="mt-1">
                                                                            <label className="block font-medium text-gray-500">{semester}</label>
                                                                            <textarea
                                                                                className="w-full p-2 border rounded-md mt-1"
                                                                                rows="2"
                                                                                defaultValue={subjects.join(', ')}
                                                                                onChange={(e) => handleSubjectChange([schoolName, campus, gradeOrMajor, year, semester], e.target.value)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ManualInstructionsPage = () => {
    const Section = ({ title, children }) => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">{title}</h2>
            <div className="prose max-w-none prose-indigo">{children}</div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manual Instructions</h1>
                <p className="text-gray-600 mt-1">A guide to all features and functions of the Student Management Dashboard.</p>
            </header>
            
            <Section title="Dashboard: Student List">
                <p>This is the main page where you can see a list of all active students.</p>
                <ul>
                    <li><strong>Sorting:</strong> Click on any column header (e.g., "First Name", "Age") to sort the table by that column. Click again to reverse the order.</li>
                    <li><strong>Category Filters:</strong> Use the buttons at the top (e.g., "University", "High School") to quickly filter students by their educational level.</li>
                    <li><strong>Advanced Filtering:</strong> Click the <strong>Filter</strong> button to open a modal where you can search by name or filter by multiple criteria like grade, school, sex, and age.</li>
                    <li><strong>Add Student:</strong> Click the <strong>Add Student</strong> button to open a form for adding a new student record.</li>
                    <li><strong>Navigation:</strong> Click on a student's name to go to their detailed <strong>Profile Page</strong>. Click on a school's name to go to the <strong>School Center</strong> page for that school.</li>
                </ul>
            </Section>

            <Section title="Student Profile Page">
                <p>This page shows all information for a single student.</p>
                <ul>
                    <li><strong>Information Cards:</strong> Personal, Academic, Guardian, and Financial details are displayed in separate cards for clarity.</li>
                    <li><strong>Edit Profile:</strong> Click the <strong>Edit</strong> button to open a form where you can update the student's information. From the edit form, you can also <strong>Archive</strong> the student.</li>
                    <li><strong>View Grades:</strong> Click the <strong>View Grades</strong> button to navigate to the <strong>Grades Center</strong> for that specific student.</li>
                    <li><strong>Follow-up History:</strong> This section shows a chronological list of all follow-ups. You can <strong>Add</strong>, <strong>Edit</strong>, or <strong>Delete</strong> follow-up records from here.</li>
                </ul>
            </Section>

            <Section title="Monthly Follow-Up Procedure">
                <p>The follow-up form is designed to capture a holistic view of the student's well-being and progress. It should be completed monthly.</p>
                <h3 className="font-semibold mt-4">1. Well-being Progress</h3>
                <p>Rate the student's Physical Health, Social Interaction, and Home Life as "Good," "Average," or "Poor." If you select "Average" or "Poor," a text box will appear, requiring you to provide specific details and explain how we can help.</p>
                <h3 className="font-semibold mt-4">2. Risk Factors</h3>
                <p>Check all applicable risk factors from the comprehensive list. If any risk factors are selected, you must provide details in the text area that appears below the list.</p>
                <h3 className="font-semibold mt-4">3. Staff Notes & Recommendations</h3>
                <p>Use the "Notes" section for any information not captured elsewhere. Use the "Changes / Recommendations" section to suggest actionable steps for supporting the student.</p>
            </Section>

            <Section title="Grades Center">
                <p>This page provides a detailed academic overview for a selected student. You must first select a student from the Dashboard or Profile page to view this section.</p>
                <ul>
                    <li><strong>All Grade Records:</strong> A table showing every grade ever entered for the student, including the Cambodian letter grade (A-F).</li>
                    <li><strong>Monthly/Semester Summary:</strong> A summary table that averages the scores for each subject by month (for K-12) or semester (for University).</li>
                    <li><strong>Yearly Summary:</strong> A simple table showing the overall average score for each year.</li>
                    <li><strong>Add Grades:</strong> Click the <strong>Add Grades</strong> button to enter new scores. The subjects available in the form are pulled directly from the <strong>Curriculum</strong> page.</li>
                </ul>
            </Section>

            <Section title="School Center">
                <p>This page provides analytics to compare performance across different schools and educational levels.</p>
                <ul>
                    <li><strong>Average Grades by School Level:</strong> A bar chart comparing the average scores in core subjects across different levels (e.g., University vs. High School).</li>
                    <li><strong>School-Specific Details:</strong> When you navigate here by clicking a school name on the dashboard, you will see detailed charts and a list of all students attending that specific school.</li>
                </ul>
            </Section>

            <Section title="Curriculum Management">
                 <p>This page allows administrators to define the official list of subjects for each school, grade, and university major.</p>
                 <ul>
                    <li><strong>Editing Subjects:</strong> To edit the curriculum, simply type in the text boxes. Subjects should be separated by a comma (e.g., Math, Science, History).</li>
                    <li><strong>Impact:</strong> The subjects defined here will automatically appear in the "Add Grades" form for students, ensuring consistency in data entry.</li>
                </ul>
            </Section>

            <Section title="Archived Students">
                <p>This page lists all students who are no longer active in the program.</p>
                <ul>
                    <li><strong>Archiving:</strong> A student can be archived from the "Edit Student" form on their profile page.</li>
                    <li><strong>Restoring:</strong> If a student returns, you can find them in the archive list and click the <strong>Restore</strong> button to move them back to the active student list.</li>
                </ul>
            </Section>

            <Section title="Settings">
                 <p>This section allows for app-wide configuration.</p>
                 <ul>
                    <li><strong>Column Visibility:</strong> Check or uncheck boxes to control which columns are visible on the main dashboard's student table.</li>
                    <li><strong>Data Management:</strong> The <strong>Reset All Data</strong> button will erase all student records, grades, and follow-ups, restoring the application to its original state. <strong>Use with extreme caution, as this action cannot be undone.</strong></li>
                </ul>
            </Section>
        </div>
    );
};


const DetailItem = ({ icon, label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
            {icon} {label}
        </dt>
        <dd className="mt-1 text-md text-gray-900">{value || 'N/A'}</dd>
    </div>
);

const StudentProfilePage = ({ student, onOpenModal, setActiveTab, followUps, onDeleteFollowUp, onBack }) => {
    if (!student) {
        return <div className="p-8 text-center text-gray-600">No student selected. Please go back to the dashboard.</div>;
    }

    const FollowUpDetail = ({ label, rating, details }) => {
        const color = rating === 'Good' ? 'text-green-600' : rating === 'Average' ? 'text-yellow-600' : 'text-red-600';
        return (
            <div>
                <strong>{label}:</strong>
                <span className={`font-semibold ml-2 ${color}`}>{rating}</span>
                {details && <p className="text-sm text-gray-600 pl-4">- {details}</p>}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <button onClick={onBack} className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-2">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">{student['Given Name']} {student['Family Name']}</h1>
                        <p className="text-gray-600">Student Profile</p>
                    </div>
                    <div className="flex gap-2 mt-8">
                        <button onClick={() => onOpenModal('edit', student)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"><Edit size={16}/> Edit</button>
                        <button onClick={() => { setActiveTab('grades'); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"><Eye size={16}/> View Grades</button>
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Student ID" value={student.StudentID} />
                            <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Age" value={student.Age} />
                            <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Sex" value={student.Sex === 'M' ? 'Male' : 'Female'} />
                            <DetailItem icon={<Calendar size={16} className="text-gray-400"/>} label="Date of Birth" value={student.DOB} />
                            <DetailItem icon={<Calendar size={16} className="text-gray-400"/>} label="Enrollment Date" value={student.EnrollmentDate} />
                            <DetailItem icon={<MapPin size={16} className="text-gray-400"/>} label="Location" value={student.Location} />
                        </dl>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Academic & Financial Info</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <DetailItem icon={<School size={16} className="text-gray-400"/>} label="School" value={`${student.School.name}${student.School.campus ? ` (${student.School.campus})` : ''}`} />
                            <DetailItem icon={<GraduationCap size={16} className="text-gray-400"/>} label="Grade" value={student.Grade} />
                            <DetailItem icon={<Briefcase size={16} className="text-gray-400"/>} label="Major" value={student.Major} />
                             <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <DollarSign size={16} className="text-gray-400" /> Financial Records
                                </dt>
                                {(student.financials || []).length > 0 ? (student.financials || []).map((item, index) => (
                                    <dd key={index} className="mt-2 text-md text-gray-900 pl-4 border-l ml-2 py-1">
                                         <p className="font-semibold">{item.item} <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{item.category}</span></p>
                                         <p className="text-sm">${parseFloat(item.amount || 0).toFixed(2)} ({item.frequency})</p>
                                         <p className="text-xs text-gray-500">Date: {item.date || 'N/A'}</p>
                                    </dd>
                                )) : <dd className="mt-1 text-md text-gray-900 pl-6">No financial records.</dd>}
                            </div>
                        </dl>
                    </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Guardian Contact</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                           {student.guardians && student.guardians.length > 0 ? (
                                <>
                                    <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Guardian Name" value={student.guardians[0].name} />
                                    <DetailItem icon={<Phone size={16} className="text-gray-400"/>} label="Contact" value={student.guardians[0].contact} />
                                    <DetailItem icon={<Briefcase size={16} className="text-gray-400"/>} label="Job" value={student.guardians[0].job} />
                                    <DetailItem icon={<DollarSign size={16} className="text-gray-400"/>} label="Income" value={`$${student.guardians[0].income}`} />
                                </>
                            ) : (
                                <p className="col-span-2 text-gray-500">No guardian information available.</p>
                            )}
                        </dl>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Follow-up History</h3>
                        <button onClick={() => onOpenModal('add-follow-up', student)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 flex items-center gap-1"><PlusCircle size={14}/> Add</button>
                    </div>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {followUps.length > 0 ? followUps.slice().reverse().map((followUp, index) => {
                            const originalIndex = followUps.length - 1 - index;
                            return (
                                <div key={index} className="bg-gray-50 p-4 rounded-md border">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-gray-500">{new Date(followUp.date).toLocaleString()}</p>
                                        <div className="flex gap-2 flex-shrink-0 ml-4">
                                            <button onClick={() => onOpenModal('edit-follow-up', {...student, followUpToEdit: followUp, followUpIndex: originalIndex})} className="text-blue-600 hover:underline"><Edit size={14}/></button>
                                            <button onClick={() => onDeleteFollowUp(student.StudentID, originalIndex)} className="text-red-600 hover:underline"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                    <div className="prose prose-sm max-w-none mt-2">
                                        <h4>Well-being Progress</h4>
                                        <FollowUpDetail label="Physical Health" {...followUp.physicalHealth} />
                                        <FollowUpDetail label="Social Interaction" {...followUp.socialInteraction} />
                                        <FollowUpDetail label="Home Life" {...followUp.homeLife} />
                                        
                                        <h4 className="mt-4">Risk Factors</h4>
                                        {(followUp.riskFactors && followUp.riskFactors.length > 0) ? (
                                            <>
                                                <p><strong>Identified:</strong> {followUp.riskFactors.join(', ')}</p>
                                                {followUp.riskFactorsDetails && <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong>Details:</strong> {followUp.riskFactorsDetails}</p>}
                                            </>
                                        ) : <p>None reported.</p>}
                                        
                                        <h4 className="mt-4">Notes & Recommendations</h4>
                                        {followUp.notes && <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong>Notes:</strong> {followUp.notes}</p>}
                                        {followUp.recommendations && <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong>Recommendations:</strong> {followUp.recommendations}</p>}
                                    </div>
                                </div>
                            );
                        }) : <p className="text-center text-gray-500 py-4">No follow-up records found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArchivedProfilePage = ({ student, setActiveTab, followUps }) => {
    if (!student) {
        return <div className="p-8 text-center text-gray-600">No student selected.</div>;
    }

    const FollowUpDetail = ({ label, rating, details }) => {
        const color = rating === 'Good' ? 'text-green-600' : rating === 'Average' ? 'text-yellow-600' : 'text-red-600';
        return (
            <div>
                <strong>{label}:</strong>
                <span className={`font-semibold ml-2 ${color}`}>{rating}</span>
                {details && <p className="text-sm text-gray-600 pl-4">- {details}</p>}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
             <header className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{student['Given Name']} {student['Family Name']}</h1>
                        <p className="text-red-600 font-semibold">Archived Student</p>
                    </div>
                    <button onClick={() => setActiveTab('archive')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"><ArrowLeft size={16}/> Back to Archive</button>
                </div>
                <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                    <p><strong>Date Left:</strong> {student.DateLeft}</p>
                    <p><strong>Reason:</strong> {student.ReasonLeft}</p>
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Student ID" value={student.StudentID} />
                            <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Age" value={student.Age} />
                            <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Sex" value={student.Sex === 'M' ? 'Male' : 'Female'} />
                            <DetailItem icon={<Calendar size={16} className="text-gray-400"/>} label="Date of Birth" value={student.DOB} />
                            <DetailItem icon={<Calendar size={16} className="text-gray-400"/>} label="Enrollment Date" value={student.EnrollmentDate} />
                            <DetailItem icon={<MapPin size={16} className="text-gray-400"/>} label="Location" value={student.Location} />
                        </dl>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Academic & Financial Info</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <DetailItem icon={<School size={16} className="text-gray-400"/>} label="School" value={`${student.School.name}${student.School.campus ? ` (${student.School.campus})` : ''}`} />
                            <DetailItem icon={<GraduationCap size={16} className="text-gray-400"/>} label="Grade" value={student.Grade} />
                            <DetailItem icon={<Briefcase size={16} className="text-gray-400"/>} label="Major" value={student.Major} />
                             <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <DollarSign size={16} className="text-gray-400" /> Financial Records
                                </dt>
                                {(student.financials || []).length > 0 ? (student.financials || []).map((item, index) => (
                                    <dd key={index} className="mt-2 text-md text-gray-900 pl-4 border-l ml-2 py-1">
                                         <p className="font-semibold">{item.item} <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{item.category}</span></p>
                                         <p className="text-sm">${parseFloat(item.amount || 0).toFixed(2)} ({item.frequency})</p>
                                         <p className="text-xs text-gray-500">Date: {item.date || 'N/A'}</p>
                                    </dd>
                                )) : <dd className="mt-1 text-md text-gray-900 pl-6">No financial records.</dd>}
                            </div>
                        </dl>
                    </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Guardian Contact</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Guardian Name" value={student['Guardian Name']} />
                            <DetailItem icon={<Phone size={16} className="text-gray-400"/>} label="Guardian Contact" value={student['Guardian Contact']} />
                        </dl>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Follow-up History</h3>
                    </div>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {followUps.length > 0 ? followUps.slice().reverse().map((followUp, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-md border">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-500">{new Date(followUp.date).toLocaleString()}</p>
                                </div>
                                <div className="prose prose-sm max-w-none mt-2">
                                    <h4>Well-being Progress</h4>
                                    <FollowUpDetail label="Physical Health" {...followUp.physicalHealth} />
                                    <FollowUpDetail label="Social Interaction" {...followUp.socialInteraction} />
                                    <FollowUpDetail label="Home Life" {...followUp.homeLife} />
                                    
                                    <h4 className="mt-4">Risk Factors</h4>
                                    {(followUp.riskFactors && followUp.riskFactors.length > 0) ? (
                                        <>
                                            <p><strong>Identified:</strong> {followUp.riskFactors.join(', ')}</p>
                                            {followUp.riskFactorsDetails && <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong>Details:</strong> {followUp.riskFactorsDetails}</p>}
                                        </>
                                    ) : <p>None reported.</p>}
                                    
                                    <h4 className="mt-4">Notes & Recommendations</h4>
                                    {followUp.notes && <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong>Notes:</strong> {followUp.notes}</p>}
                                    {followUp.recommendations && <p className="text-sm text-gray-600 whitespace-pre-wrap"><strong>Recommendations:</strong> {followUp.recommendations}</p>}
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 py-4">No follow-up records found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===================================================================================
// --- MODAL COMPONENTS (components/modals.js) ---
// All components that appear as modal dialogs are grouped here.
// ===================================================================================

const Modal = ({ children, title, onClose, maxWidth = 'max-w-3xl' }) => {
    const modalRef = useRef();
    useOnClickOutside(modalRef, onClose);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div ref={modalRef} className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose}><X /></button>
                </header>
                <main className="p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

const StudentFormModal = ({ student, onReview, onClose, onArchive }) => {
    const [formData, setFormData] = useState(student || { 'StudentID': '', 'Given Name': '', 'Family Name': '', DOB: '', Sex: '', Grade: '', School: { name: '', campus: '' }, financials: [{ category: 'Education', item: '', amount: '', frequency: 'Monthly', date: '' }], guardians: [{ name: '', relationship: '', contact: '', job: '', income: '' }], 'Major': '', 'Comments': '', 'EnrollmentDate': '', 'Location': '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'schoolName' || name === 'schoolCampus') {
            const field = name === 'schoolName' ? 'name' : 'campus';
            setFormData(prev => ({ ...prev, School: { ...prev.School, [field]: value } }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleFinancialChange = (index, field, value) => {
        const newFinancials = [...(formData.financials || [])];
        newFinancials[index][field] = value;
        setFormData({ ...formData, financials: newFinancials });
    };

    const addFinancial = () => {
        const newFinancials = [...(formData.financials || []), { category: 'Education', item: '', amount: '', frequency: 'Monthly', date: new Date().toISOString().split('T')[0] }];
        setFormData({ ...formData, financials: newFinancials });
    };

    const removeFinancial = (index) => {
        const newFinancials = (formData.financials || []).filter((_, i) => i !== index);
        setFormData({ ...formData, financials: newFinancials });
    };

    const handleGuardianChange = (index, field, value) => {
        const newGuardians = [...(formData.guardians || [])];
        newGuardians[index][field] = value;
        setFormData({ ...formData, guardians: newGuardians });
    };

    const addGuardian = () => {
        const newGuardians = [...(formData.guardians || []), { name: '', relationship: '', contact: '', job: '', income: '' }];
        setFormData({ ...formData, guardians: newGuardians });
    };

    const removeGuardian = (index) => {
        const newGuardians = (formData.guardians || []).filter((_, i) => i !== index);
        setFormData({ ...formData, guardians: newGuardians });
    };

    const handleSubmit = (e) => { e.preventDefault(); onReview(formData); };

    const formFields = Object.keys(formData).filter(k => {
        const fieldsToExclude = ['StudentID', 'Age', 'DateLeft', 'financials', 'School', 'guardians'];
        return !fieldsToExclude.includes(k);
    });

    return (
        <Modal title={student ? "Edit Student" : "Add New Student"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input 
                            type="text" 
                            name="StudentID" 
                            value={formData.StudentID || ''} 
                            onChange={handleChange} 
                            className="mt-1 block w-full p-2 border rounded-md bg-gray-100 focus:bg-white"
                            disabled={!!student} // Disable if editing
                            required 
                        />
                    </div>
                    <div className="md:col-span-1 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">School Name</label>
                            <input type="text" name="schoolName" value={formData.School.name || ''} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Campus/Branch</label>
                            <input type="text" name="schoolCampus" value={formData.School.campus || ''} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" />
                        </div>
                    </div>
                    {formFields.map(key => (
                        <div key={key} className={key === 'Comments' ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-gray-700">{key}</label>
                            {key === 'Comments' ? (
                                <textarea name={key} value={formData[key] || ''} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" rows="3" />
                            ) : (
                                <input type={key === 'DOB' || key === 'EnrollmentDate' ? 'date' : 'text'}
                                       name={key} value={formData[key] || ''} onChange={handleChange}
                                       className="mt-1 block w-full p-2 border rounded-md" />
                            )}
                        </div>
                    ))}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Guardians</h3>
                        {(formData.guardians || []).map((guardian, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 mb-2 p-2 border rounded-md">
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" value={guardian.name} onChange={(e) => handleGuardianChange(index, 'name', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Relationship</label>
                                    <input type="text" value={guardian.relationship} onChange={(e) => handleGuardianChange(index, 'relationship', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                                    <input type="text" value={guardian.contact} onChange={(e) => handleGuardianChange(index, 'contact', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Job</label>
                                    <input type="text" value={guardian.job} onChange={(e) => handleGuardianChange(index, 'job', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-11">
                                    <label className="block text-sm font-medium text-gray-700">Monthly Income ($)</label>
                                    <input type="number" value={guardian.income} onChange={(e) => handleGuardianChange(index, 'income', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-1 flex items-end">
                                    <button type="button" onClick={() => removeGuardian(index)} className="p-2 text-red-500 hover:text-red-700 mt-6"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addGuardian} className="text-sm text-indigo-600 hover:underline">+ Add Guardian</button>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Financial Records</h3>
                        {(formData.financials || []).map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 mb-2 p-2 border rounded-md items-center">
                                <div className="col-span-full md:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Item Description</label>
                                    <input type="text" value={item.item} onChange={(e) => handleFinancialChange(index, 'item', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" placeholder="e.g., Tuition Fee, Books" />
                                </div>
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select value={item.category} onChange={(e) => handleFinancialChange(index, 'category', e.target.value)} className="mt-1 block w-full p-2 border rounded-md">
                                        <option>Education</option>
                                        <option>Supplies</option>
                                        <option>Transportation</option>
                                        <option>Healthcare</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="col-span-6 md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                                    <input type="number" value={item.amount} onChange={(e) => handleFinancialChange(index, 'amount', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-6 md:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">Frequency</label>
                                    <select value={item.frequency} onChange={(e) => handleFinancialChange(index, 'frequency', e.target.value)} className="mt-1 block w-full p-2 border rounded-md">
                                        <option>One-time</option>
                                        <option>Monthly</option>
                                        <option>Quarterly</option>
                                        <option>Semester</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>
                                <div className="col-span-6 md:col-span-4">
                                     <label className="block text-sm font-medium text-gray-700">Date</label>
                                     <input type="date" value={item.date} onChange={(e) => handleFinancialChange(index, 'date', e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                                </div>
                                <div className="col-span-11 md:col-span-3"></div>
                                <div className="col-span-1 flex items-end">
                                    <button type="button" onClick={() => removeFinancial(index)} className="p-2 text-red-500 hover:text-red-700 mt-6"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addFinancial} className="text-sm text-indigo-600 hover:underline">+ Add Financial Record</button>
                    </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    {student && <button type="button" onClick={onArchive} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Archive Student</button>}
                    <div className="flex gap-4 ml-auto">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Review & Save</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

const ReviewModal = ({ data, onConfirm, onEdit, onClose }) => (
    <Modal title="Review Student Details" onClose={onClose} maxWidth="max-w-lg">
        <div className="space-y-2 mb-6">
            {Object.entries(data).map(([key, value]) => {
                if (key === 'financials') {
                    return (
                        <div key={key}>
                            <strong className="font-medium text-gray-600">Financial Records:</strong>
                            {(value || []).map((item, index) => (
                                <div key={index} className="pl-4 text-sm mt-1">
                                    <p className="font-semibold">{item.item} ({item.category})</p>
                                    <p>${item.amount} / {item.frequency} (Date: {item.date || 'N/A'})</p>
                                </div>
                            ))}
                        </div>
                    )
                }
                if (key === 'School') {
                    return <p key={key}><strong className="font-medium text-gray-600">School:</strong> {value.name}{value.campus && ` (${value.campus})`}</p>
                }
                if (key === 'guardians') {
                    return (
                        <div key={key}>
                            <strong className="font-medium text-gray-600">Guardians:</strong>
                            {(value || []).map((guardian, index) => (
                                <div key={index} className="pl-4">
                                    <p>{guardian.name} ({guardian.relationship})</p>
                                    <p className="text-sm text-gray-500">{guardian.job} - ${guardian.income}/month</p>
                                    <p className="text-sm text-gray-500">{guardian.contact}</p>
                                </div>
                            ))}
                        </div>
                    )
                }
                return (
                    <p key={key}><strong className="font-medium text-gray-600">{key}:</strong> {String(value) || 'N/A'}</p>
                )
            })}
        </div>
        <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onEdit} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Go Back & Edit</button>
            <button type="button" onClick={onConfirm} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Confirm & Save</button>
        </div>
    </Modal>
);

const FollowUpFormModal = ({ student, followUp, onSave, onClose }) => {
    const isEditMode = !!followUp;
    const ALL_RISK_FACTORS = [
        "Abandonment", "Emotional Abuse", "Physical Abuse", "Sexual Abuse", "Addiction (family members)", 
        "Addiction (child)", "Bullying", "Family Debt", "Forced Begging", "Garbage Collection", "Gang Involvement", 
        "Sexual Grooming", "Housing Insecurity", "Mental Health Challenges", "Neglect", "Orphan", 
        "Parent/ Guardian Marital Status Change", "Parent/ Guardian in Jail", "Physical Health Challenges", 
        "Drug use/ Drug selling (family members)", "Drugs use/ Drug selling (child)", "Single Parent/ Guardian"
    ];

    const [formData, setFormData] = useState(isEditMode ? followUp : {
        date: new Date().toISOString(),
        physicalHealth: { rating: 'Good', details: '' },
        socialInteraction: { rating: 'Good', details: '' },
        homeLife: { rating: 'Good', details: '' },
        riskFactors: [],
        riskFactorsDetails: '',
        notes: '',
        recommendations: '',
    });

    const handleWellbeingChange = (field, subfield, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [subfield]: value }
        }));
    };

    const handleRiskFactorChange = (risk) => {
        setFormData(prev => {
            const newRiskFactors = prev.riskFactors.includes(risk)
                ? prev.riskFactors.filter(r => r !== risk)
                : [...prev.riskFactors, risk];
            return { ...prev, riskFactors: newRiskFactors };
        });
    };
    
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(student.StudentID, formData);
    };

    const WellbeingInput = ({ label, fieldName }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                value={formData[fieldName].rating}
                onChange={(e) => handleWellbeingChange(fieldName, 'rating', e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
            >
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
            </select>
            {(formData[fieldName].rating === 'Average' || formData[fieldName].rating === 'Poor') && (
                <textarea
                    placeholder={`Please share the main problem and how we can help.`}
                    value={formData[fieldName].details}
                    onChange={(e) => handleWellbeingChange(fieldName, 'details', e.target.value)}
                    className="mt-2 block w-full p-2 border rounded-md text-sm"
                    rows="2"
                />
            )}
        </div>
    );

    return (
        <Modal title={isEditMode ? "Edit Follow-Up" : "Add Follow-Up"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset>
                    <legend className="text-lg font-semibold text-gray-800 border-b w-full pb-1 mb-2">Well-being Progress</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <WellbeingInput label="Physical Health" fieldName="physicalHealth" />
                        <WellbeingInput label="Social Interaction" fieldName="socialInteraction" />
                        <WellbeingInput label="Home Life" fieldName="homeLife" />
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend className="text-lg font-semibold text-gray-800 border-b w-full pb-1 mb-2">Risk Factors</legend>
                    <p className="text-sm text-gray-500 mb-2">Select ALL that apply.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                        {ALL_RISK_FACTORS.map(risk => (
                            <label key={risk} className="flex items-center space-x-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.riskFactors.includes(risk)}
                                    onChange={() => handleRiskFactorChange(risk)}
                                    className="rounded"
                                />
                                <span>{risk}</span>
                            </label>
                        ))}
                    </div>
                     {formData.riskFactors.length > 0 && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700">Details for ALL selected risk factors</label>
                             <textarea
                                name="riskFactorsDetails"
                                value={formData.riskFactorsDetails}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border rounded-md"
                                rows="3"
                                placeholder="Example: Housing Insecurity - family unable to pay rent and must move every month or two."
                            />
                        </div>
                    )}
                </fieldset>
                
                <fieldset>
                     <legend className="text-lg font-semibold text-gray-800 border-b w-full pb-1 mb-2">Staff Notes</legend>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                             <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border rounded-md"
                                rows="3"
                                placeholder="Please write any information you learned that is not included elsewhere in this form."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Changes / Recommendations</label>
                             <textarea
                                name="recommendations"
                                value={formData.recommendations}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border rounded-md"
                                rows="3"
                                placeholder="Please share any changes that you believe may be helpful."
                            />
                        </div>
                     </div>
                </fieldset>

                <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
                </div>
            </form>
        </Modal>
    );
};


const FilterModal = ({ currentFilters, onApply, onClose, allStudents }) => {
    const [filters, setFilters] = useState(currentFilters);
    const options = useMemo(() => ({
        grades: [...new Set(allStudents.map(s => s.Grade).filter(Boolean))].sort(),
        schools: [...new Set(allStudents.map(s => s.School.name).filter(Boolean))].sort(),
        sexes: [...new Set(allStudents.map(s => s.Sex).filter(Boolean))].sort(),
        ages: [...new Set(allStudents.map(s => s.Age).filter(a => a !== 'N/A'))].sort((a, b) => a - b),
    }), [allStudents]);

    const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    return (
        <Modal title="Filter & Search" onClose={onClose} maxWidth="max-w-sm">
            <div className="space-y-4">
                <input type="text" name="search" placeholder="Search by name..." value={filters.search} onChange={handleChange} className="w-full p-2 border rounded-md" />
                <select name="grade" value={filters.grade} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Grades</option>{options.grades.map(o => <option key={o} value={o}>{o}</option>)}</select>
                <select name="school" value={filters.school} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Schools</option>{options.schools.map(o => <option key={o} value={o}>{o}</option>)}</select>
                <select name="sex" value={filters.sex} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Sexes</option>{options.sexes.map(o => <option key={o} value={o}>{o === 'M' ? 'Male' : 'Female'}</option>)}</select>
                 <select name="age" value={filters.age} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Ages</option>{options.ages.map(o => <option key={o} value={o}>{o}</option>)}</select>
                <select name="status" value={filters.status} onChange={handleChange} className="w-full p-2 border rounded-md"><option value="">All Records</option><option value="complete">Complete Info</option><option value="incomplete">Incomplete Info</option></select>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={() => { setFilters({ search: '', grade: '', school: '', sex: '', age: '', status: '' }); }} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Clear</button>
                <button onClick={() => { onApply(filters); onClose(); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Apply</button>
            </div>
        </Modal>
    );
};

const SettingsModal = ({ visibleColumns, setVisibleColumns, allColumns, onReset, onClose }) => {
    const handleToggle = (key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
    return (
        <Modal title="Settings" onClose={onClose} maxWidth="max-w-2xl">
            <div>
                <h3 className="text-lg font-semibold mb-2">Column Visibility</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {allColumns.map(col => (
                        <label key={col.key} className="flex items-center space-x-2"><input type="checkbox" checked={!!visibleColumns[col.key]} onChange={() => handleToggle(col.key)} className="rounded" /><span>{col.label}</span></label>
                    ))}
                </div>
            </div>
            <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Data Management</h3>
                <button onClick={onReset} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Reset All Data</button>
                <p className="text-sm text-gray-600 mt-1">This will erase all changes and restore the original student list.</p>
            </div>
        </Modal>
    );
};

const AddGradesModal = ({ student, curriculum, onAddGrades, onClose }) => {
    const isUniversity = student.Grade.toLowerCase().includes('university');
    const [period, setPeriod] = useState('');
    const [scores, setScores] = useState({});
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');

    const subjects = useMemo(() => {
        if (!isUniversity) {
            return curriculum[student.School.name]?.[student.School.campus]?.[student.Grade] || [];
        }
        if (year && semester) {
            return curriculum[student.School.name]?.[student.School.campus]?.[student.Major]?.[year]?.[semester] || [];
        }
        return [];
    }, [isUniversity, student, curriculum, year, semester]);

    const handleScoreChange = (subject, score) => {
        setScores(prev => ({ ...prev, [subject]: parseInt(score, 10) || 0 }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = isUniversity ? (semester === 'Semester 1' ? `${year.split(' ')[1]}-01-15` : `${year.split(' ')[1]}-07-15`) : period + '-15';
        const newGrades = Object.entries(scores).map(([subject, score]) => ({
            StudentID: student.StudentID,
            Date: date,
            Subject: subject,
            Score: score
        }));
        onAddGrades(newGrades);
    };

    return (
        <Modal title={`Add Grades for ${student['Given Name']}`} onClose={onClose} maxWidth="max-w-xl">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{isUniversity ? 'Select Period' : 'Select Month'}</label>
                    {isUniversity ? (
                        <div className="flex gap-2">
                            <select value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" required>
                                <option value="">Select Year</option>
                                <option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option>
                            </select>
                            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" required>
                                <option value="">Select Semester</option>
                                <option>Semester 1</option><option>Semester 2</option>
                            </select>
                        </div>
                    ) : (
                        <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" required />
                    )}
                </div>
                {subjects.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {subjects.map(subject => (
                            <div key={subject}>
                                <label className="block text-sm font-medium text-gray-700">{subject}</label>
                                <input type="number" min="0" max="100" value={scores[subject] || ''} onChange={(e) => handleScoreChange(subject, e.target.value)} className="mt-1 block w-full p-2 border rounded-md" required />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No subjects found for this student's school, grade, and/or major in the curriculum. Please define them on the Curriculum page.</p>
                )}
                <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                    <button type="submit" disabled={subjects.length === 0} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">Save Grades</button>
                </div>
            </form>
        </Modal>
    );
};


const ConfirmationModal = ({ title, message, onConfirm, onClose }) => {
    const modalRef = useRef();
    useOnClickOutside(modalRef, onClose);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button onClick={onClose} className="px-4 py-2 w-full bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 w-full bg-red-600 text-white rounded-md hover:bg-red-700">Confirm</button>
                </div>
            </div>
        </div>
    );
};

const ArchiveReasonModal = ({ onConfirm, onClose }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (reason.trim()) {
            onConfirm(reason);
        }
    };

    return (
        <Modal title="Reason for Archiving" onClose={onClose} maxWidth="max-w-md">
            <div className="space-y-4">
                <p>Please provide a reason for archiving this student.</p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                    placeholder="e.g., Graduated, Moved to another province, etc."
                />
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                <button onClick={handleSubmit} disabled={!reason.trim()} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300">Confirm Archive</button>
            </div>
        </Modal>
    );
};

const calculateMonthlyEquivalent = (amount, frequency) => {
    const numericAmount = parseFloat(amount) || 0;
    switch (frequency) {
        case 'Quarterly': return numericAmount / 3;
        case 'Semester': return numericAmount / 6;
        case 'Yearly': return numericAmount / 12;
        case 'One-time': return 0; // One-time costs don't contribute to monthly equivalent
        case 'Monthly':
        default:
            return numericAmount;
    }
};


// ===================================================================================
// --- MAIN APP COMPONENT ---
// This is the root component that brings everything together.
// ===================================================================================

export default function App() {
    // --- State Management ---
    const [students, setStudents] = useStickyState(initialStudents, 'studentDashboardData');
    const [archivedStudents, setArchivedStudents] = useStickyState([], 'archivedStudentData');
    const [grades, setGrades] = useStickyState(initialGrades, 'studentGradesData');
    const [curriculum, setCurriculum] = useStickyState(initialCurriculum, 'studentCurriculumData');
    const [followUps, setFollowUps] = useStickyState(initialFollowUps, 'studentFollowUpsData');
    
    const ALL_COLUMNS = useMemo(() => [
        { key: 'StudentID', label: 'Student ID' }, { key: 'Given Name', label: 'First Name' }, { key: 'Family Name', label: 'Family Name' },
        { key: 'Age', label: 'Age' }, { key: 'Sex', label: 'Sex' }, { key: 'Grade', label: 'Grade' },
        { key: 'School', label: 'School' }, { key: 'MonthlyCosts', label: 'Monthly Costs' }, { key: 'EnrollmentDate', label: 'Enrolled' }, { key: 'Comments', label: 'Comments' }
    ], []);

    const [visibleColumns, setVisibleColumns] = useStickyState(
        ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}),
        'studentDashboardColumns'
    );

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modal, setModal] = useState(null); 
    const [reviewData, setReviewData] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);
    
    const [filters, setFilters] = useState({
        search: '', grade: '', school: '', sex: '', age: '', status: ''
    });
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState({ column: 'Given Name', direction: 'asc' });
    const menuBtnRef = useRef();

    // --- Derived State & Data Processing ---
    const studentsWithAge = useMemo(() => {
        return students.map(s => ({
            ...s,
            Age: s.DOB ? new Date().getFullYear() - new Date(s.DOB).getFullYear() : 'N/A'
        }));
    }, [students]);
    
    const schoolAverages = useMemo(() => {
        const averages = {};
        const subjectData = {};

        grades.forEach(grade => {
            const student = students.find(s => s.StudentID === grade.StudentID);
            if (!student) return;

            const key = `${student.School.name}-${student.Grade}-${grade.Subject}`;
            if (!subjectData[key]) {
                subjectData[key] = { total: 0, count: 0 };
            }
            subjectData[key].total += grade.Score;
            subjectData[key].count++;
        });

        for (const key in subjectData) {
            averages[key] = subjectData[key].total / subjectData[key].count;
        }
        return averages;
    }, [grades, students]);

    const getCategoryForStudent = (student) => {
        const grade = student.Grade ? String(student.Grade).toLowerCase() : '';
        if (grade.includes('university') || grade.includes('year')) return 'university';
        const gradeNum = parseInt(grade);
        if (!isNaN(gradeNum)) {
            if (gradeNum >= 9) return 'high-school';
            if (gradeNum >= 6) return 'middle-school';
            return 'elementary';
        }
        return 'other';
    };

    const filteredAndSortedStudents = useMemo(() => {
        let processedData = studentsWithAge
            .filter(student => category === 'all' || getCategoryForStudent(student) === category)
            .filter(student => {
                const fullName = `${student['Given Name'] || ''} ${student['Family Name'] || ''}`.toLowerCase();
                const isComplete = student.School && student.Age !== 'N/A' && (student.financials || []).length > 0;
                return (
                    fullName.includes(filters.search.toLowerCase()) &&
                    (!filters.grade || student.Grade === filters.grade) &&
                    (!filters.school || student.School.name === filters.school) &&
                    (!filters.sex || student.Sex === filters.sex) &&
                    (!filters.age || student.Age.toString() === filters.age) &&
                    (!filters.status || (filters.status === 'complete' && isComplete) || (filters.status === 'incomplete' && !isComplete))
                );
            });

        if (sort.column) {
            processedData.sort((a, b) => {
                let valA, valB;

                if (sort.column === 'MonthlyCosts') {
                    valA = (a.financials || []).reduce((sum, item) => sum + calculateMonthlyEquivalent(item.amount, item.frequency), 0);
                    valB = (b.financials || []).reduce((sum, item) => sum + calculateMonthlyEquivalent(item.amount, item.frequency), 0);
                } else if (sort.column === 'Age') {
                    valA = parseFloat(a[sort.column]) || 0; 
                    valB = parseFloat(b[sort.column]) || 0;
                } else if (sort.column === 'EnrollmentDate') {
                    valA = new Date(a[sort.column]); 
                    valB = new Date(b[sort.column]);
                } else {
                    valA = String(a[sort.column] || '').toLowerCase(); 
                    valB = String(b[sort.column] || '').toLowerCase();
                }

                if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return processedData;
    }, [studentsWithAge, category, filters, sort]);
    
    const studentGrades = useMemo(() => {
        if (!selectedStudent) return [];
        return grades.filter(g => g.StudentID === selectedStudent.StudentID);
    }, [grades, selectedStudent]);

    const totals = useMemo(() => ({
        count: filteredAndSortedStudents.length,
        costs: filteredAndSortedStudents.reduce((sum, s) => {
            const studentTotal = (s.financials || []).reduce((studentSum, item) => {
                return studentSum + calculateMonthlyEquivalent(item.amount, item.frequency);
            }, 0);
            return sum + studentTotal;
        }, 0)
    }), [filteredAndSortedStudents]);


    // --- Handlers ---
    const handleSort = (columnKey) => setSort(s => ({ column: columnKey, direction: s.column === columnKey && s.direction === 'asc' ? 'desc' : 'asc' }));
    
    const handleSelectSchool = () => {
        setActiveTab('school-center');
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setActiveTab('profile');
    };

    const handleReviewStudent = (formData) => {
        setReviewData(formData);
        setModal('review');
    };

    const handleSaveStudent = () => {
        const formData = reviewData;
        const studentIndex = students.findIndex(s => s.StudentID === formData.StudentID);

        if (studentIndex > -1) {
            // Student exists, so update it.
            const updatedStudents = [...students];
            updatedStudents[studentIndex] = formData;
            setStudents(updatedStudents);
            if (selectedStudent?.StudentID === formData.StudentID) {
                setSelectedStudent(formData);
            }
        } else {
            // Student does not exist, so add a new one.
            setStudents([...students, formData]);
        }
        setModal(null);
        setReviewData(null);
    };
    
    const handleArchiveStudent = (reason) => {
        const studentToArchive = {
            ...selectedStudent,
            DateLeft: new Date().toISOString().split('T')[0],
            ReasonLeft: reason,
        };
        setArchivedStudents([...archivedStudents, studentToArchive]);
        setStudents(students.filter(s => s.StudentID !== selectedStudent.StudentID));
        setModal(null);
        setSelectedStudent(null);
        setActiveTab('dashboard');
    };
    
    const handleRestoreStudent = (studentToRestore) => {
        const { DateLeft, ReasonLeft, ...restoredStudent } = studentToRestore;
        setStudents([...students, restoredStudent]);
        setArchivedStudents(archivedStudents.filter(s => s.StudentID !== studentToRestore.StudentID));
    };
    
    const handlePermanentDelete = () => {
        if (!studentToDelete) return;
        setArchivedStudents(prev => prev.filter(s => s.StudentID !== studentToDelete.StudentID));
        setGrades(prev => prev.filter(g => g.StudentID !== studentToDelete.StudentID));
        setFollowUps(prev => {
            const newFollowUps = { ...prev };
            delete newFollowUps[studentToDelete.StudentID];
            return newFollowUps;
        });
        setModal(null);
        setStudentToDelete(null);
    };

    const handleResetData = () => {
        if (window.confirm("Are you sure? This will erase all changes and restore the original student list.")) {
            localStorage.clear();
            window.location.reload();
        }
    };
    
    const openModal = (modalType, student = null) => {
        setSelectedStudent(student);
        setModal(modalType);
    };

    const handleAddGrades = (newGrades) => {
        setGrades(prevGrades => [...prevGrades, ...newGrades]);
        setModal(null);
    };

    const handleAddFollowUp = (studentId, followUpData) => {
        setFollowUps(prev => ({
            ...prev,
            [studentId]: [...(prev[studentId] || []), followUpData]
        }));
        setModal(null);
    };
    
    const handleUpdateFollowUp = (studentId, index, updatedFollowUp) => {
        setFollowUps(prev => {
            const updatedFollowUps = [...(prev[studentId] || [])];
            updatedFollowUps[index] = updatedFollowUp;
            return { ...prev, [studentId]: updatedFollowUps };
        });
        setModal(null);
    };

    const handleDeleteFollowUp = (studentId, index) => {
        if (window.confirm("Are you sure you want to delete this follow-up?")) {
            setFollowUps(prev => {
                const updatedFollowUps = [...(prev[studentId] || [])];
                updatedFollowUps.splice(index, 1);
                return { ...prev, [studentId]: updatedFollowUps };
            });
        }
    };

    // --- Render Components ---
    const renderModals = () => (
        <>
            {modal === 'add' && <StudentFormModal onReview={handleReviewStudent} onClose={() => setModal(null)} />}
            {modal === 'edit' && <StudentFormModal student={selectedStudent} onReview={handleReviewStudent} onClose={() => setModal(null)} onArchive={() => setModal('archive-reason')} />}
            {modal === 'review' && <ReviewModal data={reviewData} onConfirm={handleSaveStudent} onEdit={() => setModal(reviewData.StudentID ? 'edit' : 'add')} onClose={() => setModal(null)} />}
            {modal === 'filter' && <FilterModal currentFilters={filters} onApply={setFilters} onClose={() => setModal(null)} allStudents={studentsWithAge} />}
            {modal === 'settings' && <SettingsModal visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} allColumns={ALL_COLUMNS} onReset={handleResetData} onClose={() => setModal(null)} />}
            {modal === 'archive-reason' && <ArchiveReasonModal onConfirm={handleArchiveStudent} onClose={() => setModal(null)} />}
            {modal === 'delete' && <ConfirmationModal title="Confirm Permanent Deletion" message={`Are you sure you want to permanently delete ${studentToDelete?.['Given Name']}? This action cannot be undone.`} onConfirm={handlePermanentDelete} onClose={() => setModal(null)} />}
            {modal === 'add-grades' && <AddGradesModal student={selectedStudent} curriculum={curriculum} onAddGrades={handleAddGrades} onClose={() => setModal(null)} />}
            {modal === 'add-follow-up' && <FollowUpFormModal student={selectedStudent} onSave={handleAddFollowUp} onClose={() => setModal(null)} />}
            {modal === 'edit-follow-up' && <FollowUpFormModal student={selectedStudent} followUp={selectedStudent.followUpToEdit} onSave={(studentId, data) => handleUpdateFollowUp(studentId, selectedStudent.followUpIndex, data)} onClose={() => setModal(null)} />}
        </>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardPage students={filteredAndSortedStudents} onSort={handleSort} sort={sort} visibleColumns={visibleColumns} allColumns={ALL_COLUMNS} onOpenModal={openModal} setCategory={setCategory} category={category} totals={totals} onSelectSchool={handleSelectSchool} onSelectStudent={handleSelectStudent} />;
            case 'profile':
                return <StudentProfilePage student={selectedStudent} onOpenModal={openModal} setActiveTab={setActiveTab} followUps={selectedStudent ? followUps[selectedStudent.StudentID] || [] : []} onDeleteFollowUp={handleDeleteFollowUp} onBack={() => setActiveTab('dashboard')} />;
            case 'archived-profile':
                return <ArchivedProfilePage student={selectedStudent} setActiveTab={setActiveTab} followUps={selectedStudent ? followUps[selectedStudent.StudentID] || [] : []} />;
            case 'grades':
                return <GradesPage student={selectedStudent} grades={studentGrades} onOpenModal={openModal} onBack={() => setActiveTab('profile')} schoolAverages={schoolAverages} />;
            case 'school-center':
                return <SchoolCenterPage students={studentsWithAge} grades={grades} onSelectStudent={handleSelectStudent} getCategoryForStudent={getCategoryForStudent} />;
            case 'curriculum':
                return <CurriculumPage curriculum={curriculum} setCurriculum={setCurriculum} />;
            case 'archive':
                return <ArchivePage archivedStudents={archivedStudents} onRestore={handleRestoreStudent} onDelete={(student) => { setStudentToDelete(student); setModal('delete'); }} onViewProfile={(student) => { setSelectedStudent(student); setActiveTab('archived-profile'); }} />;
            case 'manual-instructions':
                return <ManualInstructionsPage />;
            default:
                return <DashboardPage students={filteredAndSortedStudents} onSort={handleSort} sort={sort} visibleColumns={visibleColumns} allColumns={ALL_COLUMNS} onOpenModal={openModal} setCategory={setCategory} category={category} totals={totals} onSelectSchool={handleSelectSchool} onSelectStudent={handleSelectStudent} />;
        }
    };

    return (
        <div className="bg-gray-100 text-gray-800 h-screen overflow-hidden flex font-sans relative">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setOpen={setIsSidebarOpen} onOpenSettings={() => setModal('settings')} menuRef={menuBtnRef} />
            <div className="flex-grow flex flex-col h-screen w-full">
                <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} menuBtnRef={menuBtnRef} />
                <div className="flex-grow overflow-y-auto">
                    {renderActiveTab()}
                </div>
            </div>
            {renderModals()}
        </div>
    );
}
