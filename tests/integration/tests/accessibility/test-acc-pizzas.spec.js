/// <reference types="cypress" />

import 'cypress-file-upload';
import jsyaml from 'js-yaml';

context('Accessibility test Pizza Orders', () => {
  Cypress.skipAfterFail();

  before(() => {
    cy.handleExceptions();
    cy.setUpContinuum('continuum/continuum.conf.js');
    cy.loginAndSelectCluster();
    cy.createNamespace('pizzas');
  });

  it('Creates the EXT pizza orders config', () => {
    cy.getLeftNav()
      .contains('Cluster Details')
      .click();

    cy.contains('ui5-button', 'Upload YAML').click();

    cy.loadFiles(
      'examples/pizzas/configuration/pizza-orders-configmap.yaml',
      'examples/pizzas/configuration/pizza-orders-crd.yaml',
    ).then(resources => {
      const input = resources.map(r => jsyaml.dump(r)).join('\n---\n');
      cy.pasteToMonaco(input);
    });

    cy.get('ui5-dialog')
      .contains('ui5-button', 'Upload')
      .should('be.visible')
      .click();

    cy.get('ui5-dialog')
      .find('.status-message-success')
      .should('have.length', 2);

    cy.loadFiles('examples/pizzas/samples/pizza-orders-samples.yaml').then(
      resources => {
        const input = resources.map(r => jsyaml.dump(r)).join('\n---\n');
        cy.pasteToMonaco(input);
      },
    );

    cy.get('ui5-dialog')
      .contains('ui5-button', 'Upload')
      .should('be.visible')
      .click();

    cy.get('ui5-dialog')
      .find('.status-message-success')
      .should('have.length', 2);
  });

  it('Acc test Pizza Orders list', () => {
    cy.loginAndSelectCluster();

    cy.getLeftNav()
      .find('ui5-side-navigation-item')
      .contains('Namespaces')
      .click();

    cy.wait(500)
      .get('ui5-input[id="search-input"]:visible')
      .find('input')
      .type('pizzas');

    cy.clickListLink('pizzas');

    cy.getLeftNav()
      .contains('Lunch')
      .click();

    cy.getLeftNav()
      .contains('Pizza Orders')
      .click();

    cy.runAllAccessibilityTests().printAccessibilityTestResults();

    if (Cypress.env('IS_PR') === 'true')
      cy.log('Skipping AMP submission for PR');
    else
      cy.submitAccessibilityConcernsToAMP(
        Cypress.env('AMP_REPORT_NAME'),
        'Pizza Orders list',
      );
  });

  it('Acc test Pizza Orders create', () => {
    cy.contains('ui5-button', 'Create').click();

    cy.runAllAccessibilityTests().printAccessibilityTestResults();

    if (Cypress.env('IS_PR') === 'true')
      cy.log('Skipping AMP submission for PR');
    else
      cy.submitAccessibilityConcernsToAMP(
        Cypress.env('AMP_REPORT_NAME'),
        'Pizza Orders create',
      );
  });

  it('Acc test Pizza Orders details', () => {
    cy.getLeftNav()
      .contains('Pizza Orders')
      .click();

    cy.clickGenericListLink('diavola-order');

    cy.runAllAccessibilityTests().printAccessibilityTestResults();

    if (Cypress.env('IS_PR') === 'true')
      cy.log('Skipping AMP submission for PR');
    else
      cy.submitAccessibilityConcernsToAMP(
        Cypress.env('AMP_REPORT_NAME'),
        'Pizza Orders details',
      );
  });
});
