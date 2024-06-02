# Digimon Card Nexus

Digimon Card Nexus is a web application designed to help users look up cards from the Digimon Card Game and create decks. To create decks a user would need to sign up.

## Features

- User Registration and Login
- Search Digimon cards by various parameters
- Create and manage card decks
- Responsive design for both desktop and mobile views

## Upcoming Features

- Ability to create multiple decks
- Allow users to share their decks with others

## Technologies Used

### Frontend

- React
- Axios

### Backend

- Node.js
- Express
- MongoDB
- bcrypt
- UUID

## Project Structure

### NavBar

The navbar allows users to cycle through the Home Page, Card Database, Deck Database, as well as a login, signup and signout buttons.

### Home Page

The home page current aim is to introduce the game to more players and the basic know-how for what they need to succeed in the game.

### Card Database

The Card Database allows users to look up cards for the game base on name, color, type, attribute.

### Deck Database.

Currently the deck database allows users to create and update their decks with cards.

#### Known Issue

There are several known issues as of now with the Deck Database. The main one being that the same cards are being saved no matter which deck is being edited, this will be fixed in the near future.

Users are also able to add more than 5 digiegg cards and 50 digimon cards.

When removing a card from the digiegg it will remove all copies of it.

### Login / Signup

The website features a login / signup option that allows users to input an email / username and a password to sign up.

Either the email or the username can be used as an identifier piece.

The password is being encrypted in the backend to ensure that users passwords are not available to others.
