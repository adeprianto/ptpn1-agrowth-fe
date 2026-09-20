import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const email = body.email
        const password = body.password
        const rememberMe = body.rememberMe === true

        if (!email || !password) {
            return NextResponse.json(
                {
                    error: 'Email dan password wajib diisi',
                },
                {
                    status: 422,
                }
            )
        }

        // 1. Authenticate with Laravel backend
        const authResult = await fetch(
            'http://localhost:8000/api/v1/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        )

        // 2. Authentication failed
        if (!authResult.ok) {
            return NextResponse.json(
                {
                    error: 'NIK/Email atau password salah',
                },
                {
                    status: authResult.status,
                }
            )
        }

        // 3. Parse Laravel response
        const data = await authResult.json()

        const token = data?.data?.token

        if (!token) {
            return NextResponse.json(
                {
                    error: 'Authentication succeeded, but no token was returned.',
                },
                {
                    status: 500,
                }
            )
        }

        // 4. Set HttpOnly cookie
        const cookieStore = await cookies()

        const cookieMaxAge = rememberMe
            ? 30 * 24 * 60 * 60
            : undefined

        cookieStore.set('session_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            ...(cookieMaxAge !== undefined && {
                maxAge: cookieMaxAge,
            }),
        })

        // 5. Return success response
        return NextResponse.json({
            success: true,
        })
    } catch (error) {
        console.error('Login error:', error)

        return NextResponse.json(
            {
                error: 'Terjadi kesalahan pada server',
            },
            {
                status: 500,
            }
        )
    }
}
