// Input validation and sanitization utilities

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateUsername(username: string): boolean {
  // Username should be 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password: string): boolean {
  // Password should be at least 8 characters with at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digit characters except + for international format
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check for Philippine mobile number formats:
  // +63XXXXXXXXXX, 09XXXXXXXXX, 9XXXXXXXXX, +639XXXXXXXXX
  const phMobileRegex = /^(\+63|0)?9\d{9}$/;
  
  // Check for Philippine landline formats:
  // +63XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
  const phLandlineRegex = /^(\+63|0)?[2-8]\d{7}$/;
  
  // Check for international formats (7-15 digits)
  const internationalRegex = /^\+[1-9]\d{6,14}$/;
  
  return phMobileRegex.test(cleanPhone) || 
         phLandlineRegex.test(cleanPhone) || 
         internationalRegex.test(cleanPhone);
}

interface RegistrationData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  region?: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  dateOfSurvive?: string;
  chapter?: string;
  membership?: string;
  paymentAmount?: string | number;
  contactNumber?: string;
  emailAddress?: string;
}

export function sanitizeRegistrationData(data: RegistrationData) {
  return {
    firstName: sanitizeString(data.firstName || ''),
    middleName: data.middleName ? sanitizeString(data.middleName) : '',
    lastName: sanitizeString(data.lastName || ''),
    gender: sanitizeString(data.gender || ''),
    dateOfBirth: sanitizeString(data.dateOfBirth || ''),
    placeOfBirth: sanitizeString(data.placeOfBirth || ''),
    address: sanitizeString(data.address || ''),
    region: sanitizeString(data.region || ''),
    province: sanitizeString(data.province || ''),
    cityMunicipality: sanitizeString(data.cityMunicipality || ''),
    barangay: sanitizeString(data.barangay || ''),
    dateOfSurvive: sanitizeString(data.dateOfSurvive || ''),
    chapter: sanitizeString(data.chapter || ''),
    membership: sanitizeString(data.membership || ''),
    paymentAmount: parseInt(String(data.paymentAmount)) || 0,
    contactNumber: sanitizeString(data.contactNumber || ''),
    emailAddress: sanitizeString(data.emailAddress || '')
  };
} 