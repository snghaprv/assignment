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

module.exports = {
	Address:Address,
	User: User
}