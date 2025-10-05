const nodemailer = require("nodemailer");
const { getLast24HoursData } = require("./dataController");


async function sendDailyReport() {
  try {
    const report = await getLast24HoursData();

    if (!report || report.records === 0) {
      throw new Error("No data available in the last 24 hours");
    }

    // Build rows for hourly breakdown
    let rows = "";
    Object.entries(report.hourly)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([hour, d]) => {
        const avgV = d.count ? d.voltageSum / d.count : 0;
        const avgC = d.count ? d.currentSum / d.count : 0;

        rows += `
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">${hour}</td>
            <td style="padding:8px; border:1px solid #ddd;">${d.count}</td>
            <td style="padding:8px; border:1px solid #ddd;">${avgV.toFixed(2)} V</td>
            <td style="padding:8px; border:1px solid #ddd;">${avgC.toFixed(2)} A</td>
            <td style="padding:8px; border:1px solid #ddd;">${d.energy.toFixed(2)} kWh</td>
            <td style="padding:8px; border:1px solid #ddd;">₦${d.billing.toFixed(2)}</td>
          </tr>
        `;
      });

    // Build email HTML
    const emailHtml = `
      <div style="font-family:Arial, sans-serif; color:#333; max-width:600px; margin:auto;">
        <h2 style="color:#2c3e50;">📊 Smart Meter Daily Report</h2>
        <p><strong>Since:</strong> ${new Date(report.since).toLocaleString()}</p>
        <p><strong>Total Records:</strong> ${report.records}</p>
        <p><strong>Total Energy:</strong> ${report.totalEnergy.toFixed(2)} kWh</p>
        <p><strong>Total Billing:</strong> ₦${report.totalBilling.toFixed(2)}</p>
        <br>
        <h3 style="margin-bottom:8px;">Hourly Breakdown</h3>
        <table style="border-collapse:collapse; width:100%; text-align:left; border:1px solid #ddd;">
          <thead>
            <tr style="background:#f4f4f4;">
              <th style="padding:8px; border:1px solid #ddd;">Hour</th>
              <th style="padding:8px; border:1px solid #ddd;">Records</th>
              <th style="padding:8px; border:1px solid #ddd;">Avg Voltage</th>
              <th style="padding:8px; border:1px solid #ddd;">Avg Current</th>
              <th style="padding:8px; border:1px solid #ddd;">Energy</th>
              <th style="padding:8px; border:1px solid #ddd;">Billing</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <br>
        <small style="color:#777;">⚡ Report generated automatically from Firebase Smart Meter Database</small>
      </div>
    `;

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Meter Reports" <${process.env.EMAIL_USER}>`,
      to: process.env.REPORT_RECIPIENTS,
      subject: "🔋 Smart Meter Daily Report",
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Daily report sent with professional HTML format!");
  } catch (err) {
    console.error("❌ Failed to send report:", err.message);
  }
}

module.exports = { sendDailyReport };
