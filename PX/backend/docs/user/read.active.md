# User read active

Used to retrieve logged in user information.

**URL** : `/user/read/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : YES

* All roles can read their own user information

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "user": {
      "id": 5,
      "email": "just@email.com"
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "111-111-1111",
      "role": 1,
      "scope_account_id": 2,
      "account": {
        "id": 1,
        "name": "Some account"
      }
    },
    "scope_account": {
      "id": 2,
      "name": "Scoped account",
      "notes": "random notes"
    }
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Content** : None

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Content** : 

```json
{
  "message": "Could not retrieve the user at this time. Please try again later."
}
```