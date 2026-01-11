import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create an unmodified Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // PROTECTED ROUTES LOGIC
    // 1. Admin Dashboard Route
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Shop Profile Route (example)
    if (request.nextUrl.pathname.startsWith('/shop/profile') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Auth Page Redirect (Login/Signup) -> If user is already logged in
    if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) && user) {
        // Default Redirect to Shop, logic can be expanded to check role
        return NextResponse.redirect(new URL('/shop', request.url))
    }

    return response
}
