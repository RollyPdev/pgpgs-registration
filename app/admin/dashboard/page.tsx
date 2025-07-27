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
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    // Update clock every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);



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
    // Calculate revenue - only approved registrations count towards revenue
    const approvedRegistrations = registrationsData.filter(reg => reg.status === 'Approved');
    const totalRevenue = approvedRegistrations.reduce((sum, reg) => sum + reg.paymentAmount, 0);
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
    // Only calculate revenue for approved registrations
    const approvedData = data.filter(reg => reg.status === 'Approved');
    
    const revenueByMembership: { [key: string]: number } = {};
    approvedData.forEach(reg => {
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

    setIsEditingUser(true);
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
    } finally {
      setIsEditingUser(false);
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

    setIsDeletingUser(true);
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
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/admin';
    }, 1500);
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
        body: JSON.stringify({
          ...registrationForm,
          confirmedBy: registrationForm.status === 'Approved' ? userName : null
        }),
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
      {/* Logout Loading Screen */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 z-[9999] flex items-center justify-center">
          <div className="text-center">
            {/* Animated Logo/Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              {/* Rotating Ring */}
              <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-transparent border-t-white/50 rounded-full animate-spin"></div>
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 w-32 h-32 mx-auto -ml-4 -mt-4 border-2 border-transparent border-t-white/20 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
            </div>
            
            {/* Loading Text */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white mb-2">Signing Out</h2>
              <p className="text-white/80 text-lg">Please wait while we securely log you out...</p>
              
              {/* Loading Dots */}
              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-64 mx-auto mt-8">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full animate-pulse" style={{width: '100%', animation: 'progress 1.5s ease-in-out'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse" style={{animationDuration: '6s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full animate-pulse" style={{animationDuration: '8s'}}></div>
          </div>
        </div>
      )}
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
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isLoggingOut ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing Out...</span>
                </div>
              ) : 'Logout'}
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
              {stats.map((stat, index) => {
                const getIcon = (label: string) => {
                  switch (label) {
                    case 'Total Registrations':
                      return (
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      );
                    case 'Total Users':
                      return (
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      );
                    case 'Pending Approvals':
                      return (
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      );
                    case 'Revenue Generated':
                      return (
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      );
                    default:
                      return null;
                  }
                };
                
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          {getIcon(stat.label)}
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                        stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                        stat.changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                          </svg>
                        ) : stat.changeType === 'negative' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                          </svg>
                        ) : null}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Registration Trends</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 7 Days</span>
                </div>
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

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('registrations')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-all duration-200"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Chapter Breakdown</h3>
                </div>
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

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Gender Distribution</h3>
                </div>
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

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Membership Types</h3>
                </div>
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Revenue Breakdown</h3>
                    <p className="text-sm text-green-700 font-medium">Only approved registrations contribute to revenue</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl p-6 mb-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <span className="text-lg font-bold text-gray-900">Total Revenue</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      ₱{registrations.filter(reg => reg.status === 'Approved').reduce((sum, reg) => sum + reg.paymentAmount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Revenue by Membership Type */}
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200 hover:border-green-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            item.membership === 'Alumni' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}></div>
                          <span className="font-semibold text-gray-700">{item.membership}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">₱{item.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Registrations</h2>
                    <p className="text-gray-600">Manage and review all registration submissions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{registrations.length}</div>
                    <div className="text-sm text-gray-600">Total Registrations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Registrant</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Chapter</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span>Membership</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span>Payment</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Status</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4m0-10V7" />
                          </svg>
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                          <span>Actions</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {registrations.map((registration, index) => (
                      <tr key={registration.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {registration.firstName.charAt(0)}{registration.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {registration.firstName} {registration.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{registration.emailAddress}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{registration.chapter}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            registration.membership === 'Alumni' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {registration.membership}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-600">₱{registration.paymentAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            registration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            registration.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              registration.status === 'Pending' ? 'bg-yellow-500' :
                              registration.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewRegistration(registration)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => handleEditRegistration(registration)}
                              className="inline-flex items-center px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-medium rounded-lg transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRegistration(registration)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-md shadow-2xl rounded-xl bg-white transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Username</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  >
                    <option value="Member">Member</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingUser}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-md disabled:cursor-not-allowed"
                  >
                    {isAddingUser ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </div>
                    ) : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-md shadow-2xl rounded-xl bg-white transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setUserForm({ name: '', username: '', password: '', role: 'Member' });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSaveUserEdit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Username</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  >
                    <option value="Member">Member</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                      setUserForm({ name: '', username: '', password: '', role: 'Member' });
                    }}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditingUser}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-md disabled:cursor-not-allowed"
                  >
                    {isEditingUser ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-md shadow-2xl rounded-xl bg-white transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Delete User</h3>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  Are you sure you want to delete user <span className="font-semibold text-gray-900">{deletingUser.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingUser(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteUser}
                  disabled={isDeletingUser}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-md disabled:cursor-not-allowed"
                >
                  {isDeletingUser ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Registration Modal */}
      {showViewRegistrationModal && selectedRegistration && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-5xl shadow-2xl rounded-xl bg-white transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Registration Details</h3>
                </div>
                <button
                  onClick={() => {
                    setShowViewRegistrationModal(false);
                    setSelectedRegistration(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{selectedRegistration.firstName} {selectedRegistration.middleName} {selectedRegistration.lastName}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Gender:</span> <span className="text-gray-900">{selectedRegistration.gender}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Date of Birth:</span> <span className="text-gray-900">{selectedRegistration.dateOfBirth}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Place of Birth:</span> <span className="text-gray-900">{selectedRegistration.placeOfBirth}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Date of Survive:</span> <span className="text-gray-900">{selectedRegistration.dateOfSurvive}</span></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-900">{selectedRegistration.emailAddress}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Contact Number:</span> <span className="text-gray-900">{selectedRegistration.contactNumber}</span></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Address:</span> <span className="text-gray-900">{selectedRegistration.address}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Region:</span> <span className="text-gray-900">{selectedRegistration.region}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Province:</span> <span className="text-gray-900">{selectedRegistration.province}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">City:</span> <span className="text-gray-900">{selectedRegistration.city}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Barangay:</span> <span className="text-gray-900">{selectedRegistration.barangay}</span></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Registration Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Chapter:</span> <span className="text-gray-900">{selectedRegistration.chapter}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Membership:</span> <span className="text-gray-900">{selectedRegistration.membership}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Payment Amount:</span> <span className="text-green-600 font-semibold">₱{selectedRegistration.paymentAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Status:</span> 
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        selectedRegistration.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedRegistration.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedRegistration.status}
                      </span>
                    </div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Registration Date:</span> <span className="text-gray-900">{new Date(selectedRegistration.createdAt).toLocaleDateString()}</span></div>
                    {selectedRegistration.confirmedBy && (
                      <div className="flex justify-between"><span className="font-medium text-gray-600">Confirmed By:</span> <span className="text-green-600 font-semibold">{selectedRegistration.confirmedBy}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Modal */}
      {showEditRegistrationModal && selectedRegistration && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-6xl shadow-2xl rounded-xl bg-white transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Edit Registration</h3>
                </div>
                <button
                  onClick={() => {
                    setShowEditRegistrationModal(false);
                    setSelectedRegistration(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              
              <form onSubmit={handleSaveRegistrationEdit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.firstName}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Middle Name</label>
                    <input
                      type="text"
                      value={registrationForm.middleName}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, middleName: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter middle name (optional)"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.lastName}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Gender</label>
                    <select
                      required
                      value={registrationForm.gender}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, gender: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={registrationForm.dateOfBirth}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Place of Birth</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.placeOfBirth}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter place of birth"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                    <input
                      type="text"
                      required
                      value={registrationForm.address}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, address: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter complete address"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Date of Survive</label>
                    <input
                      type="date"
                      required
                      value={registrationForm.dateOfSurvive}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, dateOfSurvive: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Chapter</label>
                    <input
                      type="text"
                      value={registrationForm.chapter}
                      readOnly
                      className="block w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Membership</label>
                    <input
                      type="text"
                      value={registrationForm.membership}
                      readOnly
                      className="block w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Payment Amount</label>
                    <input
                      type="text"
                      value={`₱${registrationForm.paymentAmount.toLocaleString()}`}
                      readOnly
                      className="block w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Status</label>
                    <select
                      required
                      value={registrationForm.status}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, status: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={registrationForm.emailAddress}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, emailAddress: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={registrationForm.contactNumber}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditRegistrationModal(false);
                      setSelectedRegistration(null);
                    }}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingRegistration}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-md disabled:cursor-not-allowed"
                  >
                    {isUpdatingRegistration ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </div>
                    ) : 'Update Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Registration Modal */}
      {showDeleteRegistrationModal && selectedRegistration && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-md shadow-2xl rounded-xl bg-white transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Delete Registration</h3>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteRegistrationModal(false);
                    setSelectedRegistration(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  Are you sure you want to delete the registration for <span className="font-semibold text-gray-900">{selectedRegistration.firstName} {selectedRegistration.lastName}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDeleteRegistrationModal(false);
                    setSelectedRegistration(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteRegistration}
                  disabled={isDeletingRegistration}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-md disabled:cursor-not-allowed"
                >
                  {isDeletingRegistration ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : 'Delete Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 text-white py-8 mt-16 border-t border-slate-700 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img src="/PGPGS Logo.png" alt="PGPGS Logo" className="w-12 h-12 rounded-full border-2 border-indigo-400 shadow-md bg-white object-contain" />
            <div>
              <div className="font-extrabold text-lg tracking-wide text-indigo-200 drop-shadow">Pi Gamma Phi Gamma Sigma</div>
              <div className="text-xs text-slate-300 font-medium">Admin Dashboard</div>
            </div>
          </div>
          {/* Copyright & Developer */}
          <div className="text-center md:text-right flex-1">
            <div className="text-sm font-medium text-slate-200">Developed by <span className="font-semibold text-indigo-300">Brother Rolly O. Paredes</span></div>
            <div className="text-xs text-slate-400 mt-1">© {new Date().getFullYear()} Pi Gamma Phi Gamma Sigma. All rights reserved.</div>
          </div>
          {/* Social/Contact Icons */}
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=61577315199577" className="hover:text-indigo-400 transition-colors" title="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors" title="Email">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4m0-4V8" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}