// / <reference types="Cypress" />

// Hack to avoid basic auth on Electron browser startup:
// https://github.com/cypress-io/cypress/issues/1639
const url = Cypress.env('baseUrlHack');

describe('Posts', () => {
  beforeEach(() => {
    // API call example
    cy.request(`${url}/api/posts?offset=0&limit=1`)
      .then(response => {
        cy.log(JSON.stringify(response.body.data[0]));
      });

    // Database call example
    // NOTE: Prefer API calls.
    cy.task('sql', 'select * from posts limit 1').then(data => {
      cy.log(JSON.stringify(data));
    });

    // Navigate to posts and clear the form
    cy.visit(`${url}/`);
    cy.get('[data-test=open-left-drawer]').click();
    cy.get('[data-test=navigate-to-posts]').click();
    cy.get('input').clear();
    cy.get('textarea').clear({ force: true });
  });

  it('Submits a new post', () => {
    const random = Math.floor(Math.random() * 100000000);

    cy.get('[data-test=subject-field]')
      .find('input')
      .type(`subject-${random}`);
    cy.get('[data-test=author-field]')
      .find('input')
      .type(`author-${random}`);
    cy.get('[data-test=content-field]')
      .find('textarea')
      .not('[readonly]')
      .type(`content-${random}`);
    cy.get('[data-test=add-post]').click();

    // Assert
    cy.get('[data-test=posts]')
      .should('contain', `subject-${random}`)
      .and('contain', `author-${random}`)
      .and('contain', `content-${random}`);

    // Assert: API call example
    cy.request(`${url}/api/posts?offset=0&limit=20`).then(response => {
      const post = response.body.data[0];
      expect(post).to.have.property('subject', `subject-${random}`);
      expect(post).to.have.property('author', `author-${random}`);
      expect(post).to.have.property('content', `content-${random}`);
    });
  });
});
