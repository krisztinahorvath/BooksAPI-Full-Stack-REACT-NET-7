describe('Show All Authors', () => {
  it('should navigate through the pages correctly', () => {
    cy.visit("http://localhost:5173/authors");
    cy.get('ul').children().eq(2).click(); // click the second page
    cy.contains('11');
  });
});