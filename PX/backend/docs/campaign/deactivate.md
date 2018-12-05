# Campaign deactivate

Used to deactivate a campaign. Flights under the campaign will be deactivated.

**URL** : `/campaign/deactivate/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Campaign id|

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

**Condition** : If campaign id is invalid

**Code** : `406 Not Acceptable`

**Condition** : If campaign with provided id does not exist

**Code** : `404 Not Found`