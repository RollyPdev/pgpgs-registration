'use client';
import { PDFWrapper } from '../../components/PDFWrapper';

export default function TestPDFPage() {
  const testData = {
    chapter: 'PGPGS Roxas City Capiz Chapter',
    firstName: 'Test',
    middleName: 'User',
    lastName: 'Example',
    dateOfBirth: '1990-01-01',
    placeOfBirth: 'Roxas City',
    address: 'Test Address',
    region: 'Region VI (Western Visayas)',
    province: 'Capiz',
    cityMunicipality: 'City of Roxas',
    barangay: 'Test Barangay',
    dateOfSurvive: '2020-01-01',
    membershipType: 'Alumni',
    paymentAmount: 1000,
    contactNumber: '09123456789',
    emailAddress: 'test@example.com',
    registrationDate: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">PDF Generation Test</h1>
        <p className="mb-4">Click the button below to test PDF generation:</p>
        <PDFWrapper data={testData} />
      </div>
    </div>
  );
} 