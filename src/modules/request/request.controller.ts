import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { RequestService } from './request.service';
import { Request as RequestEntity } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReqUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-guard';

@ApiBearerAuth()
@ApiTags('Request')
@UseGuards(JwtAuthGuard)
@Controller('request')
export class RequestController {
  static LOGGER = new Logger('Request', true);

  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Successful' })
  async getAll(
    @Query('onlyMine') onlyMine: string,
    @ReqUser() user: any,
  ): Promise<RequestEntity[]> {
    return await this.requestService.getAll(user, onlyMine);
  }

  @ApiCreatedResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Add a complete request including articles.',
    type: RequestEntity,
  })
  @Post()
  async insertRequestWithArticles(
    @Body() createRequestDto: CreateRequestDto,
    @ReqUser() user: any,
  ): Promise<RequestEntity> {
    RequestController.LOGGER.log(user);
    return this.requestService.create(createRequestDto, user);
  }
}
