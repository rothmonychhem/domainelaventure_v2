import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  if (
    notifyEmail &&
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== "put_your_resend_key_here"
  ) {
    await resend.emails.send({
      from: "Cabin Website <onboarding@resend.dev>",
      to: notifyEmail,
      subject: `New cabin reservation request - ${chalet}`,
      text: `
New reservation request

Name: ${name}
Email: ${email}
Phone: ${phone}
Cabin: ${chalet}
Start: ${startDate}
End: ${endDate}
Comments: ${comments}
      `,
    });
  }

  return NextResponse.redirect(new URL("/contact?success=1", req.url));
}