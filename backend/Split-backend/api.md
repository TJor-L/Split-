# Get the information of a user
### GET /user
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|user_id|string|true|The ID of the user.|
#### Request example
```json
{
    "user_id": "test"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|groups|string[]|The IDs of the groups of the user.|
#### Response example
```json
{
    "user_id": "test",
    "display_name": "test",
    "email": "test@test.com",
    "friends": [
        {
            "user_id": "friend ID 1",
            "display_name": "friend 1"
        }, {
            "user_id": "friend ID 2",
            "display_name": "friend 2"
        }
    ],
    "groups": ["group ID 1", "group ID 2"]
}
```

# Login a user
### POST /user/login
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|user_id|string|true|The user ID returned by the Google login API.|
|display_name|string|true|The display name returned by the Google login API.|
|email|string|true|The email returned by the google login API.|
#### Request example
```json
{
    "user_id": "test ID",
    "display_name": "test name",
    "email": "test@test.com"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|groups|string[]|The IDs of the groups of the user.|
#### Response example
```json
{
    "user_id": "test",
    "display_name": "test",
    "email": "test@test.com",
    "friends": [
        {
            "user_id": "friend ID 1",
            "display_name": "friend 1"
        }, {
            "user_id": "friend ID 2",
            "display_name": "friend 2"
        }
    ],
    "groups": ["group ID 1", "group ID 2"]
}
```

# Add a friend
### POST /user/add-friend
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|user_id|string|true|The ID of the user.|
|friend_id|string|true|The ID of the friend.|
#### Request example
```json
{
    "user_id": "test",
    "friend_id": "friend ID"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|groups|string[]|The IDs of the groups of the user.|
#### Response example
```json
{
    "user_id": "test",
    "display_name": "test",
    "email": "test@test.com",
    "friends": [
        {
            "user_id": "friend ID 1",
            "display_name": "friend 1"
        }, {
            "user_id": "friend ID 2",
            "display_name": "friend 2"
        }
    ],
    "groups": ["group ID 1", "group ID 2"]
}
```

# Remove a friend
### POST /user/remove-friend
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|user_id|string|true|The ID of the user.|
|friend_id|string|true|The ID of the friend to be removed.|
#### Request example
```json
{
    "user_id": "test",
    "friend_id": "friend ID"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|groups|string[]|The IDs of the groups of the user.|
#### Response example
```json
{
    "user_id": "test",
    "display_name": "test",
    "email": "test@test.com",
    "friends": [
        {
            "user_id": "friend ID 1",
            "display_name": "friend 1"
        }, {
            "user_id": "friend ID 2",
            "display_name": "friend 2"
        }
    ],
    "groups": ["group ID 1", "group ID 2"]
}
```

# Get the information of a group
### GET /group
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of the group.|
#### Request example
```json
{
    "group_id": "group ID"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "name": "test group",
    "members": [
        "test 1, test 2"
    ],
    "group_id": "group ID"
}
```

# Create a group
### POST /gourp/create
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|name|string|true|The name of the group.|
|members|string[]|true|The user IDs of the initial members of the group.|
#### Request example
```json
{
    "name": "test group",
    "members": ["test ID 1", "test ID 2"]
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|message|string|"Success." if the request is successful. Otherwise, this will be an error message.|
#### Response example
```json
{
    "message": "Success."
}
```

# Add users to a group
### POST /group/add
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of the group.|
|members|string[]|true|The user IDs of the members to be added to the group.|
#### Request example
```json
{
    "group_id": "test group ID",
    "members": ["test ID 1", "test ID 2"]
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "name": "test group",
    "members": [
        "test 1",
        "test 2"
    ],
    "group_id": "group ID"
}
```

# Remove members from a group
### POST /group/remove
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of a group.|
|members|string[]|true|The user IDs of the members to be removed from the group.|
#### Request example
```json
{
    "group_id": "test group ID",
    "members": ["test ID 1", "test ID 2"]
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "name": "test group",
    "members": [
        "test 1",
        "test 2"
    ],
    "group_id": "group ID"
}
```