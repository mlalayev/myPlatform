import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../auth/authOptions';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has a password (might be Google user)
    if (!currentUser.passwordHash) {
      return NextResponse.json(
        { message: 'Cannot change password for Google account' },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.passwordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        passwordHash: newPasswordHash,
      }
    });

    return NextResponse.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 