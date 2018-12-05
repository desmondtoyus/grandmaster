const expect = require('chai').expect;
const request = require('request');
const password = 'My1Password';
const ROOT_URL = 'http://localhost:8080';
let token = "";
const faker = require('faker');
const models = require('../models');
const moment = require('moment');

describe('Super Admin testing', function() {
  const superAdmin = {
    email: 'super@admin.com',
    password: password
  };

  const wrongSuperAdmin = {
    email: 'super@admin.com',
    password: 'djfhdjfhdg'
  };

  const ZONE_ID = 1;
  const OTHER_ZONE_ID = 2;

  const ACCOUNT_ID = 1;
  const OTHER_ZONE_ACCOUNT_ID = 2;
  const SAME_ZONE_ACCOUNT_ID = 7;
  const NON_EXISTING_ACCOUNT_ID = 1000;

  const USER_ID = 2;
  const NON_EXISTING_USER_ID = 1000;
  const SAME_ZONE_DIFFERENT_ACCOUNT_USER_ID = 3;

  const SAME_ACCOUNT_ADVERTISER_ID = 9;
  const SAME_ZONE_DIFFERENT_ACCOUNT_ADVERTISER_ID = 15;
  const DIFFERENT_ZONE_ADVERTISER_ID = 10;
  const NON_EXISTING_ADVERTISER_ID = 1;
  
  const str_101 = 'n3M66xR8u12EFYeZTlAPYvU5YlS4vjxYRL2LHudDVPK3D2pxy8MxpA0feh4WquSNPqM3xBODl1frAOdQSXSIxpbsPTRzKDVNzK4gl';
  const str_501 = "01uiTq3dzlDm7O2mKwk465ikCcWjmDTUvYf74xT5gERSqlEZv7dEGLoIvOBWB8NK4m6w3RvnkdR1zMoKFusozv3dcpX0RebJx7fe5p6b5JoZhOGLbQLg98FTbK2yRYGaGkSaOCv1qjncuCOPf3JlRBIFykQazu2X8KUW5BC9rLbh5D844J5Xt1ztLlAZdyKgp8uFseMsnbt56rTY0oFmSFQ8tIozjUbMBa6j13QBO23EoqD36BfJbEjqNnMXlPnQbrWkDMSkMgzrbzNTXyN5uHnkh2igsOZVXTzecUazUIrsRr5K9s2jWCVYwLbuk91gCkpLjeEvSSUpCSob4uQxi1Fs4xB0YXZPTCnejVnbNbUPmzApDBXJNl3qZXtqybATho08dOu8wZvuiN8CGsiwbiNfZ02Geu6c5myEvGtvdIvJ5PglSdMVAgRJaLUUxKV8X5V6QsVfvdS0fh8AqjEYPCIhfW0AVp91T6yNqOPTA8ZAFsXhCw22A";

  describe('Log in', function() {
    it('Correct log in', function(done) {
      request({
        url: `${ROOT_URL}/public/login`,
        method: 'POST',
        json: superAdmin
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('token');
        expect(body).to.have.property('role');
        expect(body.role).to.equal(1);
        token = body.token;
        done();
      })
    });
    it('Fail to login with wrong password', function(done) {
      request({
        url: `${ROOT_URL}/public/login`,
        method: 'POST',
        json: wrongSuperAdmin
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
          account_id: ACCOUNT_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Setting scope to account outside of user zone', function(done) {
      request({
        url: `${ROOT_URL}/user/scope`,
        method: 'POST',
        json: {
          account_id: OTHER_ZONE_ACCOUNT_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
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
          id: SAME_ZONE_ACCOUNT_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('name');
        expect(body).to.have.property('id');
        expect(body).to.have.property('zone_id');
        expect(body).to.have.property('notes');
        expect(body.id).to.equal(SAME_ZONE_ACCOUNT_ID);
        done();
      })
    });
    it('Read account from other zone', function(done) {
      request({
        url: `${ROOT_URL}/account/read`,
        method: 'POST',
        json: {
          id: OTHER_ZONE_ACCOUNT_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('name');
        expect(body).to.have.property('id');
        expect(body).to.have.property('zone_id');
        expect(body).to.have.property('notes');
        expect(body.id).to.equal(OTHER_ZONE_ACCOUNT_ID);
        done();
      })
    });
    it('Fail to read account without providing account id', function(done) {
      request({
        url: `${ROOT_URL}/account/read`,
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
    it('Fail to read account that does not exist', function(done) {
      request({
        url: `${ROOT_URL}/account/read`,
        method: 'POST',
        json: {
          id: NON_EXISTING_ACCOUNT_ID
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

  describe('Create account', function() {
    it('Create account', function(done) {
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
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to create account with account name less than 6 characters', function(done) {
      request({
        url: `${ROOT_URL}/account/create`,
        method: 'POST',
        json: {
          name: "test",
          notes: faker.lorem.paragraph()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(503);
        done();
      })
    });
    it('Fail to create account with account name more than 200 characters', function(done) {
      request({
        url: `${ROOT_URL}/account/create`,
        method: 'POST',
        json: {
          name: "BXrp9PSOXOtIt5zxjPj2sjD481Fqr4nhjvaguV7VO6SR3fO9oUYJDioVZFea38BPpgInq879JPh0wm5eW7Y5IJrC7RU5ZRbJkHZ8MTEGMOMXUc7R7ekxW6szEcnsHWnE3RIDYbNB0xMtiaAHQhDw5tiZIuIW1VNVdiXP7M4F4MK5m7f7NL1gRBDGOnZnh8IngeVfxo3IX",
          notes: faker.lorem.paragraph()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(503);
        done();
      })
    });
    it('Fail to create account with notes over 500 characters', function(done) {
      request({
        url: `${ROOT_URL}/account/create`,
        method: 'POST',
        json: {
          name: faker.company.companyName(),
          notes:"01uiTq3dzlDm7O2mKwk465ikCcWjmDTUvYf74xT5gERSqlEZv7dEGLoIvOBWB8NK4m6w3RvnkdR1zMoKFusozv3dcpX0RebJx7fe5p6b5JoZhOGLbQLg98FTbK2yRYGaGkSaOCv1qjncuCOPf3JlRBIFykQazu2X8KUW5BC9rLbh5D844J5Xt1ztLlAZdyKgp8uFseMsnbt56rTY0oFmSFQ8tIozjUbMBa6j13QBO23EoqD36BfJbEjqNnMXlPnQbrWkDMSkMgzrbzNTXyN5uHnkh2igsOZVXTzecUazUIrsRr5K9s2jWCVYwLbuk91gCkpLjeEvSSUpCSob4uQxi1Fs4xB0YXZPTCnejVnbNbUPmzApDBXJNl3qZXtqybATho08dOu8wZvuiN8CGsiwbiNfZ02Geu6c5myEvGtvdIvJ5PglSdMVAgRJaLUUxKV8X5V6QsVfvdS0fh8AqjEYPCIhfW0AVp91T6yNqOPTA8ZAFsXhCw22A"
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(503);
        done();
      })
    });
  });

  describe('Update account', function() {
    let account_id;
    before(function(done) {
      models.accounts.create({
        name: faker.company.companyName(),
        notes: faker.random.words(),
        created_at: 0,
        is_zone_master: false,
        status: 'active',
        approved_at: 0,
        zone_id: ZONE_ID
      })
        .then(account => {
          account_id = account.id;
          done();
        })
        .catch(err => {
          console.log(err);
        })
    });
    it('Update account', function(done) {
      request({
        url: `${ROOT_URL}/account/update`,
        method: 'POST',
        json: {
          id: account_id,
          name: 'Updated account name',
          notes: 'Updated account notes'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to update an account when no account id provided', function(done) {
      request({
        url: `${ROOT_URL}/account/update`,
        method: 'POST',
        json: {
          name: 'Updated account name',
          notes: 'Updated account notes'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to update an account when account does not exist', function(done) {
      request({
        url: `${ROOT_URL}/account/update`,
        method: 'POST',
        json: {
          id: NON_EXISTING_ACCOUNT_ID,
          name: 'Updated account name',
          notes: 'Updated account notes'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      })
    });
    it('Fail to update an account with name that is less than 6 characters', function(done) {
      request({
        url: `${ROOT_URL}/account/update`,
        method: 'POST',
        json: {
          id: account_id,
          name: 'short',
          notes: 'Updated account notes'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(503);
        done();
      })
    });
    it('Fail to update an account with name that is more than 200 characters', function(done) {
      request({
        url: `${ROOT_URL}/account/update`,
        method: 'POST',
        json: {
          id: account_id,
          name: 'wF5yKKl4aVCJlV65TPu8xvM943J1nru9HIuVwJ9XVywjnnVgbY6ztH7pzH0wFiNPtk5nZm7IFp6RWeiL3kUvsO4sK0eo9YtiLsgQkVumZjsxiOn0Yjtd3OzTyfhSajVq4Ah5j6u8ftsOLMDau8GDRdYdKCvfgXwwTFPh9JCj9edlB1RJJTQsiJH3j840wBYy2mrnnwDFI',
          notes: 'Updated account notes'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(503);
        done();
      })
    });
    it('Fail to update an account with notes that is more than 500 characters', function(done) {
      request({
        url: `${ROOT_URL}/account/update`,
        method: 'POST',
        json: {
          id: account_id,
          name: 'Some name',
          notes: 'wVZHLUPJuVGcmo9fsDUVvyLy7jO4N5TRoLnEBckCvHh7STvJvZI6hlnfk7XcbhSPPXYBIWHmLnfohuKUeTKTQQZfmo3V0DKxJJjYp0xMCie0NndCFyKRxufl9LHlU9F5cYSFLEIa8Xy2jJjmNdQBtJ0b6MSL2cVdwvvWImqadecyA2s80i7nkh0QSodo0ZbQPZwAaB21UGQaWO48euWLk8Dh2kXM8rShLImeuOlbKFLZuVFameYtnvSdkE4xiONJB4RaHvRH3Qz7CdnXKrv4Rq5XnopqG9oAYw92hRPoYvWG7eNhf0vZTOlFKFFtic9xHFdJtL94NXuScW10MJW4y3yoojs8x2PaZ9LeSKr84QVA4UdMPmbtNy5oRa4Nm4Bkx7xAEYc6dzGGW9SFKTe6Nd0LCKbJhpTFcC1IpXClgI69G8LmVeA4M0pYDqLpTwlVHD2lxpcT0lBIAVuyVill7gvbj2XzyV0CvrlzRGEyG23ihyfg1Dx0B'
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(503);
        done();
      })
    });
    after(function() {
      models.accounts.destroy({ where: { id: account_id }});
    })
  });

  describe('Delete account', function() {
    let account_id;
    before(function(done) {
      models.accounts.create({
        name: faker.company.companyName(),
        notes: faker.random.words(),
        created_at: 0,
        is_zone_master: false,
        status: 'active',
        approved_at: 0,
        zone_id: ZONE_ID
      })
        .then(account => {
          account_id = account.id;
          done();
        })
        .catch(err => {
          console.log(err);
        })
    });
    it('Delete account', function(done) {
      request({
        url: `${ROOT_URL}/account/delete`,
        method: 'POST',
        json: {
          id: account_id
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to delete primary account', function(done) {
      request({
        url: `${ROOT_URL}/account/delete`,
        method: 'POST',
        json: {
          id: ACCOUNT_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(403);
        done();
      })
    });
    it('Fail to delete an account when id is not provided', function(done) {
      request({
        url: `${ROOT_URL}/account/delete`,
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
    it('Fail to delete an account when account does not exist', function(done) {
      request({
        url: `${ROOT_URL}/account/delete`,
        method: 'POST',
        json: {
          id: NON_EXISTING_ACCOUNT_ID
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: 0,
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
          role: faker.random.number({max: 512, min: 1}),
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
          role: faker.random.number({max: 512, min: 1}),
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
          id: 7
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
    it('Read user from same zone, different account', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'POST',
        json: {
          id: SAME_ZONE_DIFFERENT_ACCOUNT_USER_ID
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
    it('Read user from different zone', function(done) {
      request({
        url: `${ROOT_URL}/user/read`,
        method: 'POST',
        json: {
          id: 8
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
    it('Fail to read user without providing user id', function(done) {
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
          id: NON_EXISTING_USER_ID
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
          role: faker.random.number({max: 512, min: 1}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: ZONE_ID,
          account_id: ACCOUNT_ID,
          scope_zone_id: ZONE_ID,
          scope_account_id: ACCOUNT_ID
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 512, min: 1}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: ZONE_ID,
          account_id: SAME_ZONE_ACCOUNT_ID,
          scope_zone_id: ZONE_ID,
          scope_account_id: SAME_ZONE_ACCOUNT_ID
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 512, min: 1}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: OTHER_ZONE_ID,
          account_id: OTHER_ZONE_ACCOUNT_ID,
          scope_zone_id: OTHER_ZONE_ID,
          scope_account_id: OTHER_ZONE_ACCOUNT_ID
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
          role: faker.random.number({min: 1, max: 512})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Update user from same zone, different account', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id2,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 1, max: 512})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Update user from different zone', function(done) {
      request({
        url: `${ROOT_URL}/user/update`,
        method: 'POST',
        json: {
          id: user_id3,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 1, max: 512})
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
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
          role: faker.random.number({min: 1, max: 512})
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
          id: NON_EXISTING_USER_ID,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: 0
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({max: 512, min: 1}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: ZONE_ID,
          account_id: ACCOUNT_ID,
          scope_zone_id: ZONE_ID,
          scope_account_id: ACCOUNT_ID
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 512, min: 1}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: ZONE_ID,
          account_id: SAME_ZONE_ACCOUNT_ID,
          scope_zone_id: ZONE_ID,
          scope_account_id: SAME_ZONE_ACCOUNT_ID
        },
        {
          password: "123",
          last_login: 0,
          created_at: moment().utc().unix(),
          email: faker.internet.email(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          phone_number: faker.phone.phoneNumberFormat(),
          role: faker.random.number({max: 512, min: 1}),
          recover_code: "",
          recover_expire: 0,
          status: 'active',
          zone_id: OTHER_ZONE_ID,
          account_id: OTHER_ZONE_ACCOUNT_ID,
          scope_zone_id: OTHER_ZONE_ID,
          scope_account_id: OTHER_ZONE_ACCOUNT_ID
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
    it('Delete user from same zone, different account', function(done) {
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
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Delete user from other zone', function(done) {
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
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to delete your own user', function(done) {
      request({
        url: `${ROOT_URL}/user/delete`,
        method: 'POST',
        json: {
          id: USER_ID
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
          id: NON_EXISTING_USER_ID
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

  describe('List advertisers', function() {
    it('List advertisers with no params', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/list`,
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
    it('List advertisers with search term', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/list`,
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
          expect(item.name.toLowerCase()).to.include('o');
        });
        done();
      })
    });
    it('List advertisers with limited page chunk and different current page', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/list`,
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
    it('List advertisers with order by ID and descending', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/list`,
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

  describe('Create advertiser', function() {
    it('Create advertiser', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/create`,
        method: 'POST',
        json: {
          name: faker.company.companyName(),
          notes: faker.lorem.paragraph()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Fail to create a advertiser when no params provided', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/create`,
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
    it('Fail to create advertiser with name less than 6 characters', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/create`,
        method: 'POST',
        json: {
          name: "test",
          notes: faker.lorem.paragraph()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to create advertiser with name more than 100 characters', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/create`,
        method: 'POST',
        json: {
          name: str_101,
          notes: faker.lorem.paragraph()
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
    it('Fail to create advertiser with notes over 500 characters', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/create`,
        method: 'POST',
        json: {
          name: faker.company.companyName(),
          notes: str_501
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(406);
        done();
      })
    });
  });

  describe('Read advertiser', function() {
    it('Read advertiser from same account', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/read`,
        method: 'POST',
        json: {
          id: SAME_ACCOUNT_ADVERTISER_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('id');
        expect(body).to.have.property('name');
        expect(body).to.have.property('notes');
        expect(body).to.have.property('whitelist');
        expect(body).to.have.property('blacklist');
        done();
      })
    });
    it('Read advertiser from same zone, different account', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/read`,
        method: 'POST',
        json: {
          id: SAME_ZONE_DIFFERENT_ACCOUNT_ADVERTISER_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('id');
        expect(body).to.have.property('name');
        expect(body).to.have.property('notes');
        expect(body).to.have.property('whitelist');
        expect(body).to.have.property('blacklist');
        done();
      })
    });
    it('Read advertiser from different zone', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/read`,
        method: 'POST',
        json: {
          id: DIFFERENT_ZONE_ADVERTISER_ID
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.have.property('id');
        expect(body).to.have.property('name');
        expect(body).to.have.property('notes');
        expect(body).to.have.property('whitelist');
        expect(body).to.have.property('blacklist');
        done();
      })
    });
    it('Fail to read advertiser without providing user id', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/read`,
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
    it('Fail to read advertiser that does not exist', function(done) {
      request({
        url: `${ROOT_URL}/advetiser/read`,
        method: 'POST',
        json: {
          id: NON_EXISTING_ADVERTISER_ID
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

  describe('Update advertiser', function() {
    let ad_id1;
    let ad_id2;
    let ad_id3;
    before(function(done) {
      models.users.bulkCreate([
        {
          name: faker.company.companyName(),
          notes: faker.lorem.paragraph(),
          blacklist: [],
          whitelist: [],
          status: 'active',
          zone_id: ZONE_ID,
          account_id: ACCOUNT_ID,
        },
        {
          name: faker.company.companyName(),
          notes: faker.lorem.paragraph(),
          blacklist: [],
          whitelist: [],
          status: 'active',
          zone_id: ZONE_ID,
          account_id: SAME_ZONE_ACCOUNT_ID,
        },
        {
          name: faker.company.companyName(),
          notes: faker.lorem.paragraph(),
          blacklist: [],
          whitelist: [],
          status: 'active',
          zone_id: OTHER_ZONE_ID,
          account_id: OTHER_ZONE_ACCOUNT_ID,
        }
      ])
        .then(() => {
          return models.advertisers.findAll({
            order: [['id', 'desc']],
            limit: 3
          })
        })
        .then(advertisers => {
          ad_id1 = advertisers[2].id;
          ad_id2 = advertisers[1].id;
          ad_id3 = advertisers[0].id;
          done();
        })
    });
    it('Update advertiser from same account', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/update`,
        method: 'POST',
        json: {
          id: ad_id1,
          name: "updated name",
          notes: "updated notes",
          blacklist: ["google.com"],
          whitelist: ["yahoo.com"]
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Update advertiser from same zone, different account', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/update`,
        method: 'POST',
        json: {
          id: ad_id2,
          name: "updated name",
          notes: "updated notes",
          blacklist: ["google.com"],
          whitelist: ["yahoo.com"]
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      })
    });
    it('Update advertiser from different zone', function(done) {
      request({
        url: `${ROOT_URL}/advertiser/update`,
        method: 'POST',
        json: {
          id: ad_id3,
          name: "updated name",
          notes: "updated notes",
          blacklist: ["google.com"],
          whitelist: ["yahoo.com"]
        },
        headers: {
          authorization: token
        }
      }, function(err, response, body) {
        expect(response.statusCode).to.equal(200);
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
          role: faker.random.number({min: 1, max: 512})
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
          id: NON_EXISTING_USER_ID,
          firstName: 'updated first name',
          lastName: 'updated last name',
          newPassword: "My1Password",
          phoneNumber: "",
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
          role: 0
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
          role: faker.random.number({min: 1, max: 512})
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
          role: faker.random.number({min: 1, max: 512})
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
});
