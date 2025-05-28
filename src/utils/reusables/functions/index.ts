import { EmailConfig, PromoData } from "@/utils/types/types";
import { toast } from "react-toastify";

export function createEmailTemplate(
  name: string,
  email: string,
  message: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
      </head>
      <body style="
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
      ">
        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" style="
          background-color: #f4f4f4;
          padding: 20px;
        ">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                width: 100%;
              ">
                <!-- Header -->
                <tr>
                  <td style="
                    background-color: #5a2d6e;
                    color: white;
                    text-align: center;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                  ">
                    <h1 style="
                      margin: 0;
                      font-size: 24px;
                      font-weight: bold;
                    ">New Contact Form Submission</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 30px;">
                    <!-- Name Section -->
                    <div style="margin-bottom: 20px;">
                      <p style="
                        color: #666;
                        font-weight: bold;
                        font-size: 16px;
                        margin: 0 0 5px 0;
                      ">Name:</p>
                      <p style="
                        margin: 0;
                        font-size: 18px;
                        word-break: break-word;
                      ">${name}</p>
                    </div>

                    <!-- Email Section -->
                    <div style="margin-bottom: 20px;">
                      <p style="
                        color: #666;
                        font-weight: bold;
                        font-size: 16px;
                        margin: 0 0 5px 0;
                      ">Email:</p>
                      <p style="
                        margin: 0;
                        font-size: 18px;
                        word-break: break-word;
                      ">${email}</p>
                    </div>

                    <!-- Message Section -->
                    <div style="
                      background-color: #f9f9f9;
                      border-left: 4px solid #5a2d6e;
                      padding: 20px;
                      margin-top: 20px;
                    ">
                      <p style="
                        color: #666;
                        font-weight: bold;
                        font-size: 16px;
                        margin: 0 0 5px 0;
                      ">Message:</p>
                      <p style="
                        margin: 0;
                        font-size: 18px;
                        word-break: break-word;
                        white-space: pre-wrap;
                      ">${message}</p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 0 30px;">
                    <div style="
                      text-align: center;
                      padding: 20px 0;
                      border-top: 1px solid #ddd;
                    ">
                      <p style="
                        margin: 0 0 10px 0;
                        font-size: 14px;
                        color: #666;
                      ">© 2025 Rejeses Consult. All rights reserved.</p>
                      <p style="
                        margin: 0;
                        font-size: 14px;
                        color: #666;
                      ">
                        <a href="https://rejeses.com/" style="
                          color: #5a2d6e;
                          text-decoration: none;
                          font-weight: bold;
                        ">Visit website</a>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export const getNextMondayDates = (
  count?: number,
  promoStartDate?: string,
  promoEndDate?: string
) => {
  const dates = [];
  if (count) {
    const today = new Date();
    // Calculate the closest Monday
    const dayOfWeek = today.getDay();
    const daysUntilMonday = (dayOfWeek === 0 ? 1 : 8) - dayOfWeek; // Sunday to Monday or the next Monday
    let currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + daysUntilMonday);

    // Generate dates for each card
    for (let i = 0; i < count; i++) {
      dates.push(new Date(currentMonday));
      currentMonday.setDate(currentMonday.getDate() + 7); // Move to the next Monday
    }

    return dates;
  } else if (promoStartDate && promoEndDate) {
    const dates = [];

    const startDate = new Date(promoStartDate);
    const endDate = new Date(promoEndDate);

    // Find the first Monday on or after the start date
    let currentDate = new Date(startDate);
    const day = currentDate.getDay();

    // If not already Monday, move to next Monday
    if (day !== 1) {
      currentDate.setDate(currentDate.getDate() + ((1 + 7 - day) % 7));
    }

    // Add all Mondays within the range
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7); // Move to next Monday
    }

    return dates;
  } else {
    return null;
  }
};

export const isPromoExpired = (promoData: PromoData, deadline: string) => {
  if (!promoData || !promoData.dateRange) return true;

  const currentDate = new Date();
  const endDate = new Date(deadline);

  return currentDate > endDate;
};

export function formatDate(courseDate: Date) {
  const day = courseDate.getDate();
  const month = courseDate.toLocaleString("en-US", { month: "long" });
  const year = courseDate.getFullYear();

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}

export function formatPrice(price: number | undefined): string {
  if (price && price >= 1000) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return price?.toString() || "";
  }
}
export function createCourseEmailTemplate(
  firstName: string,
  lastName: string,
  courseType: string,
  startDate: string,
  courseSchedule: Date[],
  courseScheduleType: string,
  amount: number,
  currency: string,
  courseparticipants: { name: string; email: string }[],
  participant?: boolean,
  isPayer?: boolean
) {
  const fullName = `${firstName} ${lastName}`;
  const otherParticipants = courseparticipants.filter(
    (p) => p.name.toLowerCase() !== fullName.toLowerCase()
  );

  const renderParticipantsSection = () => {
    if (isPayer) {
      return `
        <div style="margin-top: 20px;">
          <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Course Participants:</div>
          <ul style="font-size: 15px; padding-left: 18px; margin: 10px 0;">
            ${
              courseparticipants &&
              courseparticipants.length > 0 &&
              courseparticipants[0].name !== "" &&
              courseparticipants
                .map((p) => `<li>${p.name} (${p.email})</li>`)
                .join("")
            }
          </ul>
        </div>
      `;
    }

    if (
      participant &&
      otherParticipants.length > 0 &&
      otherParticipants[0].name !== ""
    ) {
      return `
        <div style="margin-top: 20px;">
          <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Other Participants:</div>
          <ul style="font-size: 15px; padding-left: 18px; margin: 10px 0;">
            ${otherParticipants
              .map((p) => `<li>${p.name} (${p.email})</li>`)
              .join("")}
          </ul>
        </div>
      `;
    }

    if (
      !participant &&
      courseparticipants.length > 1 &&
      courseparticipants[0].name !== ""
    ) {
      return `
        <div style="margin-top: 20px;">
          <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Participants:</div>
          <ul style="font-size: 15px; padding-left: 18px; margin: 10px 0;">
            ${courseparticipants
              .map((p) => `<li>${p.name} (${p.email})</li>`)
              .join("")}
          </ul>
        </div>
      `;
    }

    return "";
  };

  const registrationMessage = isPayer
    ? `<p style="color: #666; font-weight: bold; font-size: 15px; margin-bottom: 15px;">
      Thank you for registering for the <strong>${courseType}</strong> program.
    </p>`
    : participant
    ? `<p style="color: #666; font-weight: bold; font-size: 15px; margin-bottom: 15px;">
      You have been registered for the <strong>${courseType}</strong> program.
    </p>`
    : `<p style="color: #666; font-weight: bold; font-size: 15px; margin-bottom: 15px;">
      Thank you for registering for the <strong>${courseType}</strong> program.
    </p>`;

  return `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 30px;">
          <div style="background-color: #89c13e; color: white; text-align: center; padding: 15px; border-radius: 8px 8px 0 0; font-size: 20px;">
            <h1 style="margin: 0;">
              ${
                participant
                  ? `Course Payment on behalf of ${fullName}`
                  : isPayer
                  ? `Course Registration Confirmation`
                  : `Hello ${fullName}`
              }
            </h1>
          </div>
          <div style="margin-top: 18px;">
            ${registrationMessage}

            ${
              courseType.includes("Mentoring")
                ? `<p style="margin-bottom: 15px; font-size: 15px;">
                    You have registered for the mentoring program. As a result, you will be contacted soon regarding the program details.
                  </p>`
                : ""
            }

            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Program Type:</div>
            <div style="margin-bottom: 15px; font-size: 15px;">${courseType}</div>

            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Start Date:</div>
            <div style="margin-bottom: 15px; font-size: 15px;">
              ${
                courseType.includes("Mentoring")
                  ? "You will be contacted"
                  : courseScheduleType === "weekend"
                  ? formatSingleDate(courseSchedule[0])
                  : formatSingleDate(startDate)
              }
            </div>

            ${
              !courseType.includes("Mentoring")
                ? `
                  <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Course Schedule Type:</div>
                  <div style="margin-bottom: 15px; font-size: 15px;">${capitalizeCourseScheduleType(
                    courseScheduleType
                  )}</div>
                `
                : ""
            }

            ${
              !courseType.includes("Mentoring")
                ? `
                  <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Course Days:</div>
                  <div style="margin-bottom: 15px; font-size: 15px;">${formatCourseSchedule2(
                    courseSchedule
                  )}</div>
                `
                : ""
            }

            <div style="color: #666; font-weight: bold; margin-bottom: 5px; font-size: 15px;">Amount Paid:</div>
            <div style="margin-bottom: 15px; font-size: 15px;">
              ${
                currency === "naira" || currency === "NGN" ? "NGN" : "$"
              } ${formatPrice(amount)}
            </div>

            ${
              courseparticipants &&
              courseparticipants.length > 0 &&
              courseparticipants[0].name !== ""
                ? renderParticipantsSection()
                : ""
            }            

            <div style="background-color: #f9f9f9; border-left: 4px solid #89c13e; padding: 15px; margin-top: 20px; font-size: 15px;">
              ${
                courseType.includes("Mentoring")
                  ? `<p style="margin: 0;">If you have any questions, feel free to contact us. We look forward to seeing you in class.</p>`
                  : `<p style="margin: 0;">If you have any questions, kindly reply to this email. We look forward to seeing you on <strong>${
                      courseScheduleType === "weekend"
                        ? formatSingleDate(courseSchedule[0])
                        : formatSingleDate(startDate)
                    }</strong>.</p>`
              }
            </div>

            ${
              !courseType.includes("Mentoring")
                ? `
                  <div style="text-align: center; margin-top: 20px;">
                    <p style="font-size: 15px; color: #666;">
                      Click the button below to join the classes on each of the class days.
                    </p>
                    <a href="https://us06web.zoom.us/j/4740587248?pwd=Y0NTc2phUHcxVXV1OTlCUGxGdjU5dz09&omn=89077871808"
                      style="display: inline-block; background-color: #007bff; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: bold;">
                      Join Class
                    </a>
                  </div>
                `
                : ""
            }
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 14px; color: #666; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd;">
            <p style="margin: 5px 0;">© 2025 Rejeses Consult. All rights reserved.</p>
            <p style="margin: 5px 0;">Need help? Contact us at <a href="mailto:info@rejeses.com" style="text-decoration: none;">info@rejeses.com</a></p>
            <p style="margin: 5px 0;"><a href="https://rejeses.com/" style="color: #89c13e; text-decoration: none;">Visit website</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function createPromoEmailTemplate(code: string, expiryDate: Date) {
  return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 30px;">
            
            <!-- Header -->
            <div style="background-color: #074ca6; color: white; text-align: center; padding: 15px; border-radius: 8px 8px 0 0; font-size: 20px;">
              <h1 style="margin: 0;">New Promo Code Generated</h1>
            </div>

            <!-- Body Content -->
            <div style="margin-top: 18px;">
              <p style="font-size: 16px;">
                A new promo code has been successfully generated for this week.
              </p>

              <div style="text-align: center; margin: 20px 0;">
                <span style="background-color: #BA6820; color: white; padding: 10px 15px; font-size: 18px; font-weight: bold; border-radius: 5px; display: inline-block;">
                  ${code}
                </span>
              </div>

              <p style="font-size: 16px;">This code expires on <strong>${formatSingleDate(
                expiryDate
              )}</strong>.</p>

              <div style="background-color: #f9f9f9; border-left: 4px solid #074ca6; padding: 15px; margin-top: 20px; font-size: 15px;">
                <p style="margin: 0;">Ensure to use your promo code before the expiration date!</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; font-size: 14px; color: #666; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd;">
              <p style="margin: 5px 0;">© 2025 Rejeses Consult. All rights reserved.</p>
              <p style="margin: 5px 0;">
                <a href="https://rejeses.com/ style="color: #074ca6; text-decoration: none;">visit website</a>
              </p>
            </div>

          </div>
        </body>
      </html>
    `;
}

export function calculateClassSchedule(
  startDate: Date,
  courseScheduleType: string
): Date[] {
  // Handle weekday schedule
  if (courseScheduleType !== "weekend") {
    const weekSchedule: Date[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 5; i++) {
      weekSchedule.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekSchedule;
  }

  // Weekend schedule logic
  const currentDate = new Date(startDate);

  function getWeekendPair(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get all weekends in the month
    const weekends: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Find first Saturday of the month
    let currentDay = new Date(firstDay);
    while (currentDay.getDay() !== 6) {
      // 6 is Saturday
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Get all weekends (Saturday and Sunday pairs)
    while (currentDay <= lastDay) {
      const saturday = new Date(currentDay);
      const sunday = new Date(currentDay);
      sunday.setDate(sunday.getDate() + 1);

      if (sunday <= lastDay) {
        weekends.push(saturday, sunday);
      }

      currentDay.setDate(currentDay.getDate() + 7);
    }

    // Group weekends into pairs (1&2, 3&4)
    const firstPair = weekends.slice(0, 4); // First two weekends
    const secondPair = weekends.slice(4, 8); // Third and fourth weekends

    // Determine which pair to use based on current date
    const isInFirstHalf = currentDate <= weekends[3];
    const validFirstPair = firstPair.every((date) => date >= currentDate);
    const validSecondPair =
      secondPair.length === 4 &&
      secondPair.every((date) => date >= currentDate);

    if (validFirstPair && isInFirstHalf) {
      return firstPair;
    } else if (validSecondPair) {
      return secondPair;
    }

    // If no valid pairs in current month, get first pair of next month
    const nextMonth = new Date(year, month + 1, 1);
    return getWeekendPair(nextMonth);
  }

  return getWeekendPair(currentDate);
}

export function formatCourseSchedule(dates: (Date | string)[]): string {
  // format individual dates
  const formatDate = (date: Date | string): string => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    const day = parsedDate.getDate();
    const dayName = parsedDate.toLocaleDateString("en-GB", { weekday: "long" });
    const monthName = parsedDate.toLocaleDateString("en-GB", { month: "long" });
    const year = parsedDate.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const formattedDates = dates.map(formatDate);

  return formattedDates.length > 1
    ? `${formattedDates.slice(0, -1).join(", ")} & ${
        formattedDates[formattedDates.length - 1]
      }`
    : formattedDates[0];
}

// might be needed later
export const dateOrdinalSuffix = () => {
  const getOrdinalSuffix = (day: number): string => {
    if (day % 10 === 1 && day !== 11) return `${day}st`;
    if (day % 10 === 2 && day !== 12) return `${day}nd`;
    if (day % 10 === 3 && day !== 13) return `${day}rd`;
    return `${day}th`;
  };
};

export function formatCourseSchedule2(dates: (Date | string)[]): string {
  const formatDate = (date: Date | string): string => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    const day = parsedDate.getDate();
    const dayName = parsedDate.toLocaleDateString("en-GB", { weekday: "long" });
    const monthName = parsedDate.toLocaleDateString("en-GB", { month: "long" });
    const year = parsedDate.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const formattedDates = dates.map(formatDate);

  return formattedDates.map((date) => `${date} <br />`).join("\n");
}

export function formatSingleDate(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  const day = parsedDate.getDate();
  const dayName = parsedDate.toLocaleDateString("en-GB", { weekday: "long" });
  const monthName = parsedDate.toLocaleDateString("en-GB", { month: "long" });
  const year = parsedDate.getFullYear();

  return `${dayName}, ${monthName} ${day}, ${year}`;
}

export const capitalizeCourseScheduleType = (item: string) => {
  const restOfItems = item.slice(1);
  const first = item.charAt(0).toUpperCase() + restOfItems;
  return first;
};

export const notify = (message: string) =>
  toast.error(message, {
    autoClose: 3000,
    hideProgressBar: true,
    theme: "colored",
    toastId: "1",
  });

// Function to get the appropriate email configuration based on environment
export const getEmailConfig = (
  email: string,
  password: string
): EmailConfig => {
  if (process.env.NODE_ENV === "production") {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 0,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    };
  }

  // Development configuration
  return {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "",
      pass: process.env.EMAIL_PASS || "",
    },
  };
};
