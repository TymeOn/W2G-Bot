<br />
<p align="center">
  <a href="https://github.com/TymeOn/W2G-Bot">
    <img src="assets/w2g_bot-logo.png" alt="Logo" width="192" height="192">
  </a>
  <h2 align="center">Watch2Gether Bot</h2>
  <p align="center">A simple Discord Bot made to create Watch2Gether rooms.</p>
</p>

## About

This project is a simple discord bot meant to create Watch2Gether rooms quickly and easily.

Watch2Gether is a social video website that allows you to watch videos and other content in-sync with others.

Watch2Gether is available [here](https://w2g.tv/).

## Getting Started

To use this bot in your discord server, click [here](https://discord.com/oauth2/authorize?client_id=817463038595563521&scope=bot&permissions=11264), log in with your discord account and select the server which you want the bot to join.

If you are in a server with the bot, you can also send commands in its private messages.


## Commands

### !w2g

This will create a Watch2Gether Room. By default, the room will have:

- no video pre-loaded
- a dark background (#3B3B3B)
- a 100% opacity

Three arguments may be supplied, in any order, to customize the created room.
Arguments may be:
- An URL to a video
- An [hexadecimal color code](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) for the room background
- A number beetween 0 and 100 for the room opacity

Any other argument will be ignored.

Examples of valid commands:

- `!w2g https://youtu.be/JOhiWY7XmoY`
- `!w2g #fff000 50`
- `!w2g 75 https://youtu.be/JOhiWY7XmoY`
- `!w2g`

### !help

This will display the list of the available commands, as well as examples on how to use them.

Example of valid command:

- `!help`

## License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.