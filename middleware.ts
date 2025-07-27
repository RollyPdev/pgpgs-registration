import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Basic Security Headers (less restrictive)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  // Relaxed Content Security Policy - allows eval and development features
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:; " +
    "style-src 'self' 'unsafe-inline' blob: data:; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data: https:; " +
    "connect-src 'self' https: ws: wss:; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );

  // Only block access to very sensitive files (reduced list)
  const sensitivePaths = [
    '/.env',
    '/.git',
    '/node_modules',
    '/package.json',
    '/package-lock.json',
    '/prisma/dev.db',
    '/.vscode',
    '/.idea',
    '/.DS_Store',
    '/Thumbs.db'
  ];

  const pathname = request.nextUrl.pathname.toLowerCase();
  
  // Check for sensitive paths (reduced protection)
  for (const sensitivePath of sensitivePaths) {
    if (pathname.includes(sensitivePath.toLowerCase())) {
      return new NextResponse('Access Denied', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block'
        }
      });
    }
  }

  // Allow access to source code files (removed blocking)
  // const sourceCodeExtensions = [
  //   '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.log',
  //   '.yml', '.yaml', '.xml', '.sql', '.env', '.config', '.conf',
  //   '.ini', '.cfg', '.bak', '.backup', '.old', '.tmp', '.temp'
  // ];

  // const fileExtension = pathname.split('.').pop()?.toLowerCase();
  // if (fileExtension && sourceCodeExtensions.includes(fileExtension)) {
  //   return new NextResponse('Access Denied', { 
  //     status: 403,
  //     headers: {
  //       'Content-Type': 'text/plain',
  //       'X-Content-Type-Options': 'nosniff',
  //       'X-Frame-Options': 'DENY',
  //       'X-XSS-Protection': '1; mode=block'
  //     }
  //   });
  // }

  // Allow access to development endpoints (removed blocking)
  // const debugPaths = [
  //   '/debug', '/dev', '/development', '/test', '/testing',
  //   '/api/debug', '/api/dev', '/api/test', '/api/health',
  //   '/status', '/ping', '/health', '/metrics', '/monitoring'
  // ];

  // for (const debugPath of debugPaths) {
  //   if (pathname.startsWith(debugPath)) {
  //     return new NextResponse('Access Denied', { 
  //       status: 403,
  //       headers: {
  //         'Content-Type': 'text/plain',
  //         'X-Content-Type-Options': 'nosniff',
  //         'X-Frame-Options': 'DENY',
  //         'X-XSS-Protection': '1; mode=block'
  //       }
  //     });
  //   }
  // }

  // Allow access to common patterns (removed blocking)
  // const attackPatterns = [
  //   'php', 'asp', 'aspx', 'jsp', 'cgi', 'pl', 'py', 'rb',
  //   'exec', 'system', 'shell', 'cmd', 'eval', 'include',
  //   'require', 'file_get_contents', 'fopen', 'fwrite',
  //   'mysql_', 'mysqli_', 'pg_', 'sqlite_', 'mongo_',
  //   'document.write', 'innerHTML', 'outerHTML', 'eval(',
  //   'setTimeout(', 'setInterval(', 'Function(', 'constructor'
  // ];

  // for (const pattern of attackPatterns) {
  //   if (pathname.includes(pattern)) {
  //     return new NextResponse('Access Denied', { 
  //       status: 403,
  //       headers: {
  //         'Content-Type': 'text/plain',
  //         'X-Content-Type-Options': 'nosniff',
  //         'X-Frame-Options': 'DENY',
  //         'X-XSS-Protection': '1; mode=block'
  //       }
  //     });
  //   }
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|PGPGS Logo.png|gold.png|next.svg|vercel.svg|file.svg|globe.svg|window.svg).*)',
  ],
}; 