# Flight create

Used to create a new flight.

**URL** : `/flight/create/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : YES

**Body Parameters**

|Parameter|Sub Param|Type|Required|Default|Description|
|:---------|:-------|:---|:------:|:--:|:-----------|
|flight||Object|Yes||Flight object containing all flight data.|
||timezone|String|Yes||Flight time zone. Can be 'US/Pacific', 'US/Eastern' or 'UTC'|
||status|String|Yes||At flight creation status is 'active' or 'inactive'|
||campaignId|Integer|Yes||Campaign ID for the flight|
||name|String|Yes||Flight name|
||notes|String|Yes||Flight notes. Can be empty string|
||cpm|Integer|Yes||Flight cpm in cents|
||cpc|Integer|Yes||Flight cpc in cents. Can be 0|
||clickthrough_url|String|Yes||Flight click through URL. Required only for first party flights. Can be empty string otherwise.|
||wrapper_url|String|Yes||Wrapper URL for third party flights. Can be empty string otherwise.|
||wrapper_source_platform|String|Yes||Wrapper URL platform.|
||is_direct_deal|Boolean|Yes||Indicates if the flight is directly connected to a placement|
||user_frequency_cap|Integer|Yes||User frequency cap|
||domain_list_id|Integer|Yes||ID of the list used for whitelisting or blacklisting. If no list is selected 0 must be provided.|
||domain_list_category|String|Yes||Indicates if the domain list is 'whitelist', 'blacklist' or 'none'|
||is_muted_allowed|Boolean|Yes||Indicates if the flight is sound only|
||is_visible_only|Boolean|Yes||Indicates if the flight is visible only|
||start_time|Integer|Yes||Timestamp for flight start in seconds|
||end_time|Integer|Yes||Timestamp for flight end in seconds|
||demand_source_type|String|Yes||Indicates the type of the source. 'first_party', 'third_party' or 'rtb'|
||pacing_category|String|Yes||Indicates pacing type. 'even' or 'asap'|
||user_agent|Array|Yes||Array of user agent. Acceptable values are 'ios', 'android', 'mobile_other', 'windows_mobile' and 'desktop'|
||desktop_browser_targeting|Array|Yes||Array of targeted browsers. Acceptable values are 'ie/edge', 'chrome', 'firefox'' safari' and 'other'|
||rtb_source|String|Yes||Required only for RTB flights. Otherwise empty string|
||format|String|Yes||Flight format. Acceptable values are 'video' or 'display'|
||channel|String|Yes||Flight channel. Acceptable values are 'mobile_web', 'mobile_app', 'desktop' and 'ctv'|
||height|Integer|Yes||Height in pixels. Required only for first party flights. Otherwise 0|
||width|Integer|Yes||Width in pixels. Required only for first party flights. Otherwise 0|
||player_size|Array|Yes||Player size array. Can be a combination of 'small', 'medium' and 'large'|
||is_vast_only|Boolean|Yes||Indicates if the flight is vast only|
||iab_categories|Array|Yes||IAB taxonomy categories codes|
|brandSafety||Object|Yes||Flight brand safety object containing all brand safety parameters.|
||name|String|Yes||Name of brand safety provider|
||is_active|Boolean|Yes||Indicates if the brand safety provider service is active for the flight|
|dayParting||Array|Yes||Day parting array. Can be empty array.|
||start_day|String|Yes||Day parting start day. Available options are 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'|
||end_day|String|Yes||Day parting end day. Available options are 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'|
||start_hour|Integer|Yes||Day parting start hour. Integer 0-23|
||end_hour|Integer|Yes||Day parting end hour. Integer 0-23|
|geo|Array||Yes||Geo Targeting array. Can be empty array.|
|goals||Array|Yes||Flight goals array. Can be empty array.|
||impressions|Integer|Yes||Number of goal impressions|
||interval|String|Yes||Impressions goal interval. Either 'day' or 'total'|
||is_budget|Boolean|Yes||Indicates if the goal entered as a budget or impressions|
|video||Object|No||Video creative object. Only required if the flight is a video flight whic is not RTB.|
||name|String|Yes||Video creative name|
||notes|String|Yes||Video creative notes. Can be empty string|
||filename|String|Yes||Filename required for first party creative only. Empty string otherwise.|
||alt_text|String|Yes||Alternative text. Can be empty string|
||party|String|Yes||Indicates type of creative. 'first_party' or 'third_party'|
||js_tag|String|Yes||Required only for third party flight. Empty string otherwise|
||width|Integer|Yes||Width in pixels. Required only for first party flight. 0 otherwise|
||height|Integer|Yes||Height in pixels. Required only for first party flight. 0 otherwise|
||content_type|String|Yes||Video mime type. Require only for first party flight. Empty string otherwise|
||bitrate|Integer|Yes||Video bitrate. Required only for first party flight. 0 otherwise|
||duration|Integer|Yes||Video duration in seconds. Required only for first party flight. 0 otherwise|
||companions|Array|Yes||Array of companion creatives. Can be empty array|
|display||Object|No|Display creative object. Only required if the flight is a display flight.|
||name|String|Yes||Display creative name|
||notes|String|Yes||Display creative notes. Can be empty string|
||is_companion_creative|Boolean|Yes||Indicates if the creative is companion|
||filename|String|Yes||Filename required for first party creative only. Empty string otherwise.|
||alt_text|String|Yes||Alternative text. Can be empty string|
||party|String|Yes||Indicates type of creative. 'first_party' or 'third_party'|
||js_tag|String|Yes||Required only for third party flight. Empty string otherwise|
||width|Integer|Yes||Width in pixels. Required only for first party flight. 0 otherwise|
||height|Integer|Yes||Height in pixels. Required only for first party flight. 0 otherwise|

**Data example**

```json
{
    "flight": {
    
    },
    "brandSafety": [
    
    ],
    "dayParting": [
    
    ],
    "geo": [
    
    ],
    "goals": [
    
    ],
    "video": {
    
    }
}
```

## Success Response

**Code** : `200 OK`

**Content** : None

## Error Responses

**Condition** : If user doesn't have permissions.

**Code** : `401 Unauthorized`

**Condition** : If database returns an error.

**Code** : `503 Service Unavailable`

**Condition** : Flight data is not valid.

**Code**: `406 Not Acceptable`

**Condition** : If flight with the same name already exists

**Code** : `422 Unprocessable Entity`


