# Domain lists list

Used to retrieve a list of domain lists for dropdowns components.

**URL** : `/lists/list/`

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
        "text": "List 1",
        "value": 1
      },
      {
        "text": "List 2",
        "value": 2
      }
]
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`