import { HttpException, HttpStatus, ValidationError } from '@nestjs/common'

type ErrorDetail = {
  field: string
  message: string
}

export type CustomExceptionInformation = {
  statusCode: number
  message: string
  errorDetails?: ErrorDetail[]
}

export class CustomException extends HttpException {
  private readonly customInformation: CustomExceptionInformation

  constructor(statusCode: HttpStatus, message: string, errorDetails?: ErrorDetail[]) {
    super(message, statusCode)
    this.customInformation = {
      statusCode,
      message,
      errorDetails
    }
  }

  getResponse(): CustomExceptionInformation {
    return this.customInformation
  }
}

export class CustomBadRequestException extends CustomException {
  constructor(message: string, errorDetails?: ErrorDetail[]) {
    super(HttpStatus.BAD_REQUEST, message, errorDetails)
  }

  static fromValidationErrors(errors: ValidationError[]): CustomBadRequestException {
    const data: ErrorDetail[] = []
    const parseErrors = (
      errs: ValidationError[],
      result: ErrorDetail[],
      parentProperty?: string
    ): void => {
      errs.forEach((error) => {
        const property = parentProperty ? `${parentProperty}.${error.property}` : error.property
        if (error.constraints) {
          result.push({
            field: property,
            message: error.constraints[Object.keys(error.constraints)[0]]
          })
        } else if (error.children?.length) {
          parseErrors(error.children, result, property)
        }
      })
    }
    parseErrors(errors, data)

    return new CustomBadRequestException('Validation failed', data)
  }
}
