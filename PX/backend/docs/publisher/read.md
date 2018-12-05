# Publisher read

Used to retrieve single publisher information.

**URL** : `/publisher/read/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes|||

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
    "id": 5,
    "name": "Publisher name",
    "notes": "Publisher notes",
    "whitelist": ["google.com", "yahoo.com"],
    "blacklist": ["google.com", "yahoo.com"]
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
  "message": "Could not retrieve the publisher at this time. Please try again later."
}
```

**Condition** : Publisher was not found

**Code** : `404 Not Found`

**Content** : None

**Condition** : Publisher ID was not provided

**Code** : `406 Not Acceptable`

**Content** : None
