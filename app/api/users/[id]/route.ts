import { NextRequest, NextResponse } from 'next/server';
import { getUsersRef, User } from '../../db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const users = getUsersRef();
    const user = users.find((u: User) => u.id === params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const users = getUsersRef();
    const userIndex = users.findIndex((u: User) => u.id === params.id);
    if (userIndex === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    users[userIndex] = { id: params.id, name, email, password, role };
    console.log('User updated:', users[userIndex]);
    return NextResponse.json(users[userIndex]);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const users = getUsersRef();
    const userIndex = users.findIndex((u: User) => u.id === params.id);
    if (userIndex === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const deletedUser = users.splice(userIndex, 1)[0];
    console.log('User deleted:', deletedUser);
    return NextResponse.json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}