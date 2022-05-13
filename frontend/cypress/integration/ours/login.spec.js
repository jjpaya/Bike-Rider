/// <reference types="cypress" />
describe('beginning', () => {
    beforeEach(() => {
        cy.setCookie('cookiesAccepted', 'true')
        cy.visit('/')
    })

    it('Should login successfully', () => {
        cy.get('.css-2uchni > .MuiButtonBase-root > .material-icons').click()
        cy.get('#mui-1').type('12345678Z')
        cy.get('#mui-2').type('admin')
        cy.get('.MuiButton-root').click()

        // check if toaster appeared
        cy.get('.MuiSnackbar-root > .MuiPaper-root')

        // check if user avatar is visible
        cy.get('.MuiAvatar-root')

        // check login worked
        cy.getCookie('brsession').should('exist')
    })
})
