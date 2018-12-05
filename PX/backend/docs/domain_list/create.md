# Domain list create

Used to create a new domain list.

**URL** : `/lists/create/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|name|String|Yes||Domain list name. Between 6 and 200 characters.|
|uploadedDomains|Array|Yes||Array of domains.|
|typedDomains|Array|Yes||Array of domains.|

**Data example**

```json
{
    "name": "Some domain list",
    "uploadedDomains": ["google.com", "yahoo.com"],
    "typedDomains": ["cnn.com", "time.com"]
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


