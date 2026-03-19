import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function buildReservationMessage(input: {
  name: string;
  email: string;
  phone: string;
  chalet: string;
  startDate: string;
  endDate: string;
  comments: string;
}) {
  return [
    "New reservation request",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Cabin: ${input.chalet}`,
    `Start: ${input.startDate}`,
    `End: ${input.endDate}`,
    `Comments: ${input.comments || "None"}`,
  ].join("\n");
}

async function sendSmsNotification(message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.TWILIO_TO_NUMBER;

  if (!accountSid || !authToken || !from || !to) {
    return;
  }

  const body = new URLSearchParams({
    Body: message,
    From: from,
    To: to,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString(
          "base64"
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send SMS notification.");
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const chalet = String(formData.get("chalet") || "");
  const startDate = String(formData.get("startDate") || "");
  const endDate = String(formData.get("endDate") || "");
  const comments = String(formData.get("comments") || "");

  await prisma.reservation.create({
    data: {
      name,
      email,
      phone,
      chalet,
      startDate,
      endDate,
      comments,
    },
  });

  const notifyEmail = process.env.NOTIFY_EMAIL;
  const message = buildReservationMessage({
    name,
    email,
    phone,
    chalet,
    startDate,
    endDate,
    comments,
  });

  const notifications: Promise<unknown>[] = [];

  if (notifyEmail && resend) {
    notifications.push(
      resend.emails.send({
        from: "Domaine Aventure <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `New cabin reservation request - ${chalet}`,
        text: message,
      })
    );
  }

  notifications.push(sendSmsNotification(message));

  const notificationResults = await Promise.allSettled(notifications);

  for (const result of notificationResults) {
    if (result.status === "rejected") {
      console.error(result.reason);
    }
  }

  return NextResponse.redirect(new URL("/contact?success=1", req.url), {
    status: 303,
  });
}
