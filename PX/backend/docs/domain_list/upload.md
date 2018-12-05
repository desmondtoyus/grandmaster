# Domain lists upload

Used to upload a domain list.

**URL** : `/lists/upload/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters** : Text or CSV file.

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "msg": "Uploaded 123 valid domains. 456 domains are invalid",
    "domains": ["google.com", "yahoo.com"]
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`