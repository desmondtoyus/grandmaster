# Flight delete

Used to delete a flight. Flights are not deleted from the db but set to status 'disabled'.

**URL** : `/flight/delete/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Flight id|

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

**Condition** : If flight id is invalid

**Code** : `406 Not Acceptable`

**Condition** : If flight with provided id does not exist

**Code** : `404 Not Found`
