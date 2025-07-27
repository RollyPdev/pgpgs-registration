"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { PDFWrapper } from "../components/PDFWrapper";

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
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  
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
    }, 2500);
    
    // Load regions on component mount
    fetch('https://psgc.cloud/api/regions')
      .then(res => res.json())
      .then((data: AddressData[]) => setRegions(data))
      .catch(err => console.error('Error loading regions:', err));
    
    // Fetch actual registration count from database
    fetchRegistrationCount();
    
    return () => clearTimeout(timer);
  }, []);

  // Function to fetch actual registration count and status breakdown
  const fetchRegistrationCount = async () => {
    try {
      const response = await fetch('/api/registrations');
      if (response.ok) {
        const registrations = await response.json();
        
        // Calculate status breakdown
        const approved = registrations.filter((reg: { status: string }) => reg.status === 'Approved').length;
        const pending = registrations.filter((reg: { status: string }) => reg.status === 'Pending').length;
        
        setApprovedCount(approved);
        setPendingCount(pending);
      }
    } catch (error) {
      console.error('Error fetching registration count:', error);
    }
  };
  
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
      alert('Please accept the terms and conditions to continue.');
      return;
    }

    setIsSubmitting(true);

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
        alert(`⚠️ Registration Error: ${errorData.error}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        alert(`⚠️ Registration Error: ${errorData.error || 'Failed to submit registration'}`);
        return;
      }

      const result = await response.json();
      console.log('Success result:', result);

      // Show success message
      setShowSuccess(true);
      // Refresh registration count from database
      fetchRegistrationCount();

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
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

  return (
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
              
              {/* Registration Status */}
              <div className="flex items-center gap-4">
                {/* Approved Registrants */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs font-medium text-green-800">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{approvedCount.toLocaleString()}</span>
                      <span className="text-xs opacity-75">Approved</span>
                    </div>
                  </div>
                </div>
                
                {/* Pending Registrants */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border border-amber-200">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs font-medium text-amber-800">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{pendingCount.toLocaleString()}</span>
                      <span className="text-xs opacity-75">Pending</span>
                    </div>
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
            <img src="/PGPGS Logo.png" alt="PGPGS Logo" className="w-12 h-12 rounded-full border-2 border-indigo-400 shadow-md bg-white object-contain" />
            <div>
              <div className="font-extrabold text-lg tracking-wide text-indigo-200 drop-shadow">Pi Gamma Phi Gamma Sigma</div>
              <div className="text-xs text-slate-300 font-medium">Roxas City Capiz Chapter</div>
            </div>
          </div>
          {/* Copyright & Developer */}
          <div className="text-center md:text-right flex-1">
            <div className="text-sm font-medium text-slate-200">Developed by <span className="font-semibold text-indigo-300">Brother Rolly O. Paredes</span></div>
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
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 text-center border-b border-slate-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h3>
              <p className="text-slate-600">
                Your registration has been completed successfully.
              </p>
            </div>
            
            {/* Registration Preview */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Registration Preview</h4>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium text-slate-600">Name:</span> {formData.firstName} {formData.middleName} {formData.lastName}</div>
                  <div><span className="font-medium text-slate-600">Chapter:</span> {chapter}</div>
                  <div><span className="font-medium text-slate-600">Membership:</span> {membership}</div>
                  <div><span className="font-medium text-slate-600">Fee:</span> ₱{paymentAmount}.00</div>
                  <div><span className="font-medium text-slate-600">Contact:</span> {formData.contactNumber}</div>
                  <div><span className="font-medium text-slate-600">Email:</span> {formData.emailAddress}</div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div><span className="font-medium text-slate-600">Address:</span> {formData.address}, {barangays.find(b => b.code === selectedBarangay)?.name || selectedBarangay}, {cities.find(c => c.code === selectedCity)?.name || selectedCity}, {provinces.find(p => p.code === selectedProvince)?.name || selectedProvince}, {regions.find(r => r.code === selectedRegion)?.name || selectedRegion}</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 space-y-3">
              <div className="w-full">
                <PDFWrapper
                  data={{
                    chapter,
                    firstName: formData.firstName,
                    middleName: formData.middleName,
                    lastName: formData.lastName,
                    dateOfBirth: formData.dateOfBirth,
                    placeOfBirth: formData.placeOfBirth,
                    address: formData.address,
                    region: regions.find(r => r.code === selectedRegion)?.name || '',
                    province: provinces.find(p => p.code === selectedProvince)?.name || '',
                    cityMunicipality: cities.find(c => c.code === selectedCity)?.name || '',
                    barangay: barangays.find(b => b.code === selectedBarangay)?.name || '',
                    dateOfSurvive: formData.dateOfSurvive,
                    membershipType: membership,
                    paymentAmount,
                    contactNumber: formData.contactNumber,
                    emailAddress: formData.emailAddress,
                    registrationDate: new Date().toISOString().split('T')[0]
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
