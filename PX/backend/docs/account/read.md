# Account read

Used to retrieve single account information.

**URL** : `/account/read/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin, BWA Admin are allowed to read account from any zone.
* Zone Admin allowed to read account from their zone.
* All other roles are not allowed to read accounts.

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
    "id": 5,
    "name": "Account name",
    "notes": "Account notes",
    "zone_id": 1,
    "status": "active"
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : Account was not found

**Code** : `404 Not Found`

**Condition** : If invalid id was provided

**Code** : `406 Unacceptable`