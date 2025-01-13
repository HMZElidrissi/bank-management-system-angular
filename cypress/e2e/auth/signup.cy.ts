describe('Sign Up', () => {
  let users: any;
  let errors: any;

  before(() => {
    cy.fixture('users').then((userData) => {
      users = userData;
    });
    cy.fixture('auth-errors').then((errorData) => {
      errors = errorData;
    });
  });

  beforeEach(() => {
    cy.visit('/auth/signup');
  });

  describe('UI Elements', () => {
    it('should display all required sign up form elements', () => {
      cy.get('input[formControlName="name"]').should('be.visible');
      cy.get('input[formControlName="email"]').should('be.visible');
      cy.get('input[formControlName="password"]').should('be.visible');
      cy.get('input[formControlName="confirmPassword"]').should('be.visible');
      cy.get('button[type="submit"]').contains('Sign Up').should('be.visible');
      cy.get('a[routerLink="/auth/signin"]').contains('Sign in instead').should('be.visible');
    });

    it('should have proper input types for security', () => {
      cy.get('input[formControlName="email"]').should('have.attr', 'type', 'email');
      cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');
      cy.get('input[formControlName="confirmPassword"]').should('have.attr', 'type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('should validate empty form submission', () => {
      cy.get('input[formControlName="name"]').focus().blur();
      cy.get('input[formControlName="email"]').focus().blur();
      cy.get('input[formControlName="password"]').focus().blur();
      cy.get('input[formControlName="confirmPassword"]').focus().blur();

      cy.get('.text-red-600').first().should('contain', errors.requiredName);
      cy.get('.text-red-600').eq(1).should('contain', errors.requiredEmail);
      cy.get('.text-red-600').eq(2).should('contain', errors.requiredPassword);
      cy.get('.text-red-600').last().should('contain', errors.requiredConfirmPassword);
    });

    it('should validate name length', () => {
      cy.get('input[formControlName="name"]').type(users.invalidSignup.name).blur();
      cy.hasErrors([errors.shortName]);
    });

    it('should validate email format', () => {
      cy.get('input[formControlName="email"]').type(users.invalidSignup.email).blur();
      cy.hasErrors([errors.invalidEmail]);
    });

    it('should validate password length', () => {
      cy.get('input[formControlName="password"]').type(users.invalidSignup.password).blur();
      cy.hasErrors([errors.shortPassword]);
    });

    it('should validate password match', () => {
      cy.get('input[formControlName="password"]').type(users.newUser.password);
      cy.get('input[formControlName="confirmPassword"]').type('different').blur();
      cy.hasErrors([errors.passwordMismatch]);
    });
  });

  describe('Registration Flow', () => {
    it('should successfully register a new user', () => {
      cy.intercept('POST', '/api/v1/auth/signup').as('signup');

      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;

      cy.get('input[formControlName="name"]').type(users.newUser.name);
      cy.get('input[formControlName="email"]').type(email);
      cy.get('input[formControlName="password"]').type(users.newUser.password);
      cy.get('input[formControlName="confirmPassword"]').type(users.newUser.password);
      cy.get('button[type="submit"]').click();

      cy.wait('@signup').its('response.statusCode').should('eq', 201);
      cy.checkAuthenticatedState(true);
    });

    it('should show loading state during registration', () => {
      cy.intercept('POST', '/api/v1/auth/signup', (req) => {
        req.reply({ delay: 1000, statusCode: 201, body: users.newUser });
      }).as('signupDelay');

      cy.get('input[formControlName="name"]').type(users.newUser.name);
      cy.get('input[formControlName="email"]').type(users.newUser.email);
      cy.get('input[formControlName="password"]').type(users.newUser.password);
      cy.get('input[formControlName="confirmPassword"]').type(users.newUser.password);
      cy.get('button[type="submit"]').click();

      cy.get('button[type="submit"]').should('be.disabled').and('contain', 'Creating Account...');
      cy.get('lucide-icon.animate-spin').should('be.visible');
    });

    it('should handle existing email error', () => {
      cy.intercept('POST', '/api/v1/auth/signup', {
        statusCode: 409,
        body: { message: errors.emailExists }
      }).as('signupError');

      cy.get('input[formControlName="name"]').type(users.existingUser.name);
      cy.get('input[formControlName="email"]').type(users.existingUser.email);
      cy.get('input[formControlName="password"]').type(users.existingUser.password);
      cy.get('input[formControlName="confirmPassword"]').type(users.existingUser.password);
      cy.get('button[type="submit"]').click();

      cy.wait('@signupError');
      cy.get('[role="alert"]').should('contain', errors.emailExists);
      cy.checkAuthenticatedState(false);
    });

    it('should handle server errors gracefully', () => {
      cy.intercept('POST', '/api/v1/auth/signup', {
        statusCode: 500,
        body: { message: errors.unexpectedError }
      }).as('signupServerError');

      cy.get('input[formControlName="name"]').type(users.newUser.name);
      cy.get('input[formControlName="email"]').type(users.newUser.email);
      cy.get('input[formControlName="password"]').type(users.newUser.password);
      cy.get('input[formControlName="confirmPassword"]').type(users.newUser.password);
      cy.get('button[type="submit"]').click();

      cy.wait('@signupServerError');
      cy.get('[role="alert"]').should('contain', errors.unexpectedError);
    });
  });

  describe('Navigation', () => {
    it('should redirect to signin page', () => {
      cy.get('a[routerLink="/auth/signin"]').click();
      cy.url().should('include', '/auth/signin');
    });

    it('should redirect to specified return URL after registration', () => {
      const returnUrl = '/dashboard';
      cy.visit(`/auth/signup?returnUrl=${returnUrl}`);

      cy.intercept('POST', '/api/v1/auth/signup', {
        statusCode: 200,
        body: users.newUser
      }).as('signup');

      cy.get('input[formControlName="name"]').type(users.newUser.name);
      cy.get('input[formControlName="email"]').type(users.newUser.email);
      cy.get('input[formControlName="password"]').type(users.newUser.password);
      cy.get('input[formControlName="confirmPassword"]').type(users.newUser.password);
      cy.get('button[type="submit"]').click();

      cy.wait('@signup');
      cy.wait(1000);

      cy.url().should('include', returnUrl);
    });
  });
});
