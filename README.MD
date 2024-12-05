# Discord-2
    npx kill-port 3000 to kill server if already in use
    7,

    4140 lines of code 11/20/2022


### todo: 
- [ ] not done yet:
- [x] done: 
do this near the end:
- [ ] fake data works well with front end but does not work with backend unless i update with my temp backend data
    - [ ] add fake data to backend and use that instead
- [ ] change id in prisma from autoincrement to uuid




- [ ] create server active: 
    - [x] got hover to work 
    - [ ] but not active
- [x] invite sending and both are embedded but link embeds after refresh.
- [ ] change invite if already joined
    - [ ] invite code is pretty useless, don't know how to do anything with it.
    - [ ] work on expired or deleted servers
    - [ ] fix links embeds after refresh 
- [ ] work on server menu
    - [ ] Complete the rest of the server menu later
- [ ] work on chat:
    - [ ] make the chat look like discord: add time hover over message to show time
    - [ ] server chat still little bugged but kinda annoying to fix 
- [ ] register page background is pretty slow sometimes
---
- [x] Work on gif picker, make it a modal and work on opening and closing it. 
    - [x] make sure it works with messaging (.gifs work)
        - [ ] make sure it works with other types
    - [ ] try to get stickers working
    - [ ] Add loaders to values (already have loader but i like the square ones better)
    - [ ] stickers are not working? i guess and its okay for now.
- [x] Fix: voice channel is based on server channel text group not voice group
---

- [ ] work  on real time issues: 
    - [ ] Adding friend is not real time but i think that's okay, we can fix it later, not a priority 
    - [ ] Create channel is not real time, just needs a refresh
    to see it.
    - [ ] server chat is not real time?
---

- [ ] pause execution on webrtc development at the moment
    - [ ] Can't see other user's voice indicators like video, audio, and mic indicators
    - [ ] fix not active on user screens and correct the amount of people in voice room, when clicking on server, should get users in voice channels
    - [x] Get voiceChanneldisplay working properly
        - [x] get all buttons to work in serverchannelsidebar 
        - [x] voice display
    - [ ] create that green border hover when voice is activated
---

### haven't done yet:
- [ ] typing real time indicator works but not read receipts just yet. Both could use a tune up, do later, extra  
- [ ]  right click menu 
- [ ]  Notifications from server or users on new message
- [ ]  users online status
- [ ]  reactions
- [ ]  permissions and roles
- [ ]  voice chat / video chat
- [ ]  discover tab in server side -> maybe make all servers public or something like that
- [ ]  profile settings and settings in general
- [ ]  dark mode (never done this before)
- [ ]  mobile mode (eh)
- [ ]  group message for private chats
- [ ]  discord loading page
---

Test accounts:
test users:
    -   test1@test1.com
        test1
        test1

    -   test2@test2.com
        test2
        test2

    -   test3@test3.com
        test3
        test3


EXTRA:
default profile pfp from : https://better-default-discord.netlify.app/

tenor docs: https://developers.google.com/tenor/guides/endpoints

    
old run command based on ts-node and not ts-node-dev: // "dev": "ts-node src/index.ts ",

webrtc guides: 
https://codelabs.developers.google.com/codelabs/webrtc-web#0
https://www.youtube.com/watch?v=GdYVTWujYD8
https://www.youtube.com/watch?v=g42yNO_dxWQ
https://millo-l.github.io/Implementing-WebRTC-using-ReactJS-and-Typescript-1-N-P2P/#github

