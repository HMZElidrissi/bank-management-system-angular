import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '@environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signup', () => {
    it('should send POST request and store user data', () => {
      const mockSignupData = {
        name: 'Test User',
        email: 'hamza@hamza.com',
        password: 'password123'
      };

      const mockResponse = {
        name: 'Test User',
        email: 'hamza@hamza.com',
        role: 'USER'
      };

      service.signup(mockSignupData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockResponse));
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/signup`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSignupData);
      req.flush(mockResponse);
    });
  });

  describe('signin', () => {
    it('should send POST request and store user data', () => {
      const mockSigninData = {
        email: 'hamza@hamza.com',
        password: 'password123'
      };

      const mockResponse = {
        name: 'Test User',
        email: 'hamza@hamza.com',
        role: 'USER'
      };

      service.signin(mockSigninData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockResponse));
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/signin`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSigninData);
      req.flush(mockResponse);
    });
  });

  describe('signout', () => {
    it('should clear local storage and current user', () => {
      const mockUser = {
        name: 'Test User',
        email: 'hamza@hamza.com',
        role: 'USER'
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      service.signout().subscribe(() => {
        expect(localStorage.getItem('currentUser')).toBeNull();
        expect(service.getCurrentUser()).toBeNull();
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/signout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the specified role', () => {
      const mockUser = {
        name: 'Test User',
        email: 'hamza@hamza.com',
        role: 'ADMIN'
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service['currentUserSubject'].next(mockUser);
      expect(service.hasRole('ADMIN')).toBeTrue();
    });

    it('should return false when user does not have the specified role', () => {
      const mockUser = {
        name: 'Test User',
        email: 'hamza@hamza.com',
        role: 'USER'
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      expect(service.hasRole('ADMIN')).toBeFalse();
    });

    it('should return false when no user is logged in', () => {
      localStorage.clear();
      expect(service.hasRole('ADMIN')).toBeFalse();
    });
  });
});
