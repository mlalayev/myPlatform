import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../auth/authOptions';
import { prisma } from '@/lib/prisma';

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
    const { name, surname, username, email, phone, avatarUrl } = body;

    // Validate required fields
    if (!name || !surname || !username || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if username is available (if changed)
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUserWithEmail && existingUserWithEmail.id !== currentUser.id) {
        return NextResponse.json(
          { message: 'Email is already taken' },
          { status: 400 }
        );
      }
    }

    // Check if username is already taken by another user
    if (username !== currentUser.username) {
      const existingUserWithUsername = await prisma.user.findUnique({
        where: { username }
      });
      
      if (existingUserWithUsername && existingUserWithUsername.id !== currentUser.id) {
        return NextResponse.json(
          { message: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // Update user information
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        surname,
        username,
        email,
        phone: phone || null,
        avatarUrl: avatarUrl || null,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        email: true,
        phone: true,
        avatarUrl: true,
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 