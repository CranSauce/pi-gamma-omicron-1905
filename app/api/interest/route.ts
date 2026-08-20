import { getDb } from "../../../db";
import { interests } from "../../../db/schema";

type InterestPayload = Record<string, unknown> & {
  startedAt?: number;
  website?: string;
};

const requiredFields = [
  "fullName",
  "email",
  "phone",
  "city",
  "state",
  "institution",
  "institutionType",
  "currentStatus",
  "chapterInterest",
  "whyInterested",
  "brotherhoodMeaning",
] as const;

function clean(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as InterestPayload;

    if (clean(payload.website)) {
      return Response.json({ message: "Your interest has been received." }, { status: 201 });
    }

    if (!payload.startedAt || Date.now() - Number(payload.startedAt) < 1800) {
      return Response.json({ error: "Please take a moment to review the form and try again." }, { status: 400 });
    }

    for (const field of requiredFields) {
      if (!clean(payload[field])) {
        return Response.json({ error: "Please complete every required field." }, { status: 400 });
      }
    }

    const email = clean(payload.email, 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (clean(payload.consent) !== "yes") {
      return Response.json({ error: "Consent is required before submitting." }, { status: 400 });
    }

    const db = getDb();
    await db.insert(interests).values({
      id: crypto.randomUUID(),
      fullName: clean(payload.fullName, 120),
      preferredName: clean(payload.preferredName, 80),
      email,
      phone: clean(payload.phone, 40),
      city: clean(payload.city, 80),
      state: clean(payload.state, 32),
      institution: clean(payload.institution, 180),
      institutionType: clean(payload.institutionType, 80),
      fieldOfStudy: clean(payload.fieldOfStudy, 120),
      graduationYear: clean(payload.graduationYear, 4),
      currentStatus: clean(payload.currentStatus, 80),
      chapterInterest: clean(payload.chapterInterest, 120),
      whyInterested: clean(payload.whyInterested, 2000),
      brotherhoodMeaning: clean(payload.brotherhoodMeaning, 2000),
      referralSource: clean(payload.referralSource, 300),
    });

    return Response.json(
      { message: "Your interest has been received and is ready for officer review." },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const unavailable = message.includes("no such table") || message.includes("binding `DB`");
    return Response.json(
      { error: unavailable ? "The interest system is being prepared. Please try again shortly." : "We could not submit your interest right now." },
      { status: 500 },
    );
  }
}
