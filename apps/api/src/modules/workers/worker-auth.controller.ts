import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { WorkersService } from "./workers.service";
import { SendOtpDto, VerifyOtpDto, SelfRegisterDto } from "./dto/worker-auth.dto";

// Notice: NO @UseGuards(AuthGuard) here. This is a public API for workers.
@Controller("workers/auth")
export class WorkerAuthController {
  constructor(private readonly workersService: WorkersService) {}

  @Post("send-otp")
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.workersService.sendOtp(dto.mobile);
  }

  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.workersService.verifyOtp(dto.mobile, dto.otp);
  }

  @Post("self-register")
  async selfRegister(@Body() dto: SelfRegisterDto) {
    return this.workersService.selfRegisterWorker(dto);
  }
}
