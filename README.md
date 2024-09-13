
<h1 align="center" style="font-weight: bold;">Streaming Video With Dropbox ( BE )  📹</h1>

<p align="center">
<a href="#tech">Technologies</a>
<a href="#started">Getting Started</a>
<a href="#routes">API Endpoints</a>

 
</p>


<p align="center">This project is a video management system developed using NestJS and MongoDB, which allows users to manage information related to video files stored on third-party platforms like Dropbox.</p>


<p align="center">
<a href="https://github.com/DuyToannn/admin-web-nextjs">📱 Go to FE</a>
</p>

<h2 id="technologies">💻 Technologies</h2>

- Frontend : Typescript, NextJS, Ant Design, NextAuth
- Backend :  NestJS
- Database : MongoDB
- Deploy : Docker
- Dropbox API, Cloudinary API,JWT

<h2 id="started">🚀 Getting started</h2>

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

<h3>Prerequisites</h3>

Here you list all prerequisites necessary for running your project. For example:

- NodeJS v20.14.0

<h3>Cloning</h3>

How to clone your project

```bash
git clone https://github.com/DuyToannn/admin-web-nest-js.git
```

<h3>Config .env variables</h2>

Use the `.env.example` as reference to create your configuration file `.env` with your AWS Credentials

```yaml
MONGODB_URI=<MONGODB_URI>
PORT=8080

JWT_SECRET=<JWT_SECRET>
JWT_ACCESS_TOKEN_EXPIRED=<JWT_ACCESS_TOKEN_EXPIRED>

MAIL_USER=<MAIL_USER>
MAIL_PASSWORD=<MAIL_PASSWORD>
NAME_MAIL=<NAME_MAIL>

CLOUDINARY_CLOUD_NAME=<CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<CLOUDINARY_API_SECRET>

DROPBOX_ACCESS_TOKEN=<DROPBOX_ACCESS_TOKEN>
DROPBOX_APP_KEY=<DROPBOX_APP_KEY>
DROPBOX_APP_SECRET=<DROPBOX_APP_SECRET>
DROPBOX_REDIRECT_URI=<DROPBOX_APP_SECRET>
```

<h3>Starting</h3>

Start the development server:

```bash
cd project-name
npm i
npm run dev
```

How to start your project

```bash
cd project-name
npm i
npm run dev
```

<h2 id="routes">📍 API Endpoints</h2>

Here you can list the main routes of your API, and what are their expected request bodies.
​
| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>GET /users</kbd>     | Retrieves user information.
| <kbd>POST /users</kbd>     | Creates new user information.
| <kbd>PUT /users</kbd>     | Updates user information.
| <kbd>DELETE /users</kbd>     | Deletes user information.
| <kbd>POST /auth/login</kbd>     | Authenticates user login.
| <kbd>POST /auth/Register</kbd>     | Registers a new user.
| <kbd>GET /auth/mail</kbd>     | Sends authentication email.
| <kbd>POST /auth/profile</kbd>     | Updates user profile.
| <kbd>GET categories</kbd>     | Retrieves category information.
| <kbd>PUT categories</kbd>     | Updates category information.
| <kbd>POST categories</kbd>     | Creates a new category.
| <kbd>POST /categories/hide</kbd>     | Hides a category.
| <kbd>DELETE /categories/:id</kbd>     | Deletes a category by ID.
| <kbd>GET /videos</kbd>     | Retrieves video information.
| <kbd>GET /videos/stream/:id </kbd>     | Streams video by ID.
| <kbd>POST /videos </kbd>     | Uploads a new video.
| <kbd>PUT /videos  </kbd>     | Updates video information.
| <kbd>DELETE /videos/:id </kbd>     | Deletes video by ID.
| <kbd>POST /cloudinary/upload </kbd>   | Uploads media to Cloudinary.
| <kbd>GET /dropbox-manage/auth </kbd> | 	Initiates Dropbox authentication.
| <kbd>GET /dropbox-manage/callback</kbd> | 	Handles Dropbox authentication callback.
| <kbd>GET /dropbox-manage/status</kbd> | Checks the current login status
| <kbd>GET /dropbox-manage/space-usage</kbd> | Retrieves Dropbox space usage information.



<h3 id="get-auth-detail">GET /users</h3>

**RESPONSE**
```json
{
    "statusCode": 200,
    "message": "",
    "data": {
        "meta": {
            "current": 1,
            "pageSize": 10,
            "pages": 1,
            "total": 3
        },
        "results": [
            {
                "_id": "66dee974690085741cddda66f",
                "name": "Duy Toan",
                "email": "test@gmail.com",
                "role": "user",
                "accountType": "LOCAL",
                "isActive": false,
                "isOnline": false,
                "createdAt": "2024-09-09T06:35:50.330Z",
                "updatedAt": "2024-09-09T06:35:50.330Z",
                "__v": 0
            }
        ]
    }
}
```

<h3 id="post-auth-detail">POST /users</h3>

**REQUEST**
```json
{
  "email": "test@gmail.com",
  "password": "123456",
  "name": "Duy Toan",
}
```

**RESPONSE**
```json
{
    "statusCode": 201,
    "message": "",
    "data": {
        "_id": "66e3a759cf9e820f1ee9583c"
    }
}
```

<h3 id="post-auth-detail">POST /auth/login</h3>

**REQUEST**
```json
{
  "username": "test@gmail.com",
  "password": "123456",
}
```

**RESPONSE**
```json
{
    "statusCode": 201,
    "message": "Fetch Login",
    "data": {
        "user": {
            "email": "test@gmail.com",
            "_id": "66e3a759cf9e820f1ee9583c",
            "name": "Duy Toan",
            "role": "admin"
        },
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvYW5wbW8xMjNAZ21haWwuY29tIiwic3ViIjoiNjZjMWZh2IzNzg4YTFjMWVmMzhiNTZhIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI2MTk1NTI0LCJleHAiOjE4MTI1OTU1MjR9.9zSetWjjJdsHsVlMCJPExH46jvF4609QOxkPitrf_R0"
    }
}
```

<h3 id="post-auth-detail">POST /auth/register</h3>

**REQUEST**
```json
{
  "email": "test2@gmail.com",
  "password": "123456",
  "name": "Duy Toan",
}
```

**RESPONSE**
```json
{
    "statusCode": 201,
    "message": "",
    "data": {
        "_id": "66e3a759cf9e820f1ee9583c"
    }
}
```


<h3 id="get-auth-detail">GET /categories</h3>

**RESPONSE**
```json
{
    "statusCode": 200,
    "message": "",
    "data": {
        "meta": {
            "current": 1,
            "pageSize": 10,
            "pages": 1,
            "total": 3
        },
        "results": [
            {
                "_id": "66e02290af2299a969c1b3d5",
                "userId": "66c1fa3b3788a1c1ef38b56a",
                "name": "Hoạt Hình",
                "description": "Hoạt Hình",
                "totalVideos": 0,
                "isActive": true,
                "createdAt": "2024-09-10T10:42:24.237Z",
                "updatedAt": "2024-09-10T10:42:24.237Z",
                "__v": 0
            }
        ]
    }
}
```

<h3 id="get-auth-detail">GET /videos</h3>

**RESPONSE**
```json
{
    "statusCode": 200,
    "message": "",
    "data": {
        "meta": {
            "current": 1,
            "pageSize": 10,
            "pages": 1,
            "total": 1
        },
        "results": [
            {
                "_id": "66e1ab5ed5340b49d7110d30",
                "userId": "66c1fa3b3788a1c1ef38b56a",
                "title": "Trailer",
                "embed": "http://localhost:8080/api/v1/videos/stream/1f56d318-4f22-4a4c-8048-bf44dfbb70cc",
                "category": "66de962190085741cddda65a",
                "type_movie": "series",
                "poster": "https://res.cloudinary.com/dbiv7ztfk/image/upload/v1726065481/jrgfuhsjgh8p3x2ffzul.jpg",
                "size": 121835613,
                "resolution": "3840x2160",
                "duration": 43766,
                "dropbox_url": "https://www.dropbox.com/scl/fi/h8decdx2v8d8o19aqxt6ze/TRAILER.mp4?rlkey=f9gpqr6rcpmlgp68629rpzebd&st=bbdun4dm&dl=0",
                "isPublic": true,
                "uuid": "1f56d318-4f22-4a4c-8048-bf44dfbb70cc",
                "idVideo": "h8decx2v8d8o19aqxt6ze",
                "filename": "TRAILER.mp4",
                "rlkey": "f9gpqr6rcpmlgp68629rpzebd",
                "st": "bbdun4dm",
                "createdAt": "2024-09-11T14:38:22.040Z",
                "updatedAt": "2024-09-11T14:38:22.040Z",
                "__v": 0
            }
        ],
        "user": {
            "email": "toanpmo123@gmail.com",
            "_id": "66c1wfa3b3788a1c1ef38b56a",
            "name": "Duy Toan",
            "role": "admin"
        }
    }
}
```


<h3 id="get-auth-detail">GET /cloudinary/upload</h3>

**RESPONSE**
```json
{
    "statusCode": 201,
    "message": "",
    "data": {
        "statusCode": 201,
        "message": "Upload successful",
        "data": {
            "public_id": "i8umiopmd1fxzrlroocx",
            "url": "https://res.cloudinary.com/dbiv7ztfk/image/upload/v1726196668/i8umiopmd13fxzrlroocx.jpg",
            "format": "jpg",
            "width": 900,
            "height": 900
        }
    }
}
```

