'use client';
import React, { useState, useEffect } from 'react';

interface Registration {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  emailAddress: string;
  chapter: string;
  membership: string;
  paymentAmount: number;
  status: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  dateOfSurvive: string;
  contactNumber: string;
  confirmedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  createdAt: string;
}

interface Stat {
  label: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showWarningMessage, setShowWarningMessage] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // Registration modal states
  const [showViewRegistrationModal, setShowViewRegistrationModal] = useState(false);
  const [showEditRegistrationModal, setShowEditRegistrationModal] = useState(false);
  const [showDeleteRegistrationModal, setShowDeleteRegistrationModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isUpdatingRegistration, setIsUpdatingRegistration] = useState(false);
  const [isDeletingRegistration, setIsDeletingRegistration] = useState(false);

  // Form states for adding/editing users
  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Member'
  });

  // Form state for editing registrations
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    placeOfBirth: '',
    address: '',
    region: '',
    province: '',
    cityMunicipality: '',
    barangay: '',
    dateOfSurvive: '',
    chapter: '',
    membership: '',
    paymentAmount: 0,
    contactNumber: '',
    emailAddress: '',
    status: ''
  });

  // Stats state
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Total Registrations', value: 0, change: '+12%', changeType: 'positive' },
    { label: 'Total Users', value: 0, change: '+5%', changeType: 'positive' },
    { label: 'Pending Approvals', value: 0, change: '-2%', changeType: 'negative' },
    { label: 'Revenue Generated', value: '₱0', change: '+8%', changeType: 'positive' }
  ]);

  // Registration trends data
  const [registrationTrends, setRegistrationTrends] = useState<Array<{ date: string; count: number }>>([]);
  const [dailyTrends, setDailyTrends] = useState<Array<{ day: string; count: number }>>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<Array<{ status: string; count: number }>>([]);
  const [recentActivity, setRecentActivity] = useState<Registration[]>([]);
  
  // Analytics data
  const [chapterBreakdown, setChapterBreakdown] = useState<Array<{ chapter: string; count: number }>>([]);
  const [genderBreakdown, setGenderBreakdown] = useState<Array<{ gender: string; count: number }>>([]);
  const [membershipBreakdown, setMembershipBreakdown] = useState<Array<{ membership: string; count: number }>>([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<Array<{ membership: string; revenue: number }>>([]);

  useEffect(() => {
    // Get user info from localStorage
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedUserRole) setUserRole(storedUserRole);
    if (storedUserName) setUserName(storedUserName);

    fetchData();
  }, []);

  useEffect(() => {
    // Redirect non-administrators from 'users' tab
    if (activeTab === 'users' && userRole !== 'Administrator') {
      setActiveTab('overview');
    }
  }, [activeTab, userRole]);

  const fetchData = async () => {
    try {
      const [registrationsRes, usersRes] = await Promise.all([
        fetch('/api/registrations'),
        fetch('/api/users')
      ]);

      let registrationsData: Registration[] = [];
      let usersData: User[] = [];

      if (registrationsRes.ok) {
        registrationsData = await registrationsRes.json();
        setRegistrations(registrationsData);
      }

      if (usersRes.ok) {
        usersData = await usersRes.json();
        setUsers(usersData);
      }

      // Update stats with the actual data
      updateStats(registrationsData.length, usersData.length, registrationsData);
      updateAnalytics(registrationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (registrationsCount: number, usersCount: number, registrationsData: Registration[]) => {
    // Calculate revenue and pending count from the provided registrations data
    const totalRevenue = registrationsData.reduce((sum, reg) => sum + reg.paymentAmount, 0);
    const pendingCount = registrationsData.filter(reg => reg.status === 'Pending').length;

    setStats([
      { label: 'Total Registrations', value: registrationsCount, change: '+12%', changeType: 'positive' },
      { label: 'Total Users', value: usersCount, change: '+5%', changeType: 'positive' },
      { label: 'Pending Approvals', value: pendingCount, change: '-2%', changeType: 'negative' },
      { label: 'Revenue Generated', value: `₱${totalRevenue.toLocaleString()}`, change: '+8%', changeType: 'positive' }
    ]);
  };

  const updateAnalytics = (data: Registration[]) => {
    // Registration trends (last 7 days)
    const trends = getRegistrationTrends(data);
    setRegistrationTrends(trends);

    // Daily trends
    const daily = getDailyRegistrationTrends(data);
    setDailyTrends(daily);

    // Status breakdown
    const breakdown = getRegistrationStatusBreakdown(data);
    setStatusBreakdown(breakdown);

    // Recent activity
    const recent = getRecentActivity(data);
    setRecentActivity(recent);

    // Analytics breakdowns
    const chapter = getChapterBreakdown(data);
    setChapterBreakdown(chapter);

    const gender = getGenderBreakdown(data);
    setGenderBreakdown(gender);

    const membership = getMembershipBreakdown(data);
    setMembershipBreakdown(membership);

    const revenue = getRevenueBreakdown(data);
    setRevenueBreakdown(revenue);
  };

  const getRegistrationTrends = (data: Registration[]): Array<{ date: string; count: number }> => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: data.filter(reg => {
        const regDate = new Date(reg.createdAt).toISOString().split('T')[0];
        return regDate === date;
      }).length
    }));
  };

  const getDailyRegistrationTrends = (data: Registration[]): Array<{ day: string; count: number }> => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayCounts: { [key: string]: number } = {};
    
    // Initialize all days with 0
    days.forEach(day => {
      dayCounts[day] = 0;
    });
    
    // Count registrations by day of week
    data.forEach(reg => {
      const dayOfWeek = new Date(reg.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (dayCounts.hasOwnProperty(dayOfWeek)) {
        dayCounts[dayOfWeek]++;
      }
    });
    
    return days.map(day => ({
      day,
      count: dayCounts[day]
    }));
  };

  const getRegistrationStatusBreakdown = (data: Registration[]): Array<{ status: string; count: number }> => {
    const statuses = ['Pending', 'Approved', 'Rejected'];
    return statuses.map(status => ({
      status,
      count: data.filter(reg => reg.status === status).length
    }));
  };

  const getRecentActivity = (data: Registration[]): Registration[] => {
    if (!data || data.length === 0) return [];
    
    return data
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getChapterBreakdown = (data: Registration[]): Array<{ chapter: string; count: number }> => {
    const chapterCounts: { [key: string]: number } = {};
    data.forEach(reg => {
      chapterCounts[reg.chapter] = (chapterCounts[reg.chapter] || 0) + 1;
    });
    return Object.entries(chapterCounts).map(([chapter, count]) => ({ chapter, count }));
  };

  const getGenderBreakdown = (data: Registration[]): Array<{ gender: string; count: number }> => {
    const genderCounts: { [key: string]: number } = {};
    data.forEach(reg => {
      genderCounts[reg.gender] = (genderCounts[reg.gender] || 0) + 1;
    });
    return Object.entries(genderCounts).map(([gender, count]) => ({ gender, count }));
  };

  const getMembershipBreakdown = (data: Registration[]): Array<{ membership: string; count: number }> => {
    const membershipCounts: { [key: string]: number } = {};
    data.forEach(reg => {
      membershipCounts[reg.membership] = (membershipCounts[reg.membership] || 0) + 1;
    });
    return Object.entries(membershipCounts).map(([membership, count]) => ({ membership, count }));
  };

  const getRevenueBreakdown = (data: Registration[]): Array<{ membership: string; revenue: number }> => {
    const revenueByMembership: { [key: string]: number } = {};
    data.forEach(reg => {
      revenueByMembership[reg.membership] = (revenueByMembership[reg.membership] || 0) + reg.paymentAmount;
    });
    
    // Ensure Alumni and Member are always shown, even if no registrations
    const breakdown = [
      { membership: 'Alumni', revenue: revenueByMembership['Alumni'] || 0 },
      { membership: 'Member', revenue: revenueByMembership['Member'] || 0 }
    ];
    
    return breakdown;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (response.status === 409) {
        setWarningMessage('Username already exists!');
        setShowWarningMessage(true);
        setTimeout(() => setShowWarningMessage(false), 5000);
        return;
      }

      if (response.ok) {
        const newUser = await response.json();
        setUsers(prev => [...prev, newUser]);
        setShowAddUserModal(false);
        setUserForm({ name: '', username: '', password: '', role: 'Member' });
        
        // Show success modal
        setSuccessMessage(`User "${userForm.name}" created successfully!`);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        setWarningMessage(error.error || 'Failed to create user');
        setShowWarningMessage(true);
        setTimeout(() => setShowWarningMessage(false), 5000);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setWarningMessage('Failed to create user');
      setShowWarningMessage(true);
      setTimeout(() => setShowWarningMessage(false), 5000);
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? updatedUser : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
        setUserForm({ name: '', username: '', password: '', role: 'Member' });
        
        // Show success modal
        setSuccessMessage(`User "${userForm.name}" updated successfully!`);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;

    // Prevent deleting the last administrator
    const adminUsers = users.filter(user => user.role === 'Administrator');
    if (adminUsers.length === 1 && deletingUser.role === 'Administrator') {
      setWarningMessage('Cannot delete the last administrator');
      setShowWarningMessage(true);
      setTimeout(() => setShowWarningMessage(false), 5000);
      setShowDeleteModal(false);
      setDeletingUser(null);
      return;
    }

    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== deletingUser.id));
        setShowDeleteModal(false);
        setDeletingUser(null);
        
        // Show success modal
        setSuccessMessage(`User "${deletingUser.name}" deleted successfully!`);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.href = '/admin';
  };

  // Registration action handlers
  const handleViewRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowViewRegistrationModal(true);
  };

  const handleEditRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setRegistrationForm({
      firstName: registration.firstName,
      middleName: registration.middleName || '',
      lastName: registration.lastName,
      gender: registration.gender,
      dateOfBirth: registration.dateOfBirth,
      placeOfBirth: registration.placeOfBirth,
      address: registration.address,
      region: registration.region,
      province: registration.province,
      cityMunicipality: registration.city,
      barangay: registration.barangay,
      dateOfSurvive: registration.dateOfSurvive,
      chapter: registration.chapter,
      membership: registration.membership,
      paymentAmount: registration.paymentAmount,
      contactNumber: registration.contactNumber,
      emailAddress: registration.emailAddress,
      status: registration.status
    });
    setShowEditRegistrationModal(true);
  };

  const handleDeleteRegistration = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowDeleteRegistrationModal(true);
  };

  const handleSaveRegistrationEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegistration) return;

    setIsUpdatingRegistration(true);
    try {
      const response = await fetch(`/api/registrations/${selectedRegistration.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationForm),
      });

      if (response.ok) {
        const updatedRegistration = await response.json();
        setRegistrations(prev => prev.map(reg => 
          reg.id === selectedRegistration.id ? updatedRegistration : reg
        ));
        setShowEditRegistrationModal(false);
        setSelectedRegistration(null);
        
        // Show success modal
        setSuccessMessage(`Registration for "${registrationForm.firstName} ${registrationForm.lastName}" updated successfully!`);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        
        // Update stats with new data
        const updatedRegistrations = registrations.map(reg => 
          reg.id === selectedRegistration.id ? updatedRegistration : reg
        );
        updateStats(updatedRegistrations.length, users.length, updatedRegistrations);
        updateAnalytics(updatedRegistrations);
      } else {
        const error = await response.json();
        setWarningMessage(error.error || 'Failed to update registration');
        setShowWarningMessage(true);
        setTimeout(() => setShowWarningMessage(false), 5000);
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      setWarningMessage('Failed to update registration');
      setShowWarningMessage(true);
      setTimeout(() => setShowWarningMessage(false), 5000);
    } finally {
      setIsUpdatingRegistration(false);
    }
  };

  const handleConfirmDeleteRegistration = async () => {
    if (!selectedRegistration) return;

    setIsDeletingRegistration(true);
    try {
      const response = await fetch(`/api/registrations/${selectedRegistration.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistrations(prev => prev.filter(reg => reg.id !== selectedRegistration.id));
        setShowDeleteRegistrationModal(false);
        setSelectedRegistration(null);
        
        // Show success modal
        setSuccessMessage(`Registration for "${selectedRegistration.firstName} ${selectedRegistration.lastName}" deleted successfully!`);
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
        
        // Update stats with new data
        const updatedRegistrations = registrations.filter(reg => reg.id !== selectedRegistration.id);
        updateStats(updatedRegistrations.length, users.length, updatedRegistrations);
        updateAnalytics(updatedRegistrations);
      } else {
        const error = await response.json();
        setWarningMessage(error.error || 'Failed to delete registration');
        setShowWarningMessage(true);
        setTimeout(() => setShowWarningMessage(false), 5000);
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      setWarningMessage('Failed to delete registration');
      setShowWarningMessage(true);
      setTimeout(() => setShowWarningMessage(false), 5000);
    } finally {
      setIsDeletingRegistration(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {userName} ({userRole})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'registrations'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registrations
            </button>
            {userRole === 'Administrator' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Warning Message */}
      {showWarningMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-[9999] animate-bounce">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            {warningMessage}
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessModal && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-[9999] animate-bounce">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            {successMessage}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Trends (Last 7 Days)</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {registrationTrends.length > 0 ? (
                    registrationTrends.map((trend, index) => {
                      const maxCount = Math.max(...registrationTrends.map(t => t.count), 1);
                      const height = maxCount > 0 ? (trend.count / maxCount) * 200 : 4;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-indigo-100 rounded-t relative">
                            <div 
                              className="bg-indigo-600 rounded-t transition-all duration-300 min-h-[4px]"
                              style={{ height: `${Math.max(height, 4)}px` }}
                            ></div>
                            {trend.count > 0 && (
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                {trend.count}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 text-center mt-2">{trend.date}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 mb-2">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No registration data</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((registration) => (
                      <div 
                        key={registration.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleViewRegistration(registration)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">
                              {registration.firstName} {registration.lastName}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              registration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              registration.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {registration.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600">{registration.chapter}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(registration.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">{registration.membership}</p>
                            <p className="text-xs font-medium text-green-600">₱{registration.paymentAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No recent registrations</p>
                      <p className="text-gray-400 text-xs">New registrations will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chapter Breakdown</h3>
                <div className="space-y-3">
                  {chapterBreakdown.length > 0 ? (
                    chapterBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate max-w-[150px]" title={item.chapter}>
                          {item.chapter}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No chapter data available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h3>
                <div className="space-y-3">
                  {genderBreakdown.length > 0 ? (
                    genderBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.gender}</span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No gender data available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Types</h3>
                <div className="space-y-3">
                  {membershipBreakdown.length > 0 ? (
                    membershipBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.membership}</span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No membership data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Breakdown Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-4">
                {/* Total Revenue */}
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total Revenue:</span>
                    <span className="text-lg font-bold text-green-600">
                      ₱{registrations.reduce((sum, reg) => sum + reg.paymentAmount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Revenue by Membership Type */}
                <div className="space-y-3">
                  {revenueBreakdown.length > 0 ? (
                    revenueBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.membership}:</span>
                        <span className="text-sm font-medium text-gray-900">₱{item.revenue.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No revenue data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Registrations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chapter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.firstName} {registration.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{registration.emailAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.chapter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.membership}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₱{registration.paymentAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          registration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          registration.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {registration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewRegistration(registration)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditRegistration(registration)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRegistration(registration)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && userRole === 'Administrator' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Users</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add User
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'Administrator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingUser}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isAddingUser ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
              <form onSubmit={handleSaveUserEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                      setUserForm({ name: '', username: '', password: '', role: 'Member' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete User</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete user &quot;{deletingUser.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingUser(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Registration Modal */}
      {showViewRegistrationModal && selectedRegistration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">View Registration Details</h3>
                <button
                  onClick={() => {
                    setShowViewRegistrationModal(false);
                    setSelectedRegistration(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Personal Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Name:</span> {selectedRegistration.firstName} {selectedRegistration.middleName} {selectedRegistration.lastName}</div>
                    <div><span className="font-medium">Gender:</span> {selectedRegistration.gender}</div>
                    <div><span className="font-medium">Date of Birth:</span> {selectedRegistration.dateOfBirth}</div>
                    <div><span className="font-medium">Place of Birth:</span> {selectedRegistration.placeOfBirth}</div>
                    <div><span className="font-medium">Date of Survive:</span> {selectedRegistration.dateOfSurvive}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Email:</span> {selectedRegistration.emailAddress}</div>
                    <div><span className="font-medium">Contact Number:</span> {selectedRegistration.contactNumber}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Address Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Address:</span> {selectedRegistration.address}</div>
                    <div><span className="font-medium">Region:</span> {selectedRegistration.region}</div>
                    <div><span className="font-medium">Province:</span> {selectedRegistration.province}</div>
                    <div><span className="font-medium">City:</span> {selectedRegistration.city}</div>
                    <div><span className="font-medium">Barangay:</span> {selectedRegistration.barangay}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Registration Details</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Chapter:</span> {selectedRegistration.chapter}</div>
                    <div><span className="font-medium">Membership:</span> {selectedRegistration.membership}</div>
                    <div><span className="font-medium">Payment Amount:</span> ₱{selectedRegistration.paymentAmount.toLocaleString()}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedRegistration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedRegistration.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedRegistration.status}
                      </span>
                    </div>
                    <div><span className="font-medium">Registration Date:</span> {new Date(selectedRegistration.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Modal */}
      {showEditRegistrationModal && selectedRegistration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Registration</h3>
                <button
                  onClick={() => {
                    setShowEditRegistrationModal(false);
                    setSelectedRegistration(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSaveRegistrationEdit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.firstName}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                      type="text"
                      value={registrationForm.middleName}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, middleName: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.lastName}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      required
                      value={registrationForm.gender}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, gender: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={registrationForm.dateOfBirth}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.placeOfBirth}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.address}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, address: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Survive</label>
                    <input
                      type="date"
                      required
                      value={registrationForm.dateOfSurvive}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, dateOfSurvive: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chapter</label>
                    <input
                      type="text"
                      value={registrationForm.chapter}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Membership</label>
                    <input
                      type="text"
                      value={registrationForm.membership}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
                    <input
                      type="text"
                      value={`₱${registrationForm.paymentAmount.toLocaleString()}`}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      required
                      value={registrationForm.status}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, status: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={registrationForm.emailAddress}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, emailAddress: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={registrationForm.contactNumber}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditRegistrationModal(false);
                      setSelectedRegistration(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingRegistration}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isUpdatingRegistration ? 'Updating...' : 'Update Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Registration Modal */}
      {showDeleteRegistrationModal && selectedRegistration && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Registration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete the registration for &quot;{selectedRegistration.firstName} {selectedRegistration.lastName}&quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteRegistrationModal(false);
                    setSelectedRegistration(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteRegistration}
                  disabled={isDeletingRegistration}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                >
                  {isDeletingRegistration ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}