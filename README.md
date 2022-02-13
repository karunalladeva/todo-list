# Populate test records
node populatedb mongodb://localhost:27017/test-app

# Run the code 

yarn
yarn start

# Todo Post/ Get/ Put

User => Todo*


users

user_id
first_name
last_name
created_at
todos

todo_id
title
description
assigned_to //user_id
is_done //boolean
is_deleted //boolean
created_at
updated_at
POST /todo
Body
{

title : "",
description: "",
assigned_to: ""
}

GET /todo -
Params -> page, count, assgined_to (non-mandatory)
Response -> Array of todo_id, title, is_done, created_at

GET /todo/:todo_id
Response -> one full todo object that matches the todo_id, otherwise 404 error message "Invalid todo_id"

PUT /todo/:_id -> Form body -> { is_done : true/false } -> Update the respective todo's is_done