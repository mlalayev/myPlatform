import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
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
      const existingUserWithUsername = await prisma.user.findFirst({
        where: { username }
      });
      
      if (existingUserWithUsername && existingUserWithUsername.id !== currentUser.id) {
        return NextResponse.json(
          { message: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        surname,
        username,
        email,
        phone: phone || null,
        avatarUrl: avatarUrl || null,
      }
    });

    // Return success response
    return NextResponse.json({
      message: 'Settings updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        surname: updatedUser.surname,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        phone: updatedUser.phone,
      }
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 