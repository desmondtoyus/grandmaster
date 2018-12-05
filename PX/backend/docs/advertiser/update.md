# Advertiser update

Used to update an existing advertiser.

**URL** : `/advertiser/update/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Advertiser id|
|name|String|Yes||Advertiser name|
|notes|String|Yes||Advertiser notes. Can be an empty string.|

**Data example**

```json
{
    "id": 5,
    "name": "Some edited advertiser name",
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

**Condition** : If advertiser data is invalid.

**Code** : `406 Not Acceptable`

**Condition** : If advertiser with the provided id does not exist

**Code** : `404 Not Found`


