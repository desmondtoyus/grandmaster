# Domain lists list

Used to retrieve a list of domain lists for scoped account.

**URL** : `/lists/list/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|searchTerm|String|No||String to match campaign name|
|currentPage|Number|No|1|Pagination page number to view|
|sortBy|String|No|id|Campaign value to sort by. Options are id, start_time, end_time, created_at and name|
|sortDirection|String|No|asc|Sort direction. Options are asc and desc|
|pageChunk|Number|No|15|Number of results to display on each page|

**Data example**

```json
{
    "searchTerm": "abc",
    "currentPage": 1,
    "sortBy": "id",
    "sortDirection": "asc",
    "pageChunk": 15
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
        "name": "List 1",
        "value": ["google.com", "yahoo.com"]
      },
      {
        "id": 2,
        "name": "List 2",
        "value": ["forbes.com", "cnn.com"]
      }
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