import { Public } from '@common/decorators'
import { JwtAccessGuard } from '@common/guards'
import { TCustomRequest } from '@core/auth/types'
import { ConfigService } from '@infra/config/config.service'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { ForgotPasswordDto, GetContactDto } from './dtos'
import { User } from './entities'
import { UserService } from './services'

@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAccessGuard)
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getUserById(@Req() { user }: TCustomRequest): Promise<User> {
    return this._userService.searchUserById(user.id)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this._userService.sendEmailResetUserPassword(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-new-password')
  compareAndChangePassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this._userService.sendEmailResetUserPassword(dto)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('get-contact')
  async getContact(@Body() dto: GetContactDto) {
    const { countryCd, officeCode, service, eventId1, eventId2, eventId3, triggerPoint = '' } = dto

    try {
      const serviceAccountAuth = new JWT({
        email: this._configService.get<string>('GOOGLE_SHEET_EMAIL'),
        key: this._configService.get<string>('GOOGLE_SHEET_PRIVATE_KEY'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      })

      const doc = new GoogleSpreadsheet(
        '10kqGCragrjNfTHKR07qBYMcXgJw3r80W3g6cHpTaVoM',
        serviceAccountAuth
      )
      await doc.loadInfo() // loads document properties and worksheets

      const sheet = doc.sheetsByIndex[0] // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
      const rows = await sheet.getRows()
      const targetHeader = sheet.headerValues.slice(1, 9) // from B to I (8 columns)

      const result =
        rows
          .find(
            (row) =>
              row.get(String(targetHeader[0])) === countryCd &&
              row.get(String(targetHeader[1])) === officeCode &&
              row.get(String(targetHeader[2])) === service &&
              row.get(String(targetHeader[3])) === eventId1 &&
              row.get(String(targetHeader[4])) === eventId2 &&
              row.get(String(targetHeader[5])) === eventId3 &&
              row.get(String(targetHeader[6])) === triggerPoint
          )
          ?.get(String(targetHeader[7])) || null

      return {
        email: result
      }
    } catch (err) {
      console.log(err)
      throw new HttpException(err?.message, HttpStatus.BAD_REQUEST)
    }
  }
}
