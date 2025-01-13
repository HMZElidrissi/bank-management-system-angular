describe('Sign In', () => {
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
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/auth/signin');
  });

  describe('UI Elements', () => {
    it('should display all required sign in form elements', () => {
      cy.get('input[formControlName="email"]').should('be.visible');
      cy.get('input[formControlName="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Sign In');
      cy.get('a').contains('Create an account').should('be.visible');
    });

    it('should have proper input types for security', () => {
      cy.get('input[formControlName="email"]').should('have.attr', 'type', 'email');
      cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('should validate empty form submission', () => {
      // Focus and blur each field to trigger validation
      cy.get('input[formControlName="email"]').focus().blur();
      cy.get('input[formControlName="password"]').focus().blur();

      // Check for error messages
      cy.get('.text-red-600').should('have.length.at.least', 2);
      cy.get('.text-red-600').first().should('contain', errors.requiredEmail);
      cy.get('.text-red-600').last().should('contain', errors.requiredPassword);
    });

    it('should validate invalid email format', () => {
      cy.get('input[formControlName="email"]').type('invalid-email').blur();
      cy.get('.text-red-600').should('contain', errors.invalidEmail);
    });

    it('should disable submit button for invalid form', () => {
      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('input[formControlName="email"]').type('hamza@example');
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should enable submit button for valid form', () => {
      cy.get('input[formControlName="email"]').type('hamza@example.com');
      cy.get('input[formControlName="password"]').type('password123');
      // Wait for form validation to complete
      cy.wait(100);
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  });

  describe('Authentication Flow', () => {
    it('should successfully sign in with valid credentials', () => {
      // Setup intercept for the correct port
      cy.intercept('POST', '/api/v1/auth/signin', {
        statusCode: 200,
        body: users.validUser
      }).as('signIn');

      cy.get('input[formControlName="email"]').type('hamza@example.com');
      cy.get('input[formControlName="password"]').type('password123');
      cy.get('button[type="submit"]').should('not.be.disabled').click();

      cy.wait('@signIn').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/dashboard');
    });

    it('should show loading state during submission', () => {
      cy.intercept('POST', '/api/v1/auth/signin', {
        statusCode: 200,
        body: users.validUser,
        delay: 1000
      }).as('signInDelay');

      cy.get('input[formControlName="email"]').type('hamza@example.com');
      cy.get('input[formControlName="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('button[type="submit"]').should('be.disabled').and('contain', 'Signing in...');
    });

    it('should handle invalid credentials', () => {
      cy.intercept('POST', '/api/v1/auth/signin', {
        statusCode: 401,
        body: { message: errors.invalidCredentials },
        delay: 100
      }).as('invalidSignIn');

      cy.get('input[formControlName="email"]').type('invalid@example.com');
      cy.get('input[formControlName="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.wait('@invalidSignIn');
      // Try multiple possible alert selectors
      cy.get('[role="alert"], .alert, .error-message')
        .should('be.visible')
        .and('contain', errors.invalidCredentials);
    });
  });

  describe('Navigation', () => {
    it('should redirect to signup page', () => {
      cy.get('a').contains('Create an account').click();
      cy.url().should('include', '/auth/signup');
    });

    it('should redirect to correct return URL after login', () => {
      const returnUrl = '/dashboard';
      cy.visit(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);

      cy.intercept('POST', '/api/v1/auth/signin', {
        statusCode: 200,
        body: users.validUser
      }).as('signIn');

      cy.get('input[formControlName="email"]').type('hamza@example.com');
      cy.get('input[formControlName="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.wait('@signIn');
      // Add a small delay to allow for navigation
      cy.wait(100);
      cy.url().should('include', returnUrl);
    });
  });
});
