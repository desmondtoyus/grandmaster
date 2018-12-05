# User delete

Used to delete a User. Users are not deleted from the db but set to status 'disabled'.

**URL** : `/user/delete/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin and BWA Admin are allowed to delete all users.
* Zone Admin is allowed to delete all users in their zone.
* Account Admin is allowed to delete all users in their account.
* Users are not allowed to delete themselves.
* Users with id 1-10 are reserved BWA Super Admin users.
* All other roles are not authorized.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||User id|

**Data example**

```json
{
    "id": 5
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
  "message": "Could not delete the user at this time. Please try again later."
}
```

**Condition** : If user trying to delete themselves or users with id 1-10

**Code** : `403 Forbidden`

**Content** : 

```json
{
  "message": "Cannot delete this user."
}
```

**Condition** : If user id was not sent

**Code** : `406 Not Acceptable`

**Content** : None

**Condition** : If user does not exist

**Code** : `404 Not Found`

**Content** : None

