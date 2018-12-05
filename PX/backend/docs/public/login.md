# Login

Used to log in the user based on email and password. Returns token and role details.

**URL** : `/public/login/`

**Method** : `POST`

**Auth required** : NO

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|-------|:-----------|
|email|String|Yes| |Valid email address|
|password|String|Yes| |Plain text password|

**Data example**

```json
{
    "username": "iloveauth@example.com",
    "password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d",
    "role": 1
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong or email does not exist.

**Code** : `401 Unauthorized`

**Content** : None