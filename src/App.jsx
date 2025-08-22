import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Menu, X, Users, DollarSign, Archive, Settings, Filter, PlusCircle, ArrowUpDown, BookOpen, FileText, BarChart2, Mail, CreditCard, Building, Edit, Eye, User, Mail as MailIcon, Phone, GraduationCap, School, Briefcase, BookCopy, Trash2 } from 'lucide-react';

// --- INITIAL DATA (from your JSON files) ---
const initialStudents = [
    { "StudentID": "CPB00039", "Given Name": "Kunthea", "Family Name": "Yim", "Sex": "F", "DOB": "2003-05-12", "Grade": "University", "School": "RULE", "Monthly": "300", "Guardian Name": "Chan Makara", "Guardian Contact": "012345678", "Major": "Laws", "Comments": "Top 5 in school" },
    { "StudentID": "CPG00025", "Given Name": "Sopheaktra", "Family Name": "Nim", "Sex": "F", "DOB": "2002-09-20", "Grade": "University", "School": "RUPP", "Monthly": "175", "Guardian Name": "", "Guardian Contact": "", "Major": "Business" },
    { "StudentID": "CPB00041", "Given Name": "Dara", "Family Name": "Yim", "Sex": "M", "DOB": "2001-01-30", "Grade": "University", "School": "RULE", "Monthly": "250", "Guardian Name": "", "Guardian Contact": "", "Major": "Laws" },
    { "StudentID": "CPG00026", "Given Name": "Manita", "Family Name": "Run", "Sex": "F", "DOB": "2004-03-15", "Grade": "University", "School": "UEF", "Monthly": "310", "Guardian Name": "Mom Sopheap", "Guardian Contact": "965455371", "Major": "Accounting and Finance" },
    { "StudentID": "CPB00042", "Given Name": "Songha", "Family Name": "Run", "Sex": "M", "DOB": "2000-11-05", "Grade": "University", "School": "PPIU", "Monthly": "224.7", "Guardian Name": "Mom Sopheap", "Guardian Contact": "965455371", "Major": "Business" },
    { "StudentID": "CPG00027", "Given Name": "SivKheu", "Family Name": "Ny", "Sex": "F", "DOB": "2003-08-22", "Grade": "University", "School": "UEF", "Monthly": "310", "Guardian Name": "Sor Sokhom", "Guardian Contact": "89217867", "Major": "Accounting and Finance" },
    { "StudentID": "CPB00043", "Given Name": "Sreypich", "Family Name": "Chan", "Sex": "F", "DOB": "2005-02-10", "Grade": "12", "School": "SPS_Tep", "Monthly": "150", "Guardian Name": "", "Guardian Contact": "" },
    { "StudentID": "CPG00028", "Given Name": "Raveen", "Family Name": "Samnang", "Sex": "M", "DOB": "2009-07-18", "Grade": "9", "School": "NewLife", "Monthly": "70", "Guardian Name": "Say Sotheary", "Guardian Contact": "977408378" }
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
  { "StudentID": "CPB00043", "Date": "2025-01-15", "Subject": "Science", "Score": 75 }
];

const initialCurriculum = {
    "NewLife": {
        "9": ["Math", "Science", "Khmer", "English", "Social Studies"],
        "10": ["Algebra", "Biology", "Khmer Literature", "English II", "World History"]
    },
    "SPS_Tep": {
        "12": ["Calculus", "Physics", "Chemistry", "Advanced English", "Cambodian History"]
    },
    "UEF": {
        "Accounting and Finance": {
            "Year 1": {
                "Semester 1": ["Business English I", "History", "Contract Law", "Business Mathematics", "Microeconomics", "Accounting in Business I (FI)"],
                "Semester 2": ["Business English II", "Philosophy", "Business Statistics", "Macroeconomics", "Human Resource Management"]
            }
        }
    },
    "RULE": {
        "Laws": {
            "Year 1": {
                "Semester 1": ["Contract Law", "Constitutional Law"],
                "Semester 2": ["Criminal Law", "Legal Research"]
            }
        }
    }
};

// --- Helper Hooks ---
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


// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [students, setStudents] = useStickyState(initialStudents, 'studentDashboardData');
    const [archivedStudents, setArchivedStudents] = useStickyState([], 'archivedStudentData');
    const [grades, setGrades] = useStickyState(initialGrades, 'studentGradesData');
    const [curriculum, setCurriculum] = useStickyState(initialCurriculum, 'studentCurriculumData');
    
    const ALL_COLUMNS = useMemo(() => [
        { key: 'StudentID', label: 'Student ID' }, { key: 'Given Name', label: 'First Name' }, { key: 'Family Name', label: 'Family Name' },
        { key: 'Age', label: 'Age' }, { key: 'Sex', label: 'Sex' }, { key: 'Grade', label: 'Grade' },
        { key: 'School', label: 'School' }, { key: 'Monthly', label: 'Monthly Fee' }
    ], []);

    const [visibleColumns, setVisibleColumns] = useStickyState(
        ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}),
        'studentDashboardColumns'
    );

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [modal, setModal] = useState(null); 
    const [reviewData, setReviewData] = useState(null);
    
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
                const isComplete = student.School && student.Age !== 'N/A' && student.Monthly;
                return (
                    fullName.includes(filters.search.toLowerCase()) &&
                    (!filters.grade || student.Grade === filters.grade) &&
                    (!filters.school || student.School === filters.school) &&
                    (!filters.sex || student.Sex === filters.sex) &&
                    (!filters.age || student.Age.toString() === filters.age) &&
                    (!filters.status || (filters.status === 'complete' && isComplete) || (filters.status === 'incomplete' && !isComplete))
                );
            });

        if (sort.column) {
            processedData.sort((a, b) => {
                let valA = a[sort.column] || '', valB = b[sort.column] || '';
                if (sort.column === 'Age' || sort.column === 'Monthly') {
                    valA = parseFloat(valA) || 0; valB = parseFloat(valB) || 0;
                } else {
                    valA = String(valA).toLowerCase(); valB = String(valB).toLowerCase();
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
        fees: filteredAndSortedStudents.reduce((sum, s) => sum + (parseFloat(s.Monthly) || 0), 0)
    }), [filteredAndSortedStudents]);


    // --- Handlers ---
    const handleSort = (columnKey) => setSort(s => ({ column: columnKey, direction: s.column === columnKey && s.direction === 'asc' ? 'desc' : 'asc' }));
    
    const handleSelectSchool = (schoolName) => {
        setSelectedSchool(schoolName);
        setActiveTab('school-center');
    };

    const handleReviewStudent = (formData) => {
        setReviewData(formData);
        setModal('review');
    };

    const handleSaveStudent = () => {
        const formData = reviewData;
        if (modal === 'edit') {
            setStudents(students.map(s => s.StudentID === formData.StudentID ? formData : s));
        } else {
            const newId = `CPB${Math.floor(10000 + Math.random() * 90000)}`;
            setStudents([...students, { ...formData, StudentID: newId }]);
        }
        setModal(null);
        setReviewData(null);
    };
    
    const handleArchiveStudent = () => {
        setArchivedStudents([...archivedStudents, selectedStudent]);
        setStudents(students.filter(s => s.StudentID !== selectedStudent.StudentID));
        setModal(null);
        setSelectedStudent(null);
    };
    
    const handleRestoreStudent = (studentToRestore) => {
        setStudents([...students, studentToRestore]);
        setArchivedStudents(archivedStudents.filter(s => s.StudentID !== studentToRestore.StudentID));
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

    // --- Render Components ---
    const renderModals = () => (
        <>
            {modal === 'add' && <StudentFormModal onReview={handleReviewStudent} onClose={() => setModal(null)} />}
            {modal === 'edit' && <StudentFormModal student={selectedStudent} onReview={handleReviewStudent} onClose={() => setModal(null)} onArchive={() => setModal('archive')} />}
            {modal === 'view' && <StudentDetailsModal student={selectedStudent} onClose={() => setModal(null)} onEdit={() => setModal('edit')} onViewGrades={() => { setModal(null); setActiveTab('grades'); }} />}
            {modal === 'review' && <ReviewModal data={reviewData} onConfirm={handleSaveStudent} onEdit={() => setModal(selectedStudent ? 'edit' : 'add')} onClose={() => setModal(null)} />}
            {modal === 'filter' && <FilterModal currentFilters={filters} onApply={setFilters} onClose={() => setModal(null)} allStudents={studentsWithAge} />}
            {modal === 'settings' && <SettingsModal visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} allColumns={ALL_COLUMNS} onReset={handleResetData} onClose={() => setModal(null)} />}
            {modal === 'archive' && <ConfirmationModal title="Confirm Archive" message={`Are you sure you want to archive ${selectedStudent?.['Given Name']}?`} onConfirm={handleArchiveStudent} onClose={() => setModal('view')} />}
            {modal === 'add-grades' && <AddGradesModal student={selectedStudent} curriculum={curriculum} onAddGrades={handleAddGrades} onClose={() => setModal(null)} />}
        </>
    );

    return (
        <div className="bg-gray-100 text-gray-800 h-screen overflow-hidden flex font-sans relative">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setOpen={setIsSidebarOpen} onOpenSettings={() => setModal('settings')} menuRef={menuBtnRef} />
            <div className="flex-grow flex flex-col h-screen w-full">
                <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} menuBtnRef={menuBtnRef} />
                <div className="flex-grow overflow-y-auto">
                    {activeTab === 'dashboard' && <DashboardPage students={filteredAndSortedStudents} onSort={handleSort} sort={sort} visibleColumns={visibleColumns} allColumns={ALL_COLUMNS} onOpenModal={openModal} setCategory={setCategory} category={category} totals={totals} onSelectSchool={handleSelectSchool} />}
                    {activeTab === 'grades' && <GradesPage student={selectedStudent} grades={studentGrades} onOpenModal={openModal} />}
                    {activeTab === 'school-center' && <SchoolCenterPage students={studentsWithAge} grades={grades} selectedSchool={selectedSchool} onSelectSchool={setSelectedSchool} getCategoryForStudent={getCategoryForStudent} onOpenStudentModal={openModal}/>}
                    {activeTab === 'curriculum' && <CurriculumPage curriculum={curriculum} setCurriculum={setCurriculum} />}
                    {activeTab === 'archive' && <ArchivePage archivedStudents={archivedStudents} onRestore={handleRestoreStudent} />}
                    {activeTab === 'plan' && <ProjectPlanPage />}
                </div>
            </div>
            {renderModals()}
        </div>
    );
}

// --- Page & Layout Components ---

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
            <h2 className="text-2xl font-bold text-gray-800 px-2">Dashboard</h2>
            <nav className="mt-4 space-y-1">
                <Tab id="dashboard" icon={<Users className="w-5 h-5" />}>Student List</Tab>
                <Tab id="grades" icon={<BookOpen className="w-5 h-5" />}>Grades Center</Tab>
                <Tab id="school-center" icon={<Building className="w-5 h-5" />}>School Center</Tab>
                <Tab id="curriculum" icon={<BookCopy className="w-5 h-5" />}>Curriculum</Tab>
                <Tab id="archive" icon={<Archive className="w-5 h-5" />}>Archived</Tab>
                <Tab id="plan" icon={<FileText className="w-5 h-5" />}>Project Plan</Tab>
            </nav>
            <div className="mt-auto">
                <a href="#" onClick={(e) => { e.preventDefault(); onOpenSettings(); setOpen(false); }} className="w-full text-left font-semibold text-gray-700 flex items-center gap-3 transition hover:bg-gray-50 p-2 rounded-md mt-4 border-t pt-4">
                    <Settings className="w-5 h-5" /> <span>Settings</span>
                </a>
            </div>
        </aside>
    );
};

const DashboardPage = ({ students, onSort, sort, visibleColumns, allColumns, onOpenModal, setCategory, category, totals, onSelectSchool }) => (
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
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Monthly Fees</h3>
                        <p className="text-2xl font-bold text-indigo-600 mt-1">${totals.fees.toFixed(2)}</p>
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
            <StudentTable students={students} onSort={onSort} sort={sort} visibleColumns={visibleColumns} allColumns={allColumns} onOpenModal={onOpenModal} onSelectSchool={onSelectSchool} />
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

const StudentTable = ({ students, onSort, sort, visibleColumns, allColumns, onOpenModal, onSelectSchool }) => (
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
                                    <a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('view', student); }}
                                       className="font-semibold text-indigo-600 hover:underline">
                                        {student[col.key] || 'N/A'}
                                    </a>
                                ) : col.key === 'School' ? (
                                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectSchool(student.School); }}
                                       className="font-semibold text-blue-600 hover:underline">
                                        {student[col.key] || 'N/A'}
                                    </a>
                                ) : col.key === 'Monthly' ? (
                                    `$${parseFloat(student[col.key] || 0).toFixed(2)}`
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

const GradesPage = ({ student, grades, onOpenModal }) => {
    const monthlySummary = useMemo(() => {
        if (!grades || grades.length === 0) return { subjects: [], data: [] };
        const months = {};
        const subjects = [...new Set(grades.map(g => g.Subject))];
        
        grades.forEach(g => {
            const month = new Date(g.Date).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!months[month]) {
                months[month] = { month, scores: {}, total: 0, count: 0 };
            }
            if (!months[month].scores[g.Subject]) {
                months[month].scores[g.Subject] = { total: 0, count: 0 };
            }
            months[month].scores[g.Subject].total += g.Score;
            months[month].scores[g.Subject].count++;
            months[month].total += g.Score;
            months[month].count++;
        });

        return {
            subjects,
            data: Object.values(months).map(monthData => {
                const row = { month: monthData.month };
                subjects.forEach(subject => {
                    const subjectData = monthData.scores[subject];
                    row[subject] = subjectData ? (subjectData.total / subjectData.count).toFixed(2) : 'N/A';
                });
                row.Average = (monthData.total / monthData.count).toFixed(2);
                return row;
            })
        };
    }, [grades]);

    const yearlySummary = useMemo(() => {
        if (!grades || grades.length === 0) return [];
        const years = {};
        grades.forEach(g => {
            const year = new Date(g.Date).getFullYear();
            if (!years[year]) {
                years[year] = { scores: [], count: 0 };
            }
            years[year].scores.push(g.Score);
            years[year].count++;
        });
        return Object.entries(years).map(([year, data]) => ({
            year,
            average: (data.scores.reduce((a, b) => a + b, 0) / data.count).toFixed(2)
        }));
    }, [grades]);

    if (!student) {
        return <div className="p-8 text-center text-gray-600">Please select a student from the dashboard to view their grades.</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow min-h-0 overflow-y-auto">
            <header className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Grade Center: {student['Given Name']}</h1>
                    <p className="text-gray-600">Student ID: {student.StudentID}</p>
                </div>
                <button onClick={() => onOpenModal('add-grades', student)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 flex items-center gap-2"><PlusCircle size={16} /> Add Grades</button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                     <h2 className="text-xl font-semibold mb-4">All Grade Records</h2>
                     <div className="max-h-80 overflow-y-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left">Date</th><th className="px-4 py-2 text-left">Subject</th><th className="px-4 py-2 text-left">Score</th><th className="px-4 py-2 text-left">Grade</th></tr></thead>
                            <tbody>
                            {grades.map((grade, i) => {
                                const cambodianGrade = getCambodianGrade(grade.Score);
                                return (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2">{grade.Date}</td>
                                        <td className="px-4 py-2">{grade.Subject}</td>
                                        <td className="px-4 py-2 font-semibold">{grade.Score}</td>
                                        <td className={`px-4 py-2 font-bold ${cambodianGrade.color}`}>{cambodianGrade.grade}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                     </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Monthly/Semester Summary</h2>
                    <div className="max-h-80 overflow-y-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left">Period</th>
                                    {monthlySummary.subjects.map(s => <th key={s} className="px-4 py-2 text-left">{s}</th>)}
                                    <th className="px-4 py-2 text-left">Average</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlySummary.data.map(row => (
                                    <tr key={row.month} className="border-b">
                                        <td className="px-4 py-2">{row.month}</td>
                                        {monthlySummary.subjects.map(s => <td key={s} className="px-4 py-2">{row[s]}</td>)}
                                        <td className="px-4 py-2 font-semibold">{row.Average}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Yearly Summary</h2>
                    <div className="max-h-80 overflow-y-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 sticky top-0"><tr><th className="px-4 py-2 text-left">Year</th><th className="px-4 py-2 text-left">Average Score</th></tr></thead>
                            <tbody>{yearlySummary.map(s => <tr key={s.year} className="border-b"><td className="px-4 py-2">{s.year}</td><td className="px-4 py-2 font-semibold">{s.average}</td></tr>)}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SchoolCenterPage = ({ students, grades, selectedSchool, onSelectSchool, getCategoryForStudent, onOpenStudentModal }) => {
    const analyticsData = useMemo(() => {
        const studentIds = students.map(s => s.StudentID);
        const relevantGrades = grades.filter(g => studentIds.includes(g.StudentID));

        const dataByLevel = {};

        relevantGrades.forEach(grade => {
            const student = students.find(s => s.StudentID === grade.StudentID);
            if (!student) return;
            
            const level = getCategoryForStudent(student);
            if (!dataByLevel[level]) {
                dataByLevel[level] = { name: level, subjects: {} };
            }
            if (!dataByLevel[level].subjects[grade.Subject]) {
                dataByLevel[level].subjects[grade.Subject] = { total: 0, count: 0 };
            }
            dataByLevel[level].subjects[grade.Subject].total += grade.Score;
            dataByLevel[level].subjects[grade.Subject].count += 1;
        });

        const chartData = Object.values(dataByLevel).map(levelData => {
            const levelAverages = { name: levelData.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) };
            Object.entries(levelData.subjects).forEach(([subject, data]) => {
                levelAverages[subject] = (data.total / data.count).toFixed(2);
            });
            return levelAverages;
        });

        return chartData;
    }, [students, grades, getCategoryForStudent]);

    const schoolStudents = useMemo(() => {
        if (!selectedSchool) return [];
        return students.filter(s => s.School === selectedSchool);
    }, [students, selectedSchool]);

    const schoolData = useMemo(() => {
        if (!selectedSchool) return null;
        const schoolStudentIds = schoolStudents.map(s => s.StudentID);
        const schoolGrades = grades.filter(g => schoolStudentIds.includes(g.StudentID));

        const subjectData = {};
        schoolGrades.forEach(grade => {
            if (!subjectData[grade.Subject]) {
                subjectData[grade.Subject] = { total: 0, count: 0 };
            }
            subjectData[grade.Subject].total += grade.Score;
            subjectData[grade.Subject].count += 1;
        });
        
        return Object.entries(subjectData).map(([subject, data]) => ({
            name: subject,
            Average: (data.total / data.count).toFixed(2)
        }));

    }, [grades, selectedSchool, schoolStudents]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">School Center</h1>
                <p className="text-gray-600 mt-1">Compare academic performance across different levels and schools.</p>
            </header>
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Average Grades by School Level</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Math" fill="#8884d8" />
                            <Bar dataKey="Science" fill="#82ca9d" />
                            <Bar dataKey="Khmer" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 {selectedSchool && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-semibold mb-4">Details for {selectedSchool}</h2>
                            <button onClick={() => onSelectSchool(null)} className="text-sm text-gray-500 hover:text-gray-800">&times; Clear Selection</button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Average Grades</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={schoolData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]}/>
                                        <Tooltip />
                                        <Bar dataKey="Average" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold mb-2">Students ({schoolStudents.length})</h3>
                                <div className="max-h-64 overflow-y-auto border rounded-md">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm">Name</th>
                                                <th className="px-4 py-2 text-left text-sm">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schoolStudents.map(student => (
                                                <tr key={student.StudentID} className="border-b">
                                                    <td className="px-4 py-2">
                                                        <a href="#" onClick={(e) => { e.preventDefault(); onOpenStudentModal('view', student); }} className="text-indigo-600 hover:underline">{student['Given Name']} {student['Family Name']}</a>
                                                    </td>
                                                    <td className="px-4 py-2">{student.Grade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const ArchivePage = ({ archivedStudents, onRestore }) => (
     <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-grow min-h-0">
        <header className="bg-white shadow-md rounded-lg p-6 mb-6"><h1 className="text-3xl font-bold text-gray-900">Archived Students</h1></header>
        <main className="flex-grow overflow-y-auto bg-white shadow-md rounded-lg">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {archivedStudents.map(student => (
                            <tr key={student.StudentID}>
                                <td className="px-6 py-4">{student.StudentID}</td><td className="px-6 py-4">{student['Given Name']} {student['Family Name']}</td><td className="px-6 py-4">{student.Grade}</td>
                                <td className="px-6 py-4"><button onClick={() => onRestore(student)} className="text-indigo-600 hover:underline">Restore</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {archivedStudents.length === 0 && <p className="p-8 text-center text-gray-500">No archived students.</p>}
            </div>
        </main>
    </div>
);

const ProjectPlanPage = () => {
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white shadow-md rounded-lg p-6 prose max-w-none">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 not-prose">
                    <h2 className="text-xl font-bold mt-0 mb-3">On This Page</h2>
                    <ul className="list-none pl-0 space-y-2">
                        <li><a href="#phase1" onClick={(e) => handleNavClick(e, 'phase1')} className="text-indigo-600 hover:underline">Phase 1: Core Functionality (Complete)</a></li>
                        <li><a href="#phase2" onClick={(e) => handleNavClick(e, 'phase2')} className="text-indigo-600 hover:underline">Phase 2: Enhanced Analytics & Reporting</a></li>
                        <li><a href="#phase3" onClick={(e) => handleNavClick(e, 'phase3')} className="text-indigo-600 hover:underline">Phase 3: User Roles & Communication</a></li>
                        <li><a href="#phase4" onClick={(e) => handleNavClick(e, 'phase4')} className="text-indigo-600 hover:underline">Phase 4: Financial Management & Advanced Data</a></li>
                    </ul>
                </div>

                <h2 id="main-title">Project Roadmap</h2>
                <p>This document outlines the current features and future development plans for the Student Dashboard application.</p>
                
                <hr />
                <h3 id="phase1">Phase 1: Core Functionality (v1.0) - Complete & Expanded</h3>
                <p>The foundational features that are currently implemented, plus planned enhancements for robustness and user experience.</p>
                <ul>
                    <li><strong>Student & Grade Management:</strong> Core CRUD (Create, Read, Update, Archive) for student and grade records.</li>
                    <li><strong>Data Persistence:</strong> All data is saved in the browser's local storage to persist between sessions.</li>
                    <li><strong>Advanced Filtering & Sorting:</strong> Robust controls for searching, filtering, and sorting the student list.</li>
                    <li><strong>Basic Reporting:</strong> Dynamic calculation of student and fee totals, plus individual grade charts.</li>
                    <li><strong>Customizable UI:</strong> Users can toggle the visibility of columns in the main student table.</li>
                    <li><strong>Enhanced User Feedback:</strong> Implement notifications (e.g., "Student Saved Successfully") to confirm user actions.</li>
                    <li><strong>Input Validation:</strong> Add validation to forms to ensure data integrity (e.g., checking for valid email formats, ensuring required fields are not empty).</li>
                    <li><strong>Search Result Highlighting:</strong> When a user searches for a student, the matching text in the results table will be highlighted to be more visible.</li>
                    <li><strong>Bulk Actions:</strong> Introduce checkboxes on the student list to allow for actions on multiple students at once, such as "Archive Selected".</li>
                </ul>

                <hr />
                <h3 id="phase2">Phase 2: Enhanced Analytics & Reporting (Future)</h3>
                <p>Focus on providing deeper insights into the school's overall performance.</p>
                <ul>
                    <li><strong>School Analytics Dashboard <BarChart2 className="inline-block w-4 h-4" />:</strong> A new page with charts visualizing school-wide data, such as student distribution by grade, average grades across subjects, and overall attendance rates.</li>
                    <li><strong>Printable Student Reports <FileText className="inline-block w-4 h-4" />:</strong> An option to generate a clean, printable PDF "report card" for any selected student, summarizing their information, grades, and attendance history.</li>
                </ul>

                <hr />
                <h3 id="phase3">Phase 3: User Roles & Communication (Future)</h3>
                <p>Expand the application to be a multi-user platform for collaboration.</p>
                <ul>
                    <li><strong>User Accounts (Admins, Teachers) <Users className="inline-block w-4 h-4" />:</strong> Introduce a login system with different permission levels. Admins would have full control, while Teachers could be restricted to viewing and managing only their assigned students.</li>
                    <li><strong>Parent/Student Portal:</strong> A secure, read-only view for parents and students to log in and see their own grades and attendance information.</li>
                    <li><strong>Announcements System <Mail className="inline-block w-4 h-4" />:</strong> A feature for admins to create and display important announcements on the dashboard for all users.</li>
                </ul>

                <hr />
                <h3 id="phase4">Phase 4: Financial Management & Advanced Data (Future)</h3>
                <p>Add dedicated tools for financial tracking and more complex data operations.</p>
                <ul>
                    <li><strong>Financial Dashboard <CreditCard className="inline-block w-4 h-4" />:</strong> A dedicated page for tracking tuition payments. It would show total income, list students with outstanding balances, and allow logging of payments.</li>
                    <li><strong>Advanced Attendance Module:</strong> A dedicated interface for marking daily attendance for all students, with reporting features to track tardiness and absences over time.</li>
                    <li><strong>Data Import/Export:</strong> Functionality in the Settings modal to export all student or grade data to a CSV file, and to import a list of new students from a formatted CSV file.</li>
                </ul>
            </div>
        </div>
    );
};

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
                            {Object.entries(schoolData).map(([gradeOrMajor, gradeOrMajorData]) => {
                                // Check if this is a K-12 grade (array of subjects) or Uni major (object of years)
                                if (Array.isArray(gradeOrMajorData)) {
                                    return ( // K-12 Grade Level
                                        <div key={gradeOrMajor}>
                                            <label className="block text-lg font-semibold text-gray-700">Grade {gradeOrMajor}</label>
                                            <textarea
                                                className="w-full p-2 border rounded-md mt-1"
                                                rows="2"
                                                defaultValue={gradeOrMajorData.join(', ')}
                                                onChange={(e) => handleSubjectChange([schoolName, gradeOrMajor], e.target.value)}
                                            />
                                        </div>
                                    );
                                } else {
                                    return ( // University Major
                                        <div key={gradeOrMajor} className="pl-4 border-l-2 border-indigo-200">
                                            <h3 className="text-xl font-semibold text-gray-700">{gradeOrMajor}</h3>
                                            <div className="space-y-3 mt-2">
                                                {Object.entries(gradeOrMajorData).map(([year, yearData]) => (
                                                    <div key={year} className="pl-4">
                                                        <h4 className="text-lg font-semibold text-gray-600">{year}</h4>
                                                        <div className="space-y-2 mt-1">
                                                            {Object.entries(yearData).map(([semester, subjects]) => (
                                                                <div key={semester}>
                                                                    <label className="block font-medium text-gray-500">{semester}</label>
                                                                    <textarea
                                                                        className="w-full p-2 border rounded-md mt-1"
                                                                        rows="2"
                                                                        defaultValue={subjects.join(', ')}
                                                                        onChange={(e) => handleSubjectChange([schoolName, gradeOrMajor, year, semester], e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
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
    );
};


// --- Modal Components ---

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
    const [formData, setFormData] = useState(student || { 'Given Name': '', 'Family Name': '', DOB: '', Sex: '', Grade: '', School: '', Monthly: '', 'Guardian Name': '', 'Guardian Contact': '', 'Major': '', 'Comments': '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onReview(formData); };

    return (
        <Modal title={student ? "Edit Student" : "Add New Student"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {Object.keys(formData).filter(k => !['StudentID', 'Age'].includes(k)).map(key => (
                        <div key={key} className={key === 'Comments' ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-gray-700">{key}</label>
                            {key === 'Comments' ? (
                                <textarea name={key} value={formData[key] || ''} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" rows="3" />
                            ) : (
                                <input type={key === 'DOB' ? 'date' : key === 'Monthly' ? 'number' : 'text'}
                                       name={key} value={formData[key] || ''} onChange={handleChange}
                                       className="mt-1 block w-full p-2 border rounded-md" />
                            )}
                        </div>
                    ))}
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
            {Object.entries(data).map(([key, value]) => (
                <p key={key}><strong className="font-medium text-gray-600">{key}:</strong> {value || 'N/A'}</p>
            ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onEdit} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Go Back & Edit</button>
            <button type="button" onClick={onConfirm} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Confirm & Save</button>
        </div>
    </Modal>
);

const DetailItem = ({ icon, label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
            {icon} {label}
        </dt>
        <dd className="mt-1 text-md text-gray-900">{value || 'N/A'}</dd>
    </div>
);

const StudentDetailsModal = ({ student, onClose, onEdit, onViewGrades }) => (
    <Modal title={`${student['Given Name']} ${student['Family Name']}`} onClose={onClose} maxWidth="max-w-2xl">
        <div>
            <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
                <dl className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Student ID" value={student.StudentID} />
                    <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Age" value={student.Age} />
                    <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Sex" value={student.Sex === 'M' ? 'Male' : 'Female'} />
                    <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Date of Birth" value={student.DOB} />
                </dl>
            </div>
             <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Academic Info</h3>
                <dl className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem icon={<School size={16} className="text-gray-400"/>} label="School" value={student.School} />
                    <DetailItem icon={<GraduationCap size={16} className="text-gray-400"/>} label="Grade" value={student.Grade} />
                    <DetailItem icon={<Briefcase size={16} className="text-gray-400"/>} label="Major" value={student.Major} />
                    <DetailItem icon={<DollarSign size={16} className="text-gray-400"/>} label="Monthly Fee" value={`$${parseFloat(student.Monthly || 0).toFixed(2)}`} />
                </dl>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-gray-800">Guardian Contact</h3>
                <dl className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem icon={<User size={16} className="text-gray-400"/>} label="Guardian Name" value={student['Guardian Name']} />
                    <DetailItem icon={<Phone size={16} className="text-gray-400"/>} label="Guardian Contact" value={student['Guardian Contact']} />
                </dl>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t flex justify-end gap-4">
            <button type="button" onClick={onEdit} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"><Edit size={16}/> Edit Student</button>
            <button type="button" onClick={onViewGrades} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"><Eye size={16}/> View Grades</button>
        </div>
    </Modal>
);


const FilterModal = ({ currentFilters, onApply, onClose, allStudents }) => {
    const [filters, setFilters] = useState(currentFilters);
    const options = useMemo(() => ({
        grades: [...new Set(allStudents.map(s => s.Grade).filter(Boolean))].sort(),
        schools: [...new Set(allStudents.map(s => s.School).filter(Boolean))].sort(),
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
            return curriculum[student.School]?.[student.Grade] || [];
        }
        if (year && semester) {
            return curriculum[student.School]?.[student.Major]?.[year]?.[semester] || [];
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
