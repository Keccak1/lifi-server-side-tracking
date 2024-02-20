import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      logIn: jest.fn(),
      logOut: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.logIn with the request and response', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.login(req, res);

      expect(authService.logIn).toHaveBeenCalledWith(req, res);
    });
  });

  describe('logOut', () => {
    it('should call authService.logOut with the request and response', async () => {
      const req = {} as Request;
      const res = {} as Response;

      await controller.logOut(req, res);

      expect(authService.logOut).toHaveBeenCalledWith(req, res);
    });
  });
});
