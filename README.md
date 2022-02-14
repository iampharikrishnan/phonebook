# Phone Book

## Introduction

Phone Book is built ground up with JSON API that help people to store contacts in server.

This document describes how to use the api provided by Phone Book. We hope you enjoy these docs, and please don't hesitate to file an issue if you see anything missing.

## Authentication

Phone book services can only be accessed after authenticating by logging in or sign up if not already a user.

### Sign up

Sign up is a put request taking user data as body for signing up

```api
http://localhost:8080/auth/signup
```

User data must be send in the following format:

| Parameter | type   | Description                       |
|-----------|--------|-----------------------------------|
| username  | string | **Required** Phone book user name |
| password  | string | **Required** Phone book password  |
| email     | string | **Optional** Mail id of user      |
| name      | string | **Optional** Full name of user    |
| phone     | number | **Optional** phone number of user |

### Login

Login is a post request taking user id and password to login

```api
http://localhost:8080/auth/login
```

User credentials should in of format:

| Parameter | type   | Description                       |
|-----------|--------|-----------------------------------|
| username  | string | **Required** Phone book user name |
| password  | string | **Required** Phone book password  |

### Logout

Logout is a post request that takes no body

```api
http://localhost:8080/auth/logout
```

## Contacts

Contacts can be stored, updated and deleted by authorized personals. Login to access these features.

### Create contacts

Create contact is a put request taking single contact as body

```api
http://localhost:8080/api/add_contact
```

The contacts should be of following format:

| Parameter | type   | Description                       |
|-----------|--------|-----------------------------------|
| name      | string | **Required** Contact name         |
| email     | string | **Required** Contact mail id      |
| phone     | number | **Optional** Contact phone number |

### Update contacts

Update contact is a patch request taking single contact as body

```api
http://localhost:8080/api/update_contact/:id
```

Where ***:id*** is _id of contact you get form server.

The update parameter should be one of these:

| Parameter | type   | Description          |
|-----------|--------|----------------------|
| name      | string | Contact name         |
| email     | string | Contact mail id      |
| phone     | number | Contact phone number |

### Get all contacts

Get all contacts is a get request which returns contacts that user have saved till now.

```api
http://localhost:8080/api/get_all_contacts/:page?size=:size
```

Where ***:page*** is page number and ***size*** is number of contacts in each page. ***:size*** is optional. The default ***:size*** is 10.

### Search contacts

Search contact is a get request to search contact with name or mail id.

```api
http://localhost:8080/api/get_all_contacts/:page?size=:size
```

Where ***:page*** is page number and ***size*** is number of contacts in each page. ***:size*** is optional. The default ***:size*** is 10.

Search parameters are:

| Parameter | type   | Description          |
|-----------|--------|----------------------|
| name      | string | Contact name         |
| email     | string | Contact mail id      |

### Delete contact

Delete contact is a delete request taking single contact as body

```api
http://localhost:8080/api/update_contact/:id
```

Where ***:id*** is _id of contact you get form server.

## Responses

Phone book API endpoints return the JSON representation of the resources created, edited or removed. Phone book returns a JSON response in the following format:

```json
{
  "status"  : number,
  "message" : string,
  "data"    : object
}
```

The ***status*** attribute contains status code indicating current status.

The ***message*** attribute contains a message commonly used to indicate current status. It will have error message if invalid api call was made.

The ***data*** attribute contains result of API. It will not be present if invalid api call was name.

## Status Codes

Phone book returns the following status codes in its API:

|Status Code| Description           |
|-----------|-----------------------|
|200        | OK                    |
|201        | CREATED               |
|400        | BAD REQUEST           |
|404        | NOT FOUND             |
|500        | INTERNAL SERVER ERROR |
