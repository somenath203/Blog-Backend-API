# Blog API Documentation

## Technologies Used in the Project

NodeJs, ExpressJS, MongoDB


# API Features

- Authentication & Authorization
- Post CRUD operations
- Comment functionality
- System blocking user if inactive for 30 days
- A user can block different users
- A user who block another user cannot see his/her posts
- Last date a post was created
- Check if a user is active or not
- Check last date a user was active
- Changing user award based on number of posts created by the user
- A user can follow and unfollow another user
- Get following and followers count
- Get total profile viewers count
- Get posts created count
- Get count of number of users you blocked
- Get all users who views someone's profile
- Admin can block and unblock a user
- Update password
- Profile photo upload
- A user can close his/her account permanently

# API Endpoints

- [Authentication](#Authentication)
    - [Register a New User](#Register-for-a-new-Account)
    - [Login an Existing User](#Login-an-existing-user)

<br>

- [User](#User)
    - [Get all available Users](#Get-all-Existing-Users)
    - [View your own Profile](#View-your-own-Profile)
    - [View other users](#View-other-users)
    - [Following a user](#Follow-a-User)
    - [Unfollowing a user](#Unfollow-a-User)
    - [Update your password](#Update-your-password)
    - [Update your profile](#Update-your-Profile)
    - [Upload profile picture](#Upload-profile-picture)
    - [Close your account](#Close-your-account)
    - [Block a user](#Block-a-User)
    - [Unblock a user](#Unblock-a-User)
    - [Admin blocking a user](#Admin-block-Account)
    - [Admin unblocking a user](#Admin-unblock-Account)

<br>

- [Post](#Post)
    - [Create a new Post](#Create-Post)
    - [Get all Posts](#Get-all-Posts)
    - [View a Particular Post](#View-a-Particular-Post)
    - [Toggle like on a Post](#Toggle-like-on-a-Post)
    - [Toggle dislike on a Post](#Toggle-dislike-on-a-Post)
    - [Update your Post](#Update-your-Post)
    - [Delete your Post](#Delete-a-Post)


<br>

- [Category](#Cateogory)
    - [Get all Categories](#Get-all-Categories)
    - [Get a Particular Category](#Get-a-particular-Category)
    - [Create a new Category](#Create-a-new-Cateogory)
    - [Update a Category](#Update-a-Category)
    - [Delete a Category](#Delete-a-Category)

<br>

- [Comment](#Comments)
    - [Create a new Comment](#Create-a-new-Comment)
    - [Update Comment](#Update-a-Comment)
    - [Delete Comment](#Delete-a-Comment)


<br>

# Authentication

Welcome to Authentication Section where you can register for a new account and as well as login with your existing account.

__The request body needs to be in JSON Format__

## Register for a new Account

```http
POST /api/v1/users/register
```

#### Example Request
```javascript
{
    "firsname": "your first name",
    "lastname": "your last name",
    "email": "your email address",
    "password": "your password"
}
```


## Login an existing user

```http
POST /api/v1/users/login
```

#### Example Request
```javascript
{
    "email": "your email address",
    "password": "your password"
}
```

### Parameters Required

| Parameter        | Type     | Description   | Required |
| :--------------- | :------- | :------------ | :------- |
| `authentication` | `string` | Your token    | no       |
| `email`          | `string` | Your email    | yes      |
| `password`       | `string` | Your password | yes      |



# User

Welcome to the User section where you can perform all the functionalities as an authenticated user.

__The request body needs to be in JSON Format__

## Get all Existing Users

```http
GET /api/v1/users
```

### Parameters Required

| Parameter        | Type     | Description   | Required |
| :--------------- | :------- | :------------ | :------- |
| `authentication` | `string` | Your token    | yes      |


## View your own Profile

```http
GET /api/v1/users/profile
```
### Parameters Required

| Parameter        | Type     | Description   | Required |
| :--------------- | :------- | :------------ | :------- |
| `authentication` | `string` | Your token    | yes      |


## Follow a User

```http
GET /api/v1/users/following/:id
```

### Parameters Required

| Parameter        | Type     | Description                         | Required |
| :--------------- | :------- | :---------------------------------- | :------- |
| `authentication` | `string` | Your token                          | yes      |
| `id`             | `string` | ID of the user you want to follow   | yes      |


## Unfollow a User

```http
GET /api/v1/users/un-follow/:id
```

### Parameters Required

| Parameter        | Type     | Description                         | Required |
| :--------------- | :------- | :---------------------------------- | :------- |
| `authentication` | `string` | Your token                          | yes      |
| `id`             | `string` | ID of the user you want to unfollow | yes      |

## Block a User

```http
GET /api/v1/users/blocked/:id
```

### Parameters Required

| Parameter        | Type     | Description                         | Required |
| :--------------- | :------- | :---------------------------------- | :------- |
| `authentication` | `string` | Your token                          | yes      |
| `id`             | `string` | ID of the user you want to block    | yes      |


## Unblock a User

```http
GET /api/v1/users/un-blocked/:id
```

### Parameters Required

| Parameter        | Type     | Description                         | Required |
| :--------------- | :------- | :---------------------------------- | :------- |
| `authentication` | `string` | Your token                          | yes      |
| `id`             | `string` | ID of the user you want to unblock  | yes      |


## Update your Profile

```http
PUT /api/v1/users
```

#### Example Request
```javascript
{
    "firsname": "your first name",
    "lastname": "your last name",
    "email": "your email address",
    "password": "your password"
}
```

### Parameters Required

| Parameter        | Type     | Description   | Required |
| :--------------- | :------- | :------------ | :------- |
| `authentication` | `string` | Your token    | Yes      |
| `firstname`      | `string` | Your firstname| optional |
| `lastname`       | `string` | Your lastname | optional |
| `email`          | `string` | Your email    | optional |
| `password`       | `string` | Your password | optional |


## View other users

```http
GET /api/v1/users/profile-viewers/:id
```
### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the user you want to view his profile    | yes      |


## Update your password

```http
PUT /api/v1/users/update-password
```

#### Example Request

```javascript
{
    "password": "your password"
}
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |


## Upload profile picture

```http
POST /api/v1/users/profile-photo-upload
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `profile`        | `string` | Your profile photo                             | yes      |


## Close your account

```http
DELETE /api/v1/users
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |


## Admin block Account

```http
PUT /api/v1/users/admin-block/:id
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the user admin want to block             | yes      |



## Admin unblock Account

```http
PUT /api/v1/users/admin-unblock/:id
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the user admin want to unblock           | yes      |

<br>

# Post

Welcome to the Post section where you can perform all the necessary functions related to Post.

__The request body needs to be in Form-Data__

## Create Post

```http
POST /api/v1/posts
```
#### Example Request
```javascript
{
    "title": "title of the post",
    "description": "description of the post",
    "category": "id of the category you want your post to be the part of",
    "postImage": "upload photo"
}
```
### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `title`          | `string` | title of the post                              | yes      |
| `description`    | `string` | description of the post                        | yes      |
| `category`       | `string` | ID of the category                             | yes      |
| `postImage`      | `string` | image of the post                              | yes      |


## Get all Posts

```http
GET /api/v1/posts
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |


## View a Particular Post

```http
GET /api/v1/posts/:id
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the post you want to view                | yes      |


## Toggle like on a Post

```http 
GET /api/v1/posts/likes/:id
```

### Parmaeters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the post you want to like                | yes      |


## Toggle dislike on a Post

```http 
GET /api/v1/posts/dislikes/:id
```
### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the post you want to dislike             | yes      |


## Update your Post

```http
PUT /api/v1/posts/:id
```

#### Example Request
```javascript
{
    "title": "title of the post",
    "description": "description of the post",
    "category": "id of the category you want your post to be the part of",
    "postImage": "upload photo"
}
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the post you want to update              | yes      |
| `title`          | `string` | title of the post                              | optional |
| `description`    | `string` | description of the post                        | optional |
| `category`       | `string` | ID of the category                             | optional |
| `postImage`      | `string` | image of the post                              | optional |



## Delete a Post

```http
DELETE /api/v1/posts/:id
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the post you want to delete              | yes      |

<br>

# Cateogory

Welcome to the Cateogry section where you can perform all the necessary functions related to Cateogry.

## Create a new Cateogory

```http
POST /api/v1/categories
```

#### Example Request

```javascript
{
    "title": "category title"
}
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `title`          | `string` | title of the category                          | yes      |


## Get all Categories

```http
GET /api/v1/categories
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |


## Get a particular Category

```http
GET /api/v1/categories/:id
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the category you want to get             | yes      |


## Update a Category

```http
PUT /api/v1/categories/:id
```

#### Example Request

```javascript
{
    "title": "category title"
}
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the category you want to edit            | yes      |
| `title`          | `string` | title of the category                          | yes      |


## Delete a Category

```http
DELETE /api/v1/categories/:id
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | ID of the category you want to edit            | yes      |

<br>

# Comments

Welcome to the Comments section where you can perform all the functionalities related to comments.


## Create a new Comment

```http
POST /api/v1/comments/:id
```

#### Example Request

```javascript
{
    "description": "your comment"
}
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |



## Update a Comment

```http
PUT /api/v1/comments/:id
```

#### Example Request

```javascript
{
    "description": "your comment"
}
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | id of the comment you want to edit             | yes      |
| `description`    | `string` | description of the comment                     | yes      |


## Delete a Comment

```http
DELETE /api/v1/comments/:id
```

### Parameters Required

| Parameter        | Type     | Description                                    | Required |
| :--------------- | :------- | :--------------------------------------------- | :------- |
| `authentication` | `string` | Your token                                     | yes      |
| `id`             | `string` | id of the comment you want to edit             | yes      |


<br>
<br>

# Collaboration
If you want to contribute in this project, then, feel free to reach me at __[somenathchoudhury35@gmail.com](mailto:somenathchoudhury35@gmail.com)__

### Github Repo Link to the Frontend Links Page of the Blog API: https://github.com/somenath203/Blog-API-Links-Frontend
