import { NextResponse } from "next/server";
import { safeRelativeReturnPath } from "../../../lib/portal-auth";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { hasSupabasePublicConfig } from "../../../lib/supabase/config";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = safeRelativeReturnPath(requestUrl.searchParams.get("next"));
  if (hasSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
