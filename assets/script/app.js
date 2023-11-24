'use strict';

// Imports
import { onEvent, select } from './utils.js';
import Contact from './Contact.js';

// Selections
const inputField = select('input');
const btnAdd = select('.btn-add');
const contactContainer = select('.contact-container');
const savedContacts = select('.saved-contacts');
const errorMessage = select('.error-message');
const storageAlertMessage = select('.storage-alert-message');

/* - - - - - - Main code - - - - - - - */

const contactsArr = [];
let name, city, email;
let maxContacts = 9;
savedContacts.innerText = 'Saved contacts: 0';

// Function to validate inputs
function validateInputs() {
  let userInput = inputField.value
    .trim()
    .split(',')
    .map(part => part.trim());
  [name, city, email] = userInput;

  const emailRegex =
    /^(?=.{8,}$)[-_A-Za-z0-9]+([.-_][a-zA-Z0-9]+)*@[A-Za-z0-9]+([.-][a-zA-Z0-9]+)*\.[A-Za-z]{2,}$/;

  if (userInput.length === 3) {
    if (typeof name !== 'string' || name.length < 2 || /\d/.test(name)) {
      displayErrorMessage('Please enter a valid name!');
      return false;
    }

    if (typeof city !== 'string' || city.length < 2 || /\d/.test(city)) {
      displayErrorMessage('Please enter a valid city!');
      return false;
    }

    if (!emailRegex.test(email)) {
      displayErrorMessage('Please enter a valid email');
      return false;
    }

    // Return true if all validations pass
    return true;
  } else {
    displayErrorMessage(
      'Please enter all the specified inputs (Name, City, Email)'
    );
    return false;
  }
}

// Function to display error message
function displayErrorMessage(message) {
  errorMessage.innerText = message;
}

// Function to clear error message
function clearErrorMessage() {
  errorMessage.innerText = '';
}

// Function to display contacts
function listContacts() {
  storageAlertMessage.innerText = '';

  // Check the storage
  if (contactsArr.length > maxContacts) {
    storageAlertMessage.innerText =
      'Storage is full! Cannot add more contacts :(';
    return;
  }

  contactContainer.innerHTML = '';

  // Iterating the contacts array
  contactsArr.forEach((contact, index) => {
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-info');

    // Create paragraph elements
    const namePara = document.createElement('p');
    const cityPara = document.createElement('p');
    const emailPara = document.createElement('p');

    // Add text to paragraph elements
    namePara.innerText = `Name: ${contact.name.trim()}`;
    cityPara.innerText = `City: ${contact.city.trim()}`;
    emailPara.innerText = `Email: ${contact.email.trim().toLowerCase()}`;

    // Append the paragraph elements
    contactDiv.appendChild(namePara);
    contactDiv.appendChild(cityPara);
    contactDiv.appendChild(emailPara);

    contactContainer.appendChild(contactDiv);

    // Delete the contacts
    onEvent('click', contactDiv, function () {
      deleteContact(index);
    });
  });

  // Update and display the counter
  displayCounter(contactsArr);
}

// Function to delete the contacts
function deleteContact(index) {
  contactsArr.splice(index, 1);
  listContacts();

  // Reset storage alert message
  storageAlertMessage.innerText = '';
}

// Update and display the counter
function displayCounter(array) {
  let numContacts = array.length;
  savedContacts.innerText = `Saved contacts: ${numContacts}`;
}

// Events
onEvent('click', btnAdd, function (e) {
  e.preventDefault();

  // Validate inputs
  if (!validateInputs()) {
    return;
  }

  // Create a new contact
  const newContact = new Contact(name, city, email);

  // Add new contact at the starting of the array
  contactsArr.unshift(newContact);

  // Display contacts
  listContacts();

  // Clear the input field
  inputField.value = '';

  // Clear the error message
  clearErrorMessage();
});
