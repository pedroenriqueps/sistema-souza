import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/stock', '/'];

export function middleware(request: NextRequest) {
    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/user/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/stock/:path*', '/'],
};
