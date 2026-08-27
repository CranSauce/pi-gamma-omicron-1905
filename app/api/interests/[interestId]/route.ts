import { canManageMembers, getAuthenticatedMember } from "../../../../lib/member-access";
import { updateInterestStatus } from "../../../../lib/portal-data";

const statuses = new Set(["new", "under_review", "interview", "accepted", "declined", "archived"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ interestId: string }> }) {
  const session = await getAuthenticatedMember();
  if (!session.user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  if (!session.member || !canManageMembers(session.member.role)) {
    return Response.json({ error: "Applicant review access is required." }, { status: 403 });
  }

  const { interestId } = await params;
  const payload = await request.json() as Record<string, unknown>;
  const status = typeof payload.status === "string" ? payload.status.trim() : "";
  if (!statuses.has(status)) return Response.json({ error: "Select a valid application stage." }, { status: 400 });

  await updateInterestStatus(interestId, status);

  return Response.json({ message: "Interest record updated." });
}
