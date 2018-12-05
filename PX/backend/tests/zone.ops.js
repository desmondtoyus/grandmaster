const expect = require('chai').expect;
const request = require('request');
const password = 'My1Password';
const ROOT_URL = 'http://localhost:8080';
let token = "";
const faker = require('faker');
const models = require('../models');

describe('Zone Operations testing', function() {
  const zoneOps = {
    email: 'zone@ops.com',
    password: password
  };

  const wrongZoneOps = {
    email: 'zone@ops.com',
    password: 'djfhdjfhdg'
  };

  const self_account_id = 12;
  const other_account_id = 18;
  const non_existing_account_id = 2;
  const self_zone_id = 18;
  const self_user_id = 9;

  describe('Log in', function() {
    it('Correct log in', function(done) {
      request({
        url: `${ROOT_URL}/public/login`,
        method: 'POST',
        json: zoneOps
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('token');
        expect(body).to.have.property('role');
        expect(body.role).to.equal(32);
        token = body.token;
        done();
      })
    });
    it('Fail to login with wrong password', function(done) {
      request({
        url: `${ROOT_URL}/public/login`,
        method: 'POST',
        json: wrongZoneOps
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
  });

  describe('Setting scope', function() {
    it('Setting scope to account within user zone', function(done) {
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
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Unauthorized to set scope outside of their zone', function(done) {
      request({
        url: `${ROOT_URL}/user/scope`,
        method: 'POST',
        json: {
          account_id: other_account_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to set scope without account id', function(done) {
      request({
        url: `${ROOT_URL}/user/scope`,
        method: 'POST',
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
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
    it('List accounts with no params', function(done) {
      request({
        url: `${ROOT_URL}/account/list`,
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
    it('List accounts with search term', function(done) {
      request({
        url: `${ROOT_URL}/account/list`,
        method: 'POST',
        json: {
          searchTerm: 'bwa'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('rows');
        expect(body).to.have.property('pagination');
        body.rows.forEach((item) => {
          expect(item.name.toLowerCase()).to.include('bwa');
        });
        done();
      })
    });
    it('List accounts with limited page chunk and different current page', function(done) {
      request({
        url: `${ROOT_URL}/account/list`,
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
    it('List accounts with order by ID and descending', function(done) {
      request({
        url: `${ROOT_URL}/account/list`,
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

  describe('Read account', function() {
    it('Read account within the same zone', function(done) {
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
    it('Unauthorized to read account from other zone', function(done) {
      request({
        url: `${ROOT_URL}/account/read`,
        method: 'POST',
        json: {
          id: other_account_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to read account without providing an id', function(done) {
      request({
        url: `${ROOT_URL}/account/read`,
        method: 'POST',
        json: {},
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
    it('Fail to read account that does not exist', function(done) {
      request({
        url: `${ROOT_URL}/account/read`,
        method: 'POST',
        json: {
          id: non_existing_account_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    })
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
    it('Unauthorized to list users', function(done) {
      request({
        url: `${ROOT_URL}/user/list`,
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

  describe('Create user', function() {
    it('Unauthorized to create user', function(done) {
      request({
        url: `${ROOT_URL}/user/create`,
        method: 'POST',
        json: {
          password: 'My1Password',
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          role: faker.random.number({max: 512, min: 1}),
          phoneNumber: faker.phone.phoneNumberFormat()
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

  describe('Read user', function() {
    it('Fail to read user', function(done) {
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
        expect(response.statusCode).to.equal(401);
        done();
      })
    });
  });

  describe('Update user', function() {
    it('Fail to update user', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: self_user_id,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: 32
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    })
  });

  describe('Delete user', function() {
    it('Fail to delete a user', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: 20
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(401);
        done();
      })
    })
  });
});
