import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerService } from '../logger/logger.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            validateCookies: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should allow access when cookies are valid', async () => {
    jest.spyOn(authService, 'validateCookies').mockReturnValue(true);

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;

    expect(await authGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should deny access when cookies are invalid', async () => {
    jest.spyOn(authService, 'validateCookies').mockReturnValue(false);

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;

    expect(await authGuard.canActivate(mockExecutionContext)).toBe(false);
  });
});
