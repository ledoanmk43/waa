import { PublicMetadata } from '@core/auth/constants'
import { SetMetadata } from '@nestjs/common'
export const Public = () => SetMetadata(PublicMetadata, true)
