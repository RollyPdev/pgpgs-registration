'use client';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#1e293b',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 3,
  },
  goldBadge: {
    backgroundColor: '#fbbf24',
    padding: 8,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 15,
    alignSelf: 'center',
  },
  badgeText: {
    color: '#1e293b',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    borderBottom: '2 solid #fbbf24',
    paddingBottom: 3,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    padding: 5,
    borderRadius: 3,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    width: 120,
  },
  fieldValue: {
    fontSize: 9,
    color: '#0f172a',
    flex: 1,
  },
  termsSection: {
    backgroundColor: '#f0f9ff',
    border: '1 solid #3b82f6',
    padding: 15,
    marginTop: 15,
    borderRadius: 5,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  termsList: {
    fontSize: 8,
    color: '#1e3a8a',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  warningBox: {
    backgroundColor: '#fef2f2',
    border: '2 solid #ef4444',
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
  },
  warningText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: '#64748b',
    marginBottom: 2,
  },
});

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

const RegistrationPDF = ({ data }: { data: RegistrationData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Pi Gamma Phi Gamma Sigma</Text>
        <Text style={styles.subHeaderText}>Roxas City Capiz Chapter</Text>
        <Text style={styles.subHeaderText}>50th Golden Anniversary Registration Certificate</Text>
      </View>

      {/* Registration Badge */}
      <View style={styles.goldBadge}>
        <Text style={styles.badgeText}>OFFICIAL REGISTRATION</Text>
      </View>

      {/* Personal Information */}
      <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Chapter:</Text>
        <Text style={styles.fieldValue}>{data.chapter || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Full Name:</Text>
        <Text style={styles.fieldValue}>{`${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim() || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Date of Birth:</Text>
        <Text style={styles.fieldValue}>{data.dateOfBirth || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Place of Birth:</Text>
        <Text style={styles.fieldValue}>{data.placeOfBirth || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Date of Survive:</Text>
        <Text style={styles.fieldValue}>{data.dateOfSurvive || 'N/A'}</Text>
      </View>

      {/* Address Information */}
      <Text style={styles.sectionTitle}>ADDRESS INFORMATION</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Street Address:</Text>
        <Text style={styles.fieldValue}>{data.address || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Barangay:</Text>
        <Text style={styles.fieldValue}>{data.barangay || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>City/Municipality:</Text>
        <Text style={styles.fieldValue}>{data.cityMunicipality || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Province:</Text>
        <Text style={styles.fieldValue}>{data.province || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Region:</Text>
        <Text style={styles.fieldValue}>{data.region || 'N/A'}</Text>
      </View>

      {/* Registration Details */}
      <Text style={styles.sectionTitle}>REGISTRATION DETAILS</Text>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Membership Type:</Text>
        <Text style={styles.fieldValue}>{data.membershipType || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Registration Fee:</Text>
        <Text style={styles.fieldValue}>PHP {data.paymentAmount || 0}.00</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Contact Number:</Text>
        <Text style={styles.fieldValue}>{data.contactNumber || 'N/A'}</Text>
      </View>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Email Address:</Text>
        <Text style={styles.fieldValue}>{data.emailAddress || 'N/A'}</Text>
      </View>

      {/* Terms and Conditions */}
      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>TERMS AND CONDITIONS</Text>
        <Text style={styles.termsList}>1. This registration form serves as official proof of participation in the 50th Anniversary</Text>
        <Text style={styles.termsList}>2. Present this document to the organizer to receive your commemorative kits</Text>
        <Text style={styles.termsList}>3. All information provided must be accurate and complete</Text>
        <Text style={styles.termsList}>4. Registration fee is non-refundable once processed</Text>
        <Text style={styles.termsList}>5. Keep this form safe as replacement copies may not be available</Text>
      </View>

      {/* Warning */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>⚠️ WARNING: NO REGISTRATION FORM = NO ANNIVERSARY KITS</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated: {new Date().toLocaleString('en-PH')}</Text>
        <Text style={styles.footerText}>System Developer: Brother Rolly O. Paredes</Text>
        <Text style={styles.footerText}>© 2024 Pi Gamma Phi Gamma Sigma - All Rights Reserved</Text>
      </View>
    </Page>
  </Document>
);

export const PDFDownloadButton = ({ data }: { data: RegistrationData }) => {
  return (
    <PDFDownloadLink
      document={<RegistrationPDF data={data} />}
      fileName={`PGPGS_Registration_${data.firstName}_${data.lastName}.pdf`}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center block"
    >
      {({ loading, error }) => {
        if (error) {
          return 'Error generating PDF';
        }
        return loading ? 'Generating PDF...' : 'Download PDF Registration Form';
      }}
    </PDFDownloadLink>
  );
};
