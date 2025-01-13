declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      checkFormValidation(formSelector: string, submitButtonSelector: string): Chainable<void>;
      hasErrors(errors: string[]): Chainable<void>;
      checkAuthenticatedState(isAuthenticated: boolean): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/signin');
  cy.get('input[formControlName="email"]').type(email);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add(
  'checkFormValidation',
  (formSelector: string, submitButtonSelector: string) => {
    cy.get(formSelector).within(() => {
      cy.get(submitButtonSelector).should('be.disabled');
      cy.get('input').each(($input) => {
        if ($input.prop('required')) {
          cy.wrap($input).focus().blur();
          cy.wrap($input).parent().parent().find('.text-red-600').should('be.visible');
        }
      });
    });
  }
);

Cypress.Commands.add('hasErrors', (errors: string[]) => {
  errors.forEach((error) => {
    cy.get('.text-red-600').should('contain', error);
  });
});

Cypress.Commands.add('checkAuthenticatedState', (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    cy.url().should('include', '/dashboard');
    cy.getCookie('jwt-token').should('exist');
    cy.window().its('localStorage').invoke('getItem', 'currentUser').should('exist');
  } else {
    cy.url().should('include', '/auth');
    cy.getCookie('jwt-token').should('not.exist');
    cy.window().its('localStorage').invoke('getItem', 'currentUser').should('not.exist');
  }
});

export {};
