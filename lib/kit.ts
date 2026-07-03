// ==========================================================================
//  Kit (ConvertKit) email-capture integration.
//
//  GOLDEN RULE: submit from the BROWSER (this runs in client components), never
//  from a server — Kit's anti-spam silently suppresses server-to-server posts.
//  Form IDs are the NUMERIC ids from each form's JS bundle (NOT the URL slug),
//  extracted from https://damp-sunset-3416.kit.com/<slug>/index.js.
//
//  Fire-and-forget: called after the primary Sheet/Apps-Script write, never
//  awaited, so a Kit outage can't block or break the real form submission.
// ==========================================================================

type KitFormType = "newsletter" | "contact" | "guest" | "webinar_replay_gate";

interface KitFormConfig {
  id: number;
  fields: Record<string, string>; // { kitFieldKey: paramKey passed below }
  firstNameOnly?: string[]; // reduce a full name to just the first name
}

const KIT_FORMS: Record<KitFormType, KitFormConfig> = {
  newsletter: {
    id: 9633910,
    fields: { source: "source", page_url: "page_url" },
  },
  contact: {
    id: 9633931,
    fields: {
      first_name: "name",
      subject: "subject",
      message: "message",
      page_url: "page_url",
    },
    firstNameOnly: ["first_name"],
  },
  guest: {
    id: 9633917,
    fields: {
      first_name: "first_name",
      last_name: "last_name",
      title: "title",
      apply_as: "apply_as",
      topic: "topic",
      about: "about",
      page_url: "page_url",
    },
  },
  webinar_replay_gate: {
    id: 9632434,
    fields: {
      first_name: "name",
      webinar_title: "webinar_title",
      replay_slug: "replay_slug",
      page_url: "page_url",
    },
    firstNameOnly: ["first_name"],
  },
};

function pickFirstName(raw: string): string {
  const parts = raw.trim().split(/\s+/);
  const start = /^dr\.?$/i.test(parts[0]) && parts.length > 1 ? 1 : 0;
  return parts[start] || "";
}

export function postToKit(
  formType: KitFormType,
  params: Record<string, string | undefined | null>
): void {
  const form = KIT_FORMS[formType];
  if (!form) return;

  const email = (params.email || "").toString().trim();
  if (!email || !email.includes("@")) return;

  const body = new URLSearchParams();
  body.set("email_address", email);
  body.set("fields[timestamp]", new Date().toISOString());

  Object.entries(form.fields).forEach(([kitKey, paramKey]) => {
    let value = (params[paramKey] || "").toString().trim();
    if (!value) return;
    if (form.firstNameOnly?.includes(kitKey)) {
      value = pickFirstName(value);
      if (!value) return;
    }
    body.set(`fields[${kitKey}]`, value);
  });

  // Fire-and-forget — Kit is additive to the primary submission, not the flow.
  fetch(`https://app.kit.com/forms/${form.id}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => {});
}
