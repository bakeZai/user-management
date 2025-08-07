import { NextRequest, NextResponse } from 'next/server';
import { getUsersRef, User } from '../../db';

export async function GET(request: NextRequest) {
  try {
    const role = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const users = getUsersRef();
    const user = users.find((u: User) => u.role === role);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}