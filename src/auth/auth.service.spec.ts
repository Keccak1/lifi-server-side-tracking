import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { AuthService } from './auth.service';
import {
  CLIENT_ID_COOKIE,
  CLIENT_ID_COOKIE_DURATION,
  SESSION_COOKIE_DURATION,
  SESSION_ID_COOKIE,
} from './constants';

describe('AuthService', () => {
  let service: AuthService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseSendSpy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: LoggerService,
          useValue: {
            error: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockRequest = {
      cookies: {},
    };
    responseSendSpy = jest.fn();
    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: responseSendSpy,
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
    it('should throw ConflictException if user already logged in', async () => {
      mockRequest.cookies = {
        [CLIENT_ID_COOKIE]: 'test-client-id',
      };

      await expect(
        service.logIn(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(ConflictException);
    });

    it("should return 'User logged in after successful login", async () => {
      service.logIn(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        CLIENT_ID_COOKIE,
        expect.any(String),
        expect.any(Object),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseSendSpy).toHaveBeenCalledWith({
        message: 'User logged in',
        statusCode: 200,
      });
    });

    it('should set proper cookies after successful login', async () => {
      const mockReq = { cookies: {} } as Partial<Request>;
      const mockRes = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as Partial<Response>;

      await service.logIn(mockReq as Request, mockRes as Response);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        CLIENT_ID_COOKIE,
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          maxAge: CLIENT_ID_COOKIE_DURATION,
        }),
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        SESSION_ID_COOKIE,
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          maxAge: SESSION_COOKIE_DURATION,
        }),
      );
    });
  });

  describe('logOut', () => {
    it('should throw BadRequestException if user not logged in', async () => {
      mockRequest.cookies = {};

      await expect(
        service.logOut(mockRequest as Request, mockResponse as Response),
      ).rejects.toThrow(BadRequestException);
    });

    it("should return 'User logged out' after successful logout", async () => {
      mockRequest.cookies = {
        [CLIENT_ID_COOKIE]: 'test-client-id',
      };

      service.logOut(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseSendSpy).toHaveBeenCalledWith({
        message: 'User logged out',
        statusCode: 200,
      });
    });

    it('should clear cookies after successful logout', async () => {
      const mockReq = {
        cookies: {
          [CLIENT_ID_COOKIE]: 'test-client-id',
        },
      } as Partial<Request>;
      const mockRes = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as Partial<Response>;

      await service.logOut(mockReq as Request, mockRes as Response);

      expect(mockRes.clearCookie).toHaveBeenCalledWith(CLIENT_ID_COOKIE);
      expect(mockRes.clearCookie).toHaveBeenCalledWith(SESSION_ID_COOKIE);
    });
  });

  describe('validateCookies', () => {
    it("should return false if client cookie doesn't exist", () => {
      const result = service.validateCookies(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(result).toBe(false);
    });

    it('should return true if client cookie exists', () => {
      mockRequest.cookies = {
        [CLIENT_ID_COOKIE]: 'test-client-id',
      };

      const result = service.validateCookies(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(result).toBe(true);
    });

    it('should set proper cookies if session cookie does not exist', () => {
      mockRequest.cookies = {
        [CLIENT_ID_COOKIE]: 'test-client-id',
      };

      service.validateCookies(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        SESSION_ID_COOKIE,
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          maxAge: SESSION_COOKIE_DURATION,
        }),
      );
    });
  });
});
