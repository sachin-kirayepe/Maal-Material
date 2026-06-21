import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that do NOT require authentication
const publicPaths = ['/login', '/storefront', '/api/auth', '/unauthorized'];

// Define Role Mapping for protected routes
// If a path starts with the key, the user must have one of the required roles.
const routeRoleMap: Record<string, string[]> = {
  '/finance': ['FINANCE_MANAGER', 'SUPER_ADMIN'],
  '/admin': ['ADMIN', 'SUPER_ADMIN'],
  '/business-intelligence': ['FINANCE_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
  '/construction': ['SITE_ENGINEER', 'PROJECT_MANAGER', 'SUPER_ADMIN'],
  '/logistics': ['DISPATCHER', 'LOGISTICS_MANAGER', 'SUPER_ADMIN'],
  '/procurement': ['PROCUREMENT_MANAGER', 'SUPER_ADMIN'],
  '/equipment': ['EQUIPMENT_MANAGER', 'SUPER_ADMIN'],
  '/rentals': ['EQUIPMENT_MANAGER', 'SUPER_ADMIN'],
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Static assets should always be allowed
  const isAsset = pathname.includes('.') || pathname.startsWith('/_next');
  if (isAsset) {
    return NextResponse.next();
  }

  // --- MAINTENANCE MODE LOGIC ---
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET || 'construct2026';
  
  // 1. Check if user is trying to bypass
  const betaAccessKey = searchParams.get('beta_access');
  if (betaAccessKey === bypassSecret) {
    // Set cookie and redirect to clean URL
    const url = new URL(pathname, request.url);
    const response = NextResponse.redirect(url);
    response.cookies.set('constructos_beta_access', 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // 2. Check if maintenance mode is active and user lacks bypass cookie
  const hasBypassCookie = request.cookies.get('constructos_beta_access')?.value === 'true';
  
  if (isMaintenanceMode && !hasBypassCookie && !pathname.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // 3. Allow access to maintenance page if it's active
  if (pathname.startsWith('/maintenance')) {
    if (!isMaintenanceMode || hasBypassCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  // --- END MAINTENANCE MODE LOGIC ---

  // Check if it's a public path or an API route
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const isApi = pathname.startsWith('/api');

  if (isPublicPath || isApi) {
    return NextResponse.next();
  }

  // Basic authentication check
  const hasSession = request.cookies.has('constructos_session');

  if (!hasSession) {
    // TEMPORARY PILOT MODE BYPASS: Allow access without session
    // const loginUrl = new URL('/login', request.url);
    // loginUrl.searchParams.set('redirect', pathname);
    // return NextResponse.redirect(loginUrl); 
  }

  // --- RBAC ENFORCEMENT ---
  const rolesCookie = request.cookies.get('constructos_session_roles')?.value || '';
  const userRoles = rolesCookie.split(',').filter(Boolean);

  // Check if user has SUPER_ADMIN role, if so they have access to everything
  const isSuperAdmin = userRoles.includes('SUPER_ADMIN');

  if (!isSuperAdmin) {
    // Check path against routeRoleMap
    const matchedRoute = Object.keys(routeRoleMap).find(route => pathname.startsWith(route));
    
    if (matchedRoute) {
      const requiredRoles = routeRoleMap[matchedRoute];
      const hasRequiredRole = userRoles.some(role => (requiredRoles || []).includes(role));

      if (!hasRequiredRole) {
        // User does not have access to this module
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
