## To run the app

1 - docker run --name pgdb -d -p 5432:5432 -e POSTGRES_PASSWORD=supersecurepass postgres:alpine
2 - create a database with the name "ptech"
3 - npm install
4 - npm run typeorm:run
5 - npm start
6 - http://localhost:3000