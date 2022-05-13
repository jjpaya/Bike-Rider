/// <reference types="cypress" />
describe('beginning', () => {
    before(() => {
        cy.visit('/')
    })

    after(() => {
        cy.get('[data-testid="CloseIcon"] > path').click()
        cy.get('.MuiAvatar-root').click()
        cy.get(':nth-child(4) > .MuiTypography-root').click()
        cy.get('.css-2uchni > .MuiButtonBase-root > .material-icons')
    })

    it('Should set the cookies accepted cookie', () => {
        cy.get('.MuiButton-root').click()
        cy.getCookie('cookiesAccepted').should('have.property', 'value', 'true')
    })

    it('Should login successfully and successfully get the station list', () => {
        cy.setCookie('cookiesAccepted', 'true')
        cy.get('.css-2uchni > .MuiButtonBase-root > .material-icons').click()
        cy.get('#mui-1').type('12345678Z')
        cy.get('#mui-2').type('admin')
        cy.get('.MuiButton-root').click()
        cy.get('.MuiSnackbar-root > .MuiPaper-root')
        cy.get('.MuiAvatar-root')

        // check login worked
        cy.getCookie('brsession').should('exist')

        cy.request('/api/stations/client')
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.results.length).to.be.at.least(0)
            })
    })
})
