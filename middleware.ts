import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // We'll remove the referrer check to make the secret gallery more accessible
  // The "secret" is still knowing the password "Piechang Goreng"
  return NextResponse.next()
}

export const config = {
  matcher: ["/secret-gallery"],
}
