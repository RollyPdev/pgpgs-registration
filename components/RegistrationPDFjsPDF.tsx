'use client';
import React from 'react';
import jsPDF from 'jspdf';

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

const generatePDF = (data: RegistrationData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add text with proper wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, fontStyle: string = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.4); // Return height used
  };

  // Helper function to add field row
  const addFieldRow = (label: string, value: string, y: number) => {
    const labelWidth = 50;
    const valueWidth = contentWidth - labelWidth - 10;
    
    // Background for field row
    doc.setFillColor(248, 250, 252); // #f8fafc
    doc.rect(margin, y - 2, contentWidth, 12, 'F');
    
    // Label
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105); // #475569
    doc.text(label, margin + 2, y + 3);
    
    // Value
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42); // #0f172a
    const valueLines = doc.splitTextToSize(value || 'N/A', valueWidth);
    doc.text(valueLines, margin + labelWidth + 5, y + 3);
    
    return Math.max(12, valueLines.length * 4);
  };

  // Header
  doc.setFillColor(30, 41, 59); // #1e293b
  doc.rect(margin, yPosition, contentWidth, 25, 'F');
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Pi Gamma Phi Gamma Sigma', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Roxas City Capiz Chapter', pageWidth / 2, yPosition + 15, { align: 'center' });
  doc.text('50th Golden Anniversary Registration Certificate', pageWidth / 2, yPosition + 22, { align: 'center' });
  
  yPosition += 35;

  // Gold Badge
  doc.setFillColor(251, 191, 36); // #fbbf24
  doc.rect(pageWidth / 2 - 40, yPosition, 80, 12, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // #1e293b
  doc.text('OFFICIAL REGISTRATION', pageWidth / 2, yPosition + 8, { align: 'center' });
  
  yPosition += 25;

  // Personal Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // #1e293b
  doc.text('PERSONAL INFORMATION', margin, yPosition);
  
  // Underline
  doc.setDrawColor(251, 191, 36); // #fbbf24
  doc.setLineWidth(2);
  doc.line(margin, yPosition + 2, margin + 80, yPosition + 2);
  
  yPosition += 15;

  // Personal Information Fields
  yPosition += addFieldRow('Chapter:', data.chapter, yPosition) + 2;
  yPosition += addFieldRow('Full Name:', `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim(), yPosition) + 2;
  yPosition += addFieldRow('Date of Birth:', data.dateOfBirth, yPosition) + 2;
  yPosition += addFieldRow('Place of Birth:', data.placeOfBirth, yPosition) + 2;
  yPosition += addFieldRow('Date of Survive:', data.dateOfSurvive, yPosition) + 5;

  // Address Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('ADDRESS INFORMATION', margin, yPosition);
  
  // Underline
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(2);
  doc.line(margin, yPosition + 2, margin + 80, yPosition + 2);
  
  yPosition += 15;

  // Address Fields
  yPosition += addFieldRow('Street Address:', data.address, yPosition) + 2;
  yPosition += addFieldRow('Barangay:', data.barangay, yPosition) + 2;
  yPosition += addFieldRow('City/Municipality:', data.cityMunicipality, yPosition) + 2;
  yPosition += addFieldRow('Province:', data.province, yPosition) + 2;
  yPosition += addFieldRow('Region:', data.region, yPosition) + 5;

  // Registration Details Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('REGISTRATION DETAILS', margin, yPosition);
  
  // Underline
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(2);
  doc.line(margin, yPosition + 2, margin + 80, yPosition + 2);
  
  yPosition += 15;

  // Registration Fields
  yPosition += addFieldRow('Membership Type:', data.membershipType, yPosition) + 2;
  yPosition += addFieldRow('Registration Fee:', `PHP ${data.paymentAmount || 0}.00`, yPosition) + 2;
  yPosition += addFieldRow('Contact Number:', data.contactNumber, yPosition) + 2;
  yPosition += addFieldRow('Email Address:', data.emailAddress, yPosition) + 5;

  // Terms and Conditions Section
  doc.setFillColor(240, 249, 255); // #f0f9ff
  doc.setDrawColor(59, 130, 246); // #3b82f6
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, contentWidth, 45, 'FD');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // #1e40af
  doc.text('TERMS AND CONDITIONS', margin + 5, yPosition + 8);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 58, 138); // #1e3a8a
  doc.text('1. This registration form serves as official proof of participation in the 50th Anniversary', margin + 5, yPosition + 15);
  doc.text('2. Present this document to the organizer to receive your commemorative kits', margin + 5, yPosition + 19);
  doc.text('3. All information provided must be accurate and complete', margin + 5, yPosition + 23);
  doc.text('4. Registration fee is non-refundable once processed', margin + 5, yPosition + 27);
  doc.text('5. Keep this form safe as replacement copies may not be available', margin + 5, yPosition + 31);
  
  yPosition += 50;

  // Warning Box
  doc.setFillColor(254, 242, 242); // #fef2f2
  doc.setDrawColor(239, 68, 68); // #ef4444
  doc.setLineWidth(2);
  doc.rect(margin, yPosition, contentWidth, 15, 'FD');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // #dc2626
  doc.text('⚠️ WARNING: NO REGISTRATION FORM = NO ANNIVERSARY KITS', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  yPosition += 20;

  // Footer
  const footerY = pageHeight - 30;
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setLineWidth(1);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // #64748b
  doc.text(`Generated: ${new Date().toLocaleString('en-PH')}`, margin, footerY + 5);
  doc.text('System Developer: Brother Rolly O. Paredes', margin, footerY + 9);
  doc.text('© 2024 Pi Gamma Phi Gamma Sigma - All Rights Reserved', margin, footerY + 13);

  // Save the PDF
  const fileName = `PGPGS_Registration_${data.firstName}_${data.lastName}.pdf`;
  doc.save(fileName);
};

export const PDFDownloadButton = ({ data }: { data: RegistrationData }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      generatePDF(data);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center block disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? 'Generating PDF...' : 'Download PDF Registration Form'}
    </button>
  );
}; 