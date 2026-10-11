@logbook-check
Feature: Logbook records Cucumber-style Playwright scenarios
  Scenario: Passed scenario with an attachment
    Given a local page with a Save button
    When I save the item
    Then I see a saved confirmation

  Scenario Outline: Scenario outline examples retain their names
    Given a local page with a Save button
    When I save the item
    Then I see a saved confirmation for "<item>"

    Examples:
      | item  |
      | alpha |
      | beta  |

  Scenario: A failed assertion retains its error
    Given a local page with a Save button
    Then a deliberately wrong assertion fails

  Scenario: A retry becomes flaky
    Given a local page with a Save button
    Then the retry passes

  Scenario: A skipped case stays skipped
    Given this case is skipped
