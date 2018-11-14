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
name: [String! @unique]
age: Int
dateOfBirth: Date
addresses: [Address! @unique]
}
`;

module.exports = {
	Address:Address,
	User: User
}
//addresses: [Address]