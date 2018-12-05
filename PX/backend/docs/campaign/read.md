# Campaign read

Used to retrieve single campaign information.

**URL** : `/campaign/read/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Campaign ID|

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
    "campaign": {
        "id": 5,
        "name": "Campaign name",
        "notes": "Campaign notes",
        "start_time": 1502302020,
        "end_time": 1512115140,
        "status": "active",
        "day_impression_goal": 0,
        "total_impression_goal": 100000,
        "timezone": "US/Pacific",
        "advertiser": {
            "id": 9,
            "name": "Advertiser name"
         }
    },
    "timezone": "US/Pacific" 
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : Campaign with the provided id was not found

**Code** : `404 Not Found`

**Condition** : Campaign ID is invalid

**Code** : `406 Not Acceptable`
