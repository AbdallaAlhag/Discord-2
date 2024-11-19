# Discord-2
    npx kill-port 3000 to kill server if already in use


    todo:
        do this near the end:
        - fake data works well with front end but does not work with backend unless i update with my temp backend data
            - add fake data to backend and use that instead
        - change id in prisma from autoincrement to uuid
        

        - Adding friend is not real time but i think that's okay, we can fix it later, not a priority 
        - typing real time indicator works but not read receipts just yet. Both could use a tune up, do later, extra  
        - create server active: got hover to work but not active
        - invite sending and both are embedded but link embeds after refresh.
            - invite code is pretty useless, don't know how to do anything with it.
            - work on expired or deleted servers 
        - work on server menu
            - Complete the rest of the server menu later
        - work on chat:
            - make the chat look like discord: add time hover over message to show time
            - server chat still little bugged but kinda annoying to fix 
        - register page background is pretty slow
        - Work on gif picker, make it a modal and work on opening and closing it. 
            - make sure it works with messaging
                - gifs work !!
            - Add loaders to values (already have loader but i like the square ones better)
        - stickers are not working? i guess and its okay for now.
        - Create channel is not real time, just needs a refresh
        to see it.
-haven't done yet:
    - right click menu 
    - Notifications from server or users on new message
    - users online status
    - reactions
    - permissions and roles
    - voice chat / video chat
    - discover tab in server side -> maybe make all servers public or something like that
    - profile settings and settings in general
    - dark mode (never done this before)
    - mobile mode (eh)
    - group message for private chats
    - discord loading page

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


default profile pfp from : https://better-default-discord.netlify.app/

tenor docs: https://developers.google.com/tenor/guides/endpoints