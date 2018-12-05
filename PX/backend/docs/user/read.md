# User read

Used to retrieve single user information.

**URL** : `/user/read/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Roles Super Admin and BWA Admin allowed to read all users.
* Zone Admin is allowed to read users in their zone.
* Account Admin allowed to read users in their account.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes|||

**Data example**

```json
{
    "id": 5
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "user": {
      "id": 5,
      "email": "just@email.com"
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "111-111-1111",
      "role": 1,
      "zone_id": 1,
      "account_id": 2,
      "scope_account_id": 2
    }
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Content** : None

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Content** : 

```json
{
  "message": "Could not retrieve the user at this time. Please try again later."
}
```

**Condition** : User was not found

**Code** : `404 Not Found`

**Content** : None

**Condition** : User id was not provided

**Code** : `406 Not Acceptable`

**Content** : None