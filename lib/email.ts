import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, html }: {
  to: string; subject: string; html: string
}) {
  return resend.emails.send({
    from: `ScaleGroupe <${process.env.EMAIL_FROM || 'noreply@scalegroupe.de'}>`,
    to,
    subject,
    html,
  })
}
