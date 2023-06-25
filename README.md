## Overview

BMBluff is a casual web version of the card game: Indian Poker.

The rules are based on https://bicyclecards.com/how-to-play/indian-poker/

Users can create an account, and search for a virual room to join.

All users start with 5000 chips upon joining. When the round starts, the users put onecard (without looking) to their webcam. Tensorflow will attempt to analyze their card, and display it.
If Tensorflow cannot detect an accurate card, it will assign that player a random card

The players can see, through videocalls, what the other players have on their forehead. Each players own video will not be shown to themselves.

There is a single round of betting, where players go clockwise to call, raise, or fold. At showdown, the computer detects through video who has the highest valued card through video,
then awards them the total pot. If there are multiple people with the highest valued card then the pot is divided equally amongst the winners.

## Technologies Used

- Auth0
- React
- P5.js
- PeerJS
- Express.js
- Redis
- Socket.IO
- Tensorflow.js

## Teammates

BMBluff could not have been made without:

- Sung Ha Hwang (Tensorflow, PeerJS)
- Jeff He (React, P5.js, Socket.IO)
- Naman Bhandari (Socket.IO, Redis, Auth0)

# Screenshots

![alt text](https://github.com/jeffbuyunhe/BMBluff/blob/main/Demo/Landing.png)
![alt text](https://github.com/jeffbuyunhe/BMBluff/blob/main/Demo/Lobby.png)
![alt text](https://github.com/jeffbuyunhe/BMBluff/blob/main/Demo/Game.png)
