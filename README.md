# chat-random

![img](http://blakesnaps.s3.amazonaws.com/tNMAZVVl.png)

This application demonstrates a random chat app client implementing real-time messaging via web sockets.

To get started, please follow the below instructions:
```
$ git clone git@github.com:blakeyoder/chat-random.git
$ cd chat-random/application
$ yarn install (this will install all server side dependencies)
$ node server.js
> Listening on port 4001

Open up a new terminal tab
$ cd chat-random/application/client
$ yarn install (this will install all client side dependencies)
$ yarn start
```

Once the server and client are running, you will need to create a chat instance in atleast _2_ tabs in order for the chat window to connect.

Once in a chat, you have 2 commands at your disposal
1. `/send delay <MS_DELAY> <MESSAGE>` will send your message on the <MS_DELAY> interval
2. `/hop` will continue onto the next user in the chat if one is available
