import React from 'react';
import { QrCode, Users, BarChart3, Calendar, MessageCircle, Settings, Bell, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const LecturerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lecturer Dashboard</h1>
              <p className="text-gray-600">Welcome back, Dr. Sarah Johnson</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/lecturer-portal">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Advanced Portal
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Access Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-2">🚀 New Advanced Lecturer Portal Available!</h2>
                <p className="text-blue-100">Access the full-featured command center with AI analytics, real-time monitoring, and advanced controls.</p>
              </div>
              <Link to="/lecturer-portal">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Launch Portal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Active Sessions</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <QrCode className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Students</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg Attendance</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Risk Alerts</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Bell className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  <span>Class Session Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Computer Networks - CS 301</h3>
                      <p className="text-gray-600">Room 101 • 9:00 AM - 11:00 AM</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Students Present</p>
                      <p className="text-2xl font-bold text-green-600">42/65</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                      <p className="text-2xl font-bold text-blue-600">65%</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      View Map
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      End Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Computer Networks</p>
                    <p className="text-sm text-gray-600">9:00 AM - Room 101</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Database Systems</p>
                    <p className="text-sm text-gray-600">11:00 AM - Room 203</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Next</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Software Lab</p>
                    <p className="text-sm text-gray-600">2:00 PM - Lab 1</p>
                  </div>
                  <Badge variant="outline">Later</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-red-600">Risk Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="font-medium text-red-800">Proxy Detection</p>
                  <p className="text-sm text-red-600">Multiple face matches for Student ID: 10654321</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-800">Location Anomaly</p>
                  <p className="text-sm text-yellow-600">GPS mismatch detected for 3 students</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed attendance analytics</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Student Management</h3>
              <p className="text-sm text-gray-600">Manage enrolled students</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Messaging</h3>
              <p className="text-sm text-gray-600">Send notifications to students</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-md hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Export Reports</h3>
              <p className="text-sm text-gray-600">Generate PDF/Excel reports</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
