import { Attachment } from 'nodemailer/lib/mailer'

export type TMailPayload = {
  to: string
  subject: string
  cc?: string | string[]
  text?: string
  from?: string
  sender?: string
  template: string
  attachments?: Attachment[]
  context: Record<string, unknown>
}
