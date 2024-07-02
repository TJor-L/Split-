## Login a user
### POST /login
|parameter|type|required|description|
|---|---|---|---|
|user_id|string|true|The user ID returned by the Google login API.|
|display_name|string|true|The display name returned by the Google login API.|
|email|string|true|The email returned by the google login API.|

## Create a group
### POST /gourp/create
|parameter|type|required|description|
|---|---|---|---|
|name|string|true|The name of the group.|
|members|string[]|true|The user IDs of the initial members of the group.|

## Add users to a group
### POST /group/add
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of the group.|
|members|string[]|true|The user IDs of the members to be added to the group.|

## Remove members from a group
### POST /group/remove
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of a group.|
|members|string[]|true|The user IDs of the members to be removed from the group.|