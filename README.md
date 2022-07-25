## To run the project:
1. npm install
2. npm start
3. Call routes using the following structure: http://localhost:3000/v1/{Routes}

Note: This is a very boilerplate service with simple validation and integration testing. 
I have considred cases that would require rate-limiting, authentication, or 500 error handling but chose 
to not implement them in this version. Also, duplicated entries or errors when attempting to Create, Update or Delete
users have been thought of but I decided to implement the happy-path scenarios. However, there is data-validation and you will receive a 422 if passing ivalid data to the API. 

## To test the project: 
npm run test

Note: I chose to implement integration tests in order to focus on the functionality of the API rather than the details of the implemented functions. Since the functions themselves perform very basic calls to the database, sanitize, and manipulate objects, I figured unit tests could be dropped for the more over-arching integration tests. 

A few more things to note:
I planned to implement a contract first approach(hence the oas.yaml file) but decided that it would not
be a fair representation of code skills and API design. In a production scnerio, that kind of approach
would be most useful especially in a CRUD api. 