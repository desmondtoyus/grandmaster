const expect = require('chai').expect;
const request = require('request');
const password = 'My1Password';
const ROOT_URL = 'http://localhost:8080';
let token = "";
const faker = require('faker');
const models = require('../models');
const moment = require('moment');

describe('Account Admin testing', function() {
  const accountAdmin = {
    email: 'account@admin.com',
    password: password
  };

  const wrongAccountAdmin = {
    email: 'account@admin.com',
    password: 'djfhdjfhdg'
  };

  const self_account_id = 12;
  const self_zone_id = 18;
  const self_user_id = 10;
  const other_account_id = 18;
  const other_zone_id = 1;
  const non_existing_account_id = 2;
  const non_existing_user_id = 22;

  const str_101 = 'n3M66xR8u12EFYeZTlAPYvU5YlS4vjxYRL2LHudDVPK3D2pxy8MxpA0feh4WquSNPqM3xBODl1frAOdQSXSIxpbsPTRzKDVNzK4gl';

  describe('Log in', function() {
    it('Correct log in', function(done) {
      request({
        url: `${ROOT_URL}/public/login`,
        method: 'POST',
        json: accountAdmin
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('token');
        expect(body).to.have.property('role');
        expect(body.role).to.equal(64);
        token = body.token;
        done();
      })
    });
    it('Fail to login with wrong password', function(done) {
      request({
        url: `${ROOT_URL}/public/login`,
        method: 'POST',
        json: wrongAccountAdmin
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
  });

  describe('Setting scope', function() {
    it('Unauthorized to set scope', function(done) {
      request({
        url: `${ROOT_URL}/user/scope`,
        method: 'POST',
        json: {
          account_id: self_account_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
  });

  describe('Read logged in account', function() {
    it('Reading logged in account', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'GET',
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(body)).to.have.property('user');
        expect(JSON.parse(body)).to.have.property('scope_account');
        done();
      })
    })
  });

  describe('List accounts', function() {
    it('Unable to list accounts', function(done) {
      request({
        url: `${ROOT_URL}/account/list`,
        method: 'POST',
        json: {},
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    })
  });

  describe('Read account', function() {
    it('Unauthorized to read account', function(done) {
      request({
        url: `${ROOT_URL}/account/read`,
        method: 'POST',
        json: {
          id: self_account_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
  });

  describe('Create account', function() {
    it('Unauthorized to create account', function(done) {
      request({
        url: `${ROOT_URL}/account/create`,
        method: 'POST',
        json: {
          name: faker.company.companyName(),
          notes: faker.lorem.paragraph()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
  });

  describe('Update account', function() {
    it('Unauthorized to update account', function(done) {
      request({
        url: `${ROOT_URL}/account/update`,
        method: 'POST',
        json: {
          id: self_account_id,
          name: 'Updated account name',
          notes: 'Updated account notes'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
  });

  describe('Delete account', function() {
    let account_id;
    before(function (done) {
      models.accounts.create({
        name: faker.company.companyName(),
        notes: faker.random.words(),
        created_at: 0,
        is_zone_master: false,
        status: 'active',
        approved_at: 0,
        zone_id: self_zone_id
      })
        .then(account => {
          account_id = account.id;
          done();
        })
        .catch(err => {
          console.log(err);
        })
    });
    it('Unauthorized to delete account', function (done) {
      request({
        url: `${ROOT_URL}/account/delete`,
        method: 'POST',
        json: {
          id: account_id
        },
        headers: {
          authorization: token
        }
      }, function (err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    after(function(done) {
      models.accounts.destroy({ where: { id: account_id }});
      done();
    })
  });

  describe('List users', function() {
    it('List users with no params', function(done) {
      request({
        url: `${ROOT_URL}/user/list`,
        method: 'POST',
        json: {},
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('rows');
        expect(body).to.have.property('pagination');
        expect(body.pagination.limit).to.equal(15);
        done();
      })
    });
    it('List users with search term', function(done) {
      request({
        url: `${ROOT_URL}/user/list`,
        method: 'POST',
        json: {
          searchTerm: 'o'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('rows');
        expect(body).to.have.property('pagination');
        body.rows.forEach((item) => {
          let name = item.first_name + ' ' + item.last_name;
          expect(name.toLowerCase()).to.include('o');
        });
        done();
      })
    });
    it('List users with limited page chunk and different current page', function(done) {
      request({
        url: `${ROOT_URL}/user/list`,
        method: 'POST',
        json: {
          pageChunk: 3,
          currentPage: 3
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('rows');
        expect(body).to.have.property('pagination');
        expect(body.pagination.limit).to.equal(3);
        expect(body.pagination.currentPage).to.equal(3);
        done();
      })
    });
    it('List users with order by ID and descending', function(done) {
      request({
        url: `${ROOT_URL}/user/list`,
        method: 'POST',
        json: {
          sortBy: 'id',
          sortDirection: 'desc'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('rows');
        expect(body).to.have.property('pagination');
        body.rows.forEach((item, index) => {
          if (index !== 0) {
            expect(item.id).to.be.below(body.rows[index - 1].id);
          }
        });
        done();
      })
    })
  });

  describe('Create user', function() {
    it('Create user', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to create a user when no params provided', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {},
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to create a user when email already exists', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: 'bwa@admin.com',
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(422);
        done();
      })
    });
    it('Fail to create user when first name is shorter than 3 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: "AA",
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when first name is longer than 100 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: "RzAFwcXMVYEcogtVLeDjMuduZBevT8g8YokvbxnzjI4MDyJ2pZAzSxXaYy0INOqSX6cLF2glFcgT1pW08jxFkQkTW12IGi5VKy11T",
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when last name is shorter than 3 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: "AA",
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when last name is longer than 100 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: "RzAFwcXMVYEcogtVLeDjMuduZBevT8g8YokvbxnzjI4MDyJ2pZAzSxXaYy0INOqSX6cLF2glFcgT1pW08jxFkQkTW12IGi5VKy11T",
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when the password does not meet the criteria', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'mypassword',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when the email is not valid', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: "abc@abc.p",
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when the role is not valid', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: 1,
          phoneNumber: faker.phone.phoneNumberFormat()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when the phone number is less than 10 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: '111111111'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    });
    it('Fail to create user when the phone number is more than 15 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 255, min: 64}),
          phoneNumber: '1111111111111111'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        expect(body).to.have.property('messages');
        done();
      })
    })
  });

  describe('Read user', function() {
    it('Read user from same account', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'POST',
        json: {
          id: 11
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('id');
        expect(body).to.have.property('email');
        expect(body).to.have.property('first_name');
        expect(body).to.have.property('last_name');
        expect(body).to.have.property('phone_number');
        expect(body).to.have.property('role');
        done();
      })
    });
    it('Fail to read user from same zone, different account', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'POST',
        json: {
          id: 57
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to read user from different zone', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'POST',
        json: {
          id: 17
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to read user without providing account id', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'POST',
        json: {},
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to read user that does not exist', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'POST',
        json: {
          id: 2
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      })
    })
  });

  describe('Update user', function() {
    let user_id1;
    let user_id2;
    let user_id3;
    before(function(done) {
      models.users.bulkCreate([
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 511, min: 64}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: self_zone_id,
          account_id: self_account_id,
          scope_zone_id: self_zone_id,
          scope_account_id: self_account_id
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 511, min: 64}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: self_zone_id,
          account_id: 13,
          scope_zone_id: self_zone_id,
          scope_account_id: 13
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 511, min: 64}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: other_zone_id,
          account_id: other_account_id,
          scope_zone_id: other_zone_id,
          scope_account_id: other_account_id
        }
      ])
        .then(() => {
          return models.users.findAll({
            order: [['id', 'desc']],
            limit: 3
          })
        })
        .then(users => {
          user_id1 = users[2].id;
          user_id2 = users[1].id;
          user_id3 = users[0].id;
          done();
        })
    });
    it('Update user from same account', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to update user from same zone, different account', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id2,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to update user from different zone', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id3,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to update user without providing user id', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user that does not exist', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: non_existing_user_id,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      })
    });
    it('Fail to update user when first name is shorter than 3 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'aa',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user when first name is longer than 100 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: str_101,
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user when last name is shorter than 3 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'updated first name',
          lastName: 'aa',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user when last name is longer than 100 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'updated first name',
          lastName: str_101,
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user when new password does not meet the criteria', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "mypass",
          phoneNumber: "",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user when the role is not valid', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: 19
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user when the phone number is less than 10 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "111",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update user when the phone number is more than 15 characters', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id1,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "123456789123456789",
          role: faker.random.number({min: 64, max: 511})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    after(function(done) {
      models.users.destroy({ where: { id: user_id1 }});
      models.users.destroy({ where: { id: user_id2 }});
      models.users.destroy({ where: { id: user_id3 }});
      done();
    });
  });

  describe('Delete user', function() {
    let user_id1;
    let user_id2;
    let user_id3;
    before(function(done) {
      models.users.bulkCreate([
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 511, min: 64}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: self_zone_id,
          account_id: self_account_id,
          scope_zone_id: self_zone_id,
          scope_account_id: self_account_id
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 511, min: 64}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: self_zone_id,
          account_id: 13,
          scope_zone_id: self_zone_id,
          scope_account_id: 13
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 511, min: 64}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: other_zone_id,
          account_id: other_account_id,
          scope_zone_id: other_zone_id,
          scope_account_id: other_account_id
        }
      ])
        .then(() => {
          return models.users.findAll({
            order: [['id', 'desc']],
            limit: 3
          })
        })
        .then(users => {
          user_id1 = users[2].id;
          user_id2 = users[1].id;
          user_id3 = users[0].id;
          done();
        })
    });
    it('Delete user from same account', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: user_id1
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to delete user from same zone, different account', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: user_id2
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to delete user from different zone', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: user_id3
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to delete your own user', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: self_user_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(403);
        done();
      })
    });
    it('Fail to delete user with id 1-10', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: 6
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(403);
        done();
      })
    });
    it('Fail to delete a user when id is not provided', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {},
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to delete a user when user does not exist', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: non_existing_user_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      })
    });
  });
});
