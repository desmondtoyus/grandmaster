# Publishers list

Used to retrieve a list of active publishers.

**URL** : `/publisher/list/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|searchTerm|String|No||String to match publisher name|
|currentPage|Number|No|1|Pagination page number to view|
|sortBy|String|No|id|Publisher value to sort by. Options are id, created_at and name|
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
        "created_at": 1499452362,
        "name": "Publisher 1"
      },
      {
        "id": 2,
        "created_at": 1499452363,
        "name": "Publisher 2"
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

**Content** : None

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Content** :

```json
{
  "message": "Could not display publishers at this time. Please try again later."
}
```