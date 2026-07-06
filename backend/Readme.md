# Realtime Video Streaming Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)

## What This Is

A Node.js backend for a video streaming service. It uploads media to Cloudinary, serves paginated video search through MongoDB aggregation pipelines, and runs Watch Together rooms with synchronized playback and live chat over Socket.IO.

## Features

- JWT authentication with access and refresh tokens stored in httpOnly cookies
- Cloudinary-based video upload and CDN delivery
- Paginated video search, sort, and owner filtering with aggregation pipelines
- Watch Together sessions with real-time play/pause/seek synchronization
- Host-controlled playback, with optional `everyoneCanControl`
- Room-based live chat, persisted to MongoDB
- TTL-based room expiry via MongoDB
- Socket.IO handshake authentication using the same JWT signing secret as REST
- Single process for REST and WebSocket
- Like/subscription toggle with race-condition-safe upsert
- **Like count derived from `Like` collection (single source of truth)**

## Runtime Quality

| Concern | Implementation |
|---|---|
| **Race conditions** | `like.controller.js` and `subscription.controller.js` catch duplicate-key errors (code 11000) and roll back to the opposite state |
| **Denormalized counters** | Removed `likes` from `Video`, `Comment`, and `Tweet` schemas. Counts are derived from `Like.countDocuments()` or `$lookup` aggregation to avoid drift |
| **Double DB fetch** | `isUserAuthorized` in `video.controller.js` now returns the video document so `togglePublishStatus`, `deleteVideo`, and `updateVideo` reuse it |
| **Socket error handling** | All async Socket.IO handlers wrap their bodies in `try/catch` and emit `error` events |
| **Global error handler** | `app.js` registers a final `(err, req, res, next)` middleware that formats all errors consistently |
| **Security** | Removed `console.log` of JWTs from `refreshAccessToken` |
| **Validation** | Centralized `validateObjectId` and `validateBodyFields` middleware wired into all route definitions |

## Architecture

```
[React Client] ← REST APIs → [Express + Socket.IO] ← WebSocket → [React Client]
                                                    ↓
                                                [MongoDB]
                                                    ↓
                                              [Cloudinary CDN]
```

## Local Setup

```bash
cd backend
npm install
npm run dev
```

Server starts on `http://localhost:8000`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 8000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `CORS_ORIGIN` | Frontend URL |
| `ACCESS_TOKEN_SECRET` | JWT signing secret for access tokens |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token TTL, e.g. `20m` |
| `REFRESH_TOKEN_SECRET` | JWT signing secret for refresh tokens |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token TTL, e.g. `9d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NODE_ENV` | `development` or `production` |

## REST API

Base URL: `/api/v1`

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | No | Create account with avatar/coverImage upload |
| POST | `/users/login` | No | Issue access + refresh tokens |
| POST | `/users/refresh-token` | No | Rotate access token |
| POST | `/users/logout` | Yes | Revoke refresh token |
| GET | `/users/current-user` | Yes | Get profile |
| PATCH | `/users/update-account` | Yes | Update name and email |
| PATCH | `/users/avatar` | Yes | Upload avatar to Cloudinary |
| PATCH | `/users/cover-image` | Yes | Upload cover image to Cloudinary |
| GET | `/users/:userName` | Yes | Public channel profile |
| GET | `/users/watch-history` | Yes | Watch history with populated videos |

### Videos

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/videos/publish` | Yes | Upload video + thumbnail (multipart) |
| GET | `/videos` | Yes | Paginated search, sort, owner filter |
| GET | `/videos/:videoId` | No | Video details |
| PATCH | `/videos/:videoId` | Yes | Update metadata or thumbnail |
| DELETE | `/videos/:videoId` | Yes | Delete video and Cloudinary assets |
| PATCH | `/videos/toggle/publish/:videoId` | Yes | Toggle publish status |

**Like count on videos**:  
The `Like` collection is the single source of truth. Responses from `GET /videos/:videoId` and `GET /videos` include a computed `likesCount` field (derived via `$lookup` on the `likes` collection) instead of a denormalized `likes` field on the `Video` schema.

### Watch Together Rooms

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/rooms` | Yes | Create Watch Together room |
| GET | `/rooms/join/:roomCode` | Yes | Join room metadata |
| PATCH | `/rooms/:roomCode` | Yes | Toggle `everyoneCanControl` (host only) |
| GET | `/rooms/:roomCode/chat` | Yes | Chat history, last 100 messages |

### Other

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/likes/toggle/video/:videoId` | Yes | Toggle video like |
| POST | `/comments/:videoId` | Yes | Add comment |
| GET | `/comments/:videoId` | Yes | Video comments |
| POST | `/playlist` | Yes | Create playlist |
| POST | `/subscriptions/channel/:channelId` | Yes | Toggle subscription |
| GET | `/dashboard/stats` | Yes | Channel stats |
| GET | `/dashboard/videos` | Yes | Channel videos |

**Like count on comments and tweets**:  
`GET /comments/:videoId` and `GET /tweets/user/:userId` responses include `likesCount`, computed by joining the `likes` collection with `$lookup`. The `Comment` and `Tweet` schemas no longer store a denormalized `likes` field.

## Validation Middleware

Centralized validation middleware is used across all routes:

- `validateObjectId(paramName)` — checks `mongoose.isValidObjectId()` on `req.params`
- `validateBodyFields([...])` — checks that listed body fields exist and are non-empty after trim

Used in: `video.routes.js`, `comment.routes.js`, `like.routes.js`, `subscription.router.js`, `tweet.routes.js`, `playlist.routes.js`, `user.routes.js`.

## Socket.IO

Connect after login by passing the access token in handshake auth:

```javascript
const socket = io("http://localhost:8000", {
  auth: { token: accessToken }
});
```

Socket authentication uses the same signing secret as REST JWTs.

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `room:join` | `{ roomCode }` | Join a Watch Together session |
| `video:play` | `{ roomCode, currentTime }` | Start playback |
| `video:pause` | `{ roomCode, currentTime }` | Pause playback |
| `video:seek` | `{ roomCode, currentTime }` | Seek to position |
| `chat:send` | `{ roomCode, message }` | Send chat message |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `room:state` | `{ roomCode, videoId, isPlaying, currentTime, lastUpdatedAt, hostId, everyoneCanControl }` | Room state on join |
| `video:play` | `{ currentTime }` | Broadcast play to room |
| `video:pause` | `{ currentTime }` | Broadcast pause to room |
| `video:seek` | `{ currentTime }` | Broadcast seek to room |
| `chat:message` | `{ userId, message, createdAt }` | New chat message |
| `error` | `{ message }` | Validation or auth error |

## Aggregation Pipelines

Three endpoints use MongoDB aggregation pipelines to combine data in a single query instead of multiple sequential lookups.

### Video Search (`GET /videos`)

Pipeline uses conditional `$match` stages and `$sort`:
- Filter by `owner` when `userId` is provided
- Case-insensitive `$regex` search on `title` and `description` when `query` is provided
- Sort by requested field and direction
- `aggregatePaginate` for page/limit pagination in one round trip

### Channel Profile (`GET /users/:userName`)

Pipeline uses `$lookup` joins on the `subscriptions` collection:
- Match user by normalized `userName`
- `$lookup` subscriptions where the user is `channel` → `subscribers`
- `$lookup` subscriptions where the user is `subscriber` → `subscribedTo`
- `$addFields` computes `subscriberCount`, `channelsSubscribedToCount`, `isSubscribed`
- `$project` returns only public profile fields

This replaces multiple sequential DB calls with one aggregation.

### Watch History (`GET /users/watch-history`)

Pipeline joins across three collections:
- $match current user
- `$lookup` videos from the `watchHistory` array
- nested `$lookup` populates `owner` inside each video
- `$addFields` flattens the owner array
- `$project` returns only owner name and avatar

## Playback Synchronization

Room state lives in MongoDB and is cached in a server-side `Map` under `roomCode`.

When a user joins, they receive:
- `isPlaying`
- `currentTime` adjusted for time elapsed since `lastUpdatedAt`
- `hostId`
- `everyoneCanControl`

Adjusted time:
```
effectiveTime = currentTime + (now - lastUpdatedAt) / 1000
```

## Authorization

- Playback control is restricted to the room host unless `everyoneCanControl` is enabled.
- Room settings can only be updated by the host.
- Socket.IO handshake rejects unauthenticated connections via JWT middleware.
- Chat messages are trimmed and limited to 500 characters.

## Room Lifecycle

- `roomCode` is a 6-character crypto-random hex string.
- `expiresAt` defaults to 24 hours from creation.
- A TTL index on `expiresAt` auto-deletes expired rooms.

## Tech Stack

- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO
- JWT (access + refresh tokens)
- Cloudinary
- Multer
- `mongoose-aggregate-paginate-v2`

## Project Structure

```
backend/
├── src/
│   ├── config/            # env, cloudinary
│   ├── controllers/       # route handlers
│   ├── middlewares/        # jwt auth, multer upload
│   ├── models/            # mongoose schemas
│   ├── routes/            # express routers
│   ├── socket/            # socket.io server + room handlers
│   ├── utils/             # ApiResponse, ApiError, asyncHandler, socketAuth
│   ├── app.js             # middleware + route mounting
│   ├── index.js           # db connect → http server → socket
│   └── constants.js       # DB_NAME
├── .env                   # secrets
├── package.json
└── Readme.md
```

## Notes

- Media files are never stored locally. Cloudinary returns URLs that are persisted in MongoDB.
- Room state is both persisted to MongoDB and kept in memory for low-latency broadcast.
