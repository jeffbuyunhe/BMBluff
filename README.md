## Project title and team name

Project Title: Indian Poker

Team Name: Code of Duty

## Your focus (frontend focused or backend focused)

Frontend focused

## Team members with student numbers

- Name: Sung Ha Hwang; Student #: 1006044647
- Name: Jeff He; Student #: 1006398783
- Name: Naman Bhandari; Student #: 1005727732

## Description of the web application

Indian Poker is a casual web version of the card game: Indian poker.

The rules are based on https://bicyclecards.com/how-to-play/indian-poker/

Users can create an account, and search for a virual room to join.

All users start with 5000 chips upon joining. When the round starts, the users put one
card (without looking) on their foreheads. The players can see, through video
calls, what the other players have on their forehead. Each players own video
will not be shown to themselves. There is a single round of betting, when
players go clockwise to check, bet a custom amount, or fold. At showdown,
the computer detects through video who has the highest valued card through video,
then awards them the total pot. If there are multiple people with the highest valued card
then the pot is divided equally amongst the winners.

## What complexity points will this project contain

- 2 pts - PeerJS for video calling
- 2 pts - p5.js for poker frontend and card animations
- 2 pts - Socket.IO (w/ redis) for game logic sync
- 3 pts - Tensorflow.js to detect cards from video

Total 9 pts

## (optional) What complexity points will be attempted as bonus for the challenge factor

- ~~2 pts - Three.js for 3d styled win animation~~

- 1 pts - Auth0 for sign in

## What you aim to complete for the alpha version, beta version, and final version

Alpha:

- Implement room logic with Express and sync with users using Socket.IO
- Create poker UI using p5.js.
- Implement face calling with PeerJS

Beta:

- Implement game logic with Express and sync with users using Socket.IO
- Sign in using Auth0
- Detect the users card value on camera using Tensorflow.js

Final:

- ~~Stylized 3d win animation using Three.js~~
- Deployment with persistent backend through Redis

## Video Demo

- https://www.youtube.com/watch?v=zv3fxGYONwU
