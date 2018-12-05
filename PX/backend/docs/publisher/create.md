# Publisher create

Used to create a new publisher.

**URL** : `/publisher/create/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Publisher will be created on the account the user is logged into.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|name|String|Yes||Publisher name. Between 6 and 200 characters.|
|notes|String|Yes||Publisher notes. Can be an empty string. Maximum 500 characters.|
|whitelist|Integer|No||Whitelist may be selected from the master list. If selected a list id must be provided.|
|blacklist|Integer|No||Blacklist may be selected from the master list. If selected a list id must be provided.|

**Data example**

```json
{
    "name": "Some publisher",
    "notes": "Some notes",
    whitelist: 1,
    blacklist: 2
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
  "message": "Could not create an publisher at this time. Please try again later."
}
```

**Condition** : Publisher data is not valid.

**Code**: `406 Not Acceptable`

**Content** : None


