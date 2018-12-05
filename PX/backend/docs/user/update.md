# User update

Used to update a user.

**URL** : `/user/update/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin and BWA Admin are allowed to update all users.
* Zone Admin allowed to update users within their zone.
* Account Admin allowed to update users within their account.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Integer|Yes||User id that we want to update.|
|newPassword|String|Yes||Plain text password. Must have at least one uppercase, lowercase and number. If no password change required an empty string must be provided.|
|firstName|String|Yes||First name shall be between 3 and 100 characters.|
|lastName|String|Yes||Last name shall be between 3 and 100 characters|
|phoneNumber|String|No||If provided phone number shall be between 10 and 15 characters.|
|role|Integer|Yes||Role is an integer. Role cannot be lower than the creating user|

**Data example**

```json
{
    "id": 1,
    "newPassword": "My1Password",
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
  "message": "Could not update a user at this time. Please try again later."
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

**Condition** : User was not found by the provided id.

**Code** : `404 Not Found`

**Content** : None

**Condition** : If user id was not provided.

**Code** : `406 Not Acceptable`

**Content** : None