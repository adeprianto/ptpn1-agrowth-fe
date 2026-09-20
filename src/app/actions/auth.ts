// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const email = formData.get('email')
    const password = formData.get('password')
    const rememberMe = formData.get('rememberMe') === 'true'

    // 1. Authenticate with your backend/database
    const authResult = await fetch('http://localhost:8000/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        })
    })

    if (!authResult.ok) {
        // Optional: Parse the error from your API if you want to pass a specific message back
        // const errorData = await authResult.json();
        return { error: 'NIK/Email atau password salah' }
    }

    // 2. Parse the JSON response to extract the token
    const data = await authResult.json()

    // Ensure this matches the exact key returned by your Laravel/Express backend
    // (e.g., data.access_token, data.token, etc.)
    const token = data.data.token

    if (!token) {
        return { error: 'Authentication succeeded, but no token was returned.' }
    }

    // 3. Await the cookies API (Required in Next.js 15/16)
    const cookieStore = await cookies()

    // 4. Set expiration based on the "Remember Me" toggle
    // 30 days if checked, otherwise undefined (expires on browser close)
    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 : undefined

    // 5. Set the secure cookie
    cookieStore.set('session_token', token, {
        httpOnly: true, // Crucial: Prevents JavaScript from reading the cookie
        secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
        sameSite: 'lax', // Protects against CSRF attacks
        path: '/',
        maxAge: cookieMaxAge,
    })

    return { success: true }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session_token')

    return { success: true }
}
