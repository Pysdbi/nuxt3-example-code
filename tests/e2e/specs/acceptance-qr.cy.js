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
      win.scanner.set("#wbbox#0001;53847;16")
      win.scanner.call()
    })

    cy.wait(1000)

    cy.get(".status__text").contains("ШК товара поставщика")

    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vIThkdUB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vDpsDeIR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!sfiDHjSR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!uI+HbIWB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!s39DDEWR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!ugws16CB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!t1SDSTGB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vd74YpJx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!toCR/NAh")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!t2sPsugB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!ufhXx5dx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!tVCmrgdx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vIo2J9Yh")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vI2vBvkB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!tPOrVlkB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!sNgeV+Ih")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!th0NnSAx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!tKsvUINR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!tuEax6GB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!tTOIgkhR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!v7a/NbMB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vz2+Q1ch")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!t6+BzKIh")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!voZnQ7kB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!sDkoR8Bx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!sGqny2Zh")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!txq52igx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vIYqzWBh")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!sfjnIdNR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!uv3EH5CB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!v/4gLvYx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!t3hDNLhB")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!sbEgoDIx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!uRCssxMx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!toL9g5aR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!vt1W+XQR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!t8Vap3Vx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!tUHaP5UR")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!sZPm7Ohx")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("2030674032937")
      win.scanner.call()
    })
    cy.wait(200)
    cy.window().then((win) => {
      win.scanner.set("!t7NzTueR")
      win.scanner.call()
    })

    // cy.screenshot();
  })
})
