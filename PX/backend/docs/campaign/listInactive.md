# Campaigns inactive list

Used to retrieve a list of inactive campaigns.

**URL** : `/campaign/list_inactive/`

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
|id|Number|No||Advertiser ID to list campaigns for. If not provided all campaigns for the scope account will be returned|

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
        "name": "Campaign 1",
        "start_time": 1502302020,
        "end_time": 1512115140
        "status": "inactive",
        "flights": [
          {
            "id": 1
          },
          {
            "id": 2
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
        "created_at": 1499452363,
        "name": "Campaign 2",
        "start_time": 1502302020,
        "end_time": 1512115140
        "status": "inactive",
        "flights": [
          {
            "id": 3
          },
          {
            "id": 4
          }
        ],
        "advertisers": [
          {
            "id": 1,
            "name": "Advertiser 1"
          }        
        ]
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