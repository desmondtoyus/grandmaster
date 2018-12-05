# Account update

Used to update an existing account.

**URL** : `/account/update/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin and BWA Admin are allowed to update all accounts.
* Zone Admin is allowed to update all accounts within the zone.
* All other roles are unauthorized.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Account id|
|name|String|Yes||Account name|
|notes|String|Yes||Account notes. Can be an empty string.|

**Data example**

```json
{
    "id": 5,
    "name": "Some edited account name",
    "notes": "Some edited notes"
}
```

## Success Response

**Code** : `200 OK`

**Content** : None

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : If input is invalid

**Code** : `406 Not Acceptable`

**Condition** : If account does not exist

**Code** : `404 Not Found`


