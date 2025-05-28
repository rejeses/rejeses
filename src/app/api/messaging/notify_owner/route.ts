import nodemailer from "nodemailer";
import {
  createCourseEmailTemplate,
  formatPrice,
  formatCourseSchedule2,
  formatSingleDate,
  capitalizeCourseScheduleType,
  getEmailConfig,
} from "@/utils/reusables/functions";

const email1 =
  process.env.NODE_ENV === "development"
    ? process.env.EMAIL_USER || ""
    : process.env.EMAIL_SERVICES || "";
const password =
  process.env.NODE_ENV === "development"
    ? process.env.EMAIL_PASS || ""
    : process.env.EMAIL_PASS_SERVICES || "";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return Response.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      courseType,
      startDate,
      courseSchedule,
      courseScheduleType,
      email,
      amount,
      currency,
      participants,
    } = body;

    if (
      !firstName ||
      firstName == "" ||
      !lastName ||
      lastName === "" ||
      !courseType ||
      courseType === "" ||
      !startDate ||
      startDate === "" ||
      !courseScheduleType ||
      courseScheduleType === "" ||
      !courseSchedule ||
      courseSchedule.length === 0 ||
      !email ||
      email === "" ||
      !amount ||
      amount <= 0 ||
      isNaN(amount) ||
      !currency ||
      currency === ""
    ) {
      return Response.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const createTransporter = () => {
      const config = getEmailConfig(email1, password);
      return nodemailer.createTransport(config);
    };

    const transporter = createTransporter();
    // const mailOptions = {
    //   from: `"Rejeses PM Consulting" <${email1}>`,
    //   to: email,
    //   subject: "Course Registration Confirmation",
    //   html: createCourseEmailTemplate(
    //     firstName,
    //     lastName,
    //     courseType,
    //     startDate,
    //     courseSchedule,
    //     courseScheduleType,
    //     amount,
    //     currency,
    //     participants as { name: string; email: string }[]
    //   ),
    // };

    // await transporter.sendMail(mailOptions);

    const appOwnerEmailConfirmationContent = `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 30px;">
          <div style="background-color: #BA6820; color: white; text-align: center; padding: 15px; border-radius: 8px 8px 0 0; font-size: 20px;">
            <h1 style="margin: 0;">Course Registration Confirmation</h1>
          </div>
          <div style="margin-top: 18px;">
            <p style="margin-bottom: 15px; font-size: 15px;">
              A customer has successfully paid for a course. Below are the details:
            </p>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Name:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${firstName} ${lastName}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Course Type:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${courseType}</div>
    
            ${
              !courseType.includes("Mentoring")
                ? `<div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Start Date:</div>
                   <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${
                     courseScheduleType === "weekend"
                       ? formatSingleDate(courseSchedule[0])
                       : formatSingleDate(startDate)
                   }</div>`
                : ""
            }
    
            ${
              !courseType.includes("Mentoring")
                ? `<div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Course Schedule Type:</div>
                   <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${capitalizeCourseScheduleType(
                     courseScheduleType
                   )}</div>`
                : ""
            }
    
            ${
              !courseType.includes("Mentoring")
                ? `<div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Course Days:</div>
                   <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${formatCourseSchedule2(
                     courseSchedule
                   )}</div>`
                : ""
            }
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Amount Paid:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${
              currency === "naira" ? "NGN" : "$"
            } ${formatPrice(amount)}</div>
    
            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Customer Email:</div>
            <div style="margin-bottom: 15px; word-wrap: break-word; font-size: 15px;">${email}</div>
    
            ${
              participants &&
              Array.isArray(participants) &&
              participants.length > 0 && participants[0].name !== ""
                ? `
                  <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Participants:</div>
                  <ul style="margin-bottom: 15px; font-size: 15px; padding-left: 20px;">
                    ${participants
                      .map((p) => `<li>${p.name} (${p.email})</li>`)
                      .join("")}
                  </ul>
                `
                : ""
            }
          </div>
        </div>
    
        <!-- Footer -->
        <div style="text-align: center; font-size: 14px; color: #666; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd;">
          <p style="margin: 5px 0;">© 2025 Rejeses Consult. All rights reserved.</p>
          <p style="margin: 5px 0;">
            Need help? Contact us at 
            <a href="mailto:info@rejeses.com" text-decoration: none;">info@rejeses.com</a>
          </p>
          <p style="margin: 5px 0;">
            <a href="https://rejeses.com/" style="color: #BA6820; text-decoration: none;">visit website</a>
          </p>
        </div>
      </body>
    </html>
    `;

    await transporter.sendMail({
      from: `Rejeses PM Consulting ${email1}`,
      to: email1,
      subject: "Course Registration Confirmation",
      html: appOwnerEmailConfirmationContent,
    });

    return Response.json(
      { message: "messages sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log("error sending mail notification:", err);
    return Response.json(
      { message: "Error sending messages" },
      { status: 500 }
    );
  }
}
