
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, TrendingUp, Play, Users, CheckCircle, MapPin, Camera, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useAttendance } from '@/hooks/useAttendanceStore';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAttendance();

  const stats = [
    {
      title: 'Enrolled Courses',
      value: '8',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      onClick: () => navigate('/courses')
    },
    {
      title: 'Attendance Rate',
      value: '87%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      onClick: () => navigate('/analytics')
    },
    {
      title: 'Classes Today',
      value: '4',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      onClick: () => navigate('/schedule')
    },
    {
      title: 'Next Class',
      value: '2:00 PM',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      onClick: () => toast.info('Database Systems starts at 2:00 PM in Room 101')
    }
  ];

  const todayClasses = [
    { 
      course: 'Computer Networks', 
      time: '8:00 AM', 
      status: 'Present', 
      date: 'Today', 
      room: 'Room 205',
      lecturer: 'Dr. Kwame Nkrumah',
      attendanceMethod: 'Face Recognition'
    },
    { 
      course: 'Software Engineering', 
      time: '10:00 AM', 
      status: 'Present', 
      date: 'Today', 
      room: 'Lab 2',
      lecturer: 'Prof. Ama Aidoo',
      attendanceMethod: 'QR Code'
    },
    { 
      course: 'Database Systems', 
      time: '2:00 PM', 
      status: 'Upcoming', 
      date: 'Today', 
      room: 'Room 101',
      lecturer: 'Dr. John Smith',
      attendanceMethod: 'Pending'
    },
    { 
      course: 'Web Development', 
      time: '4:00 PM', 
      status: 'Upcoming', 
      date: 'Today', 
      room: 'Lab 3',
      lecturer: 'Prof. Sarah Johnson',
      attendanceMethod: 'Pending'
    },
  ];

  const quickActions = [
    {
      title: 'Mark Attendance',
      description: 'Use QR code, Face ID, or GPS to mark your presence',
      icon: CheckCircle,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => {
        // Simulate attendance marking
        dispatch({
          type: 'MARK_ATTENDANCE',
          payload: {
            studentId: '20230001',
            studentName: 'Kwame Asante',
            courseId: 'CS340',
            courseName: 'Database Systems',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: 'present',
            method: 'QR Code',
            location: 'Room 101',
            lecturerName: 'Dr. John Smith'
          }
        });
        toast.success('Attendance marked successfully for Database Systems!');
        navigate('/attendance');
      }
    },
    {
      title: 'View Schedule',
      description: 'Check your complete class timetable and assignments',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/schedule')
    },
    {
      title: 'Join Live Class',
      description: 'Connect to ongoing virtual or hybrid sessions',
      icon: Play,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => {
        toast.success('Joining Database Systems virtual session...');
        setTimeout(() => {
          toast.info('Connected to virtual classroom');
        }, 2000);
      }
    }
  ];

  const recentAchievements = [
    { title: 'Perfect Attendance', description: 'Maintained 100% attendance for Computer Networks', icon: '🏆' },
    { title: 'Early Bird', description: 'Arrived 15 minutes early for 5 consecutive classes', icon: '⏰' },
    { title: 'Tech Savvy', description: 'Successfully used all attendance methods', icon: '📱' }
  ];

  const handleMarkAttendance = (method: 'qr' | 'face' | 'gps') => {
    const methods = {
      qr: 'QR Code',
      face: 'Face Recognition',
      gps: 'GPS Verification'
    };
    
    toast.success(`Attempting ${methods[method]} attendance...`);
    
    setTimeout(() => {
      dispatch({
        type: 'MARK_ATTENDANCE',
        payload: {
          studentId: '20230001',
          studentName: 'Kwame Asante',
          courseId: 'CS301',
          courseName: 'Computer Networks',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          status: 'present',
          method: methods[method] as any,
          location: 'Room 205'
        }
      });
      toast.success(`Attendance marked via ${methods[method]}!`);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Kwame!</h1>
          <p className="text-blue-100">Here's your academic overview for today</p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card 
              key={stat.title} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={stat.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Attendance Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleMarkAttendance('qr')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex flex-col items-center space-y-2"
              >
                <QrCode className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">QR Code</div>
                  <div className="text-xs opacity-90">Scan classroom QR</div>
                </div>
              </Button>
              <Button
                onClick={() => handleMarkAttendance('face')}
                className="bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex flex-col items-center space-y-2"
              >
                <Camera className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Face Recognition</div>
                  <div className="text-xs opacity-90">AI facial verification</div>
                </div>
              </Button>
              <Button
                onClick={() => handleMarkAttendance('gps')}
                className="bg-purple-600 hover:bg-purple-700 text-white p-6 h-auto flex flex-col items-center space-y-2"
              >
                <MapPin className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">GPS Check-in</div>
                  <div className="text-xs opacity-90">Location verification</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  onClick={action.onClick}
                  className={`${action.color} text-white p-6 h-auto flex flex-col items-center space-y-2 hover:scale-105 transition-transform`}
                >
                  <action.icon className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Today's Classes
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/schedule')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((class_, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => toast.info(`${class_.course} with ${class_.lecturer} - ${class_.room}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{class_.course}</p>
                      <p className="text-sm text-gray-500">
                        {class_.time} • {class_.room} • {class_.lecturer}
                      </p>
                      <p className="text-xs text-gray-400">
                        Method: {class_.attendanceMethod}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      class_.status === 'Present' 
                        ? 'bg-green-100 text-green-800'
                        : class_.status === 'Upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {class_.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="text-2xl mr-3">{achievement.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
