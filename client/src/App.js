import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, GraduationCap, DollarSign, AlertCircle, 
  Calendar, Bell, FileText, Settings, LogOut, Plus, Download, 
  TrendingUp, CheckCircle, Clock, Lock, Mail, ArrowUpRight, Award, ChevronRight, Search, Eye, Filter
} from 'lucide-react';

const API_BASE_URL = '/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin@eduerp.in');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [parentActiveTab, setParentActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dashboard Data states
  const [adminData, setAdminData] = useState(null);
  const [recentNotices, setRecentNotices] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [parentData, setParentData] = useState(null);

  // Tab Data states
  const [tabData, setTabData] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  // Fee state variables
  const [feeStudents, setFeeStudents] = useState([]);
  const [feePayments, setFeePayments] = useState([]);
  const [feeSearchTerm, setFeeSearchTerm] = useState('');
  const [showClassFeeModal, setShowClassFeeModal] = useState(false);
  const [classFeeData, setClassFeeData] = useState({ class_id: 1, amount: '' });
  const [collectingFeeStudent, setCollectingFeeStudent] = useState(null);
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
  const [newCollectPayment, setNewCollectPayment] = useState({ receipt_no: '', amount: '', mode: 'Online', status: 'Paid', date: '' });

  // Add / Edit State Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', password: 'password123', class_name: 'Class 1', roll_no: '', admission_no: '',
    parent_name: '', parent_email: '', parent_phone: ''
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [newParent, setNewParent] = useState({ name: '', email: '', phone: '', address: '', student_id: '' });
  const [editingParent, setEditingParent] = useState(null);
  const [showEditParentModal, setShowEditParentModal] = useState(false);
  const [selectedClassCardFilter, setSelectedClassCardFilter] = useState(null);
  const [selectedSubjectClassCardFilter, setSelectedSubjectClassCardFilter] = useState(null);
  const [selectedTeacherClassCardFilter, setSelectedTeacherClassCardFilter] = useState(null);
  const [selectedParentClassCardFilter, setSelectedParentClassCardFilter] = useState(null);
  const [selectedExamClassCardFilter, setSelectedExamClassCardFilter] = useState(null);
  const [selectedExamTab, setSelectedExamTab] = useState('Timetable');
  const [teacherExams, setTeacherExams] = useState([]);
  const [selectedHomeworkClassCardFilter, setSelectedHomeworkClassCardFilter] = useState(null);
  const [reportStudentId, setReportStudentId] = useState('');
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedAttendanceClassFilter, setSelectedAttendanceClassFilter] = useState('10');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [adminSearchStudentId, setAdminSearchStudentId] = useState('');
  const [adminSearchedStudentData, setAdminSearchedStudentData] = useState(null);
  const [adminSearchedStudentLoading, setAdminSearchedStudentLoading] = useState(false);
  const [adminSearchedStudentError, setAdminSearchedStudentError] = useState('');
  const [parentAttendanceView, setParentAttendanceView] = useState('Daily');
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', phone: '', qualification: '', emp_id: '', assigned_classes: [] });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [showEditClassModal, setShowEditClassModal] = useState(false);

  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSection, setNewSection] = useState({ section_name: '', class_name: '10-A' });
  const [editingSection, setEditingSection] = useState(null);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ subject_name: '', subject_code: '', class_name: 'Class 1' });
  const [editingSubject, setEditingSubject] = useState(null);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);

  const [editingFee, setEditingFee] = useState(null);
  const [showEditFeeModal, setShowEditFeeModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', exam_date: '', max_marks: '', class_name: 'Class 10' });
  const [editingExam, setEditingExam] = useState(null);
  const [showEditExamModal, setShowEditExamModal] = useState(false);

  const [showAddHomeworkModal, setShowAddHomeworkModal] = useState(false);

  const [newHomework, setNewHomework] = useState({ title: '', due_date: '', description: '', class_name: 'Class 10' });
  const [editingHomework, setEditingHomework] = useState(null);
  const [showEditHomeworkModal, setShowEditHomeworkModal] = useState(false);

  const [showAddLibraryBookModal, setShowAddLibraryBookModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', quantity: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [showEditLibraryBookModal, setShowEditLibraryBookModal] = useState(false);

  const [showAddTransportModal, setShowAddTransportModal] = useState(false);
  const [newRoute, setNewRoute] = useState({ route_name: '', driver_name: '', vehicle_no: '', pickup_point: '' });
  const [editingRoute, setEditingRoute] = useState(null);
  const [showEditTransportModal, setShowEditTransportModal] = useState(false);

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start_date: '', event_type: 'Event', description: '' });
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditEventModal, setShowEditEventModal] = useState(false);

  const [newAlert, setNewAlert] = useState({ title: '', message: '', channel: 'SMS' });

  // Teacher Marks specific modal
  const [showAddMarkModal, setShowAddMarkModal] = useState(false);
  const [newMark, setNewMark] = useState({
    student_name: '', subject_name: 'Mathematics', exam_name: 'First Term Examination',
    marks_obtained: '', max_marks: '100', grade: 'A', remarks: 'Excellent'
  });
  const [editingMark, setEditingMark] = useState(null);
  const [showEditMarkModal, setShowEditMarkModal] = useState(false);

  // Student Profile details view modal
  const [showViewStudentModal, setShowViewStudentModal] = useState(false);
  const [viewingStudentDetails, setViewingStudentDetails] = useState(null);
  const [viewingStudentLoading, setViewingStudentLoading] = useState(false);

  // Auto-fill credentials based on selected role
  useEffect(() => {
    if (selectedRole === 'admin') {
      setEmail('admin@eduerp.in');
      setPassword('password');
    } else if (selectedRole === 'teacher') {
      setEmail('teacher@eduerp.in');
      setPassword('password');
    } else if (selectedRole === 'parent') {
      setEmail('parent@eduerp.in');
      setPassword('password');
    }
  }, [selectedRole]);

  // Check logged in state on load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.role, savedToken);
    }
  }, []);

  // Fetch list data when switching tabs
  useEffect(() => {
    if (token && currentTab !== 'Dashboard') {
      fetchTabData(currentTab);
    }
    setSearchTerm('');
    setFeeSearchTerm('');
  }, [currentTab, token]);

  useEffect(() => {
    if (token && currentTab === 'Attendance') {
      fetchTabData('Attendance');
    }
  }, [attendanceDate]);

  const openAddStudentModal = () => {
    setNewStudent({
      name: '',
      email: '',
      password: 'password123',
      class_name: selectedClassCardFilter ? `Class ${selectedClassCardFilter}` : 'Class 1',
      roll_no: '',
      admission_no: '',
      parent_name: '',
      parent_email: '',
      parent_phone: ''
    });
    setShowAddStudentModal(true);
  };

  const openAddSubjectModal = () => {
    setNewSubject({
      subject_name: '',
      subject_code: '',
      class_name: selectedSubjectClassCardFilter ? `Class ${selectedSubjectClassCardFilter}` : 'Class 1'
    });
    setShowAddSubjectModal(true);
  };

  const fetchDashboardData = async (role, activeToken) => {
    try {
      const headers = { 'Authorization': `Bearer ${activeToken}` };
      if (role === 'admin') {
        const res = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers });
        if (res.ok) {
          const data = await res.json();
          setAdminData(data.data || data);
        }
        const alertsRes = await fetch(`${API_BASE_URL}/admin/alerts`, { headers });
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setRecentNotices(alertsData.slice(0, 3));
        }
      } else if (role === 'teacher') {
        const res = await fetch(`${API_BASE_URL}/teacher/dashboard`, { headers });
        if (res.ok) {
          const data = await res.json();
          setTeacherData(data.data || data);
        }
        const alertsRes = await fetch(`${API_BASE_URL}/admin/alerts`, { headers });
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setRecentNotices(alertsData.slice(0, 3));
        }
      } else if (role === 'parent' || role === 'student') {
        const res = await fetch(`${API_BASE_URL}/parent/dashboard`, { headers });
        if (res.ok) {
          const data = await res.json();
          setParentData(data.data || data);
        }
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  const fetchTabData = async (tabName) => {
    setTabLoading(true);
    setTabData([]);

    if (tabName === 'Attendance' && user && (user.role === 'admin' || user.role === 'teacher')) {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const studentsRes = await fetch(`${API_BASE_URL}/admin/students`, { headers });
        const attendanceRes = await fetch(`${API_BASE_URL}/admin/attendance?date=${attendanceDate}`, { headers });
        
        if (studentsRes.ok && attendanceRes.ok) {
          const studentsData = await studentsRes.json();
          const attendanceData = await attendanceRes.json();
          setAttendanceStudents(studentsData);
          setAttendanceRecords(attendanceData);
          setTabData(studentsData);
        }
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      } finally {
        setTabLoading(false);
      }
      return;
    }

    if (user && (user.role === 'parent' || user.role === 'student')) {
      await fetchDashboardData(user.role, token);
      setTabLoading(false);
      return;
    }

    if (user && user.role === 'teacher') {
      let path = '';
      if (tabName === 'Homework') path = 'homework';
      else if (tabName === 'Examinations') {
        try {
          const headers = { 'Authorization': `Bearer ${token}` };
          const [marksRes, examsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/teacher/marks`, { headers }),
            fetch(`${API_BASE_URL}/admin/exams`, { headers })
          ]);
          if (marksRes.ok && examsRes.ok) {
            const marksData = await marksRes.json();
            const examsData = await examsRes.json();
            setTeacherExams(examsData);
            setTabData(marksData);
          }
        } catch (err) {
          console.error("Error fetching teacher exams/marks:", err);
        } finally {
          setTabLoading(false);
        }
        return;
      }
      else if (tabName === 'Notifications') {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/alerts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setTabData(data.data || data);
          }
        } catch (err) {
          console.error("Error fetching teacher alerts:", err);
        } finally {
          setTabLoading(false);
        }
        return;
      }
      else if (tabName === 'Events') {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/events`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setTabData(data.data || data);
          }
        } catch (err) {
          console.error("Error fetching teacher events:", err);
        } finally {
          setTabLoading(false);
        }
        return;
      }
      else if (tabName === 'Students') {
        setTabData(teacherData ? teacherData.students : []);
        setTabLoading(false);
        return;
      } else {
        setTabLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/teacher/${path}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTabData(data.data || data);
        }
      } catch (err) {
        console.error("Error fetching teacher tab data:", err);
      } finally {
        setTabLoading(false);
      }
      return;
    }

    const nameMap = {
      'Students': 'students',
      'Parents': 'parents',
      'Teachers': 'teachers',
      'Fees': 'fees',
      'Examinations': 'exams',
      'Homework': 'homeworks',
      'Notifications': 'alerts',
      'Classes': 'classes',
      'Sections': 'sections',
      'Subjects': 'subjects',
      'Library': 'library',
      'Transport': 'transport',
      'Events': 'events'
    };

    const path = nameMap[tabName];
    if (!path) {
      setTabLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/${path}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (tabName === 'Fees' && user && user.role === 'admin') {
          setFeeStudents(data.students || []);
          setFeePayments(data.payments || []);
          setTabData(data.payments || []);
        } else {
          setTabData(data.data || data);
        }
      }
    } catch (err) {
      console.error("Error fetching tab data:", err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      fetchDashboardData(data.user.role, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAdminData(null);
    setTeacherData(null);
    setParentData(null);
    setCurrentTab('Dashboard');
  };

  // Teacher Attendance update toggle
  const handleTeacherAttendanceChange = (studentId, status) => {
    if (!teacherData) return;
    const updatedStudents = teacherData.students.map(s => {
      if (s.id === studentId) return { ...s, status };
      return s;
    });
    setTeacherData({ ...teacherData, students: updatedStudents });
  };

  const handleAttendanceSubmit = async () => {
    setLoading(true);
    try {
      const records = teacherData.students.map(s => ({ student_id: s.id, status: s.status }));
      const response = await fetch(`${API_BASE_URL}/teacher/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ records })
      });
      if (response.ok) {
        alert("Attendance submitted successfully!");
        fetchDashboardData('teacher', token);
      } else {
        const err = await response.json();
        alert(err.message || "Failed to submit attendance");
      }
    } catch (err) {
      alert("Error submitting attendance");
    } finally {
    }
  };

  const handleRosterAttendanceSubmit = async (recordsToSubmit) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ records: recordsToSubmit, date: attendanceDate })
      });
      if (response.ok) {
        alert("Attendance submitted successfully!");
        fetchTabData('Attendance');
        if (user && user.role === 'teacher') {
          fetchDashboardData(user.role, token);
        }
      } else {
        const err = await response.json();
        alert(err.message || "Failed to submit attendance");
      }
    } catch (e) {
      alert("Error submitting attendance");
    } finally {
    }
  };

  const getFilteredAttendanceStudents = () => {
    return attendanceStudents.filter(student => {
      const sClass = student.class_name;
      if (!sClass) return false;
      const match = sClass.toLowerCase().match(/\d+/);
      return match && match[0] === selectedAttendanceClassFilter.toString();
    });
  };

  const getStudentStatus = (studentId) => {
    const record = attendanceRecords.find(r => r.student_id === studentId);
    return record ? record.status : 'Present';
  };

  const updateStudentAttendanceStatus = (studentId, newStatus) => {
    const exists = attendanceRecords.some(r => r.student_id === studentId);
    let updated = [];
    if (exists) {
      updated = attendanceRecords.map(r => r.student_id === studentId ? { ...r, status: newStatus } : r);
    } else {
      updated = [...attendanceRecords, { student_id: studentId, date: attendanceDate, status: newStatus }];
    }
    setAttendanceRecords(updated);
  };

  const handleSubmitClassAttendance = () => {
    const displayedStudents = getFilteredAttendanceStudents();
    const recordsToSubmit = displayedStudents.map(student => {
      const status = getStudentStatus(student.id);
      return { student_id: student.id, status };
    });
    handleRosterAttendanceSubmit(recordsToSubmit);
  };

  const handleAdminStudentSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!adminSearchStudentId.trim()) {
      setAdminSearchedStudentData(null);
      setAdminSearchedStudentError('');
      return;
    }
    setAdminSearchedStudentLoading(true);
    setAdminSearchedStudentError('');
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetch(`${API_BASE_URL}/admin/reports/student?studentId=${adminSearchStudentId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setAdminSearchedStudentData(data);
      } else {
        const err = await res.json();
        setAdminSearchedStudentError(err.message || 'Student not found');
        setAdminSearchedStudentData(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setAdminSearchedStudentError('Failed to fetch student attendance history');
      setAdminSearchedStudentData(null);
    } finally {
      setAdminSearchedStudentLoading(false);
    }
  };
  // Generic delete function
  const handleDelete = async (path, id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const prefix = user.role === 'teacher' ? 'teacher' : 'admin';
        const targetPath = user.role === 'teacher' && path === 'homeworks' ? 'homework' : path;
        
        const res = await fetch(`${API_BASE_URL}/${prefix}/${targetPath}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          alert("Record deleted successfully!");
          fetchTabData(currentTab);
          fetchDashboardData(user.role, token);
        } else {
          const err = await res.json();
          alert(err.message || "Failed to delete");
        }
      } catch (e) {
        alert("Error deleting record");
      }
    }
  };

  // Generic Submit utility
  const handleFormSubmit = async (method, endpoint, bodyData, successMsg, closeModalFn, reloadTabName) => {
    setLoading(true);
    try {
      const prefix = user.role === 'teacher' ? 'teacher' : 'admin';
      const targetEndpoint = user.role === 'teacher' && endpoint === 'homeworks' ? 'homework' : 
                             user.role === 'teacher' && endpoint === 'marks' ? 'marks' : endpoint;

      const response = await fetch(`${API_BASE_URL}/${prefix}/${targetEndpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });
      if (response.ok) {
        alert(successMsg);
        closeModalFn();
        if (reloadTabName) fetchTabData(reloadTabName);
        fetchDashboardData(user.role, token);
      } else {
        const err = await response.json();
        alert(err.message || "Request failed");
      }
    } catch (err) {
      alert("Network request error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClassSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'classes', { class_name: newClassName }, "Class added successfully!", () => {
      setShowAddClassModal(false);
      setNewClassName('');
    }, 'Classes');
  };

  const handleAddSectionSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'sections', newSection, "Section added successfully!", () => {
      setShowAddSectionModal(false);
      setNewSection({ section_name: '', class_name: '10-A' });
    }, 'Sections');
  };
  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'subjects', newSubject, "Subject added successfully!", () => {
      setShowAddSubjectModal(false);
      setNewSubject({ subject_name: '', subject_code: '', class_name: 'Class 1' });
    }, 'Subjects');
  };

  const handleAddLibraryBookSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'library', newBook, "Book cataloged successfully!", () => {
      setShowAddLibraryBookModal(false);
      setNewBook({ title: '', author: '', isbn: '', quantity: '' });
    }, 'Library');
  };

  const handleAddTransportSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'transport', newRoute, "Route saved successfully!", () => {
      setShowAddTransportModal(false);
      setNewRoute({ route_name: '', driver_name: '', vehicle_no: '', pickup_point: '' });
    }, 'Transport');
  };

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'events', newEvent, "Calendar event added successfully!", () => {
      setShowAddEventModal(false);
      setNewEvent({ title: '', start_date: '', event_type: 'Event', description: '' });
    }, 'Events');
  };

  const handleAddExamSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'exams', newExam, "Exam timetabled successfully!", () => {
      setShowAddExamModal(false);
      setNewExam({ name: '', exam_date: '', max_marks: '', class_name: 'Class 10' });
    }, 'Examinations');
  };
  const handleAddHomeworkSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'homeworks', newHomework, "Homework assigned successfully!", () => {

      setShowAddHomeworkModal(false);
      setNewHomework({ title: '', due_date: '', description: '', class_name: 'Class 10' });
    }, 'Homework');
  };

  const handleExportReport = async (reportType, format) => {
    try {
      if (reportStudentId) {
        // Student-specific report
        const res = await fetch(`${API_BASE_URL}/admin/reports/student?studentId=${reportStudentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          const errData = await res.json();
          alert(errData.message || "Failed to compile student report data");
          return;
        }
        const data = await res.json();
        
        let headers = [];
        let rows = [];
        let filename = '';

        if (reportType === 'Attendance Summary Report') {
          headers = ['Date', 'Status'];
          rows = data.attendance.map(a => [a.date, a.status]);
          filename = `Attendance_Report_${data.student.name}_${data.student.displayId}`;
        } else if (reportType === 'Fee Collection Summary') {
          headers = ['Receipt No', 'Date', 'Amount Paid', 'Mode', 'Status'];
          rows = data.fees.map(f => [f.receipt_no, f.date, f.amount, f.mode, f.status]);
          filename = `Fee_Report_${data.student.name}_${data.student.displayId}`;
        } else {
          // Student Performance Ranklist
          headers = ['Examination', 'Subject', 'Marks Obtained', 'Max Marks', 'Grade', 'Remarks'];
          rows = data.marks.map(m => [m.exam_name, m.subject_name, m.marks_obtained, m.max_marks, m.grade, m.remarks]);
          filename = `Marks_Report_${data.student.name}_${data.student.displayId}`;
        }

        if (format === 'CSV') {
          const csvRows = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))];
          const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${filename}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const textLines = [
            `=========================================`,
            `          STUDENT REPORT SUMMARY         `,
            `=========================================`,
            `Student Name : ${data.student.name}`,
            `Student ID   : ${data.student.displayId}`,
            `Class        : ${data.student.class_name}`,
            `Roll No      : ${data.student.roll_no}`,
            `Admission No : ${data.student.admission_no}`,
            `Report Type  : ${reportType}`,
            `Date        : ${new Date().toLocaleDateString()}`,
            `=========================================`,
            `\n`,
            headers.join('\t\t'),
            `-----------------------------------------`,
            ...rows.map(r => r.join('\t\t')),
            `\n=========================================`
          ];
          const textContent = "data:text/plain;charset=utf-8," + encodeURIComponent(textLines.join("\n"));
          const link = document.createElement("a");
          link.setAttribute("href", textContent);
          link.setAttribute("download", `${filename}.txt`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        // General Report (All Students)
        let headers = [];
        let rows = [];
        let filename = '';

        if (reportType === 'Attendance Summary Report') {
          headers = ['Student ID', 'Student Name', 'Total Days', 'Days Present', 'Attendance Rate'];
          rows = [
            ['STU001', 'Aryan Sharma', '30', '28', '93.3%'],
            ['STU002', 'Sneha Reddy', '30', '29', '96.7%'],
            ['STU003', 'Rahul Verma', '30', '26', '86.7%'],
            ['STU004', 'Priya Patel', '30', '30', '100%']
          ];
          filename = 'General_Attendance_Summary_Report';
        } else if (reportType === 'Fee Collection Summary') {
          headers = ['Student ID', 'Student Name', 'Total Assigned', 'Paid To Date', 'Pending Balance'];
          rows = [
            ['STU001', 'Aryan Sharma', 'Rs. 45,000', 'Rs. 45,000', 'Rs. 0'],
            ['STU002', 'Sneha Reddy', 'Rs. 45,000', 'Rs. 30,000', 'Rs. 15,000'],
            ['STU003', 'Rahul Verma', 'Rs. 45,000', 'Rs. 45,000', 'Rs. 0'],
            ['STU004', 'Priya Patel', 'Rs. 45,000', 'Rs. 10,000', 'Rs. 35,000']
          ];
          filename = 'General_Fee_Collection_Summary';
        } else {
          headers = ['Rank', 'Student ID', 'Student Name', 'Class', 'Percentage', 'Grade'];
          rows = [
            ['1', 'STU002', 'Sneha Reddy', 'Class 10', '96.7%', 'A+'],
            ['2', 'STU001', 'Aryan Sharma', 'Class 10', '93.3%', 'A'],
            ['3', 'STU003', 'Rahul Verma', 'Class 10', '86.7%', 'B'],
            ['4', 'STU004', 'Priya Patel', 'Class 10', '78.3%', 'C']
          ];
          filename = 'General_Student_Performance_Ranklist';
        }

        if (format === 'CSV') {
          const csvRows = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))];
          const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${filename}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const textLines = [
            `=========================================`,
            `          GENERAL SCHOOL REPORT          `,
            `=========================================`,
            `Report Type  : ${reportType}`,
            `Date        : ${new Date().toLocaleDateString()}`,
            `=========================================`,
            `\n`,
            headers.join('\t\t'),
            `-----------------------------------------`,
            ...rows.map(r => r.join('\t\t')),
            `\n=========================================`
          ];
          const textContent = "data:text/plain;charset=utf-8," + encodeURIComponent(textLines.join("\n"));
          const link = document.createElement("a");
          link.setAttribute("href", textContent);
          link.setAttribute("download", `${filename}.txt`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Error compiling and downloading report.");
    }
  };

  const handleCreateAlertSubmit = (e) => {
    handleFormSubmit('POST', 'alerts', newAlert, "Alert broadcasted!", () => {
      setNewAlert({ title: '', message: '', channel: 'SMS' });
    }, 'Notifications');
  };

  const handleAddMarkSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit('POST', 'marks', newMark, "Marks allocated successfully!", () => {
      setShowAddMarkModal(false);
      setNewMark({
        student_name: '', subject_name: 'Mathematics', exam_name: 'First Term Examination',
        marks_obtained: '', max_marks: '100', grade: 'A', remarks: 'Excellent'
      });
    }, 'Examinations');
  };

  // Student Profile Detailed View Loader
  const handleViewStudentDetails = async (studentId) => {
    setViewingStudentLoading(true);
    setShowViewStudentModal(true);
    setViewingStudentDetails(null);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setViewingStudentDetails(data);
      } else {
        alert("Failed to load student details");
      }
    } catch (e) {
      alert("Error fetching student profile information");
    } finally {
      setViewingStudentLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-logo animate-fade">
          <div className="user-avatar" style={{ background: '#2563eb', border: 'none' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 style={{ lineHeight: '1' }}>EduERP</h1>
            <p>Smart Education Management</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to your portal</p>
          </div>

          <div className="role-tabs">
            {['admin', 'teacher', 'parent'].map((role) => (
              <button
                key={role}
                className={`role-tab ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {error && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>

            <div className="demo-credentials" onClick={() => handleLogin({ preventDefault: () => {} })}>
              Demo credentials pre-filled — click Sign In to explore
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Sidebar Menu Lists depending on role
  const getSidebarMenuItems = () => {
    if (user.role === 'admin') {
      return ['Dashboard', 'Students', 'Parents', 'Teachers', 'Subjects', 'Fees', 'Attendance', 'Examinations', 'Homework', 'Transport', 'Notifications', 'Reports', 'Settings'];
    } else if (user.role === 'teacher') {
      return ['Dashboard', 'Students', 'Attendance', 'Examinations', 'Homework', 'Notifications', 'Reports'];
    } else {
      return ['Dashboard', 'Fees', 'Attendance', 'Examinations', 'Homework', 'Notifications'];
    }
  };

  const menuIcons = {
    Dashboard: <GraduationCap size={18} />,
    Students: <Users size={18} />,
    Parents: <UserCheck size={18} />,
    Teachers: <Users size={18} />,
    Classes: <GraduationCap size={18} />,
    Sections: <GraduationCap size={18} />,
    Subjects: <FileText size={18} />,
    Fees: <DollarSign size={18} />,
    Attendance: <Calendar size={18} />,
    Examinations: <Award size={18} />,
    Homework: <FileText size={18} />,
    Library: <FileText size={18} />,
    Transport: <ChevronRight size={18} />,
    Events: <Calendar size={18} />,
    Notifications: <Bell size={18} />,
    Reports: <FileText size={18} />,
    Settings: <Settings size={18} />
  };

  const getFilteredData = () => {
    if (!tabData) return [];
    let filtered = tabData;
    if (currentTab === 'Examinations' && user && user.role === 'teacher') {
      filtered = selectedExamTab === 'Timetable' ? teacherExams : tabData;
    }

    if (currentTab === 'Students' && selectedClassCardFilter) {
      filtered = filtered.filter(item => {
        const studentClass = item.class_name;
        if (!studentClass) return false;
        const normalized = studentClass.toLowerCase();
        const match = normalized.match(/\d+/);
        if (!match) return false;
        return match[0] === selectedClassCardFilter.toString();
      });
    }

    if (currentTab === 'Subjects' && selectedSubjectClassCardFilter) {
      filtered = filtered.filter(item => {
        const subClass = item.class_name;
        if (!subClass) return false;
        const normalized = subClass.toLowerCase();
        const match = normalized.match(/\d+/);
        if (!match) return false;
        return match[0] === selectedSubjectClassCardFilter.toString();
      });
    }

    if (currentTab === 'Teachers' && selectedTeacherClassCardFilter) {
      filtered = filtered.filter(item => {
        const assigned = item.classes_assigned || '';
        if (!assigned) return false;
        const normalized = assigned.toLowerCase();
        const regex = new RegExp('\\bclass\\s*' + selectedTeacherClassCardFilter + '\\b|\\b' + selectedTeacherClassCardFilter + '\\b');
        return regex.test(normalized);
      });
    }

    if (currentTab === 'Parents' && selectedParentClassCardFilter) {
      filtered = filtered.filter(item => {
        const parentClass = item.class_name;
        if (!parentClass) return false;
        const normalized = parentClass.toLowerCase();
        const match = normalized.match(/\d+/);
        if (!match) return false;

        return match[0] === selectedParentClassCardFilter.toString();
      });
    }

    if (currentTab === 'Examinations' && selectedExamClassCardFilter) {
      filtered = filtered.filter(item => {
        const examClass = item.class_name;
        if (!examClass) return false;
        const normalized = examClass.toLowerCase();
        const match = normalized.match(/\d+/);
        if (!match) return false;
        return match[0] === selectedExamClassCardFilter.toString();
      });
    }

    if (currentTab === 'Homework' && selectedHomeworkClassCardFilter) {
      filtered = filtered.filter(item => {
        const homeworkClass = item.class_name;
        if (!homeworkClass) return false;
        const normalized = homeworkClass.toLowerCase();
        const match = normalized.match(/\d+/);
        if (!match) return false;
        return match[0] === selectedHomeworkClassCardFilter.toString();
      });
    }

    return filtered.filter(item => {
      const search = searchTerm.toLowerCase();

      if (currentTab === 'Parents') {
        const displayParentId = item.parent_id || (item.id ? `PAR${String(item.id).padStart(3, '0')}` : '');
        return (
          (item.name && item.name.toLowerCase().includes(search)) ||
          (item.email && item.email.toLowerCase().includes(search)) ||
          (item.phone && item.phone.toLowerCase().includes(search)) ||
          (displayParentId && displayParentId.toLowerCase().includes(search)) ||
          (item.child_name && item.child_name.toLowerCase().includes(search)) ||
          (item.student_id && item.student_id.toLowerCase().includes(search))
        );
      }

      if (currentTab === 'Teachers') {
        return (
          (item.name && item.name.toLowerCase().includes(search)) ||
          (item.emp_id && item.emp_id.toLowerCase().includes(search)) ||
          (item.email && item.email.toLowerCase().includes(search)) ||
          (item.qualification && item.qualification.toLowerCase().includes(search)) ||
          (item.phone && item.phone.toLowerCase().includes(search))
        );
      }

      const displayId = item.id ? `STU${String(item.id).padStart(3, '0')}` : '';
      const altDisplayId = item.student_id ? (item.student_id.startsWith('STU') ? item.student_id : `STU00${item.id}`) : `STU00${item.id}`;

      return (
        (item.name && item.name.toLowerCase().includes(search)) ||
        (item.student_name && item.student_name.toLowerCase().includes(search)) ||
        (item.email && item.email.toLowerCase().includes(search)) ||
        (displayId && displayId.toLowerCase().includes(search)) ||
        (altDisplayId && altDisplayId.toLowerCase().includes(search)) ||
        (item.student_id && item.student_id.toLowerCase().includes(search)) ||
        (item.parent_name && item.parent_name.toLowerCase().includes(search)) ||
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.class_name && item.class_name.toLowerCase().includes(search)) ||
        (item.subject_name && item.subject_name.toLowerCase().includes(search))
      );
    });
  };
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <GraduationCap size={24} />
            <div>
              <h2>EduERP</h2>
              <span style={{ textTransform: 'uppercase' }}>{user.role === 'admin' ? 'SUPER ADMIN' : user.role === 'teacher' ? 'TEACHER PORTAL' : 'PARENT PORTAL'}</span>
            </div>
          </div>

          <ul className="sidebar-menu" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            {getSidebarMenuItems().map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  className={`menu-item ${currentTab === item ? 'active' : ''}`}
                  onClick={() => setCurrentTab(item)}
                >
                  {menuIcons[item] || <FileText size={18} />}
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-bar">
            <div className="user-avatar">
              {(user && user.name) ? user.name.charAt(0) : 'U'}
            </div>
            <div className="user-info-text">
              <h4>{user.name}</h4>
              <p style={{ textTransform: 'capitalize' }}>{user.role}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-panel animate-fade">
        
        {/* Render Tab Views dynamically */}
        {currentTab !== 'Dashboard' ? (
          <div className="animate-fade">
            <header className="panel-header" style={{ marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a' }}>
                  {currentTab === 'Students' ? 'Student Management' : currentTab}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {currentTab === 'Students' ? `${tabData.length} students enrolled` : 
                   currentTab === 'Parents' ? "Parent profiles and portal accounts" :
                   currentTab === 'Teachers' ? "Teaching staff across all departments" :
                   currentTab === 'Classes' ? "Overview of academic classes" :
                   currentTab === 'Sections' ? "Class divisions and sections" :
                   currentTab === 'Subjects' ? "Subjects and mapping" :
                   currentTab === 'Fees' ? "Fee structure and invoice registers" :
                   currentTab === 'Attendance' ? "School daily attendance rates" :
                   currentTab === 'Notifications' ? "Broadcast school announcements" :
                   currentTab === 'Library' ? "Manage school books collection" :
                   currentTab === 'Transport' ? "Bus routes, vehicles and drivers" :
                   currentTab === 'Events' ? "Holidays and academic calendar events" :
                   currentTab === 'Reports' ? "Generate PDF summary logs" :
                   currentTab === 'Settings' ? "Manage school details and settings" :
                   currentTab === 'Examinations' ? (user.role === 'teacher' ? "Add and update marks for your students" : "Standard exam timetable schedules") :
                   currentTab === 'Homework' ? (user.role === 'teacher' ? "Assignments assigned by you" : "Homework schedules and submissions") : ''}
                </p>
              </div>

              {/* Show add/create options for Admin or Teacher */}
              <div className="header-actions">
                {user.role === 'admin' && currentTab === 'Students' && (
                  <button className="btn-primary" onClick={openAddStudentModal}>
                    <Plus size={16} /> Add Student
                  </button>
                )}

                {user.role === 'admin' && currentTab === 'Parents' && (
                  <button className="btn-primary" onClick={() => setShowAddParentModal(true)}>
                    <Plus size={16} /> Add Parent
                  </button>
                )}
                {user.role === 'admin' && currentTab === 'Teachers' && (
                  <button className="btn-primary" onClick={() => setShowAddTeacherModal(true)}>
                    <Plus size={16} /> Add Teacher
                  </button>
                )}
                {user.role === 'admin' && currentTab === 'Classes' && (
                  <button className="btn-primary" onClick={() => setShowAddClassModal(true)}>
                    <Plus size={16} /> Add Class
                  </button>
                )}
                {user.role === 'admin' && currentTab === 'Sections' && (
                  <button className="btn-primary" onClick={() => setShowAddSectionModal(true)}>
                    <Plus size={16} /> Add Section
                  </button>
                )}
                {user.role === 'admin' && currentTab === 'Subjects' && (
                  <button className="btn-primary" onClick={openAddSubjectModal}>
                    <Plus size={16} /> Add Subject
                  </button>
                )}

                {user.role === 'admin' && currentTab === 'Library' && (
                  <button className="btn-primary" onClick={() => setShowAddLibraryBookModal(true)}>
                    <Plus size={16} /> Add Book
                  </button>
                )}
                {user.role === 'admin' && currentTab === 'Transport' && (
                  <button className="btn-primary" onClick={() => setShowAddTransportModal(true)}>
                    <Plus size={16} /> Add Route
                  </button>
                )}
                {user.role === 'admin' && currentTab === 'Events' && (
                  <button className="btn-primary" onClick={() => setShowAddEventModal(true)}>
                    <Plus size={16} /> Add Event
                  </button>
                )}
                {user.role === 'admin' && currentTab === 'Examinations' && (
                  <button className="btn-primary" onClick={() => setShowAddExamModal(true)}>
                    <Plus size={16} /> Add Exam Schedule
                  </button>
                )}

                {/* TEACHER ACCESS */}
                {user.role === 'teacher' && currentTab === 'Homework' && (
                  <button className="btn-primary" onClick={() => setShowAddHomeworkModal(true)}>
                    <Plus size={16} /> Add Homework
                  </button>
                )}
                {user.role === 'teacher' && currentTab === 'Examinations' && (
                  <button className="btn-primary" onClick={() => setShowAddMarkModal(true)}>
                    <Plus size={16} /> Add Marks
                  </button>
                )}
              </div>
            </header>

            {/* LOADING STATE */}
            {tabLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                Loading records, please wait...
              </div>
            ) : (
              <div>
                
                {/* 1. STUDENTS TAB */}
                {currentTab === 'Students' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Class Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                      {/* All Classes Card */}
                      <div 
                        onClick={() => setSelectedClassCardFilter(null)}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          border: selectedClassCardFilter === null ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                          padding: '16px',
                          cursor: 'pointer',
                          boxShadow: selectedClassCardFilter === null ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 'none',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: '700', color: selectedClassCardFilter === null ? 'var(--color-primary)' : '#0f172a' }}>All Classes</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{tabData.length} Students</span>
                      </div>

                      {/* Class 1 to Class 10 Cards */}
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(classNum => {
                        // Count students in this class
                        const count = tabData.filter(item => {
                          const studentClass = item.class_name;
                          if (!studentClass) return false;
                          const normalized = studentClass.toLowerCase();
                          const match = normalized.match(/\d+/);
                          return match && match[0] === classNum.toString();
                        }).length;

                        const isActive = selectedClassCardFilter === classNum;

                        return (
                          <div 
                            key={classNum}
                            onClick={() => setSelectedClassCardFilter(classNum)}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '12px',
                              border: isActive ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                              padding: '16px',
                              cursor: 'pointer',
                              boxShadow: isActive ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 'none',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: '700', color: isActive ? 'var(--color-primary)' : '#0f172a' }}>Class {classNum}</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{count} Enrolled</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="alerts-card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', border: 'var(--card-border)' }}>
                    
                    {/* Search and Filters Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                      <div className="input-wrapper" style={{ flex: '1' }}>
                        <Search className="input-icon" size={18} style={{ color: '#94a3b8' }} />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Search by name, ID, or parent name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => alert('Filters opened')}>
                          <Filter size={16} style={{ color: '#64748b' }} />
                          Filter
                        </button>
                        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => alert('Exporting student roster...')}>
                          <Download size={16} style={{ color: '#64748b' }} />
                          Export
                        </button>
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                          <th style={{ padding: '14px 16px' }}>Student</th>
                          <th style={{ padding: '14px 16px' }}>ID</th>
                          <th style={{ padding: '14px 16px' }}>Class</th>
                          <th style={{ padding: '14px 16px' }}>Roll No.</th>
                          <th style={{ padding: '14px 16px' }}>Parent</th>
                          <th style={{ padding: '14px 16px' }}>Mobile</th>
                          <th style={{ padding: '14px 16px' }}>Status</th>
                          <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredData().map(student => (
                          <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', color: '#1e293b' }}>
                              <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '13px', background: '#3b82f6', border: 'none' }}>
                                {(student.name || 'Student').charAt(0)}
                              </div>
                              {student.name || 'N/A'}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: '700' }}>
                              {student.student_id ? (student.student_id.startsWith('STU') ? student.student_id : `STU00${student.id}`) : `STU00${student.id}`}
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a' }}>{student.class_name}</td>
                            <td style={{ padding: '14px 16px' }}>{student.roll_no || student.roll_number}</td>
                            <td style={{ padding: '14px 16px', fontWeight: '500', color: '#2563eb' }}>{student.parent_name}</td>
                            <td style={{ padding: '14px 16px', color: '#64748b' }}>{student.mobile || student.parent_phone}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{
                                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                backgroundColor: student.status === 'Active' ? '#e6fcf5' : '#f1f5f9',
                                color: student.status === 'Active' ? '#10b981' : '#64748b'
                              }}>
                                {student.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }} title="View Profile Details" onClick={() => handleViewStudentDetails(student.id)}>
                                  <Eye size={16} />
                                </button>
                                {user.role === 'admin' && (
                                  <>
                                    <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Edit Student" onClick={() => {
                                      setEditingStudent({ 
                                        id: student.id, 
                                        name: student.name, 
                                        email: student.email || '', 
                                        class_name: student.class_name, 
                                        roll_no: student.roll_no || student.roll_number, 
                                        status: student.status || 'Active',
                                        parent_name: student.parent_name,
                                        parent_email: student.parent_email,
                                        parent_phone: student.parent_phone
                                      });
                                      setShowEditStudentModal(true);
                                    }}>
                                      <FileText size={16} />
                                    </button>
                                    <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Delete Student" onClick={() => handleDelete('students', student.id)}>
                                      <AlertCircle size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
                {/* 2. PARENTS TAB */}
                {currentTab === 'Parents' && (
                  <div className="animate-fade">
                    <div className="alerts-card" style={{ padding: '20px' }}>                      {/* Search Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                        <div className="input-wrapper" style={{ flex: '1' }}>
                          <Search className="input-icon" size={18} style={{ color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search by Parent Name, Parent ID, Mobile, Email, Child Name or Student ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Class Division Card Grid */}
                      <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Filter by Child's Class Division</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                          <div 
                            style={{ 
                              padding: '10px 6px', 
                              textAlign: 'center', 
                              cursor: 'pointer',
                              borderRadius: '8px',
                              border: selectedParentClassCardFilter === null ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                              backgroundColor: selectedParentClassCardFilter === null ? 'var(--color-primary-light)' : 'white',
                              fontWeight: '700',
                              fontSize: '12px',
                              color: selectedParentClassCardFilter === null ? 'var(--color-primary)' : '#1e293b'
                            }}
                            onClick={() => setSelectedParentClassCardFilter(null)}
                          >
                            All Classes
                          </div>
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((clsNum) => {
                            const isActive = selectedParentClassCardFilter === clsNum;
                            return (
                              <div 
                                key={clsNum}
                                style={{ 
                                  padding: '10px 6px', 
                                  textAlign: 'center', 
                                  cursor: 'pointer',
                                  borderRadius: '8px',
                                  border: isActive ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'white',
                                  fontWeight: '700',
                                  fontSize: '12px',
                                  color: isActive ? 'var(--color-primary)' : '#1e293b'
                                }}
                                onClick={() => setSelectedParentClassCardFilter(clsNum)}
                              >
                                Class {clsNum}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                            <th style={{ padding: '12px' }}>Parent Name</th>
                            <th style={{ padding: '12px' }}>Parent ID</th>
                            <th style={{ padding: '12px' }}>Child/Student</th>
                            <th style={{ padding: '12px' }}>Mobile</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            {user.role === 'admin' && <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredData().map(parent => (
                            <tr key={parent.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                              <td style={{ padding: '12px', fontWeight: '700' }}>{parent.name}</td>
                              <td style={{ padding: '12px', color: 'var(--color-text-light)', fontWeight: '700' }}>{parent.parent_id}</td>
                              <td style={{ padding: '12px', fontWeight: '600' }}>{parent.child_name}</td>
                              <td style={{ padding: '12px' }}>{parent.phone}</td>
                              <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{parent.email}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                  backgroundColor: parent.status === 'Active' ? '#e6fcf5' : '#fdf2f2',
                                  color: parent.status === 'Active' ? '#10b981' : '#ef4444'
                                }}>
                                  {parent.status}
                                </span>
                              </td>
                              {user.role === 'admin' && (
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                      setEditingParent(parent);
                                      setShowEditParentModal(true);
                                    }}>
                                      <FileText size={16} />
                                    </button>
                                    <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete('parents', parent.id)}>
                                      <AlertCircle size={16} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {/* 3. TEACHERS TAB */}
                {currentTab === 'Teachers' && (
                  <div className="alerts-card" style={{ padding: '20px' }}>
                    
                    {/* Teachers Search & Class Filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div className="input-wrapper" style={{ flex: '1' }}>
                          <Search className="input-icon" size={18} style={{ color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search by Teacher Name, Employee ID, Email, Department or Qualification..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Class Division Card Grid */}
                      <div>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Filter by Assigned Class Division</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                          <div 
                            style={{ 
                              padding: '10px 6px', 
                              textAlign: 'center', 
                              cursor: 'pointer',
                              borderRadius: '8px',
                              border: selectedTeacherClassCardFilter === null ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                              backgroundColor: selectedTeacherClassCardFilter === null ? 'var(--color-primary-light)' : 'white',
                              fontWeight: '700',
                              fontSize: '12px',
                              color: selectedTeacherClassCardFilter === null ? 'var(--color-primary)' : '#1e293b'
                            }}
                            onClick={() => setSelectedTeacherClassCardFilter(null)}
                          >
                            All Classes
                          </div>
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((clsNum) => {
                            const isActive = selectedTeacherClassCardFilter === clsNum;
                            return (
                              <div 
                                key={clsNum}
                                style={{ 
                                  padding: '10px 6px', 
                                  textAlign: 'center', 
                                  cursor: 'pointer',
                                  borderRadius: '8px',
                                  border: isActive ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'white',
                                  fontWeight: '700',
                                  fontSize: '12px',
                                  color: isActive ? 'var(--color-primary)' : '#1e293b'
                                }}
                                onClick={() => setSelectedTeacherClassCardFilter(clsNum)}
                              >
                                Class {clsNum}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px' }}>Teacher</th>
                          <th style={{ padding: '12px' }}>Emp ID</th>
                          <th style={{ padding: '12px' }}>Department</th>
                          <th style={{ padding: '12px' }}>Classes Assigned</th>
                          <th style={{ padding: '12px' }}>Qualification</th>
                          <th style={{ padding: '12px' }}>Mobile</th>
                          {user.role === 'admin' && <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredData().map(teacher => (
                          <tr key={teacher.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                              <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                                {(teacher.name || 'Teacher').charAt(0)}
                              </div>
                              <div>
                                {teacher.name || 'N/A'}
                                <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-light)', fontWeight: 'normal' }}>{teacher.email}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px', color: 'var(--color-text-light)', fontWeight: '700' }}>{teacher.emp_id}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                backgroundColor: '#eff6ff', color: '#2563eb'
                              }}>
                                {teacher.department}
                              </span>
                            </td>
                            <td style={{ padding: '12px', fontWeight: '600' }}>{teacher.classes_assigned}</td>
                            <td style={{ padding: '12px' }}>{teacher.qualification}</td>
                            <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{teacher.phone}</td>
                            {user.role === 'admin' && (
                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                    setEditingTeacher(teacher);
                                    setShowEditTeacherModal(true);
                                  }}>
                                    <FileText size={16} />
                                  </button>
                                  <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete('teachers', teacher.id)}>
                                    <AlertCircle size={16} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CLASSES TAB */}
                {currentTab === 'Classes' && (
                  <div className="alerts-card" style={{ padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px 16px' }}>Class Name</th>
                          <th style={{ padding: '12px 16px' }}>Class Teacher</th>
                          {user.role === 'admin' && <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredData().map(cls => (
                          <tr key={cls.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700' }}>{cls.class_name}</td>
                            <td style={{ padding: '14px 16px' }}>{cls.teacher_name}</td>
                            {user.role === 'admin' && (
                              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                    setEditingClass(cls);
                                    setShowEditClassModal(true);
                                  }}>
                                    <FileText size={16} />
                                  </button>
                                  <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete('classes', cls.id)}>
                                    <AlertCircle size={16} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* SECTIONS TAB */}
                {currentTab === 'Sections' && (
                  <div className="alerts-card" style={{ padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px 16px' }}>Section Name</th>
                          <th style={{ padding: '12px 16px' }}>Class</th>
                          {user.role === 'admin' && <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredData().map(sec => (
                          <tr key={sec.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700' }}>Section {sec.section_name}</td>
                            <td style={{ padding: '14px 16px' }}>{sec.class_name}</td>
                            {user.role === 'admin' && (
                              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                    setEditingSection(sec);
                                    setShowEditSectionModal(true);
                                  }}>
                                    <FileText size={16} />
                                  </button>
                                  <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete('sections', sec.id)}>
                                    <AlertCircle size={16} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* SUBJECTS TAB */}
                {currentTab === 'Subjects' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Class Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                      {/* All Classes Card */}
                      <div 
                        onClick={() => setSelectedSubjectClassCardFilter(null)}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          border: selectedSubjectClassCardFilter === null ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                          padding: '16px',
                          cursor: 'pointer',
                          boxShadow: selectedSubjectClassCardFilter === null ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 'none',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: '700', color: selectedSubjectClassCardFilter === null ? 'var(--color-primary)' : '#0f172a' }}>All Classes</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{tabData.length} Subjects</span>
                      </div>

                      {/* Class 1 to Class 10 Cards */}
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(classNum => {
                        // Count subjects in this class
                        const count = tabData.filter(item => {
                          const subClass = item.class_name;
                          if (!subClass) return false;
                          const normalized = subClass.toLowerCase();
                          const match = normalized.match(/\d+/);
                          return match && match[0] === classNum.toString();
                        }).length;

                        const isActive = selectedSubjectClassCardFilter === classNum;

                        return (
                          <div 
                            key={classNum}
                            onClick={() => setSelectedSubjectClassCardFilter(classNum)}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '12px',
                              border: isActive ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                              padding: '16px',
                              cursor: 'pointer',
                              boxShadow: isActive ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 'none',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              position: 'relative'
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: '700', color: isActive ? 'var(--color-primary)' : '#0f172a' }}>Class {classNum}</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{count} Subjects</span>
                              {user.role === 'admin' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewSubject({
                                      subject_name: '',
                                      subject_code: '',
                                      class_name: `Class ${classNum}`
                                    });
                                    setShowAddSubjectModal(true);
                                  }}
                                  style={{
                                    border: 'none',
                                    background: '#eff6ff',
                                    color: 'var(--color-primary)',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '700'
                                  }}
                                  title={`Add subject to Class ${classNum}`}
                                >
                                  +
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="alerts-card" style={{ padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px 16px' }}>Subject Name</th>
                          <th style={{ padding: '12px 16px' }}>Subject Code</th>
                          {user.role === 'admin' && <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredData().map(sub => (
                          <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700' }}>{sub.subject_name}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{sub.subject_code}</td>
                            {user.role === 'admin' && (
                              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                    setEditingSubject(sub);
                                    setShowEditSubjectModal(true);
                                  }}>
                                    <FileText size={16} />
                                  </button>
                                  <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete('subjects', sub.id)}>
                                    <AlertCircle size={16} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

                {/* 4. FEES TAB */}
                {currentTab === 'Fees' && (
                  user.role === 'parent' || user.role === 'student' ? (
                    /* Parent Read-Only Fees View */
                    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div className="stat-card" style={{ minHeight: 'auto', padding: '16px' }}>
                          <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Total Assigned Tuition Fee</h4>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>Rs. {parseFloat(parentData?.stats?.totalFee || 45000).toLocaleString()}</h3>
                        </div>
                        <div className="stat-card" style={{ minHeight: 'auto', padding: '16px' }}>
                          <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Total Paid to Date</h4>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginTop: '6px' }}>Rs. {parseFloat(parentData?.stats?.paidFee || 0).toLocaleString()}</h3>
                        </div>
                        <div className="stat-card" style={{ minHeight: 'auto', padding: '16px' }}>
                          <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Remaining Balance (Pending)</h4>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444', marginTop: '6px' }}>Rs. {parseFloat(parentData?.stats?.pendingFee || 0).toLocaleString()}</h3>
                        </div>
                      </div>

                      <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Student Fee Payment Records</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                              <th style={{ padding: '12px' }}>Receipt No</th>
                              <th style={{ padding: '12px' }}>Payment Date</th>
                              <th style={{ padding: '12px' }}>Amount Paid</th>
                              <th style={{ padding: '12px' }}>Mode</th>
                              <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parentData?.fees?.map(fee => (
                              <tr key={fee.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-primary)' }}>{fee.receipt_no}</td>
                                <td style={{ padding: '12px' }}>{new Date(fee.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                <td style={{ padding: '12px', fontWeight: '700' }}>Rs. {parseFloat(fee.amount).toLocaleString()}</td>
                                <td style={{ padding: '12px' }}>{fee.mode}</td>
                                <td style={{ padding: '12px' }}>
                                  <span style={{
                                    padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                    backgroundColor: fee.status === 'Paid' ? '#e6fcf5' : '#fdf2f2',
                                    color: fee.status === 'Paid' ? '#10b981' : '#ef4444'
                                  }}>{fee.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Admin Editable Fees View */
                    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div className="alerts-card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', border: 'var(--card-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Student Fee Balances</h3>
                            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Search by student ID or name to record or view dues</p>
                          </div>
                          <button className="btn-primary" onClick={() => setShowClassFeeModal(true)}>
                            <Plus size={16} /> Set Class Fee
                          </button>
                        </div>

                        <div className="input-wrapper" style={{ maxWidth: '400px', marginBottom: '20px' }}>
                          <Search className="input-icon" size={18} style={{ color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search by student name or ID (e.g. STU009)..."
                            value={feeSearchTerm}
                            onChange={(e) => setFeeSearchTerm(e.target.value)}
                          />
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                              <th style={{ padding: '12px' }}>Student</th>
                              <th style={{ padding: '12px' }}>ID</th>
                              <th style={{ padding: '12px' }}>Class</th>
                              <th style={{ padding: '12px' }}>Total Fee</th>
                              <th style={{ padding: '12px' }}>Amount Paid</th>
                              <th style={{ padding: '12px' }}>Pending Due</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {feeStudents
                              .filter(s => {
                                const term = feeSearchTerm.toLowerCase();
                                const displayId = s.id ? `STU${String(s.id).padStart(3, '0')}` : '';
                                return (
                                  s.name.toLowerCase().includes(term) ||
                                  (s.student_id && s.student_id.toLowerCase().includes(term)) ||
                                  displayId.toLowerCase().includes(term) ||
                                  s.class_name.toLowerCase().includes(term)
                                );
                              })
                              .map(student => (
                                <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                  <td style={{ padding: '12px', fontWeight: '700' }}>{student.name}</td>
                                  <td style={{ padding: '12px', color: '#94a3b8', fontWeight: '700' }}>
                                    {student.student_id ? (student.student_id.startsWith('STU') ? student.student_id : `STU00${student.id}`) : `STU00${student.id}`}
                                  </td>
                                  <td style={{ padding: '12px', fontWeight: '600' }}>{student.class_name}</td>
                                  <td style={{ padding: '12px', fontWeight: '600' }}>Rs. {parseFloat(student.total_fee).toLocaleString()}</td>
                                  <td style={{ padding: '12px', color: '#10b981', fontWeight: '700' }}>Rs. {parseFloat(student.paid_fee).toLocaleString()}</td>
                                  <td style={{ padding: '12px', color: student.pending_fee > 0 ? '#ef4444' : '#10b981', fontWeight: '700' }}>
                                    Rs. {parseFloat(student.pending_fee).toLocaleString()}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => {
                                      setCollectingFeeStudent(student);
                                      setNewCollectPayment({
                                        receipt_no: `RCP-${Date.now()}`,
                                        amount: student.pending_fee,
                                        mode: 'Online',
                                        status: 'Paid',
                                        date: new Date().toISOString().split('T')[0]
                                      });
                                      setShowCollectFeeModal(true);
                                    }}>
                                      <DollarSign size={12} /> Collect Payment
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="alerts-card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', border: 'var(--card-border)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Payment Transaction History</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                              <th style={{ padding: '12px' }}>Receipt No.</th>
                              <th style={{ padding: '12px' }}>Student</th>
                              <th style={{ padding: '12px' }}>Class</th>
                              <th style={{ padding: '12px' }}>Date</th>
                              <th style={{ padding: '12px' }}>Amount Paid</th>
                              <th style={{ padding: '12px' }}>Mode</th>
                              <th style={{ padding: '12px' }}>Status</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {feePayments.map(fee => (
                              <tr key={fee.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                <td style={{ padding: '14px 12px', fontWeight: '700', color: 'var(--color-primary)' }}>{fee.receipt_no}</td>
                                <td style={{ padding: '14px 12px', fontWeight: '600' }}>{fee.student_name}</td>
                                <td style={{ padding: '14px 12px' }}>{fee.class_name}</td>
                                <td style={{ padding: '14px 12px' }}>{new Date(fee.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                <td style={{ padding: '14px 12px', fontWeight: '700' }}>Rs. {parseFloat(fee.amount).toLocaleString()}</td>
                                <td style={{ padding: '14px 12px', fontWeight: '600' }}>{fee.mode}</td>
                                <td style={{ padding: '14px 12px' }}>
                                  <span style={{
                                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                    backgroundColor: fee.status === 'Paid' ? '#e6fcf5' : '#fdf2f2',
                                    color: fee.status === 'Paid' ? '#10b981' : '#ef4444'
                                  }}>
                                    {fee.status}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }} title="Edit Receipt" onClick={() => {
                                      setEditingFee(fee);
                                      setShowEditFeeModal(true);
                                    }}>
                                      <FileText size={16} />
                                    </button>
                                    <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Delete Receipt" onClick={() => handleDelete('fees', fee.id)}>
                                      <AlertCircle size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                )}

                {/* 5. ATTENDANCE TAB */}
                {currentTab === 'Attendance' && (
                  user.role === 'parent' || user.role === 'student' ? (
                    /* Parent Read-Only child attendance log */
                    <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0' }}>Student Attendance History</h3>
                        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                          {['Daily', 'Monthly', 'Yearly'].map((view) => (
                            <button
                              key={view}
                              type="button"
                              style={{
                                padding: '6px 12px',
                                border: 'none',
                                background: parentAttendanceView === view ? 'white' : 'transparent',
                                color: parentAttendanceView === view ? 'var(--color-primary)' : '#64748b',
                                fontWeight: '700',
                                fontSize: '12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                boxShadow: parentAttendanceView === view ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.15s'
                              }}
                              onClick={() => setParentAttendanceView(view)}
                            >
                              {view}
                            </button>
                          ))}
                        </div>
                      </div>

                      {parentAttendanceView === 'Daily' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                              <th style={{ padding: '12px' }}>Date</th>
                              <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parentData?.attendance && parentData.attendance.length > 0 ? (
                              parentData.attendance.map(att => (
                                <tr key={att.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                  <td style={{ padding: '12px', fontWeight: '600' }}>{new Date(att.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                  <td style={{ padding: '12px' }}>
                                    <span style={{
                                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                      backgroundColor: att.status === 'Present' ? '#e6fcf5' : att.status === 'Late' ? '#fef8e6' : '#fdf2f2',
                                      color: att.status === 'Present' ? '#10b981' : att.status === 'Late' ? '#f59e0b' : '#ef4444'
                                    }}>{att.status}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="2" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No attendance records found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}

                      {parentAttendanceView === 'Monthly' && (() => {
                        const groups = {};
                        (parentData?.attendance || []).forEach(att => {
                          const dateObj = new Date(att.date);
                          const key = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                          if (!groups[key]) {
                            groups[key] = { Present: 0, Absent: 0, Late: 0 };
                          }
                          groups[key][att.status] = (groups[key][att.status] || 0) + 1;
                        });

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.keys(groups).length > 0 ? (
                              Object.entries(groups).map(([month, data]) => {
                                const total = data.Present + data.Absent + data.Late;
                                const rate = total > 0 ? Math.round((data.Present / total) * 100) : 0;
                                return (
                                  <div key={month} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', backgroundColor: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0' }}>{month}</h4>
                                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', backgroundColor: '#e6fcf5', padding: '4px 8px', borderRadius: '6px' }}>
                                        Attendance Rate: {rate}%
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                                      <div style={{ color: '#10b981', fontWeight: '700' }}>Present: {data.Present}</div>
                                      <div style={{ color: '#ef4444', fontWeight: '700' }}>Absent: {data.Absent}</div>
                                      <div style={{ color: '#f59e0b', fontWeight: '700' }}>Late: {data.Late}</div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No monthly attendance history found.</div>
                            )}
                          </div>
                        );
                      })()}

                      {parentAttendanceView === 'Yearly' && (() => {
                        const groups = {};
                        (parentData?.attendance || []).forEach(att => {
                          const dateObj = new Date(att.date);
                          const key = dateObj.getFullYear().toString();
                          if (!groups[key]) {
                            groups[key] = { Present: 0, Absent: 0, Late: 0 };
                          }
                          groups[key][att.status] = (groups[key][att.status] || 0) + 1;
                        });

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.keys(groups).length > 0 ? (
                              Object.entries(groups).map(([year, data]) => {
                                const total = data.Present + data.Absent + data.Late;
                                const rate = total > 0 ? Math.round((data.Present / total) * 100) : 0;
                                return (
                                  <div key={year} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#f8fafc' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0' }}>Academic Year {year}</h4>
                                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'white', backgroundColor: '#10b981', padding: '6px 12px', borderRadius: '8px' }}>
                                        Annual Rate: {rate}%
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                                      <div><span style={{ color: '#64748b' }}>Present Days:</span> <strong style={{ color: '#10b981' }}>{data.Present}</strong></div>
                                      <div><span style={{ color: '#64748b' }}>Absent Days:</span> <strong style={{ color: '#ef4444' }}>{data.Absent}</strong></div>
                                      <div><span style={{ color: '#64748b' }}>Late Days:</span> <strong style={{ color: '#f59e0b' }}>{data.Late}</strong></div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No yearly attendance history found.</div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Admin & Teacher Portals Attendance View */
                    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* Admin Student Search Bar */}
                      {user.role === 'admin' && (
                        <div className="alerts-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', margin: '0' }}>Search Attendance History by Student ID</h4>
                          <form onSubmit={handleAdminStudentSearch} style={{ display: 'flex', gap: '10px' }}>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="Enter Student ID (e.g. STU001, STU002 or roll/admission number)..." 
                              value={adminSearchStudentId}
                              onChange={(e) => {
                                setAdminSearchStudentId(e.target.value);
                                if (!e.target.value.trim()) {
                                  setAdminSearchedStudentData(null);
                                  setAdminSearchedStudentError('');
                                }
                              }}
                              style={{ flex: '1', padding: '10px 14px', fontSize: '13px' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }} disabled={adminSearchedStudentLoading}>
                              {adminSearchedStudentLoading ? 'Searching...' : 'Search History'}
                            </button>
                            {adminSearchedStudentData && (
                              <button 
                                type="button" 
                                className="btn-secondary" 
                                onClick={() => {
                                  setAdminSearchStudentId('');
                                  setAdminSearchedStudentData(null);
                                  setAdminSearchedStudentError('');
                                }}
                                style={{ padding: '10px 16px' }}
                              >
                                Clear
                              </button>
                            )}
                          </form>
                          {adminSearchedStudentError && <p style={{ color: '#ef4444', fontSize: '12px', margin: '0', fontWeight: '600' }}>{adminSearchedStudentError}</p>}
                        </div>
                      )}

                      {adminSearchedStudentData ? (
                        /* Admin Searched Student Complete History View */
                        <div className="alerts-card" style={{ padding: '20px' }}>
                          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                              Attendance History for {adminSearchedStudentData.student.name}
                            </h3>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>
                              ID: <strong>{adminSearchedStudentData.student.displayId}</strong> | Roll No: <strong>{adminSearchedStudentData.student.roll_no}</strong> | Class: <strong>{adminSearchedStudentData.student.class_name}</strong>
                            </p>
                          </div>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px' }}>Date</th>
                                <th style={{ padding: '12px' }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminSearchedStudentData.attendance && adminSearchedStudentData.attendance.length > 0 ? (
                                adminSearchedStudentData.attendance.map((att, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                    <td style={{ padding: '12px', fontWeight: '600' }}>{new Date(att.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                    <td style={{ padding: '12px' }}>
                                      <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                        backgroundColor: att.status === 'Present' ? '#e6fcf5' : att.status === 'Late' ? '#fef8e6' : '#fdf2f2',
                                        color: att.status === 'Present' ? '#10b981' : att.status === 'Late' ? '#f59e0b' : '#ef4444'
                                      }}>{att.status}</span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="2" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No attendance records found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* Normal Class-wise / Date-wise Display & Action Sheets */
                        <>
                          {/* Top Class Selection Cards Grid */}
                          <div>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Select Class Division</h3>
                            <div className="classes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((clsNum) => {
                                const isActive = selectedAttendanceClassFilter === clsNum;
                                const count = attendanceStudents.filter(s => {
                                  const sClass = s.class_name;
                                  if (!sClass) return false;
                                  const match = sClass.toLowerCase().match(/\d+/);
                                  return match && match[0] === clsNum;
                                }).length;

                                return (
                                  <div 
                                    key={clsNum}
                                    className={`class-card ${isActive ? 'active' : ''}`}
                                    style={{ 
                                      padding: '12px 8px', 
                                      textAlign: 'center', 
                                      cursor: 'pointer',
                                      borderRadius: '10px',
                                      border: isActive ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                      backgroundColor: isActive ? 'var(--color-primary-light)' : 'white',
                                      transition: 'all 0.2s'
                                    }}
                                    onClick={() => setSelectedAttendanceClassFilter(clsNum)}
                                  >
                                    <span style={{ fontWeight: '700', fontSize: '13px', display: 'block', color: isActive ? 'var(--color-primary)' : '#1e293b' }}>Class {clsNum}</span>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>{count} Students</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Date Selection / Submit Banner */}
                          <div className="alerts-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Attendance Date:</label>
                              <input 
                                type="date" 
                                className="form-input" 
                                style={{ width: '160px', padding: '8px 12px', fontSize: '13px', paddingLeft: '12px' }} 
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                              />
                            </div>
                            {user.role === 'teacher' && (
                              <button 
                                className="btn-primary" 
                                style={{ backgroundColor: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}
                                onClick={handleSubmitClassAttendance}
                                disabled={loading}
                              >
                                <CheckCircle size={16} /> Submit Class {selectedAttendanceClassFilter} Attendance
                              </button>
                            )}
                          </div>

                          {/* Student Attendance marking roster table */}
                          <div className="alerts-card" style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                              Students Attendance Sheet - Class {selectedAttendanceClassFilter}
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                              <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>
                                  <th style={{ padding: '12px' }}>Student</th>
                                  <th style={{ padding: '12px' }}>Student ID</th>
                                  <th style={{ padding: '12px' }}>Roll No.</th>
                                  <th style={{ padding: '12px', textAlign: 'center' }}>Attendance Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getFilteredAttendanceStudents().length > 0 ? (
                                  getFilteredAttendanceStudents().map(student => {
                                    const currentStatus = getStudentStatus(student.id);
                                    const initials = (student.name || 'Student').charAt(0);
                                    
                                    return (
                                      <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                        <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '13px', fontWeight: '700' }}>
                                            {initials}
                                          </div>
                                          <span style={{ fontWeight: '700' }}>{student.name}</span>
                                        </td>
                                        <td style={{ padding: '12px', color: '#64748b', fontWeight: '600' }}>{student.student_id || `STU${String(student.id).padStart(3, '0')}`}</td>
                                        <td style={{ padding: '12px', fontWeight: '600' }}>{student.roll_no || student.id}</td>
                                        <td style={{ padding: '12px' }}>
                                          {user.role === 'admin' ? (
                                            /* Admin view: Read-only badge */
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                              <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                backgroundColor: currentStatus === 'Present' ? '#e6fcf5' : currentStatus === 'Late' ? '#fef8e6' : currentStatus === 'Absent' ? '#fdf2f2' : '#f1f5f9',
                                                color: currentStatus === 'Present' ? '#10b981' : currentStatus === 'Late' ? '#f59e0b' : currentStatus === 'Absent' ? '#ef4444' : '#64748b'
                                              }}>
                                                {currentStatus || 'Not Marked'}
                                              </span>
                                            </div>
                                          ) : (
                                            /* Teacher view: Interactive toggles */
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                              <button 
                                                type="button" 
                                                style={{ 
                                                  padding: '6px 12px', 
                                                  borderRadius: '6px', 
                                                  fontSize: '12px', 
                                                  fontWeight: '700',
                                                  cursor: 'pointer',
                                                  border: '1px solid #10b981',
                                                  backgroundColor: currentStatus === 'Present' ? '#10b981' : 'transparent',
                                                  color: currentStatus === 'Present' ? 'white' : '#10b981',
                                                  transition: 'all 0.15s'
                                                }}
                                                onClick={() => updateStudentAttendanceStatus(student.id, 'Present')}
                                              >
                                                Present
                                              </button>
                                              <button 
                                                type="button" 
                                                style={{ 
                                                  padding: '6px 12px', 
                                                  borderRadius: '6px', 
                                                  fontSize: '12px', 
                                                  fontWeight: '700',
                                                  cursor: 'pointer',
                                                  border: '1px solid #ef4444',
                                                  backgroundColor: currentStatus === 'Absent' ? '#ef4444' : 'transparent',
                                                  color: currentStatus === 'Absent' ? 'white' : '#ef4444',
                                                  transition: 'all 0.15s'
                                                }}
                                                onClick={() => updateStudentAttendanceStatus(student.id, 'Absent')}
                                              >
                                                Absent
                                              </button>
                                              <button 
                                                type="button" 
                                                style={{ 
                                                  padding: '6px 12px', 
                                                  borderRadius: '6px', 
                                                  fontSize: '12px', 
                                                  fontWeight: '700',
                                                  cursor: 'pointer',
                                                  border: '1px solid #f59e0b',
                                                  backgroundColor: currentStatus === 'Late' ? '#f59e0b' : 'transparent',
                                                  color: currentStatus === 'Late' ? 'white' : '#f59e0b',
                                                  transition: 'all 0.15s'
                                                }}
                                                onClick={() => updateStudentAttendanceStatus(student.id, 'Late')}
                                              >
                                                Late
                                              </button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                                      No students found enrolled in Class {selectedAttendanceClassFilter}.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  )
                )}

                {/* EXAMINATIONS TAB */}
                {currentTab === 'Examinations' && (
                  user.role === 'parent' || user.role === 'student' ? (
                    /* Parent Read-Only academic results & exam schedule view */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Scheduled Exams Timetable for Parent */}
                      <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Scheduled Examinations ({parentData?.child?.class_name})</h3>
                        {parentData?.exams && parentData.exams.length > 0 ? (
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                                <th style={{ padding: '12px' }}>Exam Name</th>
                                <th style={{ padding: '12px' }}>Exam Date</th>
                                <th style={{ padding: '12px' }}>Max Marks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parentData.exams.map(ex => (
                                <tr key={ex.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                  <td style={{ padding: '12px', fontWeight: '700' }}>{ex.name}</td>
                                  <td style={{ padding: '12px', fontWeight: '600' }}>{new Date(ex.exam_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                  <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-primary)' }}>{ex.max_marks}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No exams scheduled for your child's class division.</p>
                        )}
                      </div>

                      {/* Report Card results */}
                      <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Academic Report Card</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                              <th style={{ padding: '12px' }}>Examination</th>
                              <th style={{ padding: '12px' }}>Subject</th>
                              <th style={{ padding: '12px' }}>Marks Obtained</th>
                              <th style={{ padding: '12px' }}>Max Marks</th>
                              <th style={{ padding: '12px' }}>Grade</th>
                              <th style={{ padding: '12px' }}>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parentData?.results?.map(mark => (
                              <tr key={mark.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                <td style={{ padding: '12px', fontWeight: '700' }}>{mark.exam_name}</td>
                                <td style={{ padding: '12px', fontWeight: '600' }}>{mark.subject_name}</td>
                                <td style={{ padding: '12px', color: 'var(--color-primary)', fontWeight: '700' }}>{mark.marks_obtained}</td>
                                <td style={{ padding: '12px' }}>{mark.max_marks}</td>
                                <td style={{ padding: '12px', fontWeight: '700' }}>{mark.grade || 'A'}</td>
                                <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{mark.remarks || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Admin/Teacher Portal view */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* Class division filter cards */}
                      <div style={{ marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Filter by Class Division</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                          <div 
                            style={{ 
                              padding: '10px 6px', 
                              textAlign: 'center', 
                              cursor: 'pointer',
                              borderRadius: '8px',
                              border: selectedExamClassCardFilter === null ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                              backgroundColor: selectedExamClassCardFilter === null ? 'var(--color-primary-light)' : 'white',
                              fontWeight: '700',
                              fontSize: '12px',
                              color: selectedExamClassCardFilter === null ? 'var(--color-primary)' : '#1e293b'
                            }}
                            onClick={() => setSelectedExamClassCardFilter(null)}
                          >
                            All Classes
                          </div>
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((clsNum) => {
                            const isActive = selectedExamClassCardFilter === clsNum;
                            return (
                              <div 
                                key={clsNum}
                                style={{ 
                                  padding: '10px 6px', 
                                  textAlign: 'center', 
                                  cursor: 'pointer',
                                  borderRadius: '8px',
                                  border: isActive ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'white',
                                  fontWeight: '700',
                                  fontSize: '12px',
                                  color: isActive ? 'var(--color-primary)' : '#1e293b'
                                }}
                                onClick={() => setSelectedExamClassCardFilter(clsNum)}
                              >
                                Class {clsNum}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sub-tab Switcher for Teacher */}
                      {user.role === 'teacher' && (
                        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '10px' }}>
                          <button 
                            style={{
                              padding: '8px 16px',
                              fontWeight: '700',
                              fontSize: '13px',
                              color: selectedExamTab === 'Timetable' ? 'var(--color-primary)' : '#64748b',
                              border: 'none',
                              background: 'none',
                              borderBottom: selectedExamTab === 'Timetable' ? '2px solid var(--color-primary)' : 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setSelectedExamTab('Timetable')}
                          >
                            Exam Schedules (Timetable)
                          </button>
                          <button 
                            style={{
                              padding: '8px 16px',
                              fontWeight: '700',
                              fontSize: '13px',
                              color: selectedExamTab === 'Marks' ? 'var(--color-primary)' : '#64748b',
                              border: 'none',
                              background: 'none',
                              borderBottom: selectedExamTab === 'Marks' ? '2px solid var(--color-primary)' : 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setSelectedExamTab('Marks')}
                          >
                            Student Marks Roster
                          </button>
                        </div>
                      )}

                      {/* Main Data Lists */}
                      {(user.role === 'admin' || selectedExamTab === 'Timetable') ? (
                        /* Exam Schedules List Table */
                        <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                                <th style={{ padding: '12px 16px' }}>Exam Name</th>
                                <th style={{ padding: '12px 16px' }}>Target Class</th>
                                <th style={{ padding: '12px 16px' }}>Exam Date</th>
                                <th style={{ padding: '12px 16px' }}>Max Marks</th>
                                {user.role === 'admin' && <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {getFilteredData().map(ex => (
                                <tr key={ex.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                  <td style={{ padding: '14px 16px', fontWeight: '700' }}>{ex.name}</td>
                                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{ex.class_name}</td>
                                  <td style={{ padding: '14px 16px' }}>{new Date(ex.exam_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--color-primary)' }}>{ex.max_marks}</td>
                                  {user.role === 'admin' && (
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                          setEditingExam(ex);
                                          setShowEditExamModal(true);
                                        }}>
                                          <FileText size={16} />
                                        </button>
                                        <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete('exams', ex.id)}>
                                          <AlertCircle size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                              {getFilteredData().length === 0 && (
                                <tr>
                                  <td colSpan={user.role === 'admin' ? 5 : 4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                                    No examinations scheduled for this class division.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* Teacher Student Marks Roster Table */
                        <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                                <th style={{ padding: '12px 16px' }}>Student</th>
                                <th style={{ padding: '12px 16px' }}>Roll No</th>
                                <th style={{ padding: '12px 16px' }}>Subject</th>
                                <th style={{ padding: '12px 16px' }}>Marks Obtained</th>
                                <th style={{ padding: '12px 16px' }}>Grade</th>
                                <th style={{ padding: '12px 16px' }}>Remarks</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getFilteredData().map(ex => (
                                <tr key={ex.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                                  <td style={{ padding: '14px 16px', fontWeight: '700' }}>{ex.student_name}</td>
                                  <td style={{ padding: '14px 16px' }}>{ex.roll_no}</td>
                                  <td style={{ padding: '14px 16px' }}>{ex.subject_name}</td>
                                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--color-primary)' }}>{ex.marks_obtained} / {ex.max_marks}</td>
                                  <td style={{ padding: '14px 16px', fontWeight: '700' }}>{ex.grade || 'A'}</td>
                                  <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{ex.remarks || 'N/A'}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                      setEditingMark(ex);
                                      setShowEditMarkModal(true);
                                    }}>
                                      <FileText size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {getFilteredData().length === 0 && (
                                <tr>
                                  <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                                    No student marks entered for this class division.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                  )
                )}

                {/* HOMEWORK TAB */}
                {currentTab === 'Homework' && (
                  user.role === 'parent' || user.role === 'student' ? (
                    /* Parent Read-Only child homework list */
                    <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Homework Assignments</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                            <th style={{ padding: '12px 16px' }}>Homework Title</th>
                            <th style={{ padding: '12px 16px' }}>Class</th>
                            <th style={{ padding: '12px 16px' }}>Due Date</th>
                            <th style={{ padding: '12px 16px' }}>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parentData?.homeworks?.map(h => (
                            <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                              <td style={{ padding: '14px 16px', fontWeight: '700' }}>{h.title}</td>
                              <td style={{ padding: '14px 16px' }}>{h.class_name}</td>
                              <td style={{ padding: '14px 16px' }}>{h.due_date}</td>
                              <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{h.description || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Admin/Teacher Homework Table */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* Class division filter cards */}
                      <div style={{ marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Filter by Class Division</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                          <div 
                            style={{ 
                              padding: '10px 6px', 
                              textAlign: 'center', 
                              cursor: 'pointer',
                              borderRadius: '8px',
                              border: selectedHomeworkClassCardFilter === null ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                              backgroundColor: selectedHomeworkClassCardFilter === null ? 'var(--color-primary-light)' : 'white',
                              fontWeight: '700',
                              fontSize: '12px',
                              color: selectedHomeworkClassCardFilter === null ? 'var(--color-primary)' : '#1e293b'
                            }}
                            onClick={() => setSelectedHomeworkClassCardFilter(null)}
                          >
                            All Classes
                          </div>
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((clsNum) => {
                            const isActive = selectedHomeworkClassCardFilter === clsNum;
                            return (
                              <div 
                                key={clsNum}
                                style={{ 
                                  padding: '10px 6px', 
                                  textAlign: 'center', 
                                  cursor: 'pointer',
                                  borderRadius: '8px',
                                  border: isActive ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'white',
                                  fontWeight: '700',
                                  fontSize: '12px',
                                  color: isActive ? 'var(--color-primary)' : '#1e293b'
                                }}
                                onClick={() => setSelectedHomeworkClassCardFilter(clsNum)}
                              >
                                Class {clsNum}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="alerts-card" style={{ padding: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                            <th style={{ padding: '12px 16px' }}>Homework Title</th>
                            <th style={{ padding: '12px 16px' }}>Class</th>
                            <th style={{ padding: '12px 16px' }}>Due Date</th>
                            {user.role !== 'teacher' && <th style={{ padding: '12px 16px' }}>Teacher</th>}
                            <th style={{ padding: '12px 16px' }}>Description</th>
                            {(user.role === 'admin' || user.role === 'teacher') && <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredData().map(h => (
                            <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                              <td style={{ padding: '14px 16px', fontWeight: '700' }}>{h.title}</td>
                              <td style={{ padding: '14px 16px' }}>{h.class_name}</td>
                              <td style={{ padding: '14px 16px' }}>{h.due_date}</td>
                              {user.role !== 'teacher' && <td style={{ padding: '14px 16px' }}>{h.teacher_name}</td>}
                              <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{h.description || 'N/A'}</td>
                              {(user.role === 'admin' || user.role === 'teacher') && (
                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => {
                                      setEditingHomework(h);
                                      setShowEditHomeworkModal(true);
                                    }}>
                                      <FileText size={16} />
                                    </button>
                                    <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete('homeworks', h.id)}>
                                      <AlertCircle size={16} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}

                {/* LIBRARY TAB */}
                {currentTab === 'Library' && (
                  <div className="alerts-card" style={{ padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px 16px' }}>Title</th>
                          <th style={{ padding: '12px 16px' }}>Author</th>
                          <th style={{ padding: '12px 16px' }}>ISBN</th>
                          <th style={{ padding: '12px 16px' }}>Quantity</th>
                          <th style={{ padding: '12px 16px' }}>Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.map(b => (
                          <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700' }}>{b.title}</td>
                            <td style={{ padding: '14px 16px' }}>{b.author}</td>
                            <td style={{ padding: '14px 16px' }}>{b.isbn}</td>
                            <td style={{ padding: '14px 16px' }}>{b.quantity}</td>
                            <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: '700' }}>{b.available_quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TRANSPORT TAB */}
                {currentTab === 'Transport' && (
                  <div className="alerts-card" style={{ padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px 16px' }}>Route Name</th>
                          <th style={{ padding: '12px 16px' }}>Driver</th>
                          <th style={{ padding: '12px 16px' }}>Vehicle No</th>
                          <th style={{ padding: '12px 16px' }}>Pickup Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.map(tr => (
                          <tr key={tr.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700' }}>{tr.route_name}</td>
                            <td style={{ padding: '14px 16px' }}>{tr.driver_name}</td>
                            <td style={{ padding: '14px 16px' }}>{tr.vehicle_no}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{tr.pickup_point}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* EVENTS TAB */}
                {currentTab === 'Events' && (
                  <div className="alerts-card" style={{ padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px 16px' }}>Title</th>
                          <th style={{ padding: '12px 16px' }}>Event Date</th>
                          <th style={{ padding: '12px 16px' }}>Type</th>
                          <th style={{ padding: '12px 16px' }}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.map(ev => (
                          <tr key={ev.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700' }}>{ev.title}</td>
                            <td style={{ padding: '14px 16px' }}>{ev.start_date}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{
                                padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                backgroundColor: ev.event_type === 'Holiday' ? '#fdf2f2' : '#eff6ff',
                                color: ev.event_type === 'Holiday' ? '#ef4444' : '#2563eb'
                              }}>{ev.event_type}</span>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{ev.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 7. NOTIFICATIONS TAB */}
                {currentTab === 'Notifications' && (
                  user.role === 'parent' || user.role === 'student' ? (
                    /* Parent Alerts Feed */
                    <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Announcements Feed</h3>
                      <div className="alerts-list">
                        {parentData?.alerts?.map((alert, idx) => (
                          <div className="alert-item" key={idx}>
                            <div className="alert-badge"></div>
                            <div className="alert-content">
                              <h4>{alert.title}</h4>
                              <p>{alert.message}</p>
                              <div className="alert-meta">
                                {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {alert.channel}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Admin Notifications list */
                    <div style={{ display: 'grid', gridTemplateColumns: user.role === 'admin' ? '1.5fr 1fr' : '1fr', gap: '24px' }}>
                      <div className="alerts-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Broadcasts History</h3>
                        <div className="alerts-list">
                          {tabData.map(alert => (
                            <div className="alert-item" key={alert.id}>
                              <div className="alert-badge"></div>
                              <div className="alert-content">
                                <h4>{alert.title}</h4>
                                <p>{alert.message}</p>
                                <div className="alert-meta">
                                  {new Date(alert.created_at || new Date()).toLocaleString()} • {alert.channel}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {user.role === 'admin' && (
                        <div className="alerts-card" style={{ padding: '20px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Send New Alert Notice</h3>
                          <form onSubmit={handleCreateAlertSubmit}>
                            <div className="form-group">
                              <label>Title</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ paddingLeft: '14px' }} 
                                placeholder="e.g. School Reopening Date" 
                                value={newAlert.title} 
                                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})} 
                                required 
                              />
                            </div>
                            <div className="form-group">
                              <label>Message Content</label>
                              <textarea 
                                className="form-input" 
                                style={{ paddingLeft: '14px', paddingTop: '10px', minHeight: '100px', resize: 'vertical' }} 
                                placeholder="Write message details here..." 
                                value={newAlert.message} 
                                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})} 
                                required 
                              />
                            </div>
                            <div className="form-group">
                              <label>Send via Channel</label>
                              <select 
                                className="form-input" 
                                style={{ paddingLeft: '14px' }} 
                                value={newAlert.channel} 
                                onChange={(e) => setNewAlert({...newAlert, channel: e.target.value})}
                              >
                                <option value="SMS">SMS Notification (Parents & Teachers)</option>
                                <option value="WhatsApp">WhatsApp Broadcast (Parents & Teachers)</option>
                              </select>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
                              Broadcast Alert
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )
                )}
                {/* 9. REPORTS TAB */}
                {currentTab === 'Reports' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="alerts-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Filter by Student ID (Optional)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          style={{ paddingLeft: '14px' }} 
                          placeholder="e.g. STU001, roll number, or admission number" 
                          value={reportStudentId} 
                          onChange={(e) => setReportStudentId(e.target.value)} 
                        />
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', flex: 2, minWidth: '250px' }}>
                        Enter a student ID to download report logs specifically for that student. Leave blank to download general school reports.
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                      {['Attendance Summary Report', 'Fee Collection Summary', 'Student Performance Ranklist'].map((title, i) => (
                        <div className="stat-card" key={i} style={{ minHeight: '180px', justifyContent: 'space-between' }}>
                          <div className="card-header">
                            <div className="card-icon-container students"><FileText size={20} /></div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{title}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                              {reportStudentId ? `Filter: Student ID "${reportStudentId}"` : 'Academic Period 2024-25'}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', flex: '1', justifyContent: 'center' }} onClick={() => handleExportReport(title, 'CSV')}>CSV</button>
                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', flex: '1', justifyContent: 'center' }} onClick={() => handleExportReport(title, 'PDF')}>PDF</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. SETTINGS TAB */}
                {currentTab === 'Settings' && (
                  <div style={{ maxWidth: '600px', padding: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>General Settings</h3>
                    <div className="form-group">
                      <label>School/College Name</label>
                      <input type="text" className="form-input" style={{ paddingLeft: '14px' }} defaultValue="EduERP International Academy" />
                    </div>
                    <div className="form-group">
                      <label>Current Academic Session</label>
                      <input type="text" className="form-input" style={{ paddingLeft: '14px' }} defaultValue="2024-2025" />
                    </div>
                    <div className="form-group">
                      <label>System Email Address</label>
                      <input type="email" className="form-input" style={{ paddingLeft: '14px' }} defaultValue="noreply@eduerp.in" />
                    </div>
                    <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => alert('Settings saved successfully!')}>Save System Settings</button>
                  </div>
                )}

              </div>
            )}
          </div>
        ) : (
          /* OTHERWISE RENDER PORTALS AS USUAL */
          <>
            {/* 1. ADMIN DASHBOARD */}
            {user.role === 'admin' && adminData && (
              <div className="animate-fade">
                <header className="panel-header">
                  <div className="header-title">
                    <h2>Admin Dashboard</h2>
                    <p>Academic Year 2024-25 • Tuesday, 24 Jun 2024</p>
                  </div>
                  <div className="header-actions">
                    <button className="btn-secondary" onClick={() => alert('Exporting data reports...')}>
                      <Download size={16} /> Export
                    </button>
                    <button className="btn-primary" onClick={openAddStudentModal}>
                      <Plus size={16} /> Add Student
                    </button>
                  </div>
                </header>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container students"><Users size={20} /></div>
                      <div className="change-badge positive"><TrendingUp size={12} /> {adminData.stats.studentsChange}</div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.totalStudents.toLocaleString()}</h3>
                      <p>Total Students</p>
                      <span>{adminData.stats.studentsSub}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container teachers"><Users size={20} /></div>
                      <div className="change-badge positive"><TrendingUp size={12} /> {adminData.stats.teachersChange}</div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.totalTeachers}</h3>
                      <p>Total Teachers</p>
                      <span>{adminData.stats.teachersSub}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container classes"><GraduationCap size={20} /></div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.totalClasses}</h3>
                      <p>Total Classes</p>
                      <span>{adminData.stats.classesChange}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container fees-collected"><DollarSign size={20} /></div>
                      <div className="change-badge positive"><TrendingUp size={12} /> {adminData.stats.feeCollectedChange}</div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.feeCollected}</h3>
                      <p>Fee Collected</p>
                      <span>{adminData.stats.feeCollectedSub}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container fees-pending"><AlertCircle size={20} /></div>
                      <div className="change-badge negative"><TrendingUp size={12} style={{ transform: 'rotate(180deg)' }} /> {adminData.stats.pendingFeesChange}</div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.pendingFees}</h3>
                      <p>Pending Fees</p>
                      <span>{adminData.stats.pendingFeesSub}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container attendance"><Calendar size={20} /></div>
                      <div className="change-badge positive"><TrendingUp size={12} /> {adminData.stats.attendanceChange}</div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.avgAttendance}</h3>
                      <p>Avg Attendance</p>
                      <span>{adminData.stats.attendanceSub}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container admissions"><Plus size={20} /></div>
                      <div className="change-badge positive"><TrendingUp size={12} /> {adminData.stats.admissionsChange}</div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.newAdmissions}</h3>
                      <p>New Admissions</p>
                      <span>{adminData.stats.admissionsSub}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container notifications"><Bell size={20} /></div>
                    </div>
                    <div className="card-body">
                      <h3>{adminData.stats.notificationsSent}</h3>
                      <p>Notifications Sent</p>
                      <span>{adminData.stats.notificationsSub}</span>
                    </div>
                  </div>
                </div>

                <div className="charts-section">
                  <div className="chart-card">
                    <div className="chart-title">Monthly Fee Collection</div>
                    <div className="fee-chart-container">
                      <div className="chart-grid-lines">
                        <div className="grid-line"><span className="grid-line-label">6L</span></div>
                        <div className="grid-line"><span className="grid-line-label">4.5L</span></div>
                        <div className="grid-line"><span className="grid-line-label">3L</span></div>
                        <div className="grid-line"><span className="grid-line-label">1.5L</span></div>
                        <div className="grid-line" style={{ borderBottom: 'none' }}><span className="grid-line-label">0L</span></div>
                      </div>

                      {adminData.feeCollectionChart.map((item, index) => (
                        <div className="fee-chart-bar-group" key={index}>
                          <div className="fee-bars">
                            <div className="bar collected" style={{ height: `${(item.collected / 6) * 100}%` }}>
                              <div className="bar-tooltip">Collected: {item.collected}L</div>
                            </div>
                            <div className="bar pending" style={{ height: `${(item.pending / 6) * 100}%` }}>
                              <div className="bar-tooltip">Pending: {item.pending}L</div>
                            </div>
                          </div>
                          <div className="chart-x-label">{item.month}</div>
                        </div>
                      ))}
                    </div>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#2563eb' }}></div>
                        Collected
                      </div>
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#ff9e9e' }}></div>
                        Pending
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-title">Attendance Analysis</div>
                    <div className="doughnut-container">
                      <div 
                        className="doughnut-wrapper"
                        style={{ 
                          background: `conic-gradient(
                            #10b981 0% ${adminData.attendanceAnalysis.present}%, 
                            #ef4444 ${adminData.attendanceAnalysis.present}% ${adminData.attendanceAnalysis.present + adminData.attendanceAnalysis.absent}%, 
                            #f59e0b ${adminData.attendanceAnalysis.present + adminData.attendanceAnalysis.absent}% 100%
                          )` 
                        }}
                      >
                        <div className="doughnut-hole">
                          <span className="doughnut-info-value">{adminData.attendanceAnalysis.present}%</span>
                          <span className="doughnut-info-label">Present</span>
                        </div>
                      </div>

                      <div className="attendance-legend">
                        <div className="att-legend-row">
                          <div className="att-legend-label">
                            <div className="att-dot present"></div>
                            Present
                          </div>
                          <div className="att-legend-val">{adminData.attendanceAnalysis.present}%</div>
                        </div>
                        <div className="att-legend-row">
                          <div className="att-legend-label">
                            <div className="att-dot absent"></div>
                            Absent
                          </div>
                          <div className="att-legend-val">{adminData.attendanceAnalysis.absent}%</div>
                        </div>
                        <div className="att-legend-row">
                          <div className="att-legend-label">
                            <div className="att-dot late"></div>
                            Late
                          </div>
                          <div className="att-legend-val">{adminData.attendanceAnalysis.late}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Grid: Student Enrollment Growth & Quick Actions */}
                <div className="bottom-grid-row">
                  <div className="chart-card">
                    <div className="chart-title">Student Enrollment Growth</div>
                    <div className="fee-chart-container" style={{ height: '240px', position: 'relative' }}>
                      <div className="chart-grid-lines">
                        <div className="grid-line"><span className="grid-line-label">1100</span></div>
                        <div className="grid-line"><span className="grid-line-label">1060</span></div>
                        <div className="grid-line"><span className="grid-line-label">1020</span></div>
                        <div className="grid-line"><span className="grid-line-label">980</span></div>
                        <div className="grid-line" style={{ borderBottom: 'none' }}><span className="grid-line-label">940</span></div>
                      </div>

                      <svg style={{ position: 'absolute', top: 0, left: 50, width: 'calc(100% - 70px)', height: '200px', overflow: 'visible' }}>
                        <path 
                          d="M 20 160 L 20 122 L 110 110 L 200 92 L 290 68 L 380 55 L 470 28 L 470 160 Z" 
                          fill="rgba(37, 99, 235, 0.05)" 
                        />
                        <path 
                          d="M 20 122 L 110 110 L 200 92 L 290 68 L 380 55 L 470 28" 
                          fill="none" 
                          stroke="#2563eb" 
                          strokeWidth="3" 
                        />
                        <circle cx="20" cy="122" r="5" fill="#2563eb" />
                        <circle cx="110" cy="110" r="5" fill="#2563eb" />
                        <circle cx="200" cy="92" r="5" fill="#2563eb" />
                        <circle cx="290" cy="68" r="5" fill="#2563eb" />
                        <circle cx="380" cy="55" r="5" fill="#2563eb" />
                        <circle cx="470" cy="28" r="5" fill="#2563eb" />
                      </svg>

                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '65px', paddingRight: '15px', marginTop: '205px', fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-title">Quick Actions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="quick-action-item" onClick={openAddStudentModal}>
                        <div className="quick-action-left">
                          <div className="quick-action-icon blue"><Users size={16} /></div>
                          <span className="quick-action-title">Add New Student</span>
                        </div>
                        <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                      </div>

                      <div className="quick-action-item" onClick={() => setShowAddTeacherModal(true)}>
                        <div className="quick-action-left">
                          <div className="quick-action-icon purple"><UserCheck size={16} /></div>
                          <span className="quick-action-title">Add Teacher</span>
                        </div>
                        <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                      </div>

                      <div className="quick-action-item" onClick={() => setCurrentTab('Fees')}>
                        <div className="quick-action-left">
                          <div className="quick-action-icon green"><DollarSign size={16} /></div>
                          <span className="quick-action-title">Fee Structure</span>
                        </div>
                        <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                      </div>

                      <div className="quick-action-item" onClick={() => setCurrentTab('Reports')}>
                        <div className="quick-action-left">
                          <div className="quick-action-icon purple"><FileText size={16} /></div>
                          <span className="quick-action-title">Generate Reports</span>
                        </div>
                        <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                      </div>

                      <div className="quick-action-item" onClick={() => setCurrentTab('Notifications')}>
                        <div className="quick-action-left">
                          <div className="quick-action-icon orange"><Bell size={16} /></div>
                          <span className="quick-action-title">Send Notification</span>
                        </div>
                        <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Notification Feed */}
                <div className="recent-notifications-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Recent Notifications</h3>
                    <a href="#notifications" style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); setCurrentTab('Notifications'); }}>View All</a>
                  </div>
                  <div className="notification-feed-list">
                    {recentNotices.length > 0 ? (
                      recentNotices.map((notice, idx) => (
                        <div className="notification-feed-item" key={notice.id || idx}>
                          <div className="notification-feed-left">
                            <div className="notification-feed-bullet"></div>
                            <div className="notification-feed-content">
                              <h4>{notice.title}</h4>
                              <p>{notice.message}</p>
                            </div>
                          </div>
                          <div className="notification-feed-time">
                            {new Date(notice.created_at || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="notification-feed-item">
                          <div className="notification-feed-left">
                            <div className="notification-feed-bullet"></div>
                            <div className="notification-feed-content">
                              <h4>Fee Due Reminder</h4>
                              <p>Fee for Q3 2024 is due on 30 June 2024. Please pay to avoid late charges.</p>
                            </div>
                          </div>
                          <div className="notification-feed-time">2 hours ago</div>
                        </div>
                        <div className="notification-feed-item">
                          <div className="notification-feed-left">
                            <div className="notification-feed-bullet"></div>
                            <div className="notification-feed-content">
                              <h4>Exam Schedule Released</h4>
                              <p>Annual examination schedule for 2024 has been published. Check the exam portal.</p>
                            </div>
                          </div>
                          <div className="notification-feed-time">1 day ago</div>
                        </div>
                        <div className="notification-feed-item">
                          <div className="notification-feed-left">
                            <div className="notification-feed-bullet"></div>
                            <div className="notification-feed-content">
                              <h4>Holiday Notice</h4>
                              <p>School will remain closed on 15 Aug 2024 on account of Independence Day.</p>
                            </div>
                          </div>
                          <div className="notification-feed-time">3 days ago</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 2. TEACHER DASHBOARD */}
            {user.role === 'teacher' && teacherData && (
              <div className="animate-fade">
                <header className="panel-header">
                  <div className="header-title">
                    <h2>Teacher Dashboard</h2>
                    <p>{teacherData.teacher.name} • {teacherData.teacher.department} • Tuesday, 24 Jun 2024</p>
                  </div>
                </header>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container students"><Users size={20} /></div>
                    </div>
                    <div className="card-body">
                      <h3>{teacherData.stats.myStudents}</h3>
                      <p>My Students</p>
                      <span>{teacherData.stats.studentsSub}</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="card-header">
                      <div className="card-icon-container attendance"><Calendar size={20} /></div>
                    </div>
                    <div className="card-body">
                      <h3>{teacherData.stats.avgAttendance}</h3>
                      <p>Avg Attendance</p>
                      <span>{teacherData.stats.attendanceSub}</span>
                    </div>
                  </div>
                </div>

                <div className="attendance-card">
                  <div className="attendance-list-header">
                    <div>
                      <h3>Mark Attendance — Today</h3>
                      <p>Click status to toggle student state</p>
                    </div>
                    <button className="btn-primary" style={{ backgroundColor: '#10b981' }} onClick={handleAttendanceSubmit}>
                      <CheckCircle size={16} /> Submit Attendance
                    </button>
                  </div>

                  <div className="student-list">
                    {teacherData.students.map((student) => (
                      <div className="student-row" key={student.id}>
                        <div className="student-info">
                          <div className="student-profile-pic">
                            {student.name ? student.name.split(' ').map(n=>n[0] || '').join('') : 'S'}
                          </div>
                          <div className="student-details">
                            <h4>{student.name || 'N/A'}</h4>
                            <p>{student.class_name || 'N/A'} • Adm: {student.admission_no} • Roll: {student.roll_no}</p>
                          </div>
                        </div>

                        <div className="status-toggles">
                          {['Present', 'Absent', 'Late'].map((status) => (
                            <button
                              key={status}
                              className={`status-btn ${status} ${student.status === status ? 'selected' : ''}`}
                              onClick={() => handleTeacherAttendanceChange(student.id, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. PARENT PORTAL */}
            {(user.role === 'parent' || user.role === 'student') && parentData && (
              <div className="animate-fade">
                <div className="parent-banner">
                  <div className="parent-banner-avatar">
                    <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '24px', border: 'none' }}>
                      {(parentData.child.name || 'Child').charAt(0)}
                    </div>
                  </div>
                  <div>
                    <span className="banner-welcome">WELCOME BACK, {user.name ? user.name.toUpperCase() : 'PARENT'}</span>
                    <h2 className="banner-name">{parentData.child.name || 'N/A'}</h2>
                    <div className="banner-tags">
                      <div className="banner-tag">Class {parentData.child.class_name}</div>
                      <div className="banner-tag">Roll No: {parentData.child.roll_no}</div>
                      <div className="banner-tag">Adm: {parentData.child.admission_no}</div>
                    </div>
                  </div>
                </div>
                <div className="parent-tabs">
                  {['Overview', 'Fee', 'Attendance', 'Results', 'Subjects'].map((tab) => (
                    <button
                      key={tab}
                      className={`parent-tab ${parentActiveTab === tab ? 'active' : ''}`}
                      onClick={() => setParentActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {parentActiveTab === 'Overview' && (
                  <div className="animate-fade">
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="card-header">
                          <div className="card-icon-container fees-collected" style={{ color: '#2563eb' }}><DollarSign size={20} /></div>
                        </div>
                        <div className="card-body">
                          <h3 style={{ color: '#2563eb' }}>Rs. {parentData.stats.totalFee ? parentData.stats.totalFee.toLocaleString() : '45,000'}</h3>
                          <p>Total Tuition Fee</p>
                          <span>Assigned school rate</span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="card-header">
                          <div className="card-icon-container attendance" style={{ color: '#10b981' }}><DollarSign size={20} /></div>
                        </div>
                        <div className="card-body">
                          <h3 style={{ color: '#10b981' }}>Rs. {parentData.stats.paidFee ? parentData.stats.paidFee.toLocaleString() : '0'}</h3>
                          <p>Total Paid Fee</p>
                          <span>Received receipts total</span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="card-header">
                          <div className="card-icon-container fees-pending" style={{ color: '#ef4444' }}><DollarSign size={20} /></div>
                        </div>
                        <div className="card-body">
                          <h3 style={{ color: '#ef4444' }}>Rs. {parentData.stats.pendingFee.toLocaleString()}</h3>
                          <p>Pending Fee Balance</p>
                          <span style={{ color: '#ef4444', fontWeight: '600' }}>Due Date: {parentData.stats.feeDueDate}</span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="card-header">
                          <div className="card-icon-container attendance" style={{ color: '#10b981' }}><Calendar size={20} /></div>
                        </div>
                        <div className="card-body">
                          <h3 style={{ color: '#10b981' }}>{parentData.stats.attendancePct}%</h3>
                          <p>Attendance</p>
                          <span>{parentData.stats.attendanceDays}</span>
                        </div>
                      </div>
                    </div>

                    <div className="alerts-card" style={{ padding: '20px' }}>
                      <div className="alerts-header">
                        <Bell size={20} style={{ color: '#2563eb' }} />
                        <h3>Recent Alerts</h3>
                      </div>
                      <div className="alerts-list">
                        {parentData.alerts.map((alert, index) => (
                          <div className="alert-item" key={index}>
                            <div className="alert-badge"></div>
                            <div className="alert-content">
                              <h4>{alert.title}</h4>
                              <p>{alert.message}</p>
                              <div className="alert-meta">
                                {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {alert.channel}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {parentActiveTab === 'Fee' && (
                  <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div className="stat-card" style={{ minHeight: 'auto', padding: '16px' }}>
                        <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Total Assigned Tuition Fee</h4>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>Rs. {parseFloat(parentData.stats.totalFee || 45000).toLocaleString()}</h3>
                      </div>
                      <div className="stat-card" style={{ minHeight: 'auto', padding: '16px' }}>
                        <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Total Paid to Date</h4>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginTop: '6px' }}>Rs. {parseFloat(parentData.stats.paidFee || 0).toLocaleString()}</h3>
                      </div>
                      <div className="stat-card" style={{ minHeight: 'auto', padding: '16px' }}>
                        <h4 style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Remaining Balance (Pending)</h4>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444', marginTop: '6px' }}>Rs. {parseFloat(parentData.stats.pendingFee || 0).toLocaleString()}</h3>
                      </div>
                    </div>

                    <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Student Fee Payment Records</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                            <th style={{ padding: '12px' }}>Receipt No</th>
                            <th style={{ padding: '12px' }}>Payment Date</th>
                            <th style={{ padding: '12px' }}>Amount Paid</th>
                            <th style={{ padding: '12px' }}>Mode</th>
                            <th style={{ padding: '12px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parentData.fees.map(fee => (
                            <tr key={fee.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                              <td style={{ padding: '12px', fontWeight: '700', color: 'var(--color-primary)' }}>{fee.receipt_no}</td>
                              <td style={{ padding: '12px' }}>{new Date(fee.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td style={{ padding: '12px', fontWeight: '700' }}>Rs. {parseFloat(fee.amount).toLocaleString()}</td>
                              <td style={{ padding: '12px' }}>{fee.mode}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                  backgroundColor: fee.status === 'Paid' ? '#e6fcf5' : '#fdf2f2',
                                  color: fee.status === 'Paid' ? '#10b981' : '#ef4444'
                                }}>{fee.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {parentActiveTab === 'Attendance' && (
                  <div className="alerts-card animate-fade" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Student Daily Attendance Log</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569', fontWeight: '700', fontSize: '11px' }}>
                          <th style={{ padding: '12px' }}>Date</th>
                          <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parentData.attendance.map(att => (
                          <tr key={att.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                            <td style={{ padding: '12px', fontWeight: '600' }}>{new Date(att.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                                backgroundColor: att.status === 'Present' ? '#e6fcf5' : att.status === 'Late' ? '#fef8e6' : '#fdf2f2',
                                color: att.status === 'Present' ? '#10b981' : att.status === 'Late' ? '#f59e0b' : '#ef4444'
                              }}>{att.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}


              </div>
            )}
          </>
        )}
      </main>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '500px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Add New Student</h3>
              <button onClick={() => setShowAddStudentModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('POST', 'students', newStudent, "Student account created successfully!", () => setShowAddStudentModal(false), 'Students'); }}>
              <div className="form-group"><label>Student Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Aryan Sharma" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} required /></div>
              <div className="form-group"><label>Student Email</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} placeholder="student@eduerp.in" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} required /></div>
              <div className="form-group">
                <label>Class Name</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={newStudent.class_name} onChange={(e) => setNewStudent({...newStudent, class_name: e.target.value})} required>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group"><label>Roll Number</label><input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={newStudent.roll_no} onChange={(e) => setNewStudent({...newStudent, roll_no: e.target.value})} required /></div>
                <div className="form-group"><label>Admission Number</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newStudent.admission_no} onChange={(e) => setNewStudent({...newStudent, admission_no: e.target.value})} required /></div>
              </div>
              <div className="form-group"><label>Login Password</label><input type="password" className="form-input" style={{ paddingLeft: '14px' }} value={newStudent.password} onChange={(e) => setNewStudent({...newStudent, password: e.target.value})} required /></div>
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '20px 0', paddingTop: '15px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Parent Link Information</h4>
                <div className="form-group"><label>Parent Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newStudent.parent_name} onChange={(e) => setNewStudent({...newStudent, parent_name: e.target.value})} required /></div>
                <div className="form-group"><label>Parent Email</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} value={newStudent.parent_email} onChange={(e) => setNewStudent({...newStudent, parent_email: e.target.value})} required /></div>
                <div className="form-group"><label>Parent Mobile</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newStudent.parent_phone} onChange={(e) => setNewStudent({...newStudent, parent_phone: e.target.value})} required /></div>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Create Student Account</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && editingStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '500px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Edit Student</h3>
              <button onClick={() => setShowEditStudentModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `students/${editingStudent.id}`, editingStudent, "Student details updated!", () => setShowEditStudentModal(false), 'Students'); }}>
              <div className="form-group"><label>Student Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.name} onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})} required /></div>
              <div className="form-group"><label>Student Email</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.email} onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})} required /></div>
              <div className="form-group">
                <label>Class Name</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.class_name} onChange={(e) => setEditingStudent({...editingStudent, class_name: e.target.value})} required>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
              <div className="form-group"><label>Roll Number</label><input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.roll_no} onChange={(e) => setEditingStudent({...editingStudent, roll_no: e.target.value})} required /></div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.status} onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}>
                  <option value="Active">Active</option><option value="Inactive">Inactive</option>
                </select>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '20px 0', paddingTop: '15px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Parent Information</h4>
                <div className="form-group"><label>Parent Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.parent_name || ''} onChange={(e) => setEditingStudent({...editingStudent, parent_name: e.target.value})} required /></div>
                <div className="form-group"><label>Parent Email</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.parent_email || ''} onChange={(e) => setEditingStudent({...editingStudent, parent_email: e.target.value})} required /></div>
                <div className="form-group"><label>Parent Mobile</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingStudent.parent_phone || ''} onChange={(e) => setEditingStudent({...editingStudent, parent_phone: e.target.value})} required /></div>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
      {/* Add Parent Modal */}
      {showAddParentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add Parent Account</h3>
              <button onClick={() => setShowAddParentModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('POST', 'parents', newParent, "Parent registered successfully!", () => setShowAddParentModal(false), 'Parents'); }}>
              <div className="form-group">
                <label>Student ID / Admission Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '14px' }} 
                  placeholder="e.g. STU001, STU002 or roll/admission number" 
                  value={newParent.student_id || ''} 
                  onChange={(e) => setNewParent({...newParent, student_id: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group"><label>Father's Full Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Raj Sharma" value={newParent.name} onChange={(e) => setNewParent({...newParent, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} placeholder="parent@eduerp.in" value={newParent.email} onChange={(e) => setNewParent({...newParent, email: e.target.value})} required /></div>
              <div className="form-group"><label>Mobile Phone</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newParent.phone} onChange={(e) => setNewParent({...newParent, phone: e.target.value})} required /></div>
              <div className="form-group"><label>Residential Address</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newParent.address} onChange={(e) => setNewParent({...newParent, address: e.target.value})} /></div>
              <button type="submit" className="btn-login" disabled={loading}>Register Parent</button>
            </form>          </div>
        </div>
      )}
      {/* Edit Parent Modal */}
      {showEditParentModal && editingParent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Parent</h3>
              <button onClick={() => setShowEditParentModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `parents/${editingParent.id}`, editingParent, "Parent profile updated!", () => setShowEditParentModal(false), 'Parents'); }}>
              <div className="form-group"><label>Parent Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingParent.name} onChange={(e) => setEditingParent({...editingParent, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} value={editingParent.email} onChange={(e) => setEditingParent({...editingParent, email: e.target.value})} required /></div>
              <div className="form-group"><label>Mobile Phone</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingParent.phone} onChange={(e) => setEditingParent({...editingParent, phone: e.target.value})} required /></div>
              <div className="form-group"><label>Student ID (Optional, e.g. STU006)</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingParent.student_id || ''} onChange={(e) => setEditingParent({...editingParent, student_id: e.target.value})} /></div>
              <div className="form-group"><label>Residential Address</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingParent.address || ''} onChange={(e) => setEditingParent({...editingParent, address: e.target.value})} /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add Teacher Profile</h3>
              <button onClick={() => setShowAddTeacherModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('POST', 'teachers', newTeacher, "Teacher added successfully!", () => setShowAddTeacherModal(false), 'Teachers'); }}>
              <div className="form-group"><label>Teacher Full Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newTeacher.name} onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} value={newTeacher.email} onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})} required /></div>
              <div className="form-group"><label>Mobile Phone</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newTeacher.phone} onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})} required /></div>
              <div className="form-group"><label>Qualifications</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. M.Sc, B.Ed" value={newTeacher.qualification} onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})} /></div>
              <div className="form-group"><label>Employee ID</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. EMP202611" value={newTeacher.emp_id} onChange={(e) => setNewTeacher({...newTeacher, emp_id: e.target.value})} required /></div>
              <div className="form-group">
                <label style={{ fontWeight: '700', marginBottom: '8px', display: 'block' }}>Assigned Classes</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cls => {
                    const isChecked = (newTeacher.assigned_classes || []).includes(cls);
                    return (
                      <label key={cls} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = newTeacher.assigned_classes || [];
                            const updated = e.target.checked
                              ? [...current, cls]
                              : current.filter(c => c !== cls);
                            setNewTeacher({...newTeacher, assigned_classes: updated});
                          }}
                        />
                        {cls}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-group"><label>Assigned Section</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. A" value={newTeacher.assigned_section || ''} onChange={(e) => setNewTeacher({...newTeacher, assigned_section: e.target.value})} /></div>
              <button type="submit" className="btn-login" disabled={loading}>Add Teacher Staff</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditTeacherModal && editingTeacher && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Teacher</h3>
              <button onClick={() => setShowEditTeacherModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `teachers/${editingTeacher.id}`, editingTeacher, "Teacher profile updated!", () => setShowEditTeacherModal(false), 'Teachers'); }}>
              <div className="form-group"><label>Teacher Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingTeacher.name} onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" className="form-input" style={{ paddingLeft: '14px' }} value={editingTeacher.email} onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})} required /></div>
              <div className="form-group"><label>Mobile Phone</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingTeacher.phone} onChange={(e) => setEditingTeacher({...editingTeacher, phone: e.target.value})} required /></div>
              <div className="form-group"><label>Qualifications</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingTeacher.qualification} onChange={(e) => setEditingTeacher({...editingTeacher, qualification: e.target.value})} required /></div>
              <div className="form-group"><label>Employee ID</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingTeacher.emp_id} onChange={(e) => setEditingTeacher({...editingTeacher, emp_id: e.target.value})} required /></div>
              <div className="form-group">
                <label style={{ fontWeight: '700', marginBottom: '8px', display: 'block' }}>Assigned Classes</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cls => {
                    const isChecked = (editingTeacher.assigned_classes || []).includes(cls);
                    return (
                      <label key={cls} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingTeacher.assigned_classes || [];
                            const updated = e.target.checked
                              ? [...current, cls]
                              : current.filter(c => c !== cls);
                            setEditingTeacher({...editingTeacher, assigned_classes: updated});
                          }}
                        />
                        {cls}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="form-group"><label>Assigned Section</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. A" value={editingTeacher.assigned_section || ''} onChange={(e) => setEditingTeacher({...editingTeacher, assigned_section: e.target.value})} /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add New Class</h3>
              <button onClick={() => setShowAddClassModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddClassSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Class 10" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} required />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Class</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditClassModal && editingClass && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Class</h3>
              <button onClick={() => setShowEditClassModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `classes/${editingClass.id}`, editingClass, "Class updated successfully!", () => setShowEditClassModal(false), 'Classes'); }}>
              <div className="form-group"><label>Class Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingClass.class_name} onChange={(e) => setEditingClass({...editingClass, class_name: e.target.value})} required /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add Class Section</h3>
              <button onClick={() => setShowAddSectionModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddSectionSubmit}>
              <div className="form-group">
                <label>Section Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. A" value={newSection.section_name} onChange={(e) => setNewSection({...newSection, section_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Class Link</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newSection.class_name} onChange={(e) => setNewSection({...newSection, class_name: e.target.value})} required />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Section</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {showEditSectionModal && editingSection && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Section</h3>
              <button onClick={() => setShowEditSectionModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `sections/${editingSection.id}`, editingSection, "Section division updated!", () => setShowEditSectionModal(false), 'Sections'); }}>
              <div className="form-group"><label>Section Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingSection.section_name} onChange={(e) => setEditingSection({...editingSection, section_name: e.target.value})} required /></div>
              <div className="form-group"><label>Class Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingSection.class_name} onChange={(e) => setEditingSection({...editingSection, class_name: e.target.value})} required /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add New Subject</h3>
              <button onClick={() => setShowAddSubjectModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddSubjectSubmit}>
              <div className="form-group">
                <label>Subject Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Physics" value={newSubject.subject_name} onChange={(e) => setNewSubject({...newSubject, subject_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. PHYS101" value={newSubject.subject_code} onChange={(e) => setNewSubject({...newSubject, subject_code: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Class Name</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={newSubject.class_name || 'Class 1'} onChange={(e) => setNewSubject({...newSubject, class_name: e.target.value})} required>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Subject</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditSubjectModal && editingSubject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Subject</h3>
              <button onClick={() => setShowEditSubjectModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `subjects/${editingSubject.id}`, editingSubject, "Subject updated!", () => setShowEditSubjectModal(false), 'Subjects'); }}>
              <div className="form-group"><label>Subject Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingSubject.subject_name} onChange={(e) => setEditingSubject({...editingSubject, subject_name: e.target.value})} required /></div>
              <div className="form-group"><label>Subject Code</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingSubject.subject_code} onChange={(e) => setEditingSubject({...editingSubject, subject_code: e.target.value})} required /></div>
              <div className="form-group">
                <label>Class Name</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={editingSubject.class_name || 'Class 1'} onChange={(e) => setEditingSubject({...editingSubject, class_name: e.target.value})} required>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Set Class Fee Modal */}
      {showClassFeeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Set Class Tuition Fee</h3>
              <button onClick={() => setShowClassFeeModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('POST', 'fees/class', classFeeData, "Class fee structure updated!", () => setShowClassFeeModal(false), 'Fees'); }}>
              <div className="form-group">
                <label>Target Academic Class</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={classFeeData.class_id} onChange={(e) => setClassFeeData({...classFeeData, class_id: parseInt(e.target.value)})}>
                  <option value="4">Class 1</option>
                  <option value="5">Class 2</option>
                  <option value="6">Class 3</option>
                  <option value="7">Class 4</option>
                  <option value="8">Class 5</option>
                  <option value="9">Class 6</option>
                  <option value="10">Class 7</option>
                  <option value="3">Class 8</option>
                  <option value="2">Class 9</option>
                  <option value="1">Class 10</option>
                </select>
              </div>
              <div className="form-group">
                <label>Annual Fee Amount (Rs.)</label>
                <input type="number" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. 50000" value={classFeeData.amount} onChange={(e) => setClassFeeData({...classFeeData, amount: e.target.value})} required />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Update Class Fee</button>
            </form>
          </div>
        </div>
      )}

      {/* Collect Fee / Add Student Payment Modal */}
      {showCollectFeeModal && collectingFeeStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Collect Fee Payment</h3>
              <button onClick={() => setShowCollectFeeModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div>Student: <strong>{collectingFeeStudent.name}</strong></div>
              <div>Pending Due: <strong style={{ color: '#ef4444' }}>Rs. {collectingFeeStudent.pending_fee.toLocaleString()}</strong></div>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('POST', 'fees', { ...newCollectPayment, student_id: collectingFeeStudent.id }, "Fee payment collected successfully!", () => setShowCollectFeeModal(false), 'Fees'); }}>
              <div className="form-group"><label>Receipt Number</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newCollectPayment.receipt_no} onChange={(e) => setNewCollectPayment({...newCollectPayment, receipt_no: e.target.value})} required /></div>
              <div className="form-group"><label>Amount Paid (Rs.)</label><input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={newCollectPayment.amount} onChange={(e) => setNewCollectPayment({...newCollectPayment, amount: e.target.value})} required /></div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={newCollectPayment.mode} onChange={(e) => setNewCollectPayment({...newCollectPayment, mode: e.target.value})}>
                  <option value="Online">Online</option><option value="Cash">Cash</option><option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="form-group"><label>Date of Payment</label><input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={newCollectPayment.date} onChange={(e) => setNewCollectPayment({...newCollectPayment, date: e.target.value})} required /></div>
              <button type="submit" className="btn-login" disabled={loading}>Collect & Save Payment</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fee Payment Modal */}
      {showEditFeeModal && editingFee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Payment Receipt</h3>
              <button onClick={() => setShowEditFeeModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `fees/${editingFee.id}`, editingFee, "Receipt modified successfully!", () => setShowEditFeeModal(false), 'Fees'); }}>
              <div className="form-group"><label>Receipt Number</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingFee.receipt_no} onChange={(e) => setEditingFee({...editingFee, receipt_no: e.target.value})} required /></div>
              <div className="form-group"><label>Amount Paid (Rs.)</label><input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={editingFee.amount} onChange={(e) => setEditingFee({...editingFee, amount: e.target.value})} required /></div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={editingFee.mode} onChange={(e) => setEditingFee({...editingFee, mode: e.target.value})}>
                  <option value="Online">Online</option><option value="Cash">Cash</option><option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={editingFee.status} onChange={(e) => setEditingFee({...editingFee, status: e.target.value})}>
                  <option value="Paid">Paid</option><option value="Pending">Pending</option>
                </select>
              </div>
              <div className="form-group"><label>Date of Payment</label><input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={editingFee.date ? editingFee.date.split('T')[0] : ''} onChange={(e) => setEditingFee({...editingFee, date: e.target.value})} required /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Receipt Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Schedule Exam</h3>
              <button onClick={() => setShowAddExamModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddExamSubmit}>
              <div className="form-group">
                <label>Select Target Class</label>
                <select 
                  className="form-input" 
                  style={{ paddingLeft: '14px', height: '42px' }} 
                  value={newExam.class_name || 'Class 10'} 
                  onChange={(e) => setNewExam({...newExam, class_name: e.target.value})} 
                  required
                >
                  {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(clsName => (
                    <option key={clsName} value={clsName}>{clsName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Exam Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Mid-Term Examination" value={newExam.name} onChange={(e) => setNewExam({...newExam, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Exam Date</label>
                <input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={newExam.exam_date} onChange={(e) => setNewExam({...newExam, exam_date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Max Marks</label>
                <input type="number" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. 100" value={newExam.max_marks} onChange={(e) => setNewExam({...newExam, max_marks: e.target.value})} required />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Schedule Exam</button>
            </form>          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {showEditExamModal && editingExam && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Exam</h3>
              <button onClick={() => setShowEditExamModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `exams/${editingExam.id}`, editingExam, "Exam details updated!", () => setShowEditExamModal(false), 'Examinations'); }}>
              <div className="form-group"><label>Exam Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingExam.name} onChange={(e) => setEditingExam({...editingExam, name: e.target.value})} required /></div>
              <div className="form-group"><label>Exam Date</label><input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={editingExam.exam_date} onChange={(e) => setEditingExam({...editingExam, exam_date: e.target.value})} required /></div>
              <div className="form-group"><label>Max Marks</label><input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={editingExam.max_marks} onChange={(e) => setEditingExam({...editingExam, max_marks: e.target.value})} required /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Homework Modal */}
      {showAddHomeworkModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '450px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Assign Homework</h3>
              <button onClick={() => setShowAddHomeworkModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddHomeworkSubmit}>
              <div className="form-group">
                <label>Homework Title</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Trigonometry Exercise 5.1" value={newHomework.title} onChange={(e) => setNewHomework({...newHomework, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Select Target Class</label>
                <select 
                  className="form-input" 
                  style={{ paddingLeft: '14px', height: '42px' }} 
                  value={newHomework.class_name || 'Class 10'} 
                  onChange={(e) => setNewHomework({...newHomework, class_name: e.target.value})} 
                  required
                >
                  {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(clsName => (
                    <option key={clsName} value={clsName}>{clsName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={newHomework.due_date} onChange={(e) => setNewHomework({...newHomework, due_date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Homework Description</label>
                <textarea className="form-input" style={{ paddingLeft: '14px', height: '80px', resize: 'none' }} placeholder="Provide instruction details..." value={newHomework.description} onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Assign Homework</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Homework Modal */}
      {showEditHomeworkModal && editingHomework && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '450px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Homework</h3>
              <button onClick={() => setShowEditHomeworkModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `homeworks/${editingHomework.id}`, editingHomework, "Homework updated!", () => setShowEditHomeworkModal(false), 'Homework'); }}>
              <div className="form-group"><label>Homework Title</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingHomework.title} onChange={(e) => setEditingHomework({...editingHomework, title: e.target.value})} required /></div>
              <div className="form-group"><label>Due Date</label><input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={editingHomework.due_date} onChange={(e) => setEditingHomework({...editingHomework, due_date: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea className="form-input" style={{ paddingLeft: '14px', height: '80px', resize: 'none' }} value={editingHomework.description || ''} onChange={(e) => setEditingHomework({...editingHomework, description: e.target.value})}></textarea></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Library Book Modal */}
      {showAddLibraryBookModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add Library Book</h3>
              <button onClick={() => setShowAddLibraryBookModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddLibraryBookSubmit}>
              <div className="form-group">
                <label>Book Title</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Organic Chemistry" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Morrison" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. 978-0136" value={newBook.isbn} onChange={(e) => setNewBook({...newBook, isbn: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={newBook.quantity} onChange={(e) => setNewBook({...newBook, quantity: e.target.value})} required />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Book</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Library Book Modal */}
      {showEditLibraryBookModal && editingBook && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Book</h3>
              <button onClick={() => setShowEditLibraryBookModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `library/${editingBook.id}`, editingBook, "Book catalog updated!", () => setShowEditLibraryBookModal(false), 'Library'); }}>
              <div className="form-group"><label>Book Title</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingBook.title} onChange={(e) => setEditingBook({...editingBook, title: e.target.value})} required /></div>
              <div className="form-group"><label>Author</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingBook.author} onChange={(e) => setEditingBook({...editingBook, author: e.target.value})} required /></div>
              <div className="form-group"><label>ISBN</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingBook.isbn || ''} onChange={(e) => setEditingBook({...editingBook, isbn: e.target.value})} /></div>
              <div className="form-group"><label>Quantity</label><input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={editingBook.quantity} onChange={(e) => setEditingBook({...editingBook, quantity: e.target.value})} required /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Transport Route Modal */}
      {showAddTransportModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '450px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add Transport Route</h3>
              <button onClick={() => setShowAddTransportModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddTransportSubmit}>
              <div className="form-group">
                <label>Route Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Route 10A (Dwarka)" value={newRoute.route_name} onChange={(e) => setNewRoute({...newRoute, route_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Driver Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Ramesh Singh" value={newRoute.driver_name} onChange={(e) => setNewRoute({...newRoute, driver_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Vehicle License Plate</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. DL-1CA-1234" value={newRoute.vehicle_no} onChange={(e) => setNewRoute({...newRoute, vehicle_no: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Pickup Point Stops</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Dwarka Mor, Sec-12" value={newRoute.pickup_point} onChange={(e) => setNewRoute({...newRoute, pickup_point: e.target.value})} required />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Transport Route</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transport Route Modal */}
      {showEditTransportModal && editingRoute && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '450px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Transport Route</h3>
              <button onClick={() => setShowEditTransportModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `transport/${editingRoute.id}`, editingRoute, "Transport route updated!", () => setShowEditTransportModal(false), 'Transport'); }}>
              <div className="form-group"><label>Route Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingRoute.route_name} onChange={(e) => setEditingRoute({...editingRoute, route_name: e.target.value})} required /></div>
              <div className="form-group"><label>Driver Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingRoute.driver_name || ''} onChange={(e) => setEditingRoute({...editingRoute, driver_name: e.target.value})} required /></div>
              <div className="form-group"><label>Vehicle No</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingRoute.vehicle_no || ''} onChange={(e) => setEditingRoute({...editingRoute, vehicle_no: e.target.value})} required /></div>
              <div className="form-group"><label>Pickup Point Stops</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingRoute.pickup_point || ''} onChange={(e) => setEditingRoute({...editingRoute, pickup_point: e.target.value})} required /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '450px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add School Calendar Event</h3>
              <button onClick={() => setShowAddEventModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddEventSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Independence Day Holiday" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={newEvent.start_date} onChange={(e) => setNewEvent({...newEvent, start_date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={newEvent.event_type} onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}>
                  <option value="Event">School Event</option>
                  <option value="Holiday">School Holiday</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" style={{ paddingLeft: '14px', height: '80px', resize: 'none' }} placeholder="Provide event detail..." value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Save Event</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditEventModal && editingEvent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '450px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Event</h3>
              <button onClick={() => setShowEditEventModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('PUT', `events/${editingEvent.id}`, editingEvent, "Event timetable updated!", () => setShowEditEventModal(false), 'Events'); }}>
              <div className="form-group"><label>Event Title</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} required /></div>
              <div className="form-group"><label>Date</label><input type="date" className="form-input" style={{ paddingLeft: '14px' }} value={editingEvent.start_date} onChange={(e) => setEditingEvent({...editingEvent, start_date: e.target.value})} required /></div>
              <div className="form-group">
                <label>Event Type</label>
                <select className="form-input" style={{ paddingLeft: '14px' }} value={editingEvent.event_type} onChange={(e) => setEditingEvent({...editingEvent, event_type: e.target.value})}>
                  <option value="Event">School Event</option><option value="Holiday">School Holiday</option>
                </select>
              </div>
              <div className="form-group"><label>Description</label><textarea className="form-input" style={{ paddingLeft: '14px', height: '80px', resize: 'none' }} value={editingEvent.description || ''} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}></textarea></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Marks Modal (Teacher specific) */}
      {showAddMarkModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Record Student Marks</h3>
              <button onClick={() => setShowAddMarkModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={handleAddMarkSubmit}>
              <div className="form-group">
                <label>Student First Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. Aryan" value={newMark.student_name} onChange={(e) => setNewMark({...newMark, student_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Subject Name</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newMark.subject_name} onChange={(e) => setNewMark({...newMark, subject_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Examination / Test</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newMark.exam_name} onChange={(e) => setNewMark({...newMark, exam_name: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Marks Scored</label>
                  <input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={newMark.marks_obtained} onChange={(e) => setNewMark({...newMark, marks_obtained: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Maximum Marks</label>
                  <input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={newMark.max_marks} onChange={(e) => setNewMark({...newMark, max_marks: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Grade</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} placeholder="e.g. A+" value={newMark.grade} onChange={(e) => setNewMark({...newMark, grade: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Teacher's Remarks</label>
                <input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={newMark.remarks} onChange={(e) => setNewMark({...newMark, remarks: e.target.value})} />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>Record Grade</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Exam Marks Modal (Teacher specific) */}
      {showEditMarkModal && editingMark && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Student Grade</h3>
              <button onClick={() => setShowEditMarkModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleFormSubmit('POST', 'marks', editingMark, "Student marks saved!", () => setShowEditMarkModal(false), 'Examinations'); }}>
              <div className="form-group"><label>Student Full Name</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingMark.student_name} disabled required /></div>
              <div className="form-group"><label>Subject</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingMark.subject_name} disabled required /></div>
              <div className="form-group"><label>Examination</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingMark.exam_name} disabled required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Marks Scored</label>
                  <input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={editingMark.marks_obtained} onChange={(e) => setEditingMark({...editingMark, marks_obtained: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Max Marks</label>
                  <input type="number" className="form-input" style={{ paddingLeft: '14px' }} value={editingMark.max_marks} onChange={(e) => setEditingMark({...editingMark, max_marks: e.target.value})} required />
                </div>
              </div>
              <div className="form-group"><label>Grade</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingMark.grade} onChange={(e) => setEditingMark({...editingMark, grade: e.target.value})} required /></div>
              <div className="form-group"><label>Remarks</label><input type="text" className="form-input" style={{ paddingLeft: '14px' }} value={editingMark.remarks || ''} onChange={(e) => setEditingMark({...editingMark, remarks: e.target.value})} /></div>
              <button type="submit" className="btn-login" disabled={loading}>Save Grade</button>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Detailed View Modal */}
      {showViewStudentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="login-card animate-scale" style={{ maxWidth: '750px', width: '90%', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Student Profile Details</h3>
              <button onClick={() => setShowViewStudentModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
            </div>
            
            {viewingStudentLoading && <div style={{ padding: '40px', textAlign: 'center', fontWeight: '600' }}>Loading profile records...</div>}

            {viewingStudentDetails && (
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '30px' }}>
                {/* Left Side Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: '1px solid #f1f5f9', paddingRight: '20px' }}>
                  <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', marginBottom: '16px', background: '#3b82f6', border: 'none' }}>
                    {(viewingStudentDetails.student.name || 'Student').charAt(0)}
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{viewingStudentDetails.student.name || 'N/A'}</h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', marginTop: '4px' }}>
                    {viewingStudentDetails.student.student_id ? (viewingStudentDetails.student.student_id.startsWith('STU') ? viewingStudentDetails.student.student_id : `STU00${viewingStudentDetails.student.id}`) : `STU00${viewingStudentDetails.student.id}`}
                  </p>
                  
                  <div style={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', textAlign: 'left' }}>
                    <div><span style={{ color: '#94a3b8', fontWeight: '600' }}>Class: </span><span style={{ fontWeight: '700' }}>{viewingStudentDetails.student.class_name}</span></div>
                    <div><span style={{ color: '#94a3b8', fontWeight: '600' }}>Roll No: </span><span style={{ fontWeight: '700' }}>{viewingStudentDetails.student.roll_no}</span></div>
                    <div><span style={{ color: '#94a3b8', fontWeight: '600' }}>Status: </span>
                      <span style={{
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                        backgroundColor: viewingStudentDetails.student.status === 'Active' ? '#e6fcf5' : '#fdf2f2',
                        color: viewingStudentDetails.student.status === 'Active' ? '#10b981' : '#ef4444'
                      }}>{viewingStudentDetails.student.status}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Parent Details section */}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '10px' }}>Parent Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                      <div><span style={{ color: '#64748b' }}>Father Name:</span> <strong style={{ color: '#1e293b' }}>{viewingStudentDetails.student.parent_name}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Contact Phone:</span> <strong style={{ color: '#1e293b' }}>{viewingStudentDetails.student.parent_phone}</strong></div>
                      <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>Parent Email:</span> <strong style={{ color: '#1e293b' }}>{viewingStudentDetails.student.parent_email}</strong></div>
                    </div>
                  </div>

                  {/* Fees Progress section */}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '10px' }}>Tuition Fees Ledger</h4>
                    {viewingStudentDetails.fees.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ color: '#64748b', fontWeight: '700', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '6px' }}>Receipt No</th>
                            <th style={{ padding: '6px' }}>Date</th>
                            <th style={{ padding: '6px' }}>Amount</th>
                            <th style={{ padding: '6px' }}>Mode</th>
                            <th style={{ padding: '6px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingStudentDetails.fees.map(f => (
                            <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '6px', fontWeight: '700', color: '#2563eb' }}>{f.receipt_no}</td>
                              <td style={{ padding: '6px' }}>{new Date(f.date).toLocaleDateString()}</td>
                              <td style={{ padding: '6px', fontWeight: '700' }}>Rs. {parseFloat(f.amount).toLocaleString()}</td>
                              <td style={{ padding: '6px' }}>{f.mode}</td>
                              <td style={{ padding: '6px' }}>
                                <span style={{
                                  padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: '700',
                                  backgroundColor: f.status === 'Paid' ? '#e6fcf5' : '#fdf2f2',
                                  color: f.status === 'Paid' ? '#10b981' : '#ef4444'
                                }}>{f.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>No fee payment logs found.</p>
                    )}
                  </div>

                  {/* Academic progress section */}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '10px' }}>Academic Marks & Performance</h4>
                    {viewingStudentDetails.marks.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ color: '#64748b', fontWeight: '700', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '6px' }}>Subject</th>
                            <th style={{ padding: '6px' }}>Test / Exam</th>
                            <th style={{ padding: '6px' }}>Marks</th>
                            <th style={{ padding: '6px' }}>Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingStudentDetails.marks.map(m => (
                            <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '6px', fontWeight: '700' }}>{m.subject_name}</td>
                              <td style={{ padding: '6px' }}>{m.exam_name}</td>
                              <td style={{ padding: '6px', fontWeight: '700', color: '#2563eb' }}>{m.marks_obtained}/{m.max_marks}</td>
                              <td style={{ padding: '6px', fontWeight: '700' }}>{m.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>No academic report card records found.</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
