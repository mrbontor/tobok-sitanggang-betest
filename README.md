
# tobok-sitanggang-betest

##### Simple microservice with NodeJs, Express , MongoDB and Redis

### Requirements

- [Git](https://www.odoo.com/documentation/15.0/contributing/documentation.html#install-git)
- [Node JS >= 16.15](https://nodejs.org/en/blog/release/v16.15/)
- [MongoDb Driver](https://www.mongodb.com/docs)
- [MongoDb Server](https://hub.docker.com/_/mongo/).
- [ExpressJS](https://expressjs.com/en/4x/api.html)
- [Redis](https://redis.io/docs/)
- [JWT Token](https://jwt.io/introduction)
- [Docker and Docker Compose](https://docs.docker.com/get-docker/)
- [Ajv and AJv Plugins](https://ajv.js.org/guide/getting-started.html)
- [Uuid](https://github.com/uuidjs/uuid)
- [Docker and Docker Compose](https://docs.docker.com/get-docker/)
- [Winston]https://www.npmjs.com/package/winston)
- [Postman](https://learning.postman.com/docs/getting-started/introduction/)


### Settings & Configuring

#### App config


Please check the file `env.example` and change to `.env`
there are 2 `.env` files, and both are required.
- one in root folder to define server needs
- one in `./apps/user-api` to setup the API


```env
NODE_ENV             = development
APP_PORT            = 3000
APP_ISSUER          = gitbub.com/mrbontor
....

```

#### Database config

This mini microservice is developed using Docker and Docker Compose,
Hint:
- If you are going to use your existing MongoDb and Redis, please change the configuration in `./.env` and `./apps/user-api/.env` (i expects the env files has been renamed)
- If you are using MongoAtlas or other Mongo Cloud, please set variable `MONGO_LOCAL` to true in `./apps/user-api/.env` 
### Deployment && Testing

#### Deployment


Running service using `Docker` and `Docker-Compose`

```sh
# start
$ docker-compose up

# stop
$ docker-compose down

# remove
$ docker-compose down -v

#login to the container by container name base on docker-compose.yml
$ docker exec -it [`container-name`] sh

#logging the container
$ docker logs -f `container-name`
```

Running for existing MongoDB and Redis

```sh
# enter to the user-api
$ cd apps/user-api

# install dependencies
$ npm install

# run app
$ npm start

# or
$ node index.js
```


#### Testing

_No unit tests, cant finish all of them with only 2 days._

For this service, i only provide [Postman File](./JENIUS.postman_collection.json),
The file already includes Environtment, Documentation and Test cases for every endpoint.

Please follow [Postman Doc Import Api](https://learning.postman.com/docs/designing-and-developing-your-api/importing-an-api/) for better information

below is the output and test case from the `postman file json`

### Endpoints

* [AUTH](#auth)
    1. [LOGIN](#1-login)
        * [Success](#i-example-request-success)
        * [Un Authorized / wrong credential](#ii-example-request-un-authorized--wrong-credential)
    1. [SIGNUP](#2-signup)
        * [Success](#i-example-request-success-1)
        * [Err username exists](#ii-example-request-err-username-exists)
        * [Err email exist](#iii-example-request-err-email-exist)
        * [Err identityNumber exist](#iv-example-request-err-identitynumber-exist)
        * [Err accountNumber exist](#v-example-request-err-accountnumber-exist)
    1. [REFRESH](#3-refresh)
        * [Success](#i-example-request-success-2)
        * [Un Authorized](#ii-example-request-un-authorized)
    1. [LOGOUT](#4-logout)
        * [Sucesss](#i-example-request-sucesss)
        * [Un Authorized](#ii-example-request-un-authorized-1)
* [USER](#user)
    1. [CREATE](#1-create)
        * [Success](#i-example-request-success-3)
        * [Err username exists](#ii-example-request-err-username-exists-1)
        * [Err email exist Copy](#iii-example-request-err-email-exist-copy)
        * [Err identityNumber exist](#iv-example-request-err-identitynumber-exist-1)
        * [Err accountNumber exist](#v-example-request-err-accountnumber-exist-1)
        * [Un Authorized](#vi-example-request-un-authorized)
    1. [UPDATE CREDENTIAL](#2-update-credential)
        * [Success](#i-example-request-success-4)
        * [Incorrect Password](#ii-example-request-incorrect-password)
        * [Un Authorized, password has changed](#iii-example-request-un-authorized-password-has-changed)
    1. [GET ALL](#3-get-all)
        * [Success](#i-example-request-success-5)
        * [Un Authorized](#ii-example-request-un-authorized-2)
    1. [GET TABLE](#4-get-table)
        * [Success](#i-example-request-success-6)
        * [Success with filter user](#ii-example-request-success-with-filter-user)
        * [Success with sort](#iii-example-request-success-with-sort)
        * [Un Authorized](#iv-example-request-un-authorized)
    1. [GET ONE](#5-get-one)
        * [Success without cache](#i-example-request-success-without-cache)
        * [Success with cache](#ii-example-request-success-with-cache)
        * [Un Authorized](#iii-example-request-un-authorized)
    1. [PUT](#6-put)
        * [Success](#i-example-request-success-7)
        * [Err Validation additionalProperties](#ii-example-request-err-validation-additionalproperties)
        * [Err Valdation required field(s)](#iii-example-request-err-valdation-required-fields)
        * [Un Authorized](#iv-example-request-un-authorized-1)
    1. [DELETE](#7-delete)
        * [Success](#i-example-request-success-8)
        * [Un Authorized](#ii-example-request-un-authorized-3)
* [Ungrouped](#ungrouped)
    1. [HEALTH CHECK](#1-health-check)
        * [Service Online](#i-example-request-service-online)

--------



## AUTH

User(s) must be _authenticated_ before accessing any API.

  
The `AUTH API` will return `accessToken`, `refreshToken` and `DID`  
`API` has provided `Cookies` for clients with `expiration time`.  
To change the `lifetime`, look in the `.env` file. Expiration time is used to handle `JWT Token` and `Cookie` expiration

Notes:

- `accessToken` will be returned in response body
- `refreshToken` will be returned as `Cookie` with name `RTOKEN`
- `deviceId` is the _**device identifier**_ and will be returned as a `Cookie` with name `DID`



### 1. LOGIN


User login using method POST with paramaters`username` and `password.`


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{local}}/v1/auth/login
```



***Body:***

```js        
{
    "accountNumber": 12345671,
    "password": "Superadmin123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "accountNumber": 12345671,
    "password": "Superadmin123!"
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImFjY291bnROdW1iZXIiOjEyMzQ1NjcxLCJpZGVudGl0eU51bWJlciI6MTIzNDU2Nzg5ODc2NTQzMX0sImlhdCI6MTY3NTU4NTIyOSwiZXhwIjoxNzExNTg4ODI5LCJhdWQiOiJnaXRidWIuY29tL21yYm9udG9yIiwiaXNzIjoiZ2l0YnViLmNvbS9tcmJvbnRvciJ9.QC0dGYt6Rd3Nou3jc8gD9i-Bmseg26Pg0Y02gNFwIGw"
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Un Authorized / wrong credential



***Body:***

```js        
{
    "accountNumber": 12345678,
    "password": "Superadmin123!"
}
```



#### II. Example Response: Un Authorized / wrong credential
```js
{
    "status": false,
    "message": "Un Authorized!"
}
```


***Status Code:*** 401

<br>



### 2. SIGNUP


Register user use `JSON` payload to create a user

fields:

- userName, `required`
- accountNumber, `required`
- emailAddress, `required`
- identityNumber, `required`
- password, `required`


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{local}}/v1/auth/register
```



***Body:***

```js        
{
    "userName": "user1",
    "accountNumber": 12345672,
    "emailAddress": "user1@gmail.com",
    "identityNumber": 1234567898765411,
    "password": "iamUser123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "userName": "user",
    "accountNumber": 12345672,
    "emailAddress": "user@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": "63df60c87116dd7ec619891b"
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err username exists



***Body:***

```js        
{
    "userName": "user",
    "accountNumber": 12345672,
    "emailAddress": "user@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### II. Example Response: Err username exists
```js
{
    "status": false,
    "message": "The userName has been registered!"
}
```


***Status Code:*** 400

<br>



#### III. Example Request: Err email exist



***Body:***

```js        
{
    "userName": "user1",
    "accountNumber": 12345672,
    "emailAddress": "user@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### III. Example Response: Err email exist
```js
{
    "status": false,
    "message": "The emailAddress has been registered!"
}
```


***Status Code:*** 400

<br>



#### IV. Example Request: Err identityNumber exist



***Body:***

```js        
{
    "userName": "user1",
    "accountNumber": 12345672,
    "emailAddress": "user1@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### IV. Example Response: Err identityNumber exist
```js
{
    "status": false,
    "message": "The identityNumber has been registered!"
}
```


***Status Code:*** 400

<br>



#### V. Example Request: Err accountNumber exist



***Body:***

```js        
{
    "userName": "user1",
    "accountNumber": 12345672,
    "emailAddress": "user1@gmail.com",
    "identityNumber": 1234567898765411,
    "password": "iamUser123!"
}
```



#### V. Example Response: Err accountNumber exist
```js
{
    "status": false,
    "message": "The accountNumber has been registered!"
}
```


***Status Code:*** 400

<br>



### 3. REFRESH


Fetch new Token as a refresh token


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/auth/refresh-token
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImFjY291bnROdW1iZXIiOjEyMzQ1NjcxLCJpZGVudGl0eU51bWJlciI6MTIzNDU2Nzg5ODc2NTQzMX0sImlhdCI6MTY3NTU4NjA1MSwiZXhwIjoxNzExNTg5NjUxLCJhdWQiOiJnaXRidWIuY29tL21yYm9udG9yIiwiaXNzIjoiZ2l0YnViLmNvbS9tcmJvbnRvciJ9.6wZWjm5yqqiHdXX6Mjdmf_ZnoULI05C6FhS-HuCGZAw"
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Un Authorized



***Body: None***



#### II. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 4. LOGOUT


User Logout and remove token, cookies etc


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/auth/logout
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| allDevices | true | true or false |



***More example Requests/Responses:***


#### I. Example Request: Sucesss



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| allDevices | true | true or false |



***Body: None***



***Status Code:*** 204

<br>



#### II. Example Request: Un Authorized



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| allDevices | true | true or false |



***Body: None***



#### II. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



## USER

`Users` directory contains all the user related APIs. For authentication these apis requrie `AuthBearerToken`



### 1. CREATE


Create user use `JSON` payload to create a user

fields:

- userName, _`required`_
- accountNumber, _`required`_
- emailAddress, _`required`_
- identityNumber, _`required`_
- password, _`required`_


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{local}}/v1/users
```



***Body:***

```js        
{
    "userName": "user5",
    "accountNumber": 12345675,
    "emailAddress": "user5@gmail.com",
    "identityNumber": 1234567898765435,
    "password": "User123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "userName": "user",
    "accountNumber": 12345672,
    "emailAddress": "user@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": "63df60c87116dd7ec619891b"
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err username exists



***Body:***

```js        
{
    "userName": "user",
    "accountNumber": 12345672,
    "emailAddress": "user@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### II. Example Response: Err username exists
```js
{
    "status": false,
    "message": "The userName has been registered!"
}
```


***Status Code:*** 400

<br>



#### III. Example Request: Err email exist Copy



***Body:***

```js        
{
    "userName": "user1",
    "accountNumber": 12345672,
    "emailAddress": "user@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### III. Example Response: Err email exist Copy
```js
{
    "status": false,
    "message": "The emailAddress has been registered!"
}
```


***Status Code:*** 400

<br>



#### IV. Example Request: Err identityNumber exist



***Body:***

```js        
{
    "userName": "user1",
    "accountNumber": 12345672,
    "emailAddress": "user1@gmail.com",
    "identityNumber": 1234567898765432,
    "password": "iamUser123!"
}
```



#### IV. Example Response: Err identityNumber exist
```js
{
    "status": false,
    "message": "The identityNumber has been registered!"
}
```


***Status Code:*** 400

<br>



#### V. Example Request: Err accountNumber exist



***Body:***

```js        
{
    "userName": "user1",
    "accountNumber": 12345672,
    "emailAddress": "user1@gmail.com",
    "identityNumber": 1234567898765411,
    "password": "iamUser123!"
}
```



#### V. Example Response: Err accountNumber exist
```js
{
    "status": false,
    "message": "The accountNumber has been registered!"
}
```


***Status Code:*** 400

<br>



#### VI. Example Request: Un Authorized



***Body:***

```js        
{
    "userName": "superadmin",
    "accountNumber": 12345671,
    "emailAddress": "superadmin@gmail.com",
    "identityNumber": 1234567898765431,
    "password": "Superadmin123!"
}
```



#### VI. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 2. UPDATE CREDENTIAL


`Patch` password user use `JSON` payload to update user password.

fields:

- password, _`required`_
- newPassword, _`required`_
    

Noted: Changing password will remove Token Bearer


***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: {{local}}/v1/users/password/1234567898765431
```



***Body:***

```js        
{
    "password": "Superadmin123!",
    "newPassword": "Superadmin123!!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "password": "Superadmin123!!",
    "newPassword": "Superadmin123!"
}
```



***Status Code:*** 204

<br>



#### II. Example Request: Incorrect Password



***Body:***

```js        
{
    "password": "Superadmin123!",
    "newPassword": "Superadmin123!!"
}
```



#### II. Example Response: Incorrect Password
```js
{
    "status": false,
    "message": "Incorect Password"
}
```


***Status Code:*** 400

<br>



#### III. Example Request: Un Authorized, password has changed



***Body:***

```js        
{
    "password": "!Haruslolos123",
    "newPassword": "Haruslolos123!"
}
```



#### III. Example Response: Un Authorized, password has changed
```js
Unauthorized
```


***Status Code:*** 401

<br>



### 3. GET ALL


Fetch all list users


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/users
```



***Query params:***

| Key | Value | Description |
| --- | ------|-------------|
| identityNumber | 1234567898765431 |  |



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "63df5fb20a6799aeaf22f724",
            "userName": "superadmin",
            "accountNumber": 12345671,
            "emailAddress": "superadmin@gmail.com",
            "identityNumber": 1234567898765431
        },
        {
            "_id": "63df60c87116dd7ec619891b",
            "userName": "user",
            "accountNumber": 12345672,
            "emailAddress": "user@gmail.com",
            "identityNumber": 1234567898765432
        }
    ]
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Un Authorized



***Body: None***



#### II. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 4. GET TABLE


Fetch `User` using pagination

allowed filter/search by multiple fields

- firstName
- username
- email
- status
    

can be sorted by those fields as well

`sortBy` = status

`sortType` = `desc` or `asc`


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/users/table
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "sort": {
            "updatedAt": "ASC"
        },
        "page": 1,
        "size": 10,
        "totalRecord": 2,
        "totalPage": 1,
        "data": [
            {
                "_id": "63df5fb20a6799aeaf22f724",
                "userName": "superadmin",
                "accountNumber": 12345671,
                "emailAddress": "superadmin@gmail.com",
                "identityNumber": 1234567898765431,
                "createdAt": "2023-02-05T07:50:10.417Z",
                "updatedAt": "2023-02-05T07:50:10.417Z"
            },
            {
                "_id": "63df60c87116dd7ec619891b",
                "userName": "user",
                "accountNumber": 12345672,
                "emailAddress": "user@gmail.com",
                "identityNumber": 1234567898765432,
                "createdAt": "2023-02-05T07:54:48.310Z",
                "updatedAt": "2023-02-05T07:54:48.310Z"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Success with filter user



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| sortBy | status | userName, emailAddress, identityNumber, accountNumber  |
| sortType | desc | asc, desc and/or  0, 1 |
| search | superadmin | string |



***Body: None***



#### II. Example Response: Success with filter user
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "sort": {
            "status": "DESC"
        },
        "page": 1,
        "size": 10,
        "totalRecord": 2,
        "totalPage": 1,
        "data": [
            {
                "_id": "63df5fb20a6799aeaf22f724",
                "userName": "superadmin",
                "accountNumber": 12345671,
                "emailAddress": "superadmin@gmail.com",
                "identityNumber": 1234567898765431,
                "createdAt": "2023-02-05T07:50:10.417Z",
                "updatedAt": "2023-02-05T07:50:10.417Z"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



#### III. Example Request: Success with sort



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| sortBy | status | firstName, username, email, status |
| sortType | desc | asc, desc and/or  0, 1 |



***Body: None***



#### III. Example Response: Success with sort
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "sort": {
            "status": "DESC"
        },
        "page": 1,
        "size": 10,
        "totalRecord": 2,
        "totalPage": 1,
        "data": [
            {
                "_id": "63df5fb20a6799aeaf22f724",
                "userName": "superadmin",
                "accountNumber": 12345671,
                "emailAddress": "superadmin@gmail.com",
                "identityNumber": 1234567898765431,
                "createdAt": "2023-02-05T07:50:10.417Z",
                "updatedAt": "2023-02-05T07:50:10.417Z"
            },
            {
                "_id": "63df60c87116dd7ec619891b",
                "userName": "user",
                "accountNumber": 12345672,
                "emailAddress": "user@gmail.com",
                "identityNumber": 1234567898765432,
                "createdAt": "2023-02-05T07:54:48.310Z",
                "updatedAt": "2023-02-05T07:54:48.310Z"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



#### IV. Example Request: Un Authorized



***Body: None***



#### IV. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 5. GET ONE


Fetch a single user using `identityNumber`


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/users/1234567898765431
```



***More example Requests/Responses:***


#### I. Example Request: Success without cache



***Body: None***



#### I. Example Response: Success without cache
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "_id": "63df5fb20a6799aeaf22f724",
        "userName": "superadmin",
        "accountNumber": 12345671,
        "emailAddress": "superadmin@gmail.com",
        "identityNumber": 1234567898765431
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Success with cache



***Body: None***



#### II. Example Response: Success with cache
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "_id": "63df5fb20a6799aeaf22f724",
        "userName": "superadmin",
        "accountNumber": 12345671,
        "emailAddress": "superadmin@gmail.com",
        "identityNumber": 1234567898765431
    }
}
```


***Status Code:*** 200

<br>



#### III. Example Request: Un Authorized



***Body: None***



#### III. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 6. PUT


Update user use `JSON` payload to update a user


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{local}}/v1/users/1234567898765431
```



***Body:***

```js        
{
    "userName": "superadmin",
    "accountNumber": 12345671,
    "emailAddress": "superadmin@gmail.com",
    "identityNumber": 1234567898765431
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "userName": "superadmin",
    "accountNumber": 12345671,
    "emailAddress": "superadmin@gmail.com",
    "identityNumber": 1234567898765431
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "_id": "63df5fb20a6799aeaf22f724",
        "userName": "superadmin",
        "accountNumber": 12345671,
        "emailAddress": "superadmin@gmail.com",
        "identityNumber": 1234567898765431,
        "infoLogin": {
            "hash": "d5573c28333a6ce94d61ea62a8bda6a0a7fc252eeb77c7083774ffeeb022e5d3e35ec619b2f2d5b151cf593edcb9ba0c53ce2545bb5eabc0684c65791063bef1",
            "salt": "WJ0J8ANdB6oKNx+LSuge/pAONk7DYk5y+5YuAukz3igSy2CgXJ3L/daXJNiwoisYsp+QeWyXY5ljpEF+h57T+d2m467VrR0ykCree/Fg6P67/xw7ZgF7Fajto7p0ZoGSQpPs8lwuQzjEzEL4ns0o3Dhtrc+JHR/3rCFErmgL0SE=",
            "iterations": 10856
        },
        "createdAt": "2023-02-05T09:21:44.957Z",
        "updatedAt": "2023-02-05T09:21:44.957Z",
        "modified": "2023-02-05T15:49:04+07:00",
        "token": [
            {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZXlKcGRpSTZJbkZRVlhaak0yMXhhMngwV1ZBclVWZ2lMQ0psYm1OeWVYQjBaV1JFWVhSaElqb2lOMVZNVVdneFFWRlJiMWRTWkRrMFVEWTFRV2c0THpaWlRYWmpOelJ0VEhWSU5HRnZMMmxVVWs1MmVHZHNNMUZJWW1JclpXdENObkJpTlZKWGNYVmtRVTFVYjJGaVMwVkJORkpKYkhZdmF6QklWbU5rTVhGTGJtVlJPV3hXYzBaVmFUUXdXU0lzSW1GMWRHZ2lPaUp6ZEVKRWNrcFNSM3BHWm10MFZtSjJSRGN3V1dSQlBUMGlmUT09IiwiaWF0IjoxNjc1NTg2OTQ0LCJleHAiOjE3NjE5ODY5NDQsImF1ZCI6ImdpdGJ1Yi5jb20vbXJib250b3IiLCJpc3MiOiJnaXRidWIuY29tL21yYm9udG9yIn0.cY-I6EY9LAkPoj9zufJADF-T3a_HvJ5Q4KoMmhn3l5U",
                "ipAddress": "::1",
                "userAgent": "PostmanRuntime/7.30.0",
                "deviceId": "8e4535bd-cd47-4d15-85cf-8c0552a778f4",
                "updateAt": "2023-02-05T15:49:04+07:00"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err Validation additionalProperties



***Body:***

```js        
{
    "userName": "superadmin",
    "accountNumber": 12345671,
    "emailAddress": "superadmin@gmail.com",
    "identityNumber": 1234567898765431,
    "password": "Superadmin123!"
}
```



#### II. Example Response: Err Validation additionalProperties
```js
{
    "status": false,
    "message": "Validation Error!",
    "errors": [
        {
            "param": "password",
            "key": "additionalProperties",
            "message": "must NOT have additional properties"
        }
    ]
}
```


***Status Code:*** 400

<br>



#### III. Example Request: Err Valdation required field(s)



***Body:***

```js        
{
    "userName": "superadmin",
    "accountNumber": 12345671,
    "emailAddress": "superadmin@gmail.com"
}
```



#### III. Example Response: Err Valdation required field(s)
```js
{
    "status": false,
    "message": "Validation Error!",
    "errors": [
        {
            "param": "identityNumber",
            "key": "required",
            "message": "Identity number is required!"
        }
    ]
}
```


***Status Code:*** 400

<br>



#### IV. Example Request: Un Authorized



***Body: None***



#### IV. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 7. DELETE


Delete a single user using `idUser`

Only Admin can perform this API


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{local}}/v1/users/1234567898765435
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



***Status Code:*** 204

<br>



#### II. Example Request: Un Authorized



***Body: None***



#### II. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



## Ungrouped



### 1. HEALTH CHECK


To ensure this service online, the client can request to this API first than continue main API


***Endpoint:***

```bash
Method: GET
Type: 
URL: localhost:3000
```



***More example Requests/Responses:***


#### I. Example Request: Service Online



***Body: None***



#### I. Example Response: Service Online
```js
{
    "uptime": 326.873812918,
    "message": "OK",
    "timestamp": 1675584608234
}
```


***Status Code:*** 200

<br>



---
[Back to top](#tobok-sitanggang-betest)
