import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - Get a specific registration by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id }
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a registration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 });
    }

    const body = await request.json();
    
    // Check if registration exists
    const existingRegistration = await prisma.registration.findUnique({
      where: { id }
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Update the registration
    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: {
        firstName: body.firstName,
        middleName: body.middleName,
        lastName: body.lastName,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth,
        placeOfBirth: body.placeOfBirth,
        address: body.address,
        region: body.region,
        province: body.province,
        city: body.cityMunicipality,
        barangay: body.barangay,
        dateOfSurvive: body.dateOfSurvive,
        chapter: body.chapter,
        membership: body.membership,
        paymentAmount: body.paymentAmount,
        contactNumber: body.contactNumber,
        emailAddress: body.emailAddress,
        status: body.status,
        confirmedBy: body.confirmedBy,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedRegistration);
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 });
    }

    // Check if registration exists
    const existingRegistration = await prisma.registration.findUnique({
      where: { id }
    });

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Delete the registration
    await prisma.registration.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 