# Display creative upload

Used to upload a display creative.

**URL** : `/flight/display_upload/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters** : Display file.

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "fileName": "ABCDEG.jpg",
    "height": 480,
    "width": 640
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If video could not be processed.

**Code** : `503 Service Unavailable`