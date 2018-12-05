# User scope

User to set user account and zone scope.

**URL** : `/user/scope/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

* Super admin, bwa users and zone users can set a scope to work on specific account they have permissions to.

**Body Parameters**

|Parameter|Type|Required|Default|Description|
|:---------|:---|:------:|:-------:|:-----------|
|account_id|Number|Yes||Account id to set the scope to.|

**Data example**

```json
{
    "account_id": 5
}
```

## Success Response

**Code** : `200 OK`

**Content example**

No content returned.

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Content** : None

**Condition** No account_id provided

**Code** : `406 Not Acceptable`

**Content** : None

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Content** : None