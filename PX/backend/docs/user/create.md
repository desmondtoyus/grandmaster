# User create

Used to create a new user.

**URL** : `/user/create/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin, BWA Admin, Zone Admin and Account Admin roles are allowed to create users.
* User will be created under the selected account.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|password|String|Yes||Plain text password. Must have at least one uppercase, lowercase and number.|
|email|String|Yes||Valid email address.|
|firstName|String|Yes||First name shall be between 3 and 100 characters.|
|lastName|String|Yes||Last name shall be between 3 and 100 characters|
|phoneNumber|String|No||If provided phone number shall be between 10 and 15 characters.|
|role|Integer|Yes||Role is an integer. Role cannot be lower than the creating user|

**Data example**

```json
{
    "password": "My1Password",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "111-111-1111",
    "role": 2
}
```

## Success Response

**Code** : `200 OK`

**Content** : None

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Content** : None

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Content** : 

```json
{
  "message": "Could not create an account at this time. Please try again later."
}
```

**Condition** : If input fields are not valid.

**Code** : `406 Not Acceptable`

**Content** :

```json
{
    "messages": ["Please provide a valid email", "Please provide a valid password"]
}
```

**Condition** : Email already exists in the db.

**Code** : `422 Unprocessable Entity`

**Content** : 

```json
{
  "message": "Email already exists"
}
```

