# Account deactivate

Used to deactivate an account.

**URL** : `/account/deactivate/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin and BWA Admin are allowed to deactivate all accounts.
* Zone Admin is allowed to deactivate all accounts in their zone.
* All other roles are not authorized.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Account id|

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

**Condition** : If id sent is not valid

**Code** : `406 Not Acceptable`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : If account was not found in the database.

**Code** : `404 Not Found`

**Condition** : If user is not authorized

**Code** : `401 Unauthorized`

**Condition** : If user is trying to deactivate their own account

**Code** : `406 Not Acceptable`

**Condition** : If user is trying to deactivate a primary account

**Code** : `406 Not Acceptable`