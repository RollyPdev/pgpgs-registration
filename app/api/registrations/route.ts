import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sanitizeRegistrationData, validateEmail, validatePhoneNumber } from '../../../lib/validation';

export async function POST(request: NextRequest) {
  console.log('=== REGISTRATION API CALLED ===');
  try {
    const rawData = await request.json();
    console.log('Raw received data:', JSON.stringify(rawData, null, 2));
    
    // Sanitize and validate input data
    const data = sanitizeRegistrationData(rawData);
    console.log('Sanitized data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.emailAddress || !data.contactNumber) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'First name, last name, email, and contact number are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(data.emailAddress)) {
      console.log('Validation failed - invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(data.contactNumber)) {
      console.log('Validation failed - invalid phone number format');
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate payment amount
    if (data.paymentAmount <= 0) {
      console.log('Validation failed - invalid payment amount:', data.paymentAmount);
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }
    
    // Check for duplicate registration
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        OR: [
          {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth
          },
          {
            emailAddress: data.emailAddress
          },
          {
            contactNumber: data.contactNumber
          }
        ]
      }
    });

    if (existingRegistration) {
      console.log('Duplicate registration found');
      return NextResponse.json(
        { error: 'Registration already exists with this name, email, or contact number' },
        { status: 409 }
      );
    }
    
    console.log('Creating registration with data:', data);
    const registration = await prisma.registration.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        placeOfBirth: data.placeOfBirth,
        address: data.address,
        region: data.region,
        province: data.province,
        city: data.cityMunicipality,
        barangay: data.barangay,
        dateOfSurvive: data.dateOfSurvive,
        chapter: data.chapter,
        membership: data.membership,
        paymentAmount: data.paymentAmount,
        contactNumber: data.contactNumber,
        emailAddress: data.emailAddress,
        status: 'Pending'
      }
    });

    console.log('Registration created successfully:', registration);
    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}