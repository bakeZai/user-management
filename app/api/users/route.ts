import { NextRequest, NextResponse } from 'next/server';
import { getUsers, addUser, updateUser, deleteUser, User } from '../db';

export async function GET(request: NextRequest) {
  try {
    const users = getUsers();
    console.log('Fetched users:', users);
    return NextResponse.json(users);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role }: User = await request.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields (name, email, password, role) are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const users = getUsers();
    const existingUser = users.find((u: User) => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser: User = { id: Date.now().toString(), name, email, password, role };
    addUser(newUser);
    console.log('New user added:', newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, email, password, role }: User = await request.json();
    if (!id || !name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields (id, name, email, password, role) are required' }, { status: 400 });
    }
    if (password && password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const users = getUsers();
    const userIndex = users.findIndex((u: User) => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingUser = users.find((u: User) => u.email === email && u.id !== id);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists for another user' }, { status: 400 });
    }

    const updatedUser: User = { id, name, email, password: password || users[userIndex].password, role };
    updateUser(updatedUser);
    console.log('User updated:', updatedUser);
    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id }: { id: string } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const users = getUsers();
    const userIndex = users.findIndex((u: User) => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const deletedUser = users[userIndex];
    deleteUser(id);
    console.log('User deleted:', deletedUser);
    return NextResponse.json(deletedUser);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}