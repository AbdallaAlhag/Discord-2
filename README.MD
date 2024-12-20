# Discord-2
    npx kill-port 3000 to kill server if already in use

    4140 lines of code 11/20/2024

--> Start project on 10/28/2022
--> 12/13/24, end of week 7
--> Finish project by end of December!
--> deploy this bad boy 12/16/2024

### todo: 
---
- [ ] not done yet:
- [x] done: 
do this near the end:
- [ ] fake data works well with front end but does not work with backend unless i update with my temp backend data
    - [ ] add fake data to backend and use that instead
- [ ] change id in prisma from autoincrement to uuid
- [ ] update and remove mock users, try to make it more intuitive for people
---



- [x] create server active: 
    - [x] got hover to work 
    - [x] but not active
- [ ] Don't like how server channels on sidebar reload but its okay
- [x] invite sending and both are embedded but link embeds after refresh.
- [ ] change invite if already joined
    - [ ] invite code is pretty useless, don't know how to do anything with it.
    - [ ] work on expired or deleted servers for invites
    - [ ] fix: links embeds after refresh 

- [x] work on chat:
    - [x] make the chat look like discord: add time hover over message to show time
    - [x] server chat still little bugged but kinda annoying to fix 
        - [x] message don't send twice and update chat dates correctly
    - [x] fix chat date display if new day
- [ ] register page background is pretty slow sometimes
---

- [x] Work on gif picker, make it a modal and work on opening and closing it. 
    - [x] make sure it works with messaging (.gifs work)
        - [ ] make sure it works with other types
    - [ ] try to get stickers working
    - [ ] Add loaders to values (already have loader but i like the square ones better)
- [x] Fix: voice channel is based on server channel text group not voice group
---

- [ ] work on server menu
    - [ ] create delete channel 
    - [x] create leave server
---

- [ ] work  on real time issues: 
    - [ ] Adding friend is not real time but i think that's okay, we can fix it later, not a priority 
    - [x] Create channel is not real time, just needs a refresh
    to see it.
    - [x] Fix: server chat is not real time?
---

- [ ] pause execution on webrtc development at the moment!!!
    - [ ] fix slight bug in voice, user count is off and remote video doesn't work on first join. Prob needs a refresh?
    - [ ] Can't see other user's voice indicators like video, audio, and mic indicators -> add this to metadata?
    - [ ] fix not active on user screens and correct the amount of people in voice room, when clicking on server, should get users in voice channels -> idk lol 
    - [ ] create that green border hover when voice is activated
    - [ ] clicking other voice channels should make you leave the current one
    - [x] Get voiceChanneldisplay working properly
        - [x] get all buttons to work in serverchannelsidebar 
        - [x] voice display
---

- [x] work on server channel online indicator, just showcase users in server
    - [x] haven't set online indicator up yet, but it should be simple
    - [x] friends nav
    - [x] direct messages 
    - [ ] active now -> let's keep this as is
    - [x] memberLists
- [x] Update tooltips for buttons 
    - [x] channel sidebar buttons
    - [x] private message sidebar buttons   
    - [x] channelwebrtc icons
    - [x] private server voice channel modal
    - [x] voiceChanneldisplay buttons
---
### haven't done yet:
- [ ]  mobile mode (eh)
- [x]  typing real time indicator works
- [x]  real time read receipts -> private chat only tbh
    - [x] Add a ding on real time receipt to showcase, low priority
- [x]  Notifications from server or users on new message
    - [ ] fix notification count, should reset but some messages are never read
    - [ ] no notification if we are on message page -> have to turn private chat into a param page to detect, some are not real time
- [x]  users online status
- [x]  voice chat / video chat / screen share
    - [ ] rough draft working, come back later
- [x] deploy to production
- [x] work on front end private routes
- [x]  discover tab in server side -> maybe make all servers public or something like that
- [x] leave server 
    - [ ]  leave server is not real time? low priority
- [x] profile settings
- [x]  permissions and roles -> revamped and set up roles for server menu
- [ ] server settings
- [ ]  right click menu (might be part of a version 2 feature)
- [ ]  reactions
- [ ]  dark mode (never done this before)
- [ ]  group message for private chats?
- [ ]  discord loading page
- [ ] Probably work on a global online indicator later
- [ ] accept files and images/vids/gifs ? maybe add a file uploader? lol 
- [ ] pagination for messages
- [ ] pagination for discover channels
- [ ] search for discover page 
- [ ] Preview video modal when turning on camera
- [ ] Create active on direct message tabs 
---


Test accounts:
test users:
    -   test@test.com
        test
        test
        
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

Common Prisma Commands Summary:
Command	Purpose
npx prisma validate	Validate the schema for errors.
npx prisma migrate dev --name	Create and apply a migration in development.
npx prisma generate	Regenerate the Prisma Client.
npx prisma studio	Open Prisma Studio to view and edit the data.
npx prisma migrate deploy	Apply migrations to production databases.

picsum photos: https://picsum.photos/