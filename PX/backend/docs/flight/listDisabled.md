# Flights list disabled

Used to retrieve a list of all disabled flights.

**URL** : `/flight/list_disabled/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|searchTerm|String|No||String to match flight name|
|currentPage|Number|No|1|Pagination page number to view|
|sortBy|String|No|id|Campaign value to sort by. Options are id, start_time, end_time, created_at and name|
|sortDirection|String|No|asc|Sort direction. Options are asc and desc|
|pageChunk|Number|No|15|Number of results to display on each page|
|id|Number|No||Campaign ID to list flights for. If not provided all flights for the scope account will be returned|

**Data example**

```json
{
    "searchTerm": "abc",
    "currentPage": 1,
    "sortBy": "id",
    "sortDirection": "asc",
    "pageChunk": 15,
    "id": 1
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "rows": [
      {
        "id": 1,
        "created_at": 1499452362,
        "name": "Flight 1",
        "notes": "Some notes",
        "cpm": 123,
        "channel": "desktop",
        "format": "video",
        "start_time": 1502302020,
        "end_time": 1512115140
        "status": "disabled",
        "campaigns": [
          {
            "id": 1,
            "name": "Campaign 1"
          }
        ],
        "advertisers": [
          {
            "id": 1,
            "name": "Advertiser 1"
          }        
        ]
      },
      {
        "id": 2,
        "created_at": 1499452362,
        "name": "Flight 2",
        "notes": "Some notes",
        "cpm": 123,
        "channel": "desktop",
        "format": "video",
        "start_time": 1502302020,
        "end_time": 1512115140
        "status": "disabled",
        "campaigns": [
          {
            "id": 2,
            "name": "Campaign 2"
          }
        ],
        "advertisers": [
          {
            "id": 2,
            "name": "Advertiser 2"
          }        
        ]
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 15,
      "totalPages": 1
    }
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`