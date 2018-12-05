# Domain list read

Used to retrieve single domain list information.

**URL** : `/lists/read/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Domain list ID|

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
    "id": 1,
    "name": "List 1",
    "value": ["google.com", "yahoo.com"],
    "zone_id": 1,
    "account_id": 1
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : Domain list with the provided id was not found

**Code** : `404 Not Found`

**Condition** : Domain list ID is invalid

**Code** : `406 Not Acceptable`
