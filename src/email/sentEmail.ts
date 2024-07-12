import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(name: string, referTo: string, email: string, courses: string[]) {
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

    const { data, error } = await resend.emails.send({
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

  } catch (error:any) {
    console.error('Error in sendEmail function:', error.message);
    throw error;
  }
}
