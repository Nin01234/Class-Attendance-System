import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Users, Clock, MapPin, Camera, QrCode, 
  ArrowLeft, RefreshCw, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PAGE_SIZE = 10;

interface AttendanceRecord {
  id: string;
  studentName: string;
  studentId: string;
  method: string;
  time: string;
  status: 'verified' | 'pending';
  confidence: string | null;
}

const AttendanceViewer = () => {
  const navigate = useNavigate();
  const [liveAttendance, setLiveAttendance] = useState<AttendanceRecord[]>([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    totalStudents: 65,
    presentStudents: 0,
    attendanceRate: 0
  });
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadAttendance = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    // Query attendance_records and join profiles for student name/id
    const { data, error, count } = await supabase
      .from('attendance_records')
      .select(`id, check_in_time, is_verified, face_confidence, verification_method, student_id, profiles:student_id(full_name, student_id)`, { count: 'exact' })
      .order('check_in_time', { ascending: false })
      .range(from, to);
    if (error) {
      setLoading(false);
      return;
    }
    const records: AttendanceRecord[] = (data || []).map((rec: any) => ({
      id: rec.id,
      studentName: rec.profiles?.full_name || 'Unknown',
      studentId: rec.profiles?.student_id || rec.student_id || 'Unknown',
      method: rec.verification_method?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
      time: rec.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString() : '',
      status: rec.is_verified ? 'verified' : 'pending',
      confidence: rec.face_confidence ? rec.face_confidence.toFixed(1) + '%' : null,
    }));
    setTotalRecords(count || 0);
    if (reset) {
      setLiveAttendance(records);
      setPage(2);
    } else {
      setLiveAttendance(prev => [...prev, ...records]);
      setPage(prev => prev + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAttendance(true);
  }, []);

  useEffect(() => {
    // Update session stats based on liveAttendance
    setSessionStats(prev => ({
      ...prev,
      presentStudents: liveAttendance.length,
      attendanceRate: Math.round((liveAttendance.length / prev.totalStudents) * 100)
    }));
  }, [liveAttendance]);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'QR Code': return <QrCode className="h-4 w-4" />;
      case 'Face Recognition': return <Camera className="h-4 w-4" />;
      case 'GPS': return <MapPin className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'verified' 
      ? <Badge className="bg-green-100 text-green-800">Verified</Badge>
      : <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/lecturer-portal')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Attendance Viewer</h1>
              <p className="text-gray-600">Real-time monitoring of student attendance</p>
            </div>
          </div>
          <Button onClick={() => loadAttendance(true)} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Present Students</p>
                  <p className="text-3xl font-bold">{sessionStats.presentStudents}/{sessionStats.totalStudents}</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Attendance Rate</p>
                  <p className="text-3xl font-bold">{sessionStats.attendanceRate}%</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Live Updates</p>
                  <p className="text-3xl font-bold">{liveAttendance.length}</p>
                </div>
                <Eye className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Attendance Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>Live Attendance ({liveAttendance.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {liveAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        {getMethodIcon(record.method)}
                        <div>
                          <p className="font-medium">{record.studentName}</p>
                          <p className="text-sm text-gray-600">ID: {record.studentId} • {record.time}</p>
                          {record.confidence && (
                            <p className="text-xs text-blue-600">Confidence: {record.confidence}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{record.method}</Badge>
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  ))}
                  {liveAttendance.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Waiting for attendance records...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      {activity.type === 'success' ? 
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" /> :
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      }
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceViewer;
