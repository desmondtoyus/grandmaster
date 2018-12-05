# Publisher update

Used to update an existing publisher.

**URL** : `/publisher/update/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Publisher id|
|name|String|Yes||Publisher name|
|notes|String|Yes||Publisher notes. Can be an empty string.|
|whitelist|Array|Yes||Array of domains. Can be empty array.|
|blacklist|Array|Yes||Array of domains. Can be empty array.|

**Data example**

```json
{
    "id": 5,
    "name": "Some edited publisher name",
    "notes": "Some edited notes",
    "whitelist": ["google.com"],
    "blacklist": ["yahoo.com"]
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

**Content** :

```json
{
  "message": "Could not update the publisher at this time. Please try again later."
}
```

**Condition** : If publisher data is invalid.

**Code** : `406 Not Acceptable`

**Content** : None

**Condition** : If publisher does not exist

**Code** : `404 Not Found`

**Content** : None


