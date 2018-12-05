# Account create

Used to create a new account.

**URL** : `/account/create/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Only roles Super Admin, BWA Admin and Zone Admin are allowed to create accounts.
* Account will be created under the same zone as the user.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|name|String|Yes||Account name. Between 6 and 200 characters.|
|notes|String|Yes||Account notes. Can be an empty string. Maximum 500 characters.|

**Data example**

```json
{
    "name": "Some account",
    "notes": "Some notes"
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

**Condition** : If input parameters are invalid

**Code** : `406 Unacceptable`