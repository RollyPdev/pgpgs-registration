import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Image,
} from '@react-pdf/renderer';

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

// Register fonts for better typography
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfB.ttf', fontWeight: 'bold' },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    position: 'relative',
    size: 'A4',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    color: '#f0f0f0',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 0.3,
    zIndex: 1,
  },
  header: {
    backgroundColor: '#1e40af',
    padding: 20,
    marginBottom: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 3,
    textAlign: 'center',
  },
  headerEvent: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    borderBottom: '2px solid #1e40af',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  field: {
    flex: 1,
    minWidth: '45%',
    marginRight: 10,
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3,
  },
  value: {
    fontSize: 11,
    color: '#111827',
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    border: '1px solid #e5e7eb',
  },
  fullWidth: {
    width: '100%',
    marginBottom: 8,
  },
  paymentHighlight: {
    backgroundColor: '#fef3c7',
    border: '2px solid #f59e0b',
    borderRadius: 6,
    padding: 10,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
  },
  importantNotice: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fef3c7',
    border: '2px solid #f59e0b',
    borderRadius: 8,
    borderLeft: '6px solid #f59e0b',
  },
  importantTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
    textAlign: 'center',
  },
  importantText: {
    fontSize: 11,
    color: '#92400e',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  warningBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fee2e2',
    border: '2px solid #ef4444',
    borderRadius: 6,
    borderLeft: '6px solid #ef4444',
  },
  warningText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991b1b',
    textAlign: 'center',
  },
  termsPage: {
    padding: 30,
  },
  termsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e40af',
  },
  termsText: {
    fontSize: 10,
    marginBottom: 8,
    lineHeight: 1.4,
    color: '#374151',
  },
  termsNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
  },
});

// Watermark Component
const Watermark = () => (
  <View style={styles.watermark}>
    <Text>PGPGS 50th Golden Anniversary</Text>
    <Text>Official Registration Document</Text>
  </View>
);

// Header Component
const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Pi Gamma Phi Gamma Sigma</Text>
    <Text style={styles.headerSubtitle}>Roxas City Capiz Chapter</Text>
    <Text style={styles.headerEvent}>50th Golden Anniversary Registration</Text>
  </View>
);

// Registration Information Component
const RegistrationInfo = ({ data }: { data: RegistrationData }) => (
  <View style={styles.content}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Registration Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Chapter</Text>
            <Text style={styles.value}>{data.chapter}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>
              {`${data.firstName} ${data.middleName} ${data.lastName}`.trim()}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>{data.dateOfBirth}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Place of Birth</Text>
            <Text style={styles.value}>{data.placeOfBirth}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address Information</Text>
        <View style={styles.fullWidth}>
          <Text style={styles.label}>Complete Address</Text>
          <Text style={styles.value}>{data.address}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Region</Text>
            <Text style={styles.value}>{data.region}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Province</Text>
            <Text style={styles.value}>{data.province}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>City/Municipality</Text>
            <Text style={styles.value}>{data.cityMunicipality}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Barangay</Text>
            <Text style={styles.value}>{data.barangay}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Membership Information</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Date of Survive</Text>
            <Text style={styles.value}>{data.dateOfSurvive}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Membership Type</Text>
            <Text style={styles.value}>{data.membershipType}</Text>
          </View>
        </View>
        <View style={styles.paymentHighlight}>
          <Text style={styles.paymentText}>
            Registration Fee: ₱{data.paymentAmount.toLocaleString()} PHP
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Contact Number</Text>
            <Text style={styles.value}>{data.contactNumber}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>{data.emailAddress}</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// Footer Component
const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Registration Date: {new Date().toLocaleDateString()}
    </Text>
    <Text style={styles.footerText}>
      This is an official document of PGPGS Roxas City Capiz Chapter
    </Text>
    <Text style={styles.footerText}>
      Generated electronically on {new Date().toLocaleString()}
    </Text>
    
    {/* Important Notice */}
    <View style={styles.importantNotice}>
      <Text style={styles.importantTitle}>IMPORTANT NOTICE</Text>
      <Text style={styles.importantText}>
        Save or Print this Registration Form. Present this document to the 50th Anniversary Organizer Committee to receive your commemorative kits.
      </Text>
    </View>
    
    {/* Warning Box */}
    <View style={styles.warningBox}>
      <Text style={styles.warningText}>
        ⚠️ WARNING: NO REGISTRATION FORM, NO KITS!
      </Text>
    </View>
  </View>
);

// Terms and Conditions Component
const TermsAndConditions = () => (
  <View style={styles.termsPage}>
    <Text style={styles.termsTitle}>Terms and Conditions</Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>1. </Text>
      Registration is open to all Pi Gamma Phi Gamma Sigma members and alumni from recognized chapters.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>2. </Text>
      Participants must provide accurate and complete information during registration.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>3. </Text>
      False or misleading information may result in registration cancellation.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>4. </Text>
      Registration fees are non-refundable except in cases of event cancellation by the organizers.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>5. </Text>
      Personal information collected will be used solely for event organization and communication purposes.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>6. </Text>
      Your data will be handled in accordance with the Data Privacy Act of 2012.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>7. </Text>
      Registered participants must comply with all event rules and regulations.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>8. </Text>
      The organizing committee reserves the right to modify event details with prior notice.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>9. </Text>
      Participants are responsible for their own safety and well-being during the event.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>10. </Text>
      Professional conduct is expected from all participants.
    </Text>
    
    <Text style={styles.termsText}>
      <Text style={styles.termsNumber}>11. </Text>
      Photography and video recording may occur during the event for documentation purposes.
    </Text>
  </View>
);

// Main Document Component
const RegistrationDocument = ({ data }: { data: RegistrationData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Watermark />
      <Header />
      <RegistrationInfo data={data} />
      <Footer />
    </Page>
    
    <Page size="A4" style={styles.termsPage}>
      <Watermark />
      <TermsAndConditions />
    </Page>
  </Document>
);

// PDF Download Component
export const PDFDownloadButton = ({ data }: { data: RegistrationData }) => (
  <PDFDownloadLink
    document={<RegistrationDocument data={data} />}
    fileName={`PGPGS_Registration_${data.firstName}_${data.lastName}_${new Date().toISOString().split('T')[0]}.pdf`}
    style={{
      backgroundColor: '#1e40af',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 'bold',
      display: 'inline-block',
      textAlign: 'center',
    }}
  >
    {({ blob, url, loading, error }) =>
      loading ? 'Generating PDF...' : 'Download Registration PDF'
    }
  </PDFDownloadLink>
);

export default RegistrationDocument; 