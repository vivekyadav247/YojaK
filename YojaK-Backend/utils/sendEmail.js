const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const buildInviteEmail = ({
  senderName,
  tripTitle,
  tripDestination,
  startDate,
  endDate,
}) => {
  const frontendUrl = process.env.FRONTEND_URL || "https://yojak.vivekdev.live";
  const acceptUrl = `${frontendUrl}/invites`;
  const formattedStart = startDate
    ? new Date(startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const formattedEnd = endDate
    ? new Date(endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const dateRange =
    formattedStart && formattedEnd ? `${formattedStart} – ${formattedEnd}` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#EEE9DA;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEE9DA;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#6096B4 0%,#93BFCF 100%);padding:36px 40px 28px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:16px;padding:12px 20px;margin-bottom:16px;">
                <span style="font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">YojaK</span>
              </div>
              <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;letter-spacing:0.5px;">Plan trips together, effortlessly</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="color:#1F2933;font-size:22px;font-weight:700;margin:0 0 8px;">You're Invited! 🎉</h1>
              <p style="color:#52606D;font-size:15px;line-height:1.6;margin:0 0 24px;">
                <strong style="color:#1F2933;">${senderName}</strong> has invited you to join a trip on YojaK.
              </p>

              <!-- Trip details card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f0f7fa 0%,#e8f0f4 100%);border-radius:16px;border:1px solid #BDCDD6;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="color:#6096B4;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px;">Trip Details</p>
                    <p style="color:#1F2933;font-size:20px;font-weight:700;margin:0 0 6px;">${tripTitle}</p>
                    ${tripDestination ? `<p style="color:#52606D;font-size:14px;margin:0 0 4px;">📍 ${tripDestination}</p>` : ""}
                    ${dateRange ? `<p style="color:#52606D;font-size:14px;margin:0;">📅 ${dateRange}</p>` : ""}
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${acceptUrl}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#F59E0B 0%,#f7b731 100%);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 48px;border-radius:12px;box-shadow:0 4px 12px rgba(245,158,11,0.3);">
                      View Invite →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#8a9bae;font-size:13px;text-align:center;margin:24px 0 0;line-height:1.5;">
                Sign up or log in to YojaK, complete your profile,<br/>and accept the invite to join the trip!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f6f1;padding:20px 40px;text-align:center;border-top:1px solid #BDCDD6;">
              <p style="color:#8a9bae;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} YojaK — Plan trips together
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const sendInviteEmail = async ({
  to,
  senderName,
  tripTitle,
  tripDestination,
  startDate,
  endDate,
}) => {
  const html = buildInviteEmail({
    senderName,
    tripTitle,
    tripDestination,
    startDate,
    endDate,
  });

  await transporter.sendMail({
    from: `"YojaK" <${process.env.SMTP_USER}>`,
    to,
    subject: `${senderName} invited you to join "${tripTitle}" on YojaK!`,
    html,
  });
};

module.exports = { sendInviteEmail };
