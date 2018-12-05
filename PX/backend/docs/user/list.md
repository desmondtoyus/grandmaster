# Users list

Used to retrieve a list of active users.

**URL** : `/user/list/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super Admin and BWA Admin have access to all users.
* Zone Admin only has access to users within a zone.
* Account Admin only has access to users within an account.
* All other roles have no permission.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|searchTerm|String|No||String to match user first or last name|
|currentPage|Number|No|1|Pagination page number to view|
|sortBy|String|No|id|User value to sort by. Options are id, created_at, first_name and last_name|
|sortDirection|String|No|asc|Sort direction. Options are asc and desc|
|pageChunk|Number|No|15|Number of results to display on each page|

**Data example**

```json
{
    "searchTerm": "doe",
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
        "account_id": 2,
        "created_at": 1499452362,
        "email": "some@email.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": 2,
        "phone_number": "111-111-1111"
      },
      {
        "id": 2,
        "account_id": 2,
        "created_at": 1499452362,
        "email": "another@email.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "role": 16,
        "phone_number": "222-222-2222"
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
  "message": "Could not display users at this time. Please try again later."
}
```