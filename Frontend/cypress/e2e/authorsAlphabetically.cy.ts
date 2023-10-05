describe('Show All Authors', () => {
  it('should sort the authors alphabetically', () => {
    cy.visit("http://localhost:5173/authors/ordered-authors");
    cy.get('table').find('tr').eq(1).should('contain', 'Adam Matthews');
  });
});