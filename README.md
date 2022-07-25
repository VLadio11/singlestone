## To run the project:
1. npm install
2. npm start
3. Call routes using the following url: http://localhost:3000/v1/{required routes}

Note: This is a very boilerplate service with simple validation and integration testing. 
I have considred cases that would require rate-limiting, authentication, or 500 error handling but chose 
to not implment them in this version. Also, duplicated entries or errors when attempting to Create, Update or Delete
users have been thought of but I decided to implement the happy-path scenarios. The only other response apart from 200
is a 422 when the data passed is not complete or valid. 

## To test the project: 
npm run test

Note: I chose to integration test in order to focus on the functionality of the API rather than the details of 
small unit tests. In a production API, we would ideally have both with an emphasis on integrations.