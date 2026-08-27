export class SupabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

export function hasSupabasePublicConfig() {
  return Boolean(supabaseUrl() && supabasePublishableKey());
}

export function hasSupabaseAdminConfig() {
  return Boolean(supabaseUrl() && supabaseSecretKey());
}

export function getSupabasePublicConfig() {
  const url = supabaseUrl();
  const publishableKey = supabasePublishableKey();

  if (!url || !publishableKey) {
    throw new SupabaseConfigurationError(
      "Supabase authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
}

export function getSupabaseAdminConfig() {
  const url = supabaseUrl();
  const secretKey = supabaseSecretKey();

  if (!url || !secretKey) {
    throw new SupabaseConfigurationError(
      "Supabase data access is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.",
    );
  }

  return { url, secretKey };
}

function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
}

function supabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    ""
  );
}

function supabaseSecretKey() {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}
