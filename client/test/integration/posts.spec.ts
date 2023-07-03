describe('Posts', () => {
  beforeEach(() => {
    // REST API call example
    // TODO: Add GraphQL example
    cy.request('/api/posts?offset=0&limit=1').then(response => {
      cy.log(JSON.stringify(response.body.data[0]));
    });

    // Database call example
    // NOTE: Prefer API calls.
    // TODO: Fails in SSL error locally?
    // cy.task('sql', 'select * from post limit 1').then(data => {
    //   cy.log(JSON.stringify(data));
    // });

    // Navigate to posts and clear the form
    cy.visit('/');
    cy.get('[data-test-id=login]').click();
    cy.get('[data-test-id=navigate-to-blog]').click();
    cy.get('[data-test-id=navigate-to-create-post]').click();
    cy.get('input').clear();
    cy.get('textarea').clear({ force: true });
  });

  it('Submits a new post', () => {
    const random = Math.floor(Math.random() * 100000000);

    cy.get('input[data-test-id=subject-field]').type(`subject-${random}`);
    cy.get('input[data-test-id=author-field]').type(`author-${random}`);
    cy.get('textarea[data-test-id=content-field]').type(`content-${random}`);
    cy.get('[data-test-id=submit-post]').click();

    // Assert
    cy.get('[data-test-id=post-list]').should('contain', `subject-${random}`);

    // Assert: API call example
    // TODO: Add GraphQL example
    cy.request('/api/posts?offset=0&limit=20').then(response => {
      const post = response.body.data[0];
      expect(post).to.have.property('subject', `subject-${random}`);
      expect(post).to.have.property('author', `author-${random}`);
      expect(post).to.have.property('content', `content-${random}`);
    });
  });
});
