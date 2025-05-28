import crypto from "crypto";
import { StatusType, Participant } from "@/utils/types/types";
import {
  getTransactionByReference,
  updateTransaction,
} from "@/app/services/repository/transactions/transactions";
import {
  getOrderByTransactionRef,
  updateOrder,
} from "@/app/services/repository/order/order";
import nodemailer from "nodemailer";
import {
  createCourseEmailTemplate,
  formatPrice,
  getEmailConfig,
} from "@/utils/reusables/functions";

const emailUser =
  process.env.NODE_ENV === "development"
    ? process.env.EMAIL_USER || ""
    : process.env.EMAIL_SERVICES || "";

const emailPass =
  process.env.NODE_ENV === "development"
    ? process.env.EMAIL_PASS || ""
    : process.env.EMAIL_PASS_SERVICES || "";

export async function POST(req: Request) {
  const paystack_secret = process.env.PAYSTACK_SECRET;
  if (!paystack_secret) {
    console.error("Missing Paystack secret");
    return Response.json({ message: "Server error" }, { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature");
  if (!signature) {
    return Response.json({ message: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const expected_sig = crypto
    .createHmac("sha512", paystack_secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected_sig) {
    return Response.json({ message: "Invalid signature" }, { status: 400 });
  }

  const body = JSON.parse(rawBody);
  const event = body.event;
  const data = body.data;

  const {
    id,
    reference,
    fees,
    paid_at,
    amount,
    currency,
    metadata: { custom_fields },
    customer: { email },
  } = data;

  const firstName =
    custom_fields.find((f: any) => f.first_name)?.first_name || "";
  const lastName = custom_fields.find((f: any) => f.last_name)?.last_name || "";
  const payment_id = id.toString();

  const appOwnerEmailConfirmationContent = `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 30px;">
          <div style="background-color: #89c13e; color: white; text-align: center; padding: 15px; border-radius: 8px 8px 0 0; font-size: 20px;">
            <h1 style="margin: 0;">Course Payment Notification</h1>
          </div>
          <div style="margin-top: 18px;">
            <p style="margin-bottom: 15px; font-size: 15px;">
              A customer has accessed the payment portal and their payment was successful. Below are the details:
            </p>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Payment ID:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${id}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Reference:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${reference}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Name:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${firstName} ${lastName}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Email:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${email}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Amount Paid:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${
              currency === "NGN" ? "NGN" : "$"
            } ${formatPrice(amount / 100)}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Payment Date:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${new Date(
              paid_at
            ).toLocaleString("en-GB")}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Payment Fees:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${currency} ${formatPrice(
    fees / 100
  )}</div>
          </div>
        </div>
        <!-- Footer -->
        <div style="text-align: center; font-size: 14px; color: #666; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0;">© 2025 Rejeses Consult. All rights reserved.</p>
          <p style="margin: 5px 0;">
            <a href="https://rejeses.com/" style="color: #89c13e; text-decoration: none;">Visit website</a>
          </p>
        </div>
      </body>
    </html>
    `;

  const transporter = nodemailer.createTransport(
    getEmailConfig(emailUser, emailPass)
  );

  const sendEmailToParticipants = async (
    participants: Participant[],
    payerEmail: string,
    order: any,
    currency: string
  ) => {
    const rest = participants.filter(
      (p) => p.email.toLowerCase() !== payerEmail.toLowerCase()
    );

    for (const participant of rest) {
      const fullName = (participant.name || "").trim().replace(/\s+/g, " ");
      const [first, ...restName] = fullName.split(" ");
      const last = restName.length ? restName[restName.length - 1] : "";

      await transporter.sendMail({
        from: `Rejeses PM Consulting ${emailUser}`,
        to: participant.email,
        subject: "Course Payment Notification",
        html: createCourseEmailTemplate(
          first,
          last,
          order.courseType,
          order.startDate,
          order.courseSchedule,
          order.courseScheduleType,
          order.amount,
          currency,
          order.participants
        ),
      });
    }
  };

  if (event === "charge.success" || event === "transfer.success") {
    const gottenTransaction = await getTransactionByReference(reference);

    if (gottenTransaction && gottenTransaction.status === "completed") {
      return Response.json(
        {
          message:
            "Trasaction already marked complete.... skipping transaction....",
        },
        { status: 200 }
      );
    }

    const transaction = await updateTransaction(reference, {
      status: StatusType.completed,
      pid: payment_id,
      fee: fees,
    });

    const order = await getOrderByTransactionRef(Number(transaction.orderRef));
    if (!order) {
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    // Notify admin
    await transporter.sendMail({
      from: `Rejeses PM Consulting ${emailUser}`,
      to: emailUser,
      subject: "Course Payment Notification",
      html: appOwnerEmailConfirmationContent,
    });

    const participants = (order.participants as Participant[]) || [];

    if (participants.length > 0 && participants[0].name !== "") {
      const payer = participants.find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      );

      if (payer) {
        // Notify payer
        await transporter.sendMail({
          from: `Rejeses PM Consulting ${emailUser}`,
          to: payer.email,
          subject: "Course Payment Notification",
          html: createCourseEmailTemplate(
            order.firstName,
            order.lastName,
            order.courseType,
            order.startDate,
            order.courseSchedule,
            order.courseScheduleType,
            order.amount,
            currency,
            participants,
            false,
            true
          ),
        });
        await sendEmailToParticipants(participants, email, order, currency);
      } else {
        // Send to all
        await sendEmailToParticipants(participants, "", order, currency);
      }
    } else {
      // No participants — just notify payer
      await transporter.sendMail({
        from: `Rejeses PM Consulting ${emailUser}`,
        to: email,
        subject: "Course Payment Notification",
        html: createCourseEmailTemplate(
          order.firstName,
          order.lastName,
          order.courseType,
          order.startDate,
          order.courseSchedule,
          order.courseScheduleType,
          order.amount,
          currency,
          [],
          false,
          true
        ),
      });
    }

    await updateOrder(Number(transaction.orderRef), {
      status: StatusType.completed,
    });

    return Response.json({ message: "Transaction completed" }, { status: 200 });
  }

  if (
    event === "charge.failed" ||
    event === "transfer.failed" ||
    event === "payment.failed"
  ) {
    await updateTransaction(reference, {
      status: StatusType.failed,
    });

    await updateOrder(Number(data.metadata.orderRef), {
      status: StatusType.failed,
    });

    return Response.json({ message: "Transaction failed" }, { status: 200 });
  }

  return Response.json({ message: "Event ignored" }, { status: 200 });
}
