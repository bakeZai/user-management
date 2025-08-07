import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('userRole')?.value;
  const pathname = request.nextUrl.pathname;

  console.log('Middleware: Checking path:', pathname, 'Role:', role); // Отладка

  // Пропускаем указанные маршруты
  if (
    pathname === '/users/login' ||
    pathname === '/unauthorized' ||
    pathname === '/'||
    pathname === '/users/register' 
  ) {
    console.log('Middleware: Skipping path:', pathname);
    return NextResponse.next();
  }

  // Проверяем защищённые маршруты
  if (pathname.startsWith('/users') && pathname.startsWith('/games') && (!role || role !== 'admin')) {
    console.log('Middleware: Redirecting to /unauthorized from:', pathname);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/users/:path*'],
};