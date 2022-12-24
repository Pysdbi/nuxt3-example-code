// https://docs.cypress.io/api/introduction/api.html

describe("Тест авторизации", () => {
    it("Пытаемся зайти на главную страницу, но нас должно редиректить на авторизацию", () => {
        cy.visit("/");
        cy.url().should("include", "/auth");
    });

    it("Проверка заведомо неизвестного EID", () => {
        cy.visit("/auth");
        //cy.get("#tab-eid").click();
        cy.get(".badge-input input").type("---").type("{enter}");
        cy.get(".error.error_visible").should("exist");
    });

    it("Проверка правильной авторизации", () => {
        cy.visit("/auth");
        cy.get(".badge-input input").type("123").type("{enter}");
        cy.get(".layout-default").should("exist");
    });
});
