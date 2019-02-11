const chai = require("chai")
const expect = chai.expect
const request = require("supertest")
const app = require("../server")
const User = require("../models/user")

// Use this agent for authenticated requests
let authAgent = request.agent(app)

before(done => {
  // Wait for the app to start
  app.on("started", () => {
    User.remove({}).then(() => {
      // Send a request to authenticate the user
      authAgent
        .post("/login/test")
        .send({
          username: "testuser",
          password: "testtest"
        })
        .expect("Location", "/account")
        .expect(res => {
          expect(res.header["set-cookie"]).not.to.be.null
        })
        .expect(302, done)
    })
  })
})

after(() => {
  // Remove all users after test
  return User.remove({})
})

module.exports = authAgent
