
import React, { useState, useEffect } from 'react';
import { QrCode, Calendar, CheckCircle, XCircle, Clock, Camera, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '@/hooks/useAttendanceStore';

const StudentAttendance = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAttendance();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [scanningQR, setScanningQR] = useState(false);
  const [scanningFace, setScanningFace] = useState(false);

  const studentData = {
    id: 'STU20230001',
    name: 'Kwame Asante',
    attendanceRate: 87,
    totalClasses: 45,
    present: 39,
    absent: 4,
    late: 2
  };

  const todayClasses = [
    { id: 'CS301', name: 'Database Systems', time: '2:00 PM', room: 'Room 101', lecturer: 'Dr. John Smith', status: 'upcoming' },
    { id: 'CS350', name: 'Web Development', time: '4:00 PM', room: 'Lab 3', lecturer: 'Prof. Sarah Johnson', status: 'upcoming' },
    { id: 'CS340', name: 'Software Engineering', time: '10:00 AM', room: 'Room 205', lecturer: 'Dr. Kwame Nkrumah', status: 'completed' }
  ];

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      });
    }
  }, []);

  const markAttendanceQR = async () => {
    setScanningQR(true);
    toast.info('QR Scanner activated. Point camera at QR code.');
    
    // Simulate QR scan
    setTimeout(() => {
      setScanningQR(false);
      dispatch({
        type: 'MARK_ATTENDANCE',
        payload: {
          studentId: studentData.id,
          studentName: studentData.name,
          courseId: 'CS301',
          courseName: 'Database Systems',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          status: 'present',
          method: 'QR Code',
          location: 'Room 101',
          lecturerName: 'Dr. John Smith'
        }
      });
      toast.success('Attendance marked successfully via QR Code!');
    }, 3000);
  };

  const markAttendanceFace = async () => {
    setScanningFace(true);
    toast.info('Starting face verification...');
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      
      // Simulate face recognition
      setTimeout(() => {
        setScanningFace(false);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        
        dispatch({
          type: 'MARK_ATTENDANCE',
          payload: {
            studentId: studentData.id,
            studentName: studentData.name,
            courseId: 'CS301',
            courseName: 'Database Systems',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: 'present',
            method: 'Face Recognition',
            location: 'Room 101',
            lecturerName: 'Dr. John Smith'
          }
        });
        toast.success('Face verification successful! Attendance marked.');
      }, 4000);
    } catch (error) {
      setScanningFace(false);
      toast.error('Camera access denied. Please enable camera permissions.');
    }
  };

  const markAttendanceGPS = () => {
    if (!currentLocation) {
      toast.error('GPS location not available. Please enable location services.');
      return;
    }

    toast.info('Verifying GPS location...');
    
    setTimeout(() => {
      dispatch({
        type: 'MARK_ATTENDANCE',
        payload: {
          studentId: studentData.id,
          studentName: studentData.name,
          courseId: 'CS301',
          courseName: 'Database Systems',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          status: 'present',
          method: 'GPS',
          location: `Room 101 (${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)})`,
          lecturerName: 'Dr. John Smith'
        }
      });
      toast.success('GPS verification successful! Attendance marked.');
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Portal</h1>
            <p className="text-gray-600">Mark your attendance and view history</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/student-portal')}>
            Back to Portal
          </Button>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-blue-100">Attendance Rate</p>
              <p className="text-3xl font-bold">{studentData.attendanceRate}%</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-green-100">Present</p>
              <p className="text-3xl font-bold">{studentData.present}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-red-100">Absent</p>
              <p className="text-3xl font-bold">{studentData.absent}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6 text-center">
              <p className="text-yellow-100">Late</p>
              <p className="text-3xl font-bold">{studentData.late}</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 ${scanningQR ? 'animate-pulse' : ''}`}>
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">QR Code Scanner</h3>
              <p className="text-sm text-gray-600 mb-4">Scan classroom QR code</p>
              <Button 
                onClick={markAttendanceQR} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={scanningQR}
              >
                {scanningQR ? 'Scanning...' : 'Start Scanner'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 ${scanningFace ? 'animate-pulse' : ''}`}>
                <Camera className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Face Verification</h3>
              <p className="text-sm text-gray-600 mb-4">AI facial recognition</p>
              <Button 
                onClick={markAttendanceFace} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={scanningFace}
              >
                {scanningFace ? 'Scanning Face...' : 'Start Verification'}
              </Button>
              
              {cameraStream && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-500" />
                    <span className="ml-2 text-sm text-gray-600">Camera Active</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">GPS Verification</h3>
              <p className="text-sm text-gray-600 mb-4">Location-based check-in</p>
              <Button 
                onClick={markAttendanceGPS} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Verify Location
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((class_) => (
                <div key={class_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{class_.name}</p>
                      <p className="text-sm text-gray-600">{class_.time} • {class_.room} • {class_.lecturer}</p>
                    </div>
                  </div>
                  <Badge className={
                    class_.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                    class_.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {class_.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Course</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {state.attendanceRecords.filter(record => record.studentId === studentData.id).slice(0, 5).map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{record.date}</td>
                      <td className="p-3 font-medium">{record.courseName}</td>
                      <td className="p-3">{record.time}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          <Badge className={
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">{record.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendance;
