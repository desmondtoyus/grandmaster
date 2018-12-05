# Advertisers list

Used to retrieve a list of advertisers for dropdowns components.

**URL** : `/advertiser/list/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters** : `None`

**Data example** : `None`

## Success Response

**Code** : `200 OK`

**Content example**

```json
[
      {
        "text": "Advertiser 1",
        "value": 1
      },
      {
        "text": "Advertiser 2",
        "value": 2
      }
]
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`