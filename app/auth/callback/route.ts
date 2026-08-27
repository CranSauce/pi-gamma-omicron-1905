import { NextResponse } from "next/server";
import { publicSiteOrigin, safeRelativeReturnPath } from "../../../lib/portal-auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeRelativeReturnPath(requestUrl.searchParams.get("next"));

  try {
    if (!code) throw new Error("The OAuth callback did not include an authorization code.");
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return NextResponse.redirect(new URL(next, publicSiteOrigin(request)));
  } catch {
    return NextResponse.redirect(new URL("/members?auth_error=callback", requestUrl.origin));
  }
}
