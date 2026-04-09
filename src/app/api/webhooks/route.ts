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
  createAdminCoursePaymentNotification,
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

  // Replace it with this:
  const adminHtml = createAdminCoursePaymentNotification(
    id,
    reference,
    firstName,
    lastName,
    email,
    amount,
    currency,
    paid_at,
    fees,
  );

  const transporter = nodemailer.createTransport(
    getEmailConfig(emailUser, emailPass),
  );

  const sendEmailToParticipants = async (
    participants: Participant[],
    payerEmail: string,
    order: any,
    currency: string,
  ) => {
    const rest = participants.filter(
      (p) => p.email.toLowerCase() !== payerEmail.toLowerCase(),
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
          order.participants,
        ),
      });
    }
  };

  const year = new Date().getFullYear();
  console.log(year, "server year");

  if (event === "charge.success" || event === "transfer.success") {
    const gottenTransaction = await getTransactionByReference(reference);

    if (gottenTransaction && gottenTransaction.status === "completed") {
      return Response.json(
        {
          message:
            "Trasaction already marked complete.... skipping transaction....",
        },
        { status: 200 },
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

    try {
      // Notify admin
      await transporter.sendMail({
        from: `Rejeses PM Consulting ${emailUser}`,
        to: emailUser,
        subject: "Course Payment Notification",
        html: adminHtml,
      });
    } catch (err) {
      console.error("portal mail not sent:", err);
    }

    const participants = (order.participants as Participant[]) || [];

    if (participants.length > 0 && participants[0].name !== "") {
      const payer = participants.find(
        (p) => p.email.toLowerCase() === email.toLowerCase(),
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
            true,
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
          true,
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
