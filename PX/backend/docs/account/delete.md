# Account delete

Used to delete an account. Accounts are not deleted from the db but set to status 'disabled'.

**URL** : `/account/delete/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin and BWA Admin are allowed to delete all accounts except primary zone accounts.
* Zone Admin is allowed to delete all accounts in their zone except primary zone account.
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

**Condition** : If account id is invalid

**Code** : `406 Unacceptable`

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Content** : None

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : If account is a primary account or contains users.

**Code** : `403 Forbidden`

**Condition** : If account does not exist

**Code** : `404 Not Found`