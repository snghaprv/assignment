
var expect = require('chai').expect;
var returnJSON = require('../index.js');
var mongoose = require('mongoose');
var config = require('../config/config.js')

describe('Creating Model and verifying models with valid and invalid data. ', function () {
	
	it('Should create model in mongodb', function (done) {
		
		const Address = `
type Address {
city: String! @unique,
state: String
}
`;
		const User = `
type User @model {
id: String! @unique
email: String! @unique
name: String!
age: Int
addresses: [Address]
dateOfBirth: Date
}
`;
		const custom_type = {
			Address:Address
		}
		
		mongoose.connect(config.MONGODB_URL);
		var UserSchema = new mongoose.Schema(returnJSON(User,custom_type));
		var UserModel = module.exports.User= mongoose.model('User',UserSchema);
		expect(UserModel.modelName).to.be.equal('User');
		done();
	});
	it('Should enter data in collection.', function (done) {
		// Test case: Correct data is inserted properly in collection.
		var valid_data = {
			id : 'agent_007',
			email: 'agent@agent.com',
			name : 'James Bond',
			age :21,
			dateOfBirth : new Date('1970-01-01'),
			addresses :{
				city : 'Ranchi',
				state : 'Jharkhand'
			}
		}
		
		
		module.exports.User.create(valid_data, function (err, data) {
			if (err) {
				console.log(err);
				console.log("Test Failed")
			};
			
			expect(err).to.be.equal(null);
			done();
			
		});
	})
	// Invalid scenarios to test are :
	// 1. Invalid data-type.
	// 2. Duplicate data for unique field.
	// 3. Missing data for required field.
	it('Should not allow to enter invalid dateOfBirth .', function (done) {
		
		var valid_data = {
			id : 'agent_008',
			email: 'agent@agent1.com',
			name : 'James Bond',
			age :21,
			dateOfBirth : 'abc',
			addresses :{
				city : 'Ranchi',
				state : 'Jharkhand'
			}
		}
		
		
		module.exports.User.create(valid_data, function (err, data) {
			if (err) {
				expect(err.name).to.be.equal('ValidationError');
			};
			done();
		});
	})
	it('Should not allow to enter duplicate email .', function (done) {
		
		var valid_data = {
			id : 'agent_007',
			email: 'agent@agent1.com',
			name : 'James Bond',
			age :21,
			dateOfBirth : new Date('1990-01-01'),
			addresses :{
				city : 'Ranchi',
				state : 'Jharkhand'
			}
		}
		//ValidationError
		
		module.exports.User.create(valid_data, function (err, data) {
			if (err) {
				expect(err.code).to.be.equal(11000);
			};
			//console.log(data);
			done();
		});
	})
	
	it('Should not allow to enter data without email .', function (done) {
		
		var valid_data = {
			id : 'agent_009',
			name : 'James Bond',
			age :21,
			dateOfBirth : new Date('1990-01-01'),
			addresses :{
				city : 'Ranchi',
				state : 'Jharkhand'
			}
		}
		//ValidationError
		
		module.exports.User.create(valid_data, function (err, data) {
			if (err) {
				expect(err.name).to.be.equal('ValidationError');
			};
			done();
		});
	})
	/* Cleaning up by deleting the database from mongodb.
	* If want to verify data in mongodb manually then comment out following 'after' hook.
	* */
	after(function(done){
		mongoose.connection.db.dropDatabase(config.MONGODB_COLLECTION,function(){
			mongoose.connection.close(done)
		});
	})
	
});
