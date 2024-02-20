import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../logger/logger.service';
import {
  CLIENT_ID_COOKIE,
  CLIENT_ID_COOKIE_DURATION,
  SESSION_COOKIE_DURATION,
  SESSION_ID_COOKIE,
} from './constants';

@Injectable()
export class AuthService {
  constructor(private readonly loggerService: LoggerService) {}
  async logIn(req: Request, res: Response) {
    this.loggerService.debug('User login request');
    if (this.cookieExists(req, CLIENT_ID_COOKIE)) {
      this.loggerService.error('User already logged in');
      throw new ConflictException('User already logged in');
    }
    const clientId = this.generateClientId();
    const sessionId = this.generateSessionId();
    this.assignClientCookieToResponse(res, clientId);
    this.assignSessionCookieToResponse(req, res, sessionId);

    res
      .status(HttpStatus.OK)
      .send({ message: 'User logged in', statusCode: HttpStatus.OK });
  }

  async logOut(req: Request, res: Response) {
    if (!this.cookieExists(req, CLIENT_ID_COOKIE)) {
      this.loggerService.error('User not logged in');
      throw new BadRequestException('User not logged in');
    }
    res.clearCookie(CLIENT_ID_COOKIE);
    res.clearCookie(SESSION_ID_COOKIE);
    res
      .status(HttpStatus.OK)
      .send({ message: 'User logged out', statusCode: HttpStatus.OK });
  }

  async isLoggedIn(req: Request, res: Response) {
    console.log('check');
    this.loggerService.log('User login status request');
    console.log(req.cookies[CLIENT_ID_COOKIE], req.cookies[SESSION_ID_COOKIE]);
    if (this.validateCookies(req, res)) {
      res
        .status(HttpStatus.OK)
        .send({ message: 'User is logged in', statusCode: HttpStatus.OK });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send({
        message: 'User is not logged in',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  validateCookies(req: Request, res: Response): boolean {
    const clientId = this.getCookie(req, CLIENT_ID_COOKIE);
    if (!clientId) {
      return false;
    }

    const sessionId =
      this.getCookie(req, SESSION_ID_COOKIE) || this.generateSessionId();
    this.assignSessionCookieToResponse(req, res, sessionId);
    this.assignClientCookieToResponse(res, clientId);

    return true;
  }

  cookieExists(req: Request, cookieName: string): boolean {
    return !!this.getCookie(req, cookieName);
  }

  getCookie(request: Request, cookieName: string): null | string {
    if (request.cookies && request.cookies[cookieName]) {
      return request.cookies[cookieName];
    }
    return null;
  }

  private assignClientCookieToResponse(response: Response, value: string) {
    this.setCookieInResponse(
      response,
      CLIENT_ID_COOKIE,
      value,
      CLIENT_ID_COOKIE_DURATION,
    );
  }

  private assignSessionCookieToResponse(
    req: Request,
    res: Response,
    value: string,
  ) {
    this.setCookieInResponse(
      res,
      SESSION_ID_COOKIE,
      value,
      SESSION_COOKIE_DURATION,
    );

    req['sessionData'] = { session: value };
  }

  private setCookieInResponse(
    response: Response,
    cookieName: string,
    cookieValue: string,
    maxAge: number,
  ) {
    response.cookie(cookieName, cookieValue, {
      httpOnly: true,
      secure: true,
      // TODO: only for development!
      // sameSite: 'strict',
      maxAge: maxAge,
    });
  }

  private generateClientId(): string {
    return `ca_${uuidv4()}`;
  }

  private generateSessionId(): string {
    return `sa_${uuidv4()}`;
  }
}
