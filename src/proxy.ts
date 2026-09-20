import {NextRequest, NextResponse} from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get('session_token')?.value

    const {pathname} = request.nextUrl;

    const isAuthRoute = pathname.startsWith('/login');
    const isProtectedRoute = pathname.startsWith('/dashboard');

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
