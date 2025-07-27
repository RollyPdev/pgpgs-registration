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
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Professional color palette
  const colors = {
    primary: [25, 46, 94],      // Deep navy blue
    secondary: [184, 134, 11],   // Professional gold
    accent: [59, 130, 246],      // Modern blue
    text: [15, 23, 42],          // Dark slate
    lightText: [71, 85, 105],    // Medium slate
    background: [248, 250, 252], // Light gray
    success: [34, 197, 94],      // Green
    border: [226, 232, 240]      // Light border
  };

  // Helper function to add decorative border
  const addDecorativeBorder = () => {
    // Outer border
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Inner decorative border
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
    
    // Corner decorations
    const cornerSize = 15;
    doc.setFillColor(...colors.secondary);
    // Top corners
    doc.rect(15, 15, cornerSize, 2, 'F');
    doc.rect(15, 15, 2, cornerSize, 'F');
    doc.rect(pageWidth - 30, 15, cornerSize, 2, 'F');
    doc.rect(pageWidth - 17, 15, 2, cornerSize, 'F');
    // Bottom corners
    doc.rect(15, pageHeight - 17, cornerSize, 2, 'F');
    doc.rect(15, pageHeight - 30, 2, cornerSize, 'F');
    doc.rect(pageWidth - 30, pageHeight - 17, cornerSize, 2, 'F');
    doc.rect(pageWidth - 17, pageHeight - 30, 2, cornerSize, 'F');
  };

  // Helper function to add professional field row
  const addFieldRow = (label: string, value: string, y: number, isHighlight: boolean = false) => {
    const labelWidth = 60;
    const valueWidth = contentWidth - labelWidth - 15;
    const rowHeight = 14;
    
    // Background for field row
    if (isHighlight) {
      doc.setFillColor(254, 249, 195); // Light yellow highlight
      doc.setDrawColor(...colors.secondary);
      doc.setLineWidth(0.5);
      doc.rect(margin, y - 3, contentWidth, rowHeight, 'FD');
    } else {
      doc.setFillColor(...colors.background);
      doc.rect(margin, y - 3, contentWidth, rowHeight, 'F');
    }
    
    // Add subtle shadow effect
    doc.setFillColor(0, 0, 0, 0.05);
    doc.rect(margin + 1, y - 2, contentWidth, rowHeight, 'F');
    
    // Label with icon-like bullet
    doc.setFillColor(...colors.primary);
    doc.circle(margin + 5, y + 3, 1.5, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.lightText);
    doc.text(label, margin + 10, y + 4);
    
    // Value
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    const valueLines = doc.splitTextToSize(value || 'N/A', valueWidth);
    doc.text(valueLines, margin + labelWidth + 10, y + 4);
    
    return Math.max(rowHeight, valueLines.length * 5) + 2;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number) => {
    // Section background
    doc.setFillColor(...colors.primary);
    doc.rect(margin, y, contentWidth, 18, 'F');
    
    // Gradient effect simulation
    doc.setFillColor(25, 46, 94, 0.8);
    doc.rect(margin, y, contentWidth, 9, 'F');
    
    // Section title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 8, y + 12);
    
    // Decorative line
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(2);
    doc.line(margin + 8, y + 15, margin + 80, y + 15);
    
    return 25;
  };

  // Add decorative border
  addDecorativeBorder();
  
  yPosition = 35; // Start after border
  
  // Professional Header with gradient effect
  const headerHeight = 45;
  
  // Main header background
  doc.setFillColor(...colors.primary);
  doc.rect(margin, yPosition, contentWidth, headerHeight, 'F');
  
  // Gradient effect simulation
  doc.setFillColor(25, 46, 94, 0.9);
  doc.rect(margin, yPosition, contentWidth, headerHeight / 2, 'F');
  
  // Header border
  doc.setDrawColor(...colors.secondary);
  doc.setLineWidth(3);
  doc.rect(margin, yPosition, contentWidth, headerHeight, 'D');
  
  // Organization name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Pi Gamma Phi Gamma Sigma', pageWidth / 2, yPosition + 15, { align: 'center' });
  
  // Chapter and event info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Roxas City Capiz Chapter', pageWidth / 2, yPosition + 25, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.secondary);
  doc.text('50th Golden Anniversary Registration Certificate', pageWidth / 2, yPosition + 35, { align: 'center' });
  
  yPosition += headerHeight + 15;

  // Professional Certificate Badge
  const badgeWidth = 120;
  const badgeHeight = 20;
  const badgeX = pageWidth / 2 - badgeWidth / 2;
  
  // Badge shadow
  doc.setFillColor(0, 0, 0, 0.1);
  doc.roundedRect(badgeX + 2, yPosition + 2, badgeWidth, badgeHeight, 5, 5, 'F');
  
  // Badge background
  doc.setFillColor(...colors.secondary);
  doc.roundedRect(badgeX, yPosition, badgeWidth, badgeHeight, 5, 5, 'F');
  
  // Badge border
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(1);
  doc.roundedRect(badgeX, yPosition, badgeWidth, badgeHeight, 5, 5, 'D');
  
  // Badge text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL REGISTRATION', pageWidth / 2, yPosition + 13, { align: 'center' });
  
  // Registration ID (timestamp-based)
  const regId = `REG-${Date.now().toString().slice(-8)}`;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.lightText);
  doc.text(`Registration ID: ${regId}`, pageWidth / 2, yPosition + 35, { align: 'center' });
  
  yPosition += 50;

  // Personal Information Section
  yPosition += addSectionHeader('PERSONAL INFORMATION', yPosition);

  // Personal Information Fields with improved spacing
  yPosition += addFieldRow('Chapter:', data.chapter, yPosition, true) + 3;
  yPosition += addFieldRow('Full Name:', `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim(), yPosition, true) + 3;
  yPosition += addFieldRow('Date of Birth:', new Date(data.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), yPosition) + 3;
  yPosition += addFieldRow('Place of Birth:', data.placeOfBirth, yPosition) + 3;
  yPosition += addFieldRow('Date of Survive:', new Date(data.dateOfSurvive).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), yPosition) + 8;

  // Address Information Section
  yPosition += addSectionHeader('ADDRESS INFORMATION', yPosition);

  // Address Fields with better formatting
  yPosition += addFieldRow('Street Address:', data.address, yPosition) + 3;
  yPosition += addFieldRow('Barangay:', data.barangay, yPosition) + 3;
  yPosition += addFieldRow('City/Municipality:', data.cityMunicipality, yPosition) + 3;
  yPosition += addFieldRow('Province:', data.province, yPosition) + 3;
  yPosition += addFieldRow('Region:', data.region, yPosition) + 8;

  // Registration Details Section
  yPosition += addSectionHeader('REGISTRATION DETAILS', yPosition);

  // Registration Fields with highlights for important info
  yPosition += addFieldRow('Membership Type:', data.membershipType, yPosition, true) + 3;
  yPosition += addFieldRow('Registration Fee:', `₱${(data.paymentAmount || 0).toLocaleString()}.00 PHP`, yPosition, true) + 3;
  yPosition += addFieldRow('Contact Number:', data.contactNumber, yPosition) + 3;
  yPosition += addFieldRow('Email Address:', data.emailAddress, yPosition) + 3;
  yPosition += addFieldRow('Registration Date:', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), yPosition) + 8;

  // Professional Terms and Conditions Section
  const termsHeight = 55;
  
  // Terms background with gradient effect
  doc.setFillColor(240, 249, 255);
  doc.rect(margin, yPosition, contentWidth, termsHeight, 'F');
  
  // Terms border
  doc.setDrawColor(...colors.accent);
  doc.setLineWidth(2);
  doc.rect(margin, yPosition, contentWidth, termsHeight, 'D');
  
  // Left border accent
  doc.setFillColor(...colors.accent);
  doc.rect(margin, yPosition, 4, termsHeight, 'F');
  
  // Terms header
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text('TERMS AND CONDITIONS', margin + 10, yPosition + 12);
  
  // Terms content with better formatting
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.text);
  
  const terms = [
    '• This registration form serves as official proof of participation in the 50th Anniversary celebration',
    '• Present this document to the organizer committee to receive your commemorative kits and materials',
    '• All information provided must be accurate and complete for proper event coordination',
    '• Registration fee is non-refundable once processed and confirmed by the organizing committee',
    '• Keep this form safe as replacement copies may not be available on the event day'
  ];
  
  let termY = yPosition + 20;
  terms.forEach(term => {
    const lines = doc.splitTextToSize(term, contentWidth - 20);
    doc.text(lines, margin + 10, termY);
    termY += lines.length * 4 + 2;
  });
  
  yPosition += termsHeight + 10;

  // Professional Warning Box
  const warningHeight = 25;
  
  // Warning shadow
  doc.setFillColor(0, 0, 0, 0.1);
  doc.roundedRect(margin + 2, yPosition + 2, contentWidth, warningHeight, 5, 5, 'F');
  
  // Warning background
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, yPosition, contentWidth, warningHeight, 5, 5, 'F');
  
  // Warning border
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(2);
  doc.roundedRect(margin, yPosition, contentWidth, warningHeight, 5, 5, 'D');
  
  // Warning icon area
  doc.setFillColor(239, 68, 68);
  doc.rect(margin, yPosition, 8, warningHeight, 'F');
  
  // Warning text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('⚠️ IMPORTANT NOTICE', margin + 12, yPosition + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('NO REGISTRATION FORM = NO ANNIVERSARY KITS', margin + 12, yPosition + 18);
  
  yPosition += warningHeight + 15;

  // Professional Footer
  const footerY = pageHeight - 45;
  
  // Footer separator line with gradient effect
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(1);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setDrawColor(...colors.secondary);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY + 1, pageWidth - margin, footerY + 1);
  
  // Footer content with better organization
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.lightText);
  
  // Left side - Generation info
  doc.text(`Document Generated: ${new Date().toLocaleString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, footerY + 8);
  
  doc.text('System Developer: Brother Rolly O. Paredes', margin, footerY + 15);
  
  // Right side - Copyright
  doc.setFont('helvetica', 'bold');
  doc.text('© 2024 Pi Gamma Phi Gamma Sigma', pageWidth - margin, footerY + 8, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('All Rights Reserved', pageWidth - margin, footerY + 15, { align: 'right' });
  
  // Center - Verification info
  doc.setFontSize(7);
  doc.setTextColor(...colors.accent);
  doc.text('This is an electronically generated document', pageWidth / 2, footerY + 25, { align: 'center' });
  doc.text('Verify authenticity at pgpgs.rollyparedes.net', pageWidth / 2, footerY + 30, { align: 'center' });

  // Save the PDF with professional naming
  const fileName = `PGPGS_50th_Anniversary_Registration_${data.firstName}_${data.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
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
      {isGenerating ? 'Generating Professional PDF...' : '📄 Download Professional Registration Certificate'}
    </button>
  );
}; 