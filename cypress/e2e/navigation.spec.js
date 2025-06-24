/* global cy, describe, it, beforeEach */

describe('Sidebar Navigation', () => {
  beforeEach(() => {
    // Visit the app using Vite dev server
    cy.visit('/');
  });

  it('expands all sidebar categories and navigates every menu item', () => {
    // Expand all categories to reveal sub-items
    cy.get('button[aria-controls^="category-"]').each(($toggleBtn) => {
      cy.wrap($toggleBtn).click();
    });

    // Click each navigation button (excluding category toggles) and assert it becomes active
    cy.get('nav button:not([aria-controls])').each(($btn) => {
      cy.wrap($btn)
        .click()
        .should('have.attr', 'aria-current', 'page');
    });
  });
}); 