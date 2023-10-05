describe('Show All Authors', () => {
  it('should load the page correctly', () => {
    cy.visit("http://localhost:5173/authors");
    cy.contains('All authors');
    cy.get('table');
  });
});