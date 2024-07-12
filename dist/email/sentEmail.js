"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
function sendEmail(name, referTo, email, courses) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(courses);
            const emailTemplate = `
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">Hello ${referTo},</h2>
          <p>Your friend <strong>${name}</strong> has referred you the following courses:</p>
          <ul>
            ${courses.map(course => `<li>${course}</li>`).join('')}
          </ul>
          <p>Enroll now and take advantage of these great learning opportunities!</p>
          <p>Best regards,</p>
          <p>The Accredian Team</p>
          <hr />
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
        </div>
      </body>
      </html>
    `;
            const { data, error } = yield resend.emails.send({
                from: 'Accredian <no-reply@yashagrawal.top>',
                to: [email],
                subject: "Courses referred by your friend",
                html: emailTemplate,
            });
            if (error) {
                console.error('Error sending email:', error.message);
                throw new Error('Failed to send email');
            }
            console.log('Email sent successfully:', data);
            return data;
        }
        catch (error) {
            console.error('Error in sendEmail function:', error.message);
            throw error;
        }
    });
}
