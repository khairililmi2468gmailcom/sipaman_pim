import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('PIM_PUPUK_INDONESIA');

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    console.log(`Middleware invoked for path: ${pathname}`);

    const token = request.cookies.get('token')?.value;

    // Define public paths
    const publicPaths = ['/', '/api/user/Post'];
    const isPublicPath = publicPaths.some(path => pathname === path);

    console.log(`Is public path: ${isPublicPath}`);

    if (token) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            console.log('Token is valid:', payload);

            const userRole = payload.role; // Assuming the role is stored in the token payload

            // Restrict access to the /register page to only users with the 'admin' role
            if (pathname.startsWith('/register') && userRole !== 'admin') {
                console.log('Access denied: User is not an admin');
                return NextResponse.redirect(new URL('/beranda', request.url));
            }

            // If the user is trying to access a public path but they are already logged in, redirect to /beranda
            if (isPublicPath) {
                return NextResponse.redirect(new URL('/beranda', request.url));
            }
        } catch (err) {
            console.error('Token verification failed:', err.message);

            // If token verification fails, allow access to public paths
            if (isPublicPath) {
                return NextResponse.next();
            }

            // If the token is invalid and the user is trying to access a protected path, redirect to login
            return NextResponse.redirect(new URL('/', request.url));
        }
    } else if (!isPublicPath) {
        console.log('No token, redirecting to login');
        return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('Public path accessed, proceeding without authentication.');
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*', '/register/:path*', '/beranda/:path*', '/pemesanan/:path*', '/laporan/:path*', '/'], // Include the root path to protect it after login
};
