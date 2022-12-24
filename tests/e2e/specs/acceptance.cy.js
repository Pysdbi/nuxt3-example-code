import stickers from "../support/stickers.js"

Cypress.Cookies.debug(true)

describe("Тест приемки товаров", () => {
  it("Проверка приемки товаров", () => {
    cy.exec(
      "PGPASSWORD=oimUozCjiBtz4B5TFa9WXrrV93CMUbSy psql -h web-nuxt-pgsql-cl1-haproxy.web-nuxt.svc.k8s.stage-dp -p 5000 -U main -d web-nuxt -c \"call remove_unknown_statuses()\"",
    )

    cy.viewport("ipad-mini", "landscape")

    cy.server()

    cy.visit("/")

    cy.route("GET", "/**").as("apiRequest")
    cy.route("POST", "/**").as("apiRequest2")

    cy.get(".badge-input input").type("123").type("{enter}")
    cy.wait(1000)
    cy.get(".enterPasswordWrapperInputWrapperInput input")
      .type("password")
      .type("{enter}")
    cy.wait(1000)
    cy.get(".layout-default").should("exist")

    cy.get("a[href=\"/acceptance\"]").click()

    cy.get(".popup__title").contains("Отсканируйте ШК стола")

    cy.wait(1000)

    cy.window().then((win) => {
      win.scanner.set("WHAT915817934")
      win.scanner.call()
    })

    cy.wait(1000)

    cy.get(".popup__title").contains("Отсканируйте контейнер")

    cy.window().then((win) => {
      win.scanner.set("WCT4173472")
      win.scanner.call()
    })

    cy.wait(1000)

    cy.get(".popup__title").contains("или QR-код короба")

    cy.window().then((win) => {
      // win.scanner.set("WB_76818031");
      win.scanner.set("WB_83416945")
      win.scanner.call()
    })

    cy.wait(1000)

    cy.get(".status__text").contains("ШК товара поставщика")

    // cy.window().then((win) => {
    // win.scanner.set("2026645781935");
    // win.scanner.set("4620020871679");
    // win.scanner.call();

    stickers.forEach((sticker, index) => {
      if (sticker[0] !== "*" && index < 100) {
        cy.window().then((win) => {
          win.scanner.set("4620020871679")
          win.scanner.call()
        })
        // win.scanner.set("4620020871679");
        // win.scanner.call();
        // // cy.wait(200);
        // win.scanner.set(sticker);
        // win.scanner.call();
        cy.wait(100)

        cy.window().then((win) => {
          win.scanner.set(sticker)
          win.scanner.call()
        })
      }
    })
    // });
  })
})
