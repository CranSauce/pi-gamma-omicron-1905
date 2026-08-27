import { NextResponse } from "next/server";
import { publicSiteOrigin, safeRelativeReturnPath } from "../../../lib/portal-auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { hasSupabasePublicConfig } from "../../../lib/supabase/config";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = safeRelativeReturnPath(requestUrl.searchParams.get("next"));
  if (!hasSupabasePublicConfig()) {
    return NextResponse.redirect(new URL("/members?auth_error=configuration", requestUrl.origin));
  }

  try {
    const origin = publicSiteOrigin(request);
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error || !data.url) throw error ?? new Error("Google sign-in URL was not returned.");
    return NextResponse.redirect(data.url);
  } catch {
    return NextResponse.redirect(new URL("/members?auth_error=signin", requestUrl.origin));
  }
}
