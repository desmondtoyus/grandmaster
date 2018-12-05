# Advertiser create

Used to create a new advertiser.

**URL** : `/advertiser/create/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Advertiser will be created on the account the user is logged into.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|name|String|Yes||Advertiser name. Between 6 and 200 characters.|
|notes|String|Yes||Advertiser notes. Can be an empty string. Maximum 500 characters.|

**Data example**

```json
{
    "name": "Some advertiser",
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

**Condition** : Advertiser data sent is not valid.

**Code**: `406 Not Acceptable`

**Condition** : If advertiser with the same name already exists

**Code** : `422 Unprocessable entity`


