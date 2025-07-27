'use client';
import React, { Suspense } from 'react';

// Dynamic import to avoid SSR issues
const PDFDownloadButton = React.lazy(() => import('./RegistrationPDFjsPDF').then(module => ({ default: module.PDFDownloadButton })));

interface RegistrationData {
  chapter: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  region: string;
  province: string;
  cityMunicipality: string;
  barangay: string;
  dateOfSurvive: string;
  membershipType: string;
  paymentAmount: number;
  contactNumber: string;
  emailAddress: string;
  registrationDate: string;
}

export const PDFWrapper = ({ data }: { data: RegistrationData }) => {
  return (
    <Suspense fallback={
      <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center block">
        Loading PDF Generator...
      </button>
    }>
      <PDFDownloadButton data={data} />
    </Suspense>
  );
}; 