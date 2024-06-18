import { resolve } from 'path'
import type { IMailerConfig } from './interface'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

const initConfig = (): IMailerConfig => ({
  // transport: process.env.GMAIL_TRANSPORT,
  transport: {
    host: process.env.GMAIL_HOST,
    secure: process.env.NODE === 'production' ? true : false,
    auth: {
      user: process.env.GMAIL_APP_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  },
  defaults: {
    from: process.env.GMAIL_APP_EMAIL
  },
  template: {
    dir: resolve(__dirname, './templates'),
    adapter: new HandlebarsAdapter(),
    option: {
      strict: true
    }
  }
})

export const mailerConfig = (): { mailer: IMailerConfig } => ({ mailer: initConfig() })
