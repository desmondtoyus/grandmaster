# Campaigns list for a specific advertiser

Used to retrieve a list of all campaigns for a single advertiser. Formatted for dropdown component.

**URL** : `/campaign/list_advertiser_campaigns/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|id|Number|Yes||Advertiser ID to list campaigns for.|

**Data example**

```json
{
    "id": 1
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
  {
    "text": "Campaign 1",
    "value": 1
  },
  {
    "text": "Campaign 2",
    "value": 2
  }    
]
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`