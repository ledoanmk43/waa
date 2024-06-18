import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

export interface IMailerConfig {
  transport?:
    | string
    | {
        host?: string
        port?: number
        secure?: boolean
        auth?: {
          user: string
          pass: string
        }
      }
  defaults: {
    from: string
  }
  template: {
    dir: string
    adapter: HandlebarsAdapter
    option: {
      strict: boolean
    }
  }
}
