# Flight read

Used to retrieve single flight information.

**URL** : `/flight/read/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Flight ID|

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
    
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : Flight with the provided id was not found

**Code** : `404 Not Found`

**Condition** : Flight ID is invalid

**Code** : `406 Not Acceptable`
