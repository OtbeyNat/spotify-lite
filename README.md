## SPOTIFY LITE
Spotify Lite is a lightweight version of the popular music streaming service using the latest web development features and Spotify's Web API.\
Spotify Lite is a full stack MERN application using React (Vite) for frontend, Express and Node for backend, and MongoDB for data management.\

This web application was NOT developed for commercial use and is NOT meant for real-time, real-world production; Spotify LITE purpose is for recreational use and personal learning experience only.

https://spotify-lite.onrender.com \
(takes about a minute to load when no user traffic on site; afterwards renders as normal)\

Key Features Include:
- Search/Pause/Play/Skip/Repeat Tracks (DEPRECATED)
- Search/Pause/Play/View Albums (DEPRECATED)
- Songs and Playlists Management with MongoDB (Create, Read, Update, Delete)
- User Authentication using Clerk and Google -- WIP: Spotify provider
- Real-time Messaging and Activity status with socket.io
- ... more WIP

Disclaimer:\
Spotify has updated their web api for security/safety reasons and REMOVED 30 second preview urls from their endpoints. As a result, the playback functionality of this application does not work anymore. However, the rest of Spotify LITE works as intended.\
https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api \
https://community.spotify.com/t5/Spotify-for-Developers/Changes-to-Web-API/td-p/6540414

This project is for educational purposes only. It is not affiliated with Spotify or any of its subsidiaries. @OtbeyNat's Spotify LITE DOES NOT comply with Spotify's Developer Policy (https://developer.spotify.com/policy). In order to have full functionalities of the app, you must have a Spotify account AND have a registered account for @OtbeyNat's Spotify LITE (registering an account can only be done manually and is limited to 25 accounts due to the basic plan's quota - in order to extend the quota to as many users as possible, an extension request has to be made to Spotify). For any concerns or inquiries about this application, please email tctan317@gmail.com

Credits:\
Spotify LITE core functionalities were made possible thanks to Spotify's Web API - https://developer.spotify.com/documentation/web-api \
Spotify LITE was made solely from the dedicated time and effort from @burakorkmez. @OtbeyNat watched @burakorkmez's tutorial video in order to build the application from scratch, incorporated his own features, and implemented Spotify's official Web API as a part of his learning experience \
https://github.com/burakorkmez/realtime-spotify-clone/tree/master \
https://www.youtube.com/watch?v=4sbklcQ0EXc
