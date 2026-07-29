import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  FIELD_LIMITS,
  FILE_RULES,
  isProjectTypeId,
  type ProjectTypeId,
} from "@/lib/project-inquiry";
import { isLocale, type Locale } from "@/i18n/config";

export const runtime = "nodejs";

const MIN_COMPLETION_TIME_MS = 3500;
const REQUEST_TIMEOUT_MS = 15000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Attachment = {
  filename: string;
  content: string;
};

type ValidationResult =
  | {
      ok: true;
      data: {
        name: string;
        email: string;
        phone: string;
        company: string;
        locale: Locale;
        projectTypeId: ProjectTypeId;
        message: string;
        submissionId: string;
        attachments: Attachment[];
      };
    }
  | { ok: false; code: ErrorCode };

type ErrorCode =
  | "INVALID_REQUEST"
  | "TOO_FAST"
  | "INVALID_NAME"
  | "INVALID_EMAIL"
  | "INVALID_CONTACT"
  | "INVALID_PROJECT_TYPE"
  | "INVALID_MESSAGE"
  | "CONSENT_REQUIRED"
  | "INVALID_SUBMISSION"
  | "INVALID_FILE"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "REQUEST_FAILED"
  | "UNKNOWN";

const projectTypeLabels: Record<ProjectTypeId, string> = {
  corporate: "Kurumsal Web Sitesi",
  commerce: "E-Ticaret",
  landing: "Landing Page",
  personal: "Kişisel Marka ve Portföy",
  restaurant: "Restoran ve Rezervasyon",
  blog: "Blog ve İçerik Platformu",
  event: "Etkinlik ve Tanıtım Sitesi",
  application: "Özel Web Uygulaması",
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeAttachmentName(originalName: string, index: number) {
  const normalized = originalName.normalize("NFKD");
  const extensionMatch = normalized.toLowerCase().match(/\.(jpe?g|png|webp|pdf|docx?)$/);
  const extension = extensionMatch?.[0] ?? "";
  const base = normalized
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 70);

  return `${base || `dosya-${index + 1}`}${extension}`;
}

function bytesStartWith(bytes: Uint8Array, signature: readonly number[]) {
  return signature.every((byte, index) => bytes[index] === byte);
}

function hasAscii(bytes: Uint8Array, value: string) {
  const needle = new TextEncoder().encode(value);
  outer: for (let index = 0; index <= bytes.length - needle.length; index += 1) {
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (bytes[index + offset] !== needle[offset]) continue outer;
    }
    return true;
  }
  return false;
}

function signatureMatches(extension: string, bytes: Uint8Array) {
  if (extension === "jpg" || extension === "jpeg") {
    return bytesStartWith(bytes, [0xff, 0xd8, 0xff]);
  }
  if (extension === "png") {
    return bytesStartWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
  if (extension === "webp") {
    return (
      hasAscii(bytes.slice(0, 4), "RIFF") &&
      hasAscii(bytes.slice(8, 12), "WEBP")
    );
  }
  if (extension === "pdf") {
    return hasAscii(bytes.slice(0, 5), "%PDF-");
  }
  if (extension === "doc") {
    return bytesStartWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  }
  if (extension === "docx") {
    return (
      bytesStartWith(bytes, [0x50, 0x4b, 0x03, 0x04]) &&
      hasAscii(bytes, "[Content_Types].xml") &&
      hasAscii(bytes, "word/")
    );
  }
  return false;
}

const mimeByExtension: Record<string, readonly string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
  pdf: ["application/pdf"],
  doc: ["application/msword", "application/x-msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

async function validate(formData: FormData): Promise<ValidationResult> {
  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  const company = text(formData, "company");
  const localeValue = text(formData, "locale");
  const projectTypeIdValue = text(formData, "projectTypeId");
  const message = text(formData, "message");
  const website = text(formData, "website");
  const consent = text(formData, "consent");
  const submissionId = text(formData, "submissionId");
  const openedAt = Number(text(formData, "openedAt"));

  if (website) {
    return { ok: false, code: "INVALID_REQUEST" };
  }
  if (!isLocale(localeValue)) {
    return { ok: false, code: "INVALID_REQUEST" };
  }
  if (
    !Number.isFinite(openedAt) ||
    openedAt > Date.now() ||
    Date.now() - openedAt < MIN_COMPLETION_TIME_MS
  ) {
    return {
      ok: false,
      code: "TOO_FAST",
    };
  }
  if (!name || name.length > FIELD_LIMITS.name) {
    return { ok: false, code: "INVALID_NAME" };
  }
  if (
    !email ||
    email.length > FIELD_LIMITS.email ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { ok: false, code: "INVALID_EMAIL" };
  }
  if (phone.length > FIELD_LIMITS.phone || company.length > FIELD_LIMITS.company) {
    return { ok: false, code: "INVALID_CONTACT" };
  }
  if (!isProjectTypeId(projectTypeIdValue)) {
    return { ok: false, code: "INVALID_PROJECT_TYPE" };
  }
  if (message.length < 20 || message.length > FIELD_LIMITS.message) {
    return { ok: false, code: "INVALID_MESSAGE" };
  }
  if (consent !== "accepted") {
    return { ok: false, code: "CONSENT_REQUIRED" };
  }
  if (!/^[a-f0-9-]{20,64}$/i.test(submissionId)) {
    return { ok: false, code: "INVALID_SUBMISSION" };
  }

  const files = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (files.length > FILE_RULES.maxFiles) {
    return { ok: false, code: "INVALID_FILE" };
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > FILE_RULES.maxTotalBytes) {
    return { ok: false, code: "INVALID_FILE" };
  }

  const attachments: Attachment[] = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (file.size > FILE_RULES.maxFileBytes) {
      return { ok: false, code: "INVALID_FILE" };
    }

    const extension = file.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "";
    if (!mimeByExtension[extension]?.includes(file.type)) {
      return { ok: false, code: "INVALID_FILE" };
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!signatureMatches(extension, bytes)) {
      return {
        ok: false,
        code: "INVALID_FILE",
      };
    }

    attachments.push({
      filename: safeAttachmentName(file.name, index),
      content: Buffer.from(bytes).toString("base64"),
    });
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      company,
      locale: localeValue,
      projectTypeId: projectTypeIdValue,
      message,
      submissionId,
      attachments,
    },
  };
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function line(label: string, value: string) {
  return `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #dbe5df">${label}</th><td style="padding:8px 12px;border-bottom:1px solid #dbe5df">${escapeHtml(value || "—")}</td></tr>`;
}

async function getRateLimitKey(request: Request, email: string) {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const compactEmail = email.toLowerCase().replace(/[^a-z0-9@._+-]/g, "");
  const input = new TextEncoder().encode(
    `${ip.slice(0, 80)}:${compactEmail.slice(0, 254)}`,
  );
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function checkRateLimit(request: Request, email: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const limiter = (env as CloudflareEnv).PROJECT_INQUIRY_RATE_LIMITER;
    if (!limiter) return true;
    const result = await limiter.limit({
      key: await getRateLimitKey(request, email),
    });
    return result.success;
  } catch {
    // next dev does not expose Cloudflare bindings; production does.
    return process.env.NODE_ENV !== "production";
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
      return NextResponse.json(
        { code: "INVALID_REQUEST" satisfies ErrorCode },
        { status: 415 },
      );
    }

    const formData = await request.formData();
    const result = await validate(formData);
    if (!result.ok) {
      return NextResponse.json({ code: result.code }, { status: 400 });
    }

    const { data } = result;
    if (!(await checkRateLimit(request, data.email))) {
      return NextResponse.json(
        { code: "RATE_LIMITED" satisfies ErrorCode },
        { status: 429 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL;
    if (!apiKey || !from || !to) {
      console.error("Project inquiry email configuration is missing.");
      return NextResponse.json(
        { code: "SERVICE_UNAVAILABLE" satisfies ErrorCode },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const sendPromise = resend.emails.send(
      {
        from,
        to: [to],
        replyTo: data.email,
        subject: `Yeni proje fikri — ${projectTypeLabels[data.projectTypeId]}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#172019;line-height:1.55">
            <h1 style="font-size:22px">Yeni proje iletişim formu</h1>
            <table style="width:100%;border-collapse:collapse">
              ${line("Ad soyad", data.name)}
              ${line("E-posta", data.email)}
              ${line("Telefon", data.phone)}
              ${line("Şirket / marka", data.company)}
              ${line("Proje türü", projectTypeLabels[data.projectTypeId])}
              ${line("Form dili", data.locale)}
            </table>
            <h2 style="margin-top:24px;font-size:17px">Mesaj</h2>
            <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
            <p style="margin-top:24px;color:#536057;font-size:12px">
              Ek sayısı: ${data.attachments.length}. Bu e-postayı yanıtladığınızda yanıt ziyaretçinin adresine gider.
            </p>
          </div>
        `,
        text: [
          "Yeni proje iletişim formu",
          `Ad soyad: ${data.name}`,
          `E-posta: ${data.email}`,
          `Telefon: ${data.phone || "—"}`,
          `Şirket / marka: ${data.company || "—"}`,
          `Proje türü: ${projectTypeLabels[data.projectTypeId]}`,
          `Form dili: ${data.locale}`,
          "",
          "Mesaj:",
          data.message,
          "",
          `Ek sayısı: ${data.attachments.length}`,
        ].join("\n"),
        attachments: data.attachments,
      },
      { idempotencyKey: `project-inquiry/${data.submissionId}` },
    );

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("RESEND_TIMEOUT")), REQUEST_TIMEOUT_MS);
    });
    const sendResult = await Promise.race([sendPromise, timeoutPromise]);

    if (sendResult.error) {
      console.error("Resend project inquiry failed:", sendResult.error.name);
      return NextResponse.json(
        { code: "REQUEST_FAILED" satisfies ErrorCode },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "UNKNOWN";
    console.error("Project inquiry request failed:", reason);
    return NextResponse.json(
      { code: "UNKNOWN" satisfies ErrorCode },
      { status: 500 },
    );
  }
}
