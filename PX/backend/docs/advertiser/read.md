# Advertiser read

Used to retrieve single advertiser information.

**URL** : `/advertiser/read/`

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
    "name": "Advertiser name",
    "notes": "Advertiser notes",
    "status": "active"
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : Advertiser was not found

**Code** : `404 Not Found`

**Condition** : Advertiser ID is not valid

**Code** : `406 Not Acceptable`
