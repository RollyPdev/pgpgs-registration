import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
  }

  private addWatermark() {
    const watermarkText = 'PGPGS 50th Golden Anniversary';
    const watermarkText2 = 'Official Registration Document';
    
    // Set watermark properties
    this.doc.setTextColor(200, 200, 200);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    
    // Add diagonal watermark across the page using text positioning
    const centerX = this.pageWidth / 2;
    const centerY = this.pageHeight / 2;
    
    // Calculate diagonal text position
    const angle = -45;
    const radius = 50;
    const x1 = centerX + radius * Math.cos(angle * Math.PI / 180);
    const y1 = centerY + radius * Math.sin(angle * Math.PI / 180);
    const x2 = centerX + radius * Math.cos((angle + 180) * Math.PI / 180);
    const y2 = centerY + radius * Math.sin((angle + 180) * Math.PI / 180);
    
    // Add watermark text
    this.doc.text(watermarkText, centerX, centerY, { align: 'center', angle: angle });
    this.doc.text(watermarkText2, centerX, centerY + 20, { align: 'center', angle: angle });
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  private addHeader() {
    // Add logo placeholder (you can replace this with actual logo)
    this.doc.setFillColor(59, 130, 246); // Blue color
    this.doc.rect(this.margin, this.margin, this.pageWidth - 2 * this.margin, 25, 'F');
    
    // Add title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Pi Gamma Phi Gamma Sigma', this.pageWidth / 2, this.margin + 10, { align: 'center' });
    
    this.doc.setFontSize(14);
    this.doc.text('Roxas City Capiz Chapter', this.pageWidth / 2, this.margin + 18, { align: 'center' });
    
    // Add subtitle
    this.doc.setFontSize(12);
    this.doc.text('50th Golden Anniversary Registration', this.pageWidth / 2, this.margin + 25, { align: 'center' });
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  private addRegistrationInfo(data: RegistrationData) {
    let yPosition = this.margin + 40;
    
    // Section title
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Registration Information', this.margin, yPosition);
    yPosition += 10;
    
    // Add a line
    this.doc.setDrawColor(59, 130, 246);
    this.doc.line(this.margin, yPosition, this.pageWidth - this.margin, yPosition);
    yPosition += 8;
    
    // Reset font
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Personal Information
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Personal Information:', this.margin, yPosition);
    yPosition += 6;
    this.doc.setFont('helvetica', 'normal');
    
    const personalInfo = [
      { label: 'Chapter:', value: data.chapter },
      { label: 'Full Name:', value: `${data.firstName} ${data.middleName} ${data.lastName}`.trim() },
      { label: 'Date of Birth:', value: data.dateOfBirth },
      { label: 'Place of Birth:', value: data.placeOfBirth },
    ];
    
    personalInfo.forEach(info => {
      this.doc.text(`${info.label} ${info.value}`, this.margin, yPosition);
      yPosition += 5;
    });
    
    yPosition += 3;
    
    // Address Information
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Address Information:', this.margin, yPosition);
    yPosition += 6;
    this.doc.setFont('helvetica', 'normal');
    
    const addressInfo = [
      { label: 'Complete Address:', value: data.address },
      { label: 'Region:', value: data.region },
      { label: 'Province:', value: data.province },
      { label: 'City/Municipality:', value: data.cityMunicipality },
      { label: 'Barangay:', value: data.barangay },
    ];
    
    addressInfo.forEach(info => {
      this.doc.text(`${info.label} ${info.value}`, this.margin, yPosition);
      yPosition += 5;
    });
    
    yPosition += 3;
    
    // Membership Information
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Membership Information:', this.margin, yPosition);
    yPosition += 6;
    this.doc.setFont('helvetica', 'normal');
    
    const membershipInfo = [
      { label: 'Date of Survive:', value: data.dateOfSurvive },
      { label: 'Membership Type:', value: data.membershipType },
      { label: 'Registration Fee:', value: `PHP ${data.paymentAmount.toLocaleString()}` },
    ];
    
    membershipInfo.forEach(info => {
      this.doc.text(`${info.label} ${info.value}`, this.margin, yPosition);
      yPosition += 5;
    });
    
    yPosition += 3;
    
    // Contact Information
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Contact Information:', this.margin, yPosition);
    yPosition += 6;
    this.doc.setFont('helvetica', 'normal');
    
    const contactInfo = [
      { label: 'Contact Number:', value: data.contactNumber },
      { label: 'Email Address:', value: data.emailAddress },
    ];
    
    contactInfo.forEach(info => {
      this.doc.text(`${info.label} ${info.value}`, this.margin, yPosition);
      yPosition += 5;
    });
  }

  private addFooter() {
    const yPosition = this.pageHeight - 30;
    
    // Add a line
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, yPosition, this.pageWidth - this.margin, yPosition);
    
    // Footer text
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Registration Date: ${new Date().toLocaleDateString()}`, this.margin, yPosition + 5);
    this.doc.text('This is an official document of PGPGS Roxas City Capiz Chapter', this.pageWidth / 2, yPosition + 5, { align: 'center' });
    this.doc.text('Generated electronically', this.pageWidth - this.margin, yPosition + 5, { align: 'right' });
  }

  private addTermsAndConditions() {
    // Add a new page for terms
    this.doc.addPage();
    
    let yPosition = this.margin;
    
    // Title
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Terms and Conditions', this.pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Terms content
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const terms = [
      '1. Registration is open to all Pi Gamma Phi Gamma Sigma members and alumni.',
      '2. Participants must provide accurate and complete information.',
      '3. Registration fees are non-refundable except in cases of event cancellation.',
      '4. Personal information will be used solely for event organization.',
      '5. Participants must comply with all event rules and regulations.',
      '6. Professional conduct is expected from all participants.',
      '7. The organizing committee reserves the right to modify event details.',
      '8. Cancellation requests must be submitted at least 7 days before the event.',
      '9. Participants are responsible for their own safety during the event.',
      '10. Photography and video recording may occur during the event.',
    ];
    
    terms.forEach(term => {
      if (yPosition > this.pageHeight - 50) {
        this.doc.addPage();
        yPosition = this.margin;
      }
      this.doc.text(term, this.margin, yPosition);
      yPosition += 6;
    });
  }

  public generatePDF(data: RegistrationData): void {
    // Add watermark to all pages
    this.addWatermark();
    
    // Add header
    this.addHeader();
    
    // Add registration information
    this.addRegistrationInfo(data);
    
    // Add footer
    this.addFooter();
    
    // Add terms and conditions page
    this.addTermsAndConditions();
    
    // Save the PDF
    const fileName = `PGPGS_Registration_${data.firstName}_${data.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(fileName);
  }

  public async generatePDFFromForm(formElement: HTMLElement): Promise<void> {
    try {
      // Create a temporary container for the form
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.backgroundColor = 'white';
      container.style.padding = '20px';
      container.style.fontFamily = 'Arial, sans-serif';
      
      // Clone the form
      const formClone = formElement.cloneNode(true) as HTMLElement;
      container.appendChild(formClone);
      document.body.appendChild(container);
      
      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary container
      document.body.removeChild(container);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add watermark
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      const centerX = pdf.internal.pageSize.getWidth() / 2;
      const centerY = pdf.internal.pageSize.getHeight() / 2;
      pdf.text('PGPGS 50th Golden Anniversary', centerX, centerY, { align: 'center', angle: -45 });
      pdf.text('Official Registration Document', centerX, centerY + 20, { align: 'center', angle: -45 });
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      const fileName = `PGPGS_Registration_Form_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}

export default PDFGenerator; 