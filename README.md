Task 2

Create microservices (Nodejs - Express) for CRUD operation and store in database (MongoDB) for user data (Point 50)
User data : Id, userName, accountNumber, emailAddress, identityNumber
Protect the APIs using the authorization header – JWT (Point 5)
Validate authorization header (JWT)– (Point 5)
Choose 1 of 3: (Point 30)
Implement cache strategy using Redis for user data.
Consume user data from Kafka and insert to MongoDB (consumer only)
Produce user data from mongodb to kafka (producer only)
Deploy into docker/heroku or any platform services and running. (Point 10)
 

Notes:

Provide API to generate JWT token
For read operation please create functions to get user by accountNumber and get user by IdentityNumber.
Please define the constraint and indexing in database.
Please use your name with the following format:
Database name (i.e: db_********_betest)
Microservices/Project name (i.e: ms-********- betest)
Redis name (i.e: redis_********_ betest)
Kafka/topic name (i.e: kafka_********_ betest)
Git Repo name (i.e: ********- betest.git)
(change ******** with your name)