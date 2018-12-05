# Campaign update

Used to update a campaign.

**URL** : `/campaign/update/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|name|String|Yes||Campaign name. Between 6 and 200 characters.|
|notes|String|Yes||Campaign notes. Can be an empty string. Maximum 500 characters.|
|startTime|Date String|Yes||Campaign start time.|
|endTime|Date String|Yes||Campaign end time.|
|dayImpressionGoal|Integer|Yes||Daily impressions goal. 0 provided if no goal selected.|
|totalImpressionGoal|Integer|Yes||Total impressions goal. 0 provided if no goal selected.|
|id|Integer|Yes||Campaign ID to update.|

**Data example**

```json
{
    "id": 5,
    "name": "Some campaign",
    "notes": "Some notes",
    "startTime": "2017-01-10 12:00",
    "endTime": "2017-12-31 23:00",
    "dayImpressionGoal": 0,
    "totalImpressionGoal": 100000
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

**Condition** : Campaign data is not valid.

**Code**: `406 Not Acceptable`

**Condition** : Campaign with the provided id was not found


