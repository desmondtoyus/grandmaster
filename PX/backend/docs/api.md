# Armada API Endpoints

## Public open Endpoints

Open endpoints require no Authentication.

* [Login](public/login.md) : `POST /public/login/`
* [Register](public/register.md): `POST /public/register`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### Account related

Endpoints for viewing and manipulating the Accounts that the Authenticated User
has permissions to access.

* [List accounts](account/list.md) : `POST /account/list`
* [List pending accounts](account/listPending.md) : `POST /account/list_pending`
* [List disabled accounts](account/listDisabled.md) : `POST /account/list_disabled`
* [List scope list accounts](account/scopeList.md) : `POST /account/scope_list`
* [Read account](account/read.md) : `POST /account/read`
* [Create account](account/create.md) : `POST /account/create`
* [Delete account](account/delete.md) : `POST /account/delete`
* [Update account](account/update.md) : `POST /account/update`
* [Activate account](account/activate.md) : `POST /account/activate`
* [Deactivate account](account/deactivate.md) : `POST /account/deactivate`

### User related

Endpoints for viewing and manipulating the Users that the Authenticated User has permissions to access.

* [List users](user/list.md) : `POST /user/list`
* [Read Active User](user/read.active.md) : `GET /user/read`
* [Read User](user/read.md) : `POST /user/read`
* [User Scope](user/scope.md) : `POST /user/scope`
* [Create User](user/create.md) : `POST /user/create`
* [Update User](user/update.md) : `POST /user/update`
* [Delete User](user/delete.md) : `POST /user/delete`

### Advertiser related

Endpoints for viewing and manipulating the Advertisers that the Authenticated User has permissions to access.

* [List Advertisers](advertiser/list.md) : `POST /advertiser/list`
* [List Disabled Advertisers](advertiser/listDisabled.md) : `POST /advertiser/list_disabled`
* [List All Advertisers for Dropdowns](advertiser/listAll.md) : `GET /advertiser/list`
* [Read Advertiser](advertiser/read.md) : `POST /advertiser/read`
* [Create Advertiser](advertiser/create.md) : `POST /advertiser/create`
* [Update Advertiser](advertiser/update.md) : `POST /advertiser/update`
* [Delete Advertiser](advertiser/delete.md) : `POST /advertiser/delete`

### Campaign related

Endpoints for viewing and manipulating the Campaigns that the Authenticated User has permissions to access.

* [List Campaigns](campaign/list.md) : `POST /campaign/list`
* [List Active Campaigns](campaign/listActive.md) : `POST /campaign/list_active`
* [List Inactive Campaigns](campaign/listInactive.md) : `POST /campaign/list_inactive`
* [List Disabled Campaigns](campaign/listDisabled.md) : `POST /campaign/list_disabled`
* [Read Campaign](campaign/read.md) : `POST /campaign/read`
* [Create Campaign](campaign/create.md) : `POST /campaign/create`
* [Update Campaign](campaign/update.md) : `POST /campaign/update`
* [Delete Campaign](campaign/delete.md) : `POST /campaign/delete`
* [Activate Campaign](campaign/activate.md) : `POST /campaign/activate`
* [Deactivate Campaign](campaign/deactivate.md) : `POST /campaign/deactivate`
* [List Advertiser Campaigns](campaign/listAdvertiserCampaigns.md) : `POST /campaign/list_advertiser_campaigns`
* [List All Advertisers](campaign/listAdvertisers.md) : `GET /campaign/list_advertisers`

### Flight related

Endpoints for viewing and manipulating the Flights that the Authenticated User has permissions to access

* [Create Flight](flight/create.md) : `POST /flight/create`
* [Delete Flight](flight/delete.md) : `POST /flight/delete`
* [List Flights](flight/list.md) : `POST /flight/list`
* [List Active Flights](flight/listActive.md) : `POST /flight/list_active`
* [List Inactive Flights](flight/listInactive.md) : `POST /flight/list_inactive`
* [List Disabled Flights](flight/listDisabled.md) : `POST /flight/list_disabled`
* [Read Flight](flight/read.md) : `POST /flight/read`
* [Update Flight](flight/update.md) : `POST /flight/update`
* [Clone Flight](flight/clone.md) : `POST /flight/clone`
* [Display Creative Upload](flight/displayUpload.md) : `POST /flight/display_upload`
* [Video Creative Upload](flight/videoUpload.md) : `POST /flight/video_upload`
* [Activate Flight](flight/activate.md) : `POST /flight/activate`
* [Deactivate Flight](flight/deactivate.md) : `POST /flight/deactivate`
* [List Campaigns](flight/listCampaigns.md) : `POST /flight/list_campaigns`
* [List Options for Flights](flight/listOptions.md) : `POST /flight/list_options`

### Publisher related

Endpoints for viewing and manipulating the Publishers that the Authenticated User has permissions to access.

* [List Publishers](publisher/list.md) : `POST /publisher/list`
* [Read Publisher](publisher/read.md) : `POST /publisher/read`
* [Create Publisher](publisher/create.md) : `POST /publisher/create`
* [Update Publisher](publisher/update.md) : `POST /publisher/update`
* [Delete Publisher](publisher/delete.md) : `POST /publisher/delete`

### Domain Lists related

Endpoints for viewing and manipulating the Domain Lists that the Authenticated User has permissions to access.

* [List Domain Lists](domain_list/list.md) : `POST /lists/list`
* [Upload Domain List](domain_list/upload.md) : `POST /lists/upload`
* [Create Domain List](domain_list/create.md) : `POST /lists/create`
* [Read Domain List](domain_list/read.md) : `POST /lists/read`
* [Update Domain List](domain_list/update.md) : `POST /lists/update`
* [Delete Domain List](domain_list/delete.md) : `POST /lists/delete`
* [Clone Domain List](domain_list/clone.md) : `POST /lists/clone`
* [List All Domain Lists](domain_list/listAll.md) : `GET /lists/list`