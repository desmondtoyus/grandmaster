# Publisher delete

Used to delete an publisher. Publishers are not deleted from the db but set to status 'disabled'.

**URL** : `/publisher/delete/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Publisher id|

**Data example**

```json
{
    "id": 5
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
  "message": "Could not delete the publisher at this time. Please try again later."
}
```

**Condition** : If publisher id was not sent

**Code** : `406 Not Acceptable`

**Content** : None

**Condition** : If publisher does not exist

**Code** : `404 Not Found`

**Content** : None

