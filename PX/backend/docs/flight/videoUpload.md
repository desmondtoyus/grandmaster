# Video creative upload

Used to upload a video creative.

**URL** : `/flight/video_upload/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters** : Video file.

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "fileName": "ABCDEG.mp4",
    "height": 480,
    "width": 640,
    "bitrate": 256,
    "duration": 30,
    "contentType": "video/mp4"
}
```

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If video could not be processed.

**Code** : `503 Service Unavailable`