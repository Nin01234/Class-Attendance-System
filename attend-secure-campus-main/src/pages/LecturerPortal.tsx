import React, { useState, useEffect } from 'react';
import { 
  QrCode, Users, Camera, MapPin, FileText, MessageSquare, 
  Bot, Settings, AlertTriangle, Play, Pause, Download,
  Mail, Phone, Eye, Filter, Search, Calendar, Clock,
  TrendingUp, TrendingDown, BarChart3, PieChart, Home, LogOut, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '@/hooks/useAttendanceStore';
import { supabase } from '@/integrations/supabase/client';

const LecturerPortal = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAttendance();
  const [activeSession, setActiveSession] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalStudents] = useState(65);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [gpsHeatmap, setGpsHeatmap] = useState([]);
  const [riskStudents, setRiskStudents] = useState([]);
  const [myStudents, setMyStudents] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [classSessions, setClassSessions] = useState([]);

  useEffect(() => {
    const fetchLecturerData = async () => {
      setLoading(true);
      setError('');
      try {
        // Get current user (lecturer)
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw userError || new Error('No user');
        // Fetch courses taught by this lecturer
        const { data: coursesData, error: coursesError } = await supabase.from('courses').select('*').eq('lecturer_id', user.id);
        if (coursesError) throw coursesError;
        setCourses(coursesData || []);
        // Fetch class sessions for these courses
        const courseIds = (coursesData || []).map(c => c.id);
        const { data: sessionsData, error: sessionsError } = await supabase.from('class_sessions').select('*').in('course_id', courseIds);
        if (sessionsError) throw sessionsError;
        setClassSessions(sessionsData || []);
        // Fetch enrollments for these courses
        const { data: enrollments, error: enrollmentsError } = await supabase.from('course_enrollments').select('*').in('course_id', courseIds);
        if (enrollmentsError) throw enrollmentsError;
        // Fetch student profiles
        const studentIds = (enrollments || []).map(e => e.student_id);
        const { data: students, error: studentsError } = await supabase.from('profiles').select('*').in('id', studentIds);
        if (studentsError) throw studentsError;
        setMyStudents(students || []);
        // Fetch attendance records for these courses
        const { data: attendance, error: attendanceError } = await supabase.from('attendance_records').select('*').in('session_id', (sessionsData || []).map(s => s.id));
        if (attendanceError) throw attendanceError;
        setAttendanceRecords(attendance || []);
      } catch (err) {
        setError('Failed to load lecturer data.');
        toast.error('Failed to load lecturer data from backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchLecturerData();
  }, []);

  // Generate attendance trends data
  useEffect(() => {
    const trends = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      attendance: Math.floor(Math.random() * 20) + 65,
      percentage: Math.floor(Math.random() * 30) + 70
    }));
    setAttendanceTrends(trends);

    const performance = [
      { grade: 'A', count: 15 },
      { grade: 'B', count: 25 },
      { grade: 'C', count: 20 },
      { grade: 'D', count: 5 }
    ];
    setPerformanceData(performance);
  }, []);

  // Listen to attendance state changes
  useEffect(() => {
    const currentAttendance = state.attendanceRecords.filter(record => 
      record.date === new Date().toISOString().split('T')[0]
    ).length;
    setAttendanceCount(currentAttendance);
  }, [state.attendanceRecords]);

  // Simulate real-time data updates when session is active
  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(() => {
        // Update student attendance dynamically
        setMyStudents(prev => prev.map(student => {
          if (Math.random() > 0.7 && !student.isPresent) {
            const newAttendance = new Date().toLocaleTimeString();
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: {
                message: `${student.name} has marked attendance`,
                type: 'success'
              }
            });
            return {
              ...student,
              isPresent: true,
              lastAttendance: newAttendance
            };
          }
          return student;
        }));
        
        // Simulate face detection logs
        if (Math.random() > 0.6) {
          const students = ['Kwame Asante', 'Ama Osei', 'Kojo Mensah', 'Akosua Adjei'];
          const newFace = {
            id: Date.now(),
            studentId: `20${Math.floor(Math.random() * 100000)}`,
            studentName: students[Math.floor(Math.random() * students.length)],
            confidence: (85 + Math.random() * 15).toFixed(1),
            timestamp: new Date().toLocaleTimeString(),
            status: Math.random() > 0.1 ? 'verified' : 'flagged'
          };
          setDetectedFaces(prev => [newFace, ...prev.slice(0, 9)]);
        }

        // Simulate GPS data
        if (Math.random() > 0.7) {
          const newGpsPoint = {
            lat: 5.6507 + (Math.random() - 0.5) * 0.001,
            lng: -0.1864 + (Math.random() - 0.5) * 0.001,
            studentId: `20${Math.floor(Math.random() * 100000)}`,
            accuracy: Math.floor(Math.random() * 10) + 5,
            timestamp: new Date().toLocaleTimeString()
          };
          setGpsHeatmap(prev => [newGpsPoint, ...prev.slice(0, 19)]);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [activeSession, dispatch]);

  const generateQRCode = () => {
    const sessionId = `CS301_${Date.now()}`;
    setQrCode(sessionId);
    setActiveSession(true);
    
    // Start session in attendance store
    dispatch({
      type: 'START_SESSION',
      payload: {
        courseId: 'CS301',
        courseName: 'Computer Networks',
        qrCode: sessionId
      }
    });
    
    toast.success('QR Code generated! Session started.');
  };

  const endSession = () => {
    setActiveSession(false);
    setQrCode('');
    
    // End session in store
    dispatch({ type: 'END_SESSION' });
    
    toast.info('Session ended successfully.');
  };

  const exportToPDF = () => {
    // Create comprehensive PDF content
    const attendanceData = {
      course: 'Computer Networks - CS 301',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      lecturer: 'Dr. Sarah Johnson',
      totalStudents: myStudents.length,
      presentStudents: myStudents.filter(s => s.isPresent).length,
      attendanceRate: ((myStudents.filter(s => s.isPresent).length / myStudents.length) * 100).toFixed(1),
      students: myStudents.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.isPresent ? 'Present' : 'Absent',
        time: student.lastAttendance || 'N/A',
        grade: student.grade,
        attendanceRate: student.attendanceRate
      }))
    };

    const pdfContent = `
ATTENDANCE REPORT
=================
Course: ${attendanceData.course}
Date: ${attendanceData.date}
Time: ${attendanceData.time}
Lecturer: ${attendanceData.lecturer}

SUMMARY:
--------
Total Students: ${attendanceData.totalStudents}
Present: ${attendanceData.presentStudents}
Absent: ${attendanceData.totalStudents - attendanceData.presentStudents}
Attendance Rate: ${attendanceData.attendanceRate}%

DETAILED ATTENDANCE:
-------------------
${attendanceData.students.map(s => 
  `${s.id} | ${s.name.padEnd(20)} | ${s.status.padEnd(10)} | ${s.time.padEnd(12)} | Grade: ${s.grade} | Attendance: ${s.attendanceRate}%`
).join('\n')}

PERFORMANCE ANALYTICS:
---------------------
${performanceData.map(p => `Grade ${p.grade}: ${p.count} students`).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Comprehensive attendance report downloaded!');
  };

  const exportToExcel = () => {
    const csvHeader = ['Student ID', 'Name', 'Email', 'Phone', 'Course', 'Attendance Rate', 'Last Attendance', 'Status', 'Grade', 'Present Today'];
    const csvData = myStudents.map(student => [
      student.id,
      student.name,
      student.email,
      student.phone,
      student.course,
      `${student.attendanceRate}%`,
      student.lastAttendance || 'N/A',
      student.status,
      student.grade,
      student.isPresent ? 'Yes' : 'No'
    ]);

    const csvContent = [csvHeader, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Student data exported to Excel/CSV format!');
  };

  const messageStudent = (studentId, studentName) => {
    navigate('/lecturer-chat', { state: { studentId, studentName } });
    toast.success(`Opening chat with ${studentName}`);
  };

  const viewStudentDetails = (studentId) => {
    toast.info(`Viewing details for student ${studentId}`);
    // Could navigate to a detailed student view
  };

  // Risk students data
  useEffect(() => {
    setRiskStudents([
      { id: '20230001', name: 'John Doe', riskScore: 85, reason: 'Low attendance (45%)', trend: 'down' },
      { id: '20230002', name: 'Jane Smith', riskScore: 72, reason: 'Irregular patterns', trend: 'down' },
      { id: '20230003', name: 'Mike Johnson', riskScore: 68, reason: 'Proxy detection alerts', trend: 'up' },
      { id: '20230004', name: 'Sarah Wilson', riskScore: 63, reason: 'Late submissions', trend: 'stable' }
    ]);
  }, []);

  const presentStudents = myStudents.filter(s => s.isPresent).length;
  const attendanceRate = myStudents.length > 0 ? ((presentStudents / myStudents.length) * 100).toFixed(1) : 0;

  // Logout logic
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lecturer Command Center</h1>
              <p className="text-gray-600">Advanced Class Management & Analytics Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`px-4 py-2 ${activeSession ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {activeSession ? 'Session Active' : 'No Active Session'}
              </Badge>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              {/* User Menu */}
              <div className="relative group">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Button>
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                  <button
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Live Attendance</p>
                  <p className="text-3xl font-bold">{presentStudents}/{myStudents.length}</p>
                  <p className="text-sm text-blue-200">{attendanceRate}% Present</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Face Detections</p>
                  <p className="text-3xl font-bold">{detectedFaces.length}</p>
                  <p className="text-sm text-green-200">Recent verifications</p>
                </div>
                <Camera className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">GPS Locations</p>
                  <p className="text-3xl font-bold">{gpsHeatmap.length}</p>
                  <p className="text-sm text-purple-200">Active tracking</p>
                </div>
                <MapPin className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Risk Alerts</p>
                  <p className="text-3xl font-bold">{myStudents.filter(s => s.status === 'at-risk').length}</p>
                  <p className="text-sm text-red-200">Need attention</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Control Panel and Student List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <span>Class Session Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Computer Networks - CS 301</h3>
                    <p className="text-gray-600">Room 101 • {new Date().toLocaleTimeString()}</p>
                  </div>
                  <Badge className={activeSession ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {activeSession ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {activeSession && qrCode && (
                  <div className="bg-white rounded-lg p-6 mb-4 text-center">
                    <div className="w-32 h-32 bg-black mx-auto mb-4 flex items-center justify-center text-white font-mono text-xs">
                      QR: {qrCode.slice(-8)}
                    </div>
                    <p className="text-sm text-gray-600">Session ID: {qrCode}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Students Present</p>
                    <p className="text-2xl font-bold text-green-600">{presentStudents}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-600">{attendanceRate}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!activeSession ? (
                    <Button onClick={generateQRCode} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Start Session & Generate QR
                    </Button>
                  ) : (
                    <Button onClick={endSession} variant="destructive">
                      <Pause className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => navigate('/attendance-viewer')}>
                    <Eye className="h-4 w-4 mr-2" />
                    Live Viewer
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/gps-heatmap')}>
                    <MapPin className="h-4 w-4 mr-2" />
                    GPS Heatmap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Students List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>My Students ({myStudents.length})</span>
                <Badge className="bg-green-100 text-green-800">
                  {presentStudents} Present
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {myStudents.map((student) => (
                  <div key={student.id} className={`p-3 rounded-lg border ${
                    student.status === 'at-risk' ? 'bg-red-50 border-red-200' : 
                    student.isPresent ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{student.name}</h4>
                          {student.isPresent && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Present
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">ID: {student.id}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-green-600 font-medium">
                            {student.attendanceRate}% attendance
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            Grade: {student.grade}
                          </span>
                        </div>
                        {student.lastAttendance && (
                          <p className="text-xs text-purple-600 mt-1">
                            Last attended: {student.lastAttendance}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs px-2 py-1"
                          onClick={() => viewStudentDetails(student.id)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs px-2 py-1"
                          onClick={() => messageStudent(student.id, student.name)}
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export and Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Enhanced Export Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Export Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={exportToPDF} className="w-full text-sm bg-red-600 hover:bg-red-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export PDF Report
              </Button>
              <Button onClick={exportToExcel} className="w-full text-sm bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export Excel/CSV
              </Button>
              <div className="text-xs text-gray-500 mt-2">
                <p>• Real-time attendance data</p>
                <p>• Student performance metrics</p>
                <p>• Comprehensive analytics</p>
              </div>
            </CardContent>
          </Card>

          {/* Messaging Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <span>Communication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full text-sm">
                <Phone className="h-4 w-4 mr-2" />
                Bulk SMS ({myStudents.length} students)
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-sm" 
                onClick={() => navigate('/lecturer-chat')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Open Chat Center
              </Button>
              <div className="text-xs text-gray-500 mt-2">
                <p>• Send attendance notifications</p>
                <p>• Individual student messaging</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{attendanceRate}%</p>
                <p className="text-xs text-gray-600">Today's Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {(myStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / myStudents.length).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600">Average Attendance</p>
              </div>
            </CardContent>
          </Card>

          {/* Session Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Settings className="h-4 w-4 text-indigo-600" />
                <span>Session Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full text-sm" onClick={() => navigate('/attendance-viewer')}>
                <Eye className="h-4 w-4 mr-2" />
                Live Viewer
              </Button>
              <Button variant="outline" className="w-full text-sm" onClick={() => navigate('/gps-heatmap')}>
                <MapPin className="h-4 w-4 mr-2" />
                GPS Heatmap
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Attendance Trends (Last 7 Days)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 space-y-4">
                {attendanceTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{trend.date}</p>
                      <p className="text-sm text-gray-600">{trend.attendance} students</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${trend.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{trend.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-green-600" />
                <span>Class Performance Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 space-y-4">
                {performanceData.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        grade.grade === 'A' ? 'bg-green-500' :
                        grade.grade === 'B' ? 'bg-blue-500' :
                        grade.grade === 'C' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium">Grade {grade.grade}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{grade.count}</span>
                      <span className="text-sm text-gray-600">students</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LecturerPortal;
