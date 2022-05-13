/// <reference types="cypress" />
describe('beginning', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Should have a login button', () => {
        cy.get('.css-2uchni > .MuiButtonBase-root > .material-icons')
    })

    it('Should have a zoom in button', () => {
        cy.get('[aria-label="Zoom in"]')
    })

    it('Should have the app logo image', () => {
        cy.get('.css-1r00tlo')
    })
})
