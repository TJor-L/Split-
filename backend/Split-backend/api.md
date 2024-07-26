# Get the information of a user
### GET /user
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|email|string|true|The email of the user.|
#### Request example
```json
{
    "email": "test@test.com"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeeded.|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|friends||The friends of the user.
|groups|string[]|The IDs of the groups of the user.|
|transactions|string[]|The transactions of the user.|
#### Response example
```json
{
    "success": true,
    "user_id": "test id",
    "display_name": "test name",
    "email": "test@test.com",
    "friends": [
        {
            "email": "test1@test.com",
            "display_name": "test name 1"
        }
    ],
    "groups": [
        "668b4ba2f09328da73f8da0e"
    ],
    "transactions": [
        "668b4c24f09328da73f8da0f"
    ]
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
    "user_id": "test id 3",
    "display_name": "test name 3",
    "email": "test3@test.com"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeeded.|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|friends||The friends of the user.
|groups|string[]|The IDs of the groups of the user.|
|transactions|string[]|The transactions of the user.|
#### Response example
```json
{
    "success": true,
    "user_id": "test id 3",
    "display_name": "test name 3",
    "email": "test3@test.com",
    "friends": [],
    "groups": [],
    "transactions": []
}
```

# Add a friend
### POST /user/add-friend
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|email|string|true|The email of the user.|
|friend_email|string|true|The email of the friend to be added.|
#### Request example
```json
{
    "email": "test@test.com",
    "friend_email": "test1@test.com"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeeded.|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|friends||The friends of the user.
|groups|string[]|The IDs of the groups of the user.|
|transactions|string[]|The transactions of the user.|
#### Response example
```json
{
    "success": true,
    "user_id": "test id",
    "display_name": "test name",
    "email": "test@test.com",
    "friends": [
        {
            "email": "test1@test.com",
            "display_name": "test name 1"
        }
    ],
    "groups": [
        "668b4ba2f09328da73f8da0e"
    ],
    "transactions": [
        "668b4c24f09328da73f8da0f"
    ]
}
```

# Remove a friend
### POST /user/remove-friend
Note: a user can only remove a friend when there is no uncompleted transaction between them.
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|email|string|true|The email of the user.|
|friend_email|string|true|The email of the friend to be removed.|
#### Request example
```json
{
    "email": "test@test.com",
    "friend_email": "test1@test.com"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeeded.|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|friends||The friends of the user.
|groups|string[]|The IDs of the groups of the user.|
|transactions|string[]|The transactions of the user.|
#### Response example
```json
{
    "success": true,
    "user_id": "test id",
    "display_name": "test name",
    "email": "test@test.com",
    "friends": [],
    "groups": [
        "668b4ba2f09328da73f8da0e"
    ],
    "transactions": [
        "668b4c24f09328da73f8da0f"
    ]
}
```

# Delete a user
### POST /user/delete
note: a user can only be deleted when they have no uncompleted transaction.
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|email|string|true|The email of the user.|
#### Request example
```json
{
    "email": "test@test.com"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeeded.|
|user_id|string|The ID of the user.|
|display_name|string|The display name of the user.|
|email|string|The email of the user.|
|friends||The friends of the user.
|groups|string[]|The IDs of the groups of the user.|
|transactions|string[]|The transactions of the user.|
#### Response example
```json
{
    "success": true,
    "user_id": "test id",
    "display_name": "test name",
    "email": "test@test.com",
    "friends": [
        {
            "email": "test1@test.com",
            "display_name": "test name 1"
        }
    ],
    "groups": [
        "668b4ba2f09328da73f8da0e"
    ],
    "transactions": [
        "668b4c24f09328da73f8da0f"
    ]
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
    "group_id": "668b4ba2f09328da73f8da0e"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|transactions|string[]|The transactions in the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "name": "test group",
    "members": [
        "test@test.com",
        "test1@test.com"
    ],
    "transactions": [
        "668b4fe1f09328da73f8da11"
    ],
    "group_id": "668b4ba2f09328da73f8da0e",
    "success": true
}
```

# Create a group
### POST /gourp/create
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|name|string|true|The name of the group.|
|members|string[]|true|The emails of the initial members of the group.|
#### Request example
```json
{
    "name": "test group",
    "members": ["test@test.com", "test1@test.com"]
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|transactions|string[]|The transactions in the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "success": true,
    "name": "test group",
    "members": [
        "test@test.com",
        "test1@test.com"
    ],
    "transactions": [],
    "group_id": "668b4ba2f09328da73f8da0e"
}
```

# Add users to a group
### POST /group/add
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of the group.|
|members|string[]|true|The emails of the members to be added.|
#### Request example
```json
{
    "group_id": "668b4ba2f09328da73f8da0e",
    "members": ["test2@test.com"]
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|transactions|string[]|The transactions in the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "success": true,
    "name": "test group",
    "members": [
        "test@test.com",
        "test1@test.com",
        "test2@test.com"
    ],
    "transactions": [
        "668b4fe1f09328da73f8da11"
    ],
    "group_id": "668b4ba2f09328da73f8da0e"
}
```

# Remove members from a group
### POST /group/remove
note: a member can only be removed if they have no uncompleted transaction in the group.
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of a group.|
|members|string[]|true|The emails of the members to be removed.|
#### Request example
```json
{
    "group_id": "668b4ba2f09328da73f8da0e",
    "members": ["test2@test.com"]
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|transactions|string[]|The transactions in the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "success": true,
    "name": "test group",
    "members": [
        "test@test.com",
        "test1@test.com"
    ],
    "transactions": [
        "668b4fe1f09328da73f8da11"
    ],
    "group_id": "668b4ba2f09328da73f8da0e"
}
```

# Delete a group
### POST /group/delete
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|group_id|string|true|The ID of the group.|
#### Request example
```json
{
    "group_id": "668b4ba2f09328da73f8da0e"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|name|string|The name of the group.|
|members|string[]|The IDs of the members of the group.|
|transactions|string[]|The transactions in the group.|
|group_id|string|The ID of the group.|
#### Response example
```json
{
    "success": true,
    "name": "test group",
    "members": [
        "test@test.com",
        "test1@test.com"
    ],
    "transactions": [
        "668b4fe1f09328da73f8da11"
    ],
    "group_id": "668b4ba2f09328da73f8da0e"
}
```

# Get the information of a bill from ChatGPT-4o
### GET /model
note: this interface is untested, so examples are not provided.
#### Request parameters
|parameter|type|required|descriptoin|
|---|---|---|---|
|image|file|true|The image file.
#### Response parameter
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|text|string|The response of ChatGPT-4o.|

# Get the information of a transaction
### GET /transaction
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|transaction_id|string|true|The ID of the transaction.|
#### Request example
```json
{
    "transaction_id": "668b550236185e84f76f5b50"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|payer|string|The email of the payer of the transaction.|
|payee|string|The email of the payee of the transaction.|
|amount|int|The amount of money.|
|date|string|The date of the transaction.|
|completed|bool|Whether the transaction has completed.|
|transaction_id|string|The ID of the transaction.|
#### Response example
```json
{
    "success": true,
    "payer": "test1@test.com",
    "payee": "test@test.com",
    "amount": 1000,
    "date": "08/07/2024",
    "completed": false,
    "transaction_id": "668b550236185e84f76f5b50"
}
```

# Create a transaction
### POST /transaction/create
#### Request parameters
|parameter|type|required|description|
|---|---|---|---|
|payer|string|true|The email of the payer of the transaction.|
|payee|string|true|The email of the payee of the transaction.|
|amount|int|true|The amount of money.|
|date|string|true|The date of the transaction.|
|group|string|false|The group that the transaction belongs to. If not given, the transaction will not belong to any group.|
#### Request example
```json
{
    "payer": "test1@test.com",
    "payee": "test@test.com",
    "amount": 1000,
    "date": "08/07/2024",
    "group": "668b4ba2f09328da73f8da0e"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|payer|string|The email of the payer of the transaction.|
|payee|string|The email of the payee of the transaction.|
|amount|int|The amount of money.|
|date|string|The date of the transaction.|
|completed|bool|Whether the transaction has completed.|
|transaction_id|string|The ID of the transaction.|
#### Response example
```json
{
    "success": true,
    "payer": "test1@test.com",
    "payee": "test@test.com",
    "amount": 1000,
    "date": "08/07/2024",
    "completed": false,
    "transaction_id": "668b550236185e84f76f5b50"
}
```

# Mark a transcation as completed
### POST /transaction/complete
|parameter|type|required|description|
|---|---|---|---|
|transaction_id|string|true|The ID of the transaction.|
#### Request example
```json
{
    "transaction_id": "668b550236185e84f76f5b50"
}
```
#### Response parameters
|parameter|type|description|
|---|---|---|
|success|bool|Whether the operation has succeeded.|
|payer|string|The email of the payer of the transaction.|
|payee|string|The email of the payee of the transaction.|
|amount|int|The amount of money.|
|date|string|The date of the transaction.|
|completed|bool|Whether the transaction has completed.|
|transaction_id|string|The ID of the transaction.|
#### Response example
```json
{
    "success": true,
    "payer": "test1@test.com",
    "payee": "test@test.com",
    "amount": 1000,
    "date": "08/07/2024",
    "completed": true,
    "transaction_id": "668b550236185e84f76f5b50"
}
```