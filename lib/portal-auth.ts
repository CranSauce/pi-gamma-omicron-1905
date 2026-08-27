import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { hasSupabasePublicConfig } from "./supabase/config";

export type PortalUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

export async function getPortalUser(): Promise<PortalUser | null> {
  if (!hasSupabasePublicConfig()) return localPreviewUser();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;

  const fullName = userFullName(data.user.user_metadata);
  return {
    userId: data.user.id,
    email: data.user.email.toLowerCase(),
    displayName: fullName ?? data.user.email,
    fullName,
  };
}

export async function requirePortalUser(returnTo: string): Promise<PortalUser> {
  const user = await getPortalUser();
  if (user) return user;
  redirect(portalSignInPath(returnTo));
}

export function portalSignInPath(returnTo = "/members") {
  return `/auth/sign-in?next=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}

export function portalSignOutPath(returnTo = "/") {
  if (!hasSupabasePublicConfig() && process.env.NODE_ENV !== "production") {
    return safeRelativeReturnPath(returnTo);
  }
  return `/auth/sign-out?next=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}

export function safeRelativeReturnPath(value: string | null | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/";

  try {
    const url = new URL(value, "https://portal.local");
    if (url.origin !== "https://portal.local" || url.pathname.startsWith("/auth/")) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function publicSiteOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return validatedOrigin(configured);

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return validatedOrigin(`https://${vercelHost}`);

  if (process.env.NODE_ENV !== "production") return new URL(request.url).origin;
  throw new Error("NEXT_PUBLIC_SITE_URL must be configured for production authentication.");
}

async function localPreviewUser(): Promise<PortalUser | null> {
  if (process.env.NODE_ENV === "production") return null;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host")?.split(":")[0].toLowerCase();
  if (host !== "localhost" && host !== "127.0.0.1" && host !== "[::1]") return null;
  return {
    userId: "local-portal-preview",
    displayName: "Local Portal Preview",
    email: "portal-preview@localhost.invalid",
    fullName: "Local Portal Preview",
  };
}

function userFullName(metadata: Record<string, unknown>) {
  const candidate = metadata.full_name ?? metadata.name;
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

function validatedOrigin(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("The configured site URL must use HTTPS.");
  }
  return url.origin;
}
