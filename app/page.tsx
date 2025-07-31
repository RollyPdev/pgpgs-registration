"use client";

import Image from "next/image";
import { useState, useEffect } from "react";



interface AddressData {
  code: string;
  name: string;
}

const chapters = [
  "PGPGS Roxas City Capiz Chapter",
  "PGPGS President Roxas  Chapter",
  "PGPGS Maayon Chapter",
  "PGPGS Sigma Chapter",
  "PGPGS Dao Chapter",
  "PGPGS Dumarao Chapter",
  "PGPGS Ivisan Chapter",
  "PGPGS Panit-an Chapter",
  "PGPGS Panay Chapter",
];

export default function RegistrationPage() {
  const [membership, setMembership] = useState("");
  const [chapter, setChapter] = useState("");
  const [terms, setTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Error alert state

  
  // Beautiful Alert Notifications System
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'error' | 'warning' | 'success' | 'info';
    title: string;
    message: string;
    duration?: number;
    show: boolean;
  }>>([]);

  // Function to add a new notification
  const addNotification = (type: 'error' | 'warning' | 'success' | 'info', title: string, message: string, duration: number = 6000) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type,
      title,
      message,
      duration,
      show: true
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  // Function to remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, show: false } : notification
    ));
    
    // Remove from state after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 300);
  };

  // Legacy function for backward compatibility
  const showError = (message: string) => {
    addNotification('error', '⚠️ Registration Error', message, 8000);
  };

  // Address state
  const [regions, setRegions] = useState<AddressData[]>([]);
  const [provinces, setProvinces] = useState<AddressData[]>([]);
  const [cities, setCities] = useState<AddressData[]>([]);
  const [barangays, setBarangays] = useState<AddressData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Form data state
  const [formData, setFormData] = useState({
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
    contactNumber: '',
    emailAddress: ''
  });

  // Touched state for validation
  const [touched, setTouched] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    dateOfBirth: false,
    placeOfBirth: false,
    address: false,
    region: false,
    province: false,
    cityMunicipality: false,
    barangay: false,
    dateOfSurvive: false,
    contactNumber: false,
    emailAddress: false,
    chapter: false,
    membershipType: false,
  });

  // Validation state
  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    address: '',
    region: '',
    province: '',
    cityMunicipality: '',
    barangay: '',
    dateOfSurvive: '',
    contactNumber: '',
    emailAddress: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowWelcomeModal(true);
    }, 2500);
    
    // Load regions on component mount
    fetch('https://psgc.cloud/api/regions')
      .then(res => res.json())
      .then((data: AddressData[]) => setRegions(data))
      .catch(err => console.error('Error loading regions:', err));
    
    return () => clearTimeout(timer);
  }, []);


  
  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-09-27T00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Load provinces when region changes
  useEffect(() => {
    if (selectedRegion) {
      fetch(`https://psgc.cloud/api/regions/${selectedRegion}/provinces`)
        .then(res => res.json())
        .then((data: AddressData[]) => setProvinces(data))
        .catch(err => console.error('Error loading provinces:', err));
      setSelectedProvince("");
      setCities([]);
      setBarangays([]);
    }
  }, [selectedRegion]);
  
  // Load cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://psgc.cloud/api/provinces/${selectedProvince}/cities-municipalities`)
        .then(res => res.json())
        .then((data: AddressData[]) => setCities(data))
        .catch(err => console.error('Error loading cities:', err));
      setSelectedCity("");
      setBarangays([]);
    }
  }, [selectedProvince]);
  
  // Load barangays when city changes
  useEffect(() => {
    if (selectedCity) {
      fetch(`https://psgc.cloud/api/cities-municipalities/${selectedCity}/barangays`)
        .then(res => res.json())
        .then((data: AddressData[]) => setBarangays(data))
        .catch(err => console.error('Error loading barangays:', err));
      setSelectedBarangay("");
    }
  }, [selectedCity]);

  const paymentAmount = membership === "Alumni" ? 1000 : membership === "Member" ? 500 : 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    // Reset form after closing modal
    setFormData({
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
      contactNumber: '',
      emailAddress: ''
    });
    setChapter('');
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedBarangay('');
    setTerms(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terms) {
      addNotification('warning', '⚠️ Terms Required', 'Please accept the terms and conditions to continue with your registration.', 4000);
      return;
    }

    setIsSubmitting(true);
    
    // Show processing notification
    addNotification('info', '⏳ Processing Registration', 'Please wait while we process your registration...', 3000);

    try {
      const registrationData = {
        firstName: formData.firstName,
        middleName: formData.middleName || null,
        lastName: formData.lastName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        address: formData.address,
        region: regions.find(r => r.code === selectedRegion)?.name || '',
        province: provinces.find(p => p.code === selectedProvince)?.name || '',
        cityMunicipality: cities.find(c => c.code === selectedCity)?.name || '',
        barangay: barangays.find(b => b.code === selectedBarangay)?.name || '',
        dateOfSurvive: formData.dateOfSurvive,
        chapter,
        membership,
        paymentAmount,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress
      };

      console.log('Submitting registration data:', registrationData);

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.status === 409) {
        const errorData = await response.json();
        console.log('409 error data:', errorData);
        showError(`⚠️ Registration Error: ${errorData.error}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        showError(`⚠️ Registration Error: ${errorData.error || 'Failed to submit registration'}`);
        return;
      }

      const result = await response.json();
      console.log('Success result:', result);

      // Show success notification
      addNotification('success', '🎉 Registration Successful!', 'Your registration has been completed successfully. Welcome to the PGPGS family!', 5000);
      
      // Show success message
      setShowSuccess(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      showError('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-xl animate-pulse animation-delay-150"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse animation-delay-300"></div>
        </div>
        
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-yellow-500/30 rounded-full blur-2xl scale-150 animate-pulse"></div>
            <div className="relative overflow-hidden rounded-full">
              <Image
                src="/PGPGS Logo.png"
                alt="PGPGS Logo"
                width={140}
                height={140}
                className="animate-[float_3s_ease-in-out_infinite]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite] opacity-0"></div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-36 border-4 border-amber-200/50 border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute w-32 h-32 border-2 border-yellow-300/50 border-b-transparent rounded-full animate-spin animation-delay-150 animate-reverse"></div>
              <div className="absolute w-28 h-28 border border-amber-400/30 border-r-transparent rounded-full animate-spin animation-delay-300"></div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent animate-pulse">
              Pi Gamma Phi Gamma Sigma
            </h1>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-700">Loading Registration Portal</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-150"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-300"></div>
                </div>
                <p className="text-slate-600 ml-2">Preparing your experience</p>
              </div>
            </div>
          </div>
          
          <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "PGPGS 50th Golden Anniversary Registration",
    "description": "Official registration for Pi Gamma Phi Gamma Sigma 50th Golden Anniversary celebration",
    "startDate": "2025-09-27",
    "location": {
      "@type": "Place",
      "name": "Roxas City, Capiz",
      "address": "Roxas City, Capiz, Philippines"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Pi Gamma Phi Gamma Sigma",
      "url": "https://pgpgs.rollyparedes.net"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Member Registration",
        "price": "500",
        "priceCurrency": "PHP"
      },
      {
        "@type": "Offer",
        "name": "Alumni Registration",
        "price": "1000",
        "priceCurrency": "PHP"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/PGPGS Logo.png"
                alt="PGPGS Logo"
                width={40}
                height={40}
                className="rounded-full"
                priority
              />
              <div className="text-center sm:text-left">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  PGPGS Registration
                </h1>
                <p className="text-sm text-slate-600">50th Golden Anniversary</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Countdown Timer */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs font-medium text-purple-800">
                  <div className="flex items-center gap-1">
                    <span className="bg-purple-200 px-1 rounded">{timeLeft.days}d</span>
                    <span className="bg-purple-200 px-1 rounded">{timeLeft.hours}h</span>
                    <span className="bg-purple-200 px-1 rounded">{timeLeft.minutes}m</span>
                    <span className="bg-purple-200 px-1 rounded">{timeLeft.seconds}s</span>
                  </div>
                </div>
              </div>
              

              
              {/* Active Status */}
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-amber-800">Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 pt-28">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center lg:sticky lg:top-8">
            <div className="relative">
              <div className="relative overflow-hidden">
                <Image
                  src="/gold.png"
                  alt="PGPGS Gold Logo"
                  width={320}
                  height={320}
                  priority
                  className="animate-gold-float"
                />
                {/* Shining shimmer effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-gold-shimmer opacity-70"></div>
                </div>
              </div>
            </div>
                          <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Join Our Legacy</h3>
                <p className="text-slate-600 max-w-md">
                  Be part of our golden anniversary celebration and continue the tradition of excellence.
                </p>
                
                {/* Demo Notifications Button (for testing) */}
                <button
                  onClick={() => {
                    addNotification('info', 'ℹ️ Information', 'This is an informational notification with beautiful animations!', 4000);
                    setTimeout(() => addNotification('success', '✅ Success', 'Operation completed successfully!', 4000), 1000);
                    setTimeout(() => addNotification('warning', '⚠️ Warning', 'Please check your information before proceeding.', 4000), 2000);
                    setTimeout(() => addNotification('error', '❌ Error', 'Something went wrong. Please try again.', 4000), 3000);
                  }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  🎭 Demo Notifications
                </button>
              </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration Form</h3>
                <p className="text-slate-600">Please fill in your information to register for the event.</p>
              </div>

              <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>
                {/* Chapter Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Chapter
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={chapter}
                    onChange={e => setChapter(e.target.value)}
                    required
                    onBlur={() => setTouched(prev => ({ ...prev, chapter: true }))}
                  >
                    <option value="">Select Your Chapter</option>
                    {chapters.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {touched.chapter && !chapter && (
                    <p className="text-red-500 text-xs mt-1">Please select your chapter.</p>
                  )}
                </div>
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="firstName"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      required 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Middle Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="middleName"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                    />
                    {touched.middleName && errors.middleName && (
                      <p className="text-red-500 text-xs mt-1">{errors.middleName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="lastName"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      required 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                {/* Birth Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gender
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      required 
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Place of Birth
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="placeOfBirth"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      required 
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                    />
                  </div>
                </div>
                {/* Address Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Complete Address
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="address"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      placeholder="Street, Building, House Number"
                      required 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                    {touched.address && errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Region
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={selectedRegion}
                        onChange={e => setSelectedRegion(e.target.value)}
                        required
                      >
                        <option value="">Select Region</option>
                        {regions.map(region => (
                          <option key={region.code} value={region.code}>{region.name}</option>
                        ))}
                      </select>
                      {touched.region && errors.region && (
                        <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Province
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={selectedProvince}
                        onChange={e => setSelectedProvince(e.target.value)}
                        disabled={!selectedRegion}
                        required
                      >
                        <option value="">Select Province</option>
                        {provinces.map(province => (
                          <option key={province.code} value={province.code}>{province.name}</option>
                        ))}
                      </select>
                      {touched.province && errors.province && (
                        <p className="text-red-500 text-xs mt-1">{errors.province}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">City/Municipality
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                        disabled={!selectedProvince}
                        required
                      >
                        <option value="">Select City/Municipality</option>
                        {cities.map(city => (
                          <option key={city.code} value={city.code}>{city.name}</option>
                        ))}
                      </select>
                      {touched.cityMunicipality && errors.cityMunicipality && (
                        <p className="text-red-500 text-xs mt-1">{errors.cityMunicipality}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Barangay
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={selectedBarangay}
                        onChange={e => setSelectedBarangay(e.target.value)}
                        disabled={!selectedCity}
                        required
                      >
                        <option value="">Select Barangay</option>
                        {barangays.map(barangay => (
                          <option key={barangay.code} value={barangay.code}>{barangay.name}</option>
                        ))}
                      </select>
                      {touched.barangay && errors.barangay && (
                        <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Date of Survive */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Survive
                    <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="dateOfSurvive"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                    required 
                    value={formData.dateOfSurvive}
                    onChange={(e) => handleInputChange('dateOfSurvive', e.target.value)}
                  />
                  {touched.dateOfSurvive && errors.dateOfSurvive && (
                    <p className="text-red-500 text-xs mt-1">{errors.dateOfSurvive}</p>
                  )}
                </div>
                {/* Membership and Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Membership Type
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={membership}
                      onChange={e => setMembership(e.target.value)}
                      required
                      onBlur={() => setTouched(prev => ({ ...prev, membershipType: true }))}
                    >
                      <option value="">Select</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Member">Member</option>
                    </select>
                    {touched.membershipType && !membership && (
                      <p className="text-red-500 text-xs mt-1">Please select your membership type.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Registration Fee
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-slate-50 text-slate-700 font-semibold"
                        value={paymentAmount > 0 ? `₱${paymentAmount} PHP` : "Select membership type"}
                        readOnly
                        tabIndex={-1}
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="contactNumber"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      placeholder="09XX XXX XXXX"
                      required 
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    />
                    {touched.contactNumber && errors.contactNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                      placeholder="your.email@example.com"
                      required 
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                    />
                    {touched.emailAddress && errors.emailAddress && (
                      <p className="text-red-500 text-xs mt-1">{errors.emailAddress}</p>
                    )}
                  </div>
                </div>
                {/* Terms and Conditions */}
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={terms}
                      onChange={e => setTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                      I agree to the{" "}
                      <a 
                        href="/terms" 
                        target="_blank" 
                        className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                      >
                        Terms and Conditions
                      </a>{" "}
                      and confirm that all information provided is accurate.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!terms || isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none relative overflow-hidden"
                >
                  {isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                    </div>
                  )}
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting && (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                    <span>{isSubmitting ? "Processing Registration..." : "Complete Registration"}</span>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 text-white py-8 mt-16 border-t border-slate-700 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Image src="/PGPGS Logo.png" alt="PGPGS Logo" width={48} height={48} className="rounded-full border-2 border-indigo-400 shadow-md bg-white object-contain" />
            <div>
              <div className="font-extrabold text-lg tracking-wide text-indigo-200 drop-shadow">Pi Gamma Phi Gamma Sigma</div>
              <div className="text-xs text-slate-300 font-medium">Roxas City Capiz Chapter</div>
            </div>
          </div>
          {/* Copyright & Developer */}
          <div className="text-center md:text-right flex-1">
            <div className="text-sm font-medium text-slate-200">Developed by <a href="https://rollyparedes.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">Brother Rolly O. Paredes</a></div>
            <div className="text-xs text-slate-400 mt-1">© {new Date().getFullYear()} Pi Gamma Phi Gamma Sigma. All rights reserved.</div>
          </div>
          {/* Social/Contact Icons */}
          <div className="flex items-center gap-4">
            {/* Placeholder icons, replace hrefs with real links if needed */}
            <a href="https://www.facebook.com/profile.php?id=61577315199577" className="hover:text-indigo-400 transition-colors" title="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors" title="Email">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4m0-4V8" /></svg>
            </a>
          </div>
        </div>
      </footer>
      
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUp border border-gray-100 overflow-hidden">
            {/* Header with Golden Background */}
            <div className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-6 text-center overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-8 right-8 w-8 h-8 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-6 left-8 w-6 h-6 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-4 right-6 w-10 h-10 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              
              {/* Logo */}
              <div className="relative z-10 mb-4">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-lg">
                  <Image
                    src="/PGPGS Logo.png"
                    alt="PGPGS Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                    priority
                  />
                </div>
              </div>
              
              {/* Welcome Text */}
              <div className="relative z-10">
                <h1 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                  🎉 Welcome Brothers & Sisters! 🎉
                </h1>
                <h2 className="text-lg font-semibold text-white/90 mb-2">
                  Pi Gamma Phi Gamma Sigma
                </h2>
                <p className="text-sm text-white/80 font-medium">
                  Roxas City Capiz Chapter
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full mb-3">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  50th Golden Anniversary
                </h3>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Join us in celebrating our fraternity&apos;s <span className="font-bold text-amber-600">50th Golden Anniversary</span> on <span className="font-bold text-indigo-600">September 27, 2025</span>.
                  </p>
                  <p className="text-gray-600 text-xs">
                    Five decades of brotherhood, sisterhood, and shared values.
                  </p>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center">
                <button
                  onClick={() => setShowWelcomeModal(false)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  Register Now
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Let&apos;s make this golden anniversary unforgettable! ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto transform animate-slideUp border border-gray-100">
            {/* Celebration Header */}
            <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 text-center border-b border-green-100 rounded-t-3xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-6 left-8 w-4 h-4 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-4 right-6 w-5 h-5 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
              </div>
              
              {/* Success Icon with Animation */}
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Celebration Text */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    🎉 Registration Successful! 🎉
                  </h3>
                  <p className="text-lg text-gray-700 font-medium">
                    Welcome to the Pi Gamma Phi Gamma Sigma family!
                  </p>
                  <p className="text-gray-600">
                    Your registration for the 50th Golden Anniversary has been completed successfully.
                  </p>
                </div>
                
                {/* Registration ID Badge */}
                <div className="mt-6 inline-block">
                  <div className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-6 py-2 shadow-md">
                    <span className="text-sm font-semibold text-green-700">
                      Registration ID: REG-{Date.now().toString().slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registration Details Card */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Registration Summary</h4>
                </div>
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Personal Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Full Name:</span>
                        <span className="text-gray-900 font-semibold">{formData.firstName} {formData.middleName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Contact:</span>
                        <span className="text-gray-900">{formData.contactNumber}</span>
                      </div>
                      <div className="flex justify-between md:col-span-2">
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="text-gray-900">{formData.emailAddress}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Membership Information */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Membership Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Chapter:</span>
                        <span className="text-gray-900 font-semibold">{chapter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Type:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          membership === 'Alumni' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {membership}
                        </span>
                      </div>
                      <div className="flex justify-between md:col-span-2">
                        <span className="font-medium text-gray-600">Registration Fee:</span>
                        <span className="text-green-600 font-bold text-lg">₱{paymentAmount.toLocaleString()}.00</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Address Information */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Address Information
                    </h5>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Complete Address:</span>
                      </div>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">
                          {formData.address}, {barangays.find(b => b.code === selectedBarangay)?.name || selectedBarangay}, {cities.find(c => c.code === selectedCity)?.name || selectedCity}, {provinces.find(p => p.code === selectedProvince)?.name || selectedProvince}, {regions.find(r => r.code === selectedRegion)?.name || selectedRegion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-8 pt-0 space-y-4">
              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <div className="flex items-start">
                  <div className="w-5 h-5 text-amber-600 mr-3 mt-0.5">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h6 className="font-semibold text-amber-800 mb-1">Important Reminder</h6>
                    <p className="text-sm text-amber-700">
                      Please save this registration information. You may need to present proof of registration during the event.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Registration
                </span>
              </button>
              
              {/* Additional Info */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Thank you for joining the 50th Golden Anniversary celebration! 🎊
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Beautiful Animated Alert Notifications */}
      <div className="fixed top-4 right-4 z-[60] space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`relative transform transition-all duration-500 ease-out ${
              notification.show 
                ? 'translate-x-0 opacity-100 scale-100' 
                : 'translate-x-full opacity-0 scale-95'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Notification Card */}
            <div className={`
              relative overflow-hidden rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm
              ${notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                notification.type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                'bg-gradient-to-r from-blue-500 to-indigo-600'}
              text-white p-4 min-w-[320px] max-w-[400px]
            `}>
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-3 left-4 w-4 h-4 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center group"
              >
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start space-x-3">
                  {/* Animated Icon */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${notification.type === 'error' ? 'bg-red-400/30' :
                      notification.type === 'warning' ? 'bg-amber-400/30' :
                      notification.type === 'success' ? 'bg-green-400/30' :
                      'bg-blue-400/30'}
                    animate-bounce
                  `}>
                    {notification.type === 'error' && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                    {notification.type === 'warning' && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                    {notification.type === 'success' && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {notification.type === 'info' && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-sm mb-1">{notification.title}</h6>
                    <p className="text-sm opacity-90 leading-relaxed">{notification.message}</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-100 ease-linear ${
                          notification.type === 'error' ? 'bg-red-300' :
                          notification.type === 'warning' ? 'bg-amber-300' :
                          notification.type === 'success' ? 'bg-green-300' :
                          'bg-blue-300'
                        }`}
                        style={{
                          width: '100%',
                          animation: `shrink ${notification.duration}ms linear forwards`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
