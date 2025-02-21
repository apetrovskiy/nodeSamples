My workspace
View
context
Certainly! Below is a complete implementation of a small Node.js REST API service that meets your requirements, along with a GitLab CI/CD pipeline configuration that captures artifacts from the test job.

Project Structure
Here's the structure of the project:

 copy
node_user_service/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── src/
│   ├── index.js
│   └── users.js
├── tests/
│   └── user.test.js
├── .gitlab-ci.yml
Step 1: Create Node.js REST API Service
package.json:

 copy
json

{
  "name": "node_user_service",
  "version": "1.0.0",
  "description": "A simple Node.js REST API service for user data",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.17.3",
    "uuid": "^8.3.2"
  },
  "devDependencies": {
    "jest": "^27.0.6"
  }
}
src/index.js:

 copy
javascript

const express = require('express');
const users = require('./users');

const app = express();
const PORT = 3000;

app.get('/user/:id', (req, res) => {
  const user = users.find(user => user.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
src/users.js:

 copy
javascript

const { v4: uuidv4 } = require('uuid');

const users = [
  { id: uuidv4(), first_name: 'John', last_name: 'Doe', age: 25 },
  { id: uuidv4(), first_name: 'Jane', last_name: 'Doe', age: 30 },
  { id: uuidv4(), first_name: 'Jim', last_name: 'Beam', age: 35 },
];

module.exports = users;
Step 2: Create Tests
tests/user.test.js:

 copy
javascript

const request = require('supertest');
const express = require('express');
const users = require('../src/users');
const app = require('../src/index');

describe('GET /user/:id', () => {
  it('should return user details for a valid ID', async () => {
    const user = users[0]; // Get the first user
    const response = await request(app).get(`/user/${user.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });

  it('should return 404 for an invalid ID', async () => {
    const response = await request(app).get('/user/invalid-id');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: 'User not found' });
  });

  it('should save user information to a file', async () => {
    const user = users[0]; // Get the first user
    const response = await request(app).get(`/user/${user.id}`);
    
    const fs = require('fs');
    const filePath = './tests/user_info.json';
    
    fs.writeFileSync(filePath, JSON.stringify(response.body, null, 2));
    
    // Check if file was created
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
Step 3: Create Dockerfile
Dockerfile:

 copy
dockerfile

FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the service port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
Step 4: Create GitLab CI/CD Configuration
.gitlab-ci.yml:

 copy
yaml

stages:
  - build
  - test

build:
  stage: build
  image: node:16
  script:
    - npm install
    - npm run lint
    - docker build -t node_user_service .
  artifacts:
    paths:
      - node_modules/
      - package-lock.json
      - package.json
  only:
    - master
    - merge_requests

test:
  stage: test
  image: node:16
  before_script:
    - docker run -d -p 3000:3000 --name user_service node_user_service
  script:
    - npm run test
    - docker cp user_service:/app/tests/user_info.json ./tests/user_info.json
  artifacts:
    paths:
      - tests/user_info.json
  after_script:
    - docker stop user_service
    - docker rm user_service
  only:
    - master
    - merge_requests
Explanation
Node.js Service: The service listens on port 3000 and has a single endpoint /user/:id that returns user information based on a UUID.

Tests: Jest is used for testing. The tests check that valid user IDs return correct user data, invalid IDs return a 404 error, and one test saves user information to a file in the tests folder.

Docker: A Dockerfile specifies how to build the image for the Node.js application.

GitLab CI/CD: The pipeline consists of two jobs:

Build Job: Installs dependencies and builds the Docker image. It saves artifacts related to the dependencies.
Test Job: Runs the tests against the service running in a Docker container and copies the user information JSON file from the container to the CI/CD job environment. The JSON file is saved as an artifact after the job completes.
Conclusion
This setup creates a functional Node.js REST API and a CI/CD pipeline that captures artifacts. You can deploy this project to your GitLab instance, and it should work with minimal adjustments. Make sure to install Docker and configure your GitLab Runner appropriately to execute Docker commands.

View
context
19:59
