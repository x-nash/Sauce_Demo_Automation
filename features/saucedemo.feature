@all
Feature: Saucedemo website

  @first
  Scenario: User logs in, adds an item to cart, completes checkout and logs out

    Given I am on the Sauce Demo login page
    When I enter <username> and <password>
    And I click the login button
    Then I should see the inventory page
    When I add an item to the cart
    And I navigate to the cart
    Then I should see the added item in the cart
    When I proceed to checkout
    And I enter checkout information
    And I click the continue button
    And I click the finish button
    Then I should see a confirmation message
    When I click the menu button
    And click the logout button
    Then I should be logged out and see the login page

  Examples:
    |username | password |
    |standard_user | secret_sauce |

  @second
  Scenario: User adds multiple items to the cart, removes an item, completes checkout and logs out

    Given I am on the Sauce Demo login page
    When I enter <username> and <password>
    And I click the login button
    Then I should see the inventory page
    When I add multiple items to the cart
    And I navigate to the cart
    Then I should see the items in the cart
    When I remove the item from the cart
    Then the cart should not have the removed item
    When I proceed to checkout
    And I enter checkout information
    And I click the continue button
    And I click the finish button
    Then I should see a confirmation message
    When I click the menu button
    And click the logout button
    Then I should be logged out and see the login page


  Examples:
    |username | password |
    |standard_user | secret_sauce |

  @third
  Scenario: User adds multiple items to the cart, verifies the total price, checks out and logs out

    Given I am on the Sauce Demo login page
    When I enter <username> and <password>
    And I click the login button
    Then I should see the inventory page
    When I add multiple items to the cart
    And I navigate to the cart
    Then I should see the items in the cart
    When I proceed to checkout
    When I enter checkout information
    And I click the continue button
    Then I should see the correct total price displayed
    And I click the finish button
    Then I should see a confirmation message
    When I click the menu button
    And click the logout button
    Then I should be logged out and see the login page

  Examples:
    |username | password |
    |standard_user | secret_sauce |

  @fourth
  Scenario: User checks if items get sorted in the right order and logs out

    Given I am on the Sauce Demo login page
    When I enter <username> and <password>
    And I click the login button
    Then I should see the inventory page
    When I click on Name - Z to A from the dropdown
    Then I should see the products in reverse alphabetical order of names
    When I click on Name - A to Z from the dropdown
    Then I should see the products in alphabetical order of names
    When I click on Price - low to high from the dropdown
    Then I should see the products in lower to higher order of price
    When I click on Price - high to low from the dropdown
    Then I should see the products in higher to lower order of price
    When I click the menu button
    And click the logout button
    Then I should be logged out and see the login page

  Examples:
    |username | password |
    |standard_user | secret_sauce |