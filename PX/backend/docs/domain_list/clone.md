# Domain list clone

Used to clone a domain list.

**URL** : `/lists/clone/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|name|String|Yes||Domain list name. Between 6 and 200 characters.|
|uploadedDomains|Array|Yes||Array of domains.|
|typedDomains|Array|Yes||Array of domains.|
|list|Array|Yes||Array of existing domains|
|editStatus|String|Yes||Status of update, either "replace" or "append"|
|id|Integer|Yes||Domain list ID|

**Data example**

```json
{
    "id": 1,
    "name": "Some domain list",
    "editStatus": "append",
    "list": ["bluewaterads.com"],
    "uploadedDomains": ["google.com", "yahoo.com"],
    "typedDomains": ["cnn.com", "time.com"]"value": ["google.com", "yahoo.com"]
}
```

## Success Response

**Code** : `200 OK`

**Content** : None

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : Domain list data is not valid or domain arrays are empty.

**Code**: `406 Not Acceptable`


