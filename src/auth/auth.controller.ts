import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('log-in')
  async login(@Req() req: Request, @Res() res: Response) {
    return this.authService.logIn(req, res);
  }

  @Post('log-out')
  async logOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.logOut(req, res);
  }

  @Get('is-logged-in')
  async isLoggedInt(@Req() req: Request, @Res() res: Response) {
    return this.authService.isLoggedIn(req, res);
  }
}
