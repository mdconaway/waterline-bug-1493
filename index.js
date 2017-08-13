var Waterline = require('waterline');
var DiskAdapter = require('sails-disk');
var targetOfQuery = {
    emailAddress: "john2@example.com",
    firstName: "John",
    lastName: "Pendergast",
    department: "Engineering",
    jobCode: "CS04",
    payBand: 4
};
var fixtureData = [
    {
        emailAddress: "john@example.com",
        firstName: "John",
        lastName: "Smith",
        department: "Sales",
        jobCode: "EE57",
        payBand: 4
    },
    {
        emailAddress: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
        department: "Sales",
        jobCode: "BR26",
        payBand: 5
    },
    {
        emailAddress: "alex@example.com",
        firstName: "Alex",
        lastName: "Glass",
        department: "Human Resources",
        jobCode: "HR01",
        payBand: 2
    },
    {
        emailAddress: "william@example.com",
        firstName: "William",
        lastName: "Aarons",
        department: "Human Resources",
        jobCode: "HR94",
        payBand: 3
    },
    targetOfQuery
];
var exampleQuery = {
    and: [
        {firstName: ["John"]},
        {}, //This junct
        {},   //and this junct will cause the query forge to incorrectly mutate the remaining query
        {jobCode: ["CS04"]},
        {payBand: [4]}
    ]
};
var queryText = JSON.stringify(exampleQuery, null, 2);

Waterline.start({
    adapters: {
        'sails-disk': DiskAdapter
    },
    datastores: {
        default: {
            adapter: 'sails-disk'
        }
    },
    models: {
        user: {
            attributes: {
                emailAddress: { type: 'string', required: true },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                department: { type: 'string' },
                jobCode: { type: 'string' },
                payBand: { type: 'number' }
            }
        }
    },
    defaultModelSettings: {
        primaryKey: 'id',
        datastore: 'default',
        attributes: {
            id: { type: 'number', autoMigrations: { autoIncrement: true } },
        }
    }
}, function(err, orm){
    if(err) {
        return console.log("Error starting orm!");
    }
    var User = Waterline.getModel('user', orm);
    User.destroy({}).exec(function(err){
        if(err) {
            return console.log("Error clearing user DB.");
        }
        User.createEach(fixtureData).exec(function(err){
            if(err) {
                return console.log("Error loading fixture data!");
            }
            User.find(exampleQuery).exec(function(err, users){
                if(err) {
                    return console.log("Error querying user collection!");
                }
                console.log("-------------------------------");
                console.log("This query should have found ONLY this user: ");
                console.log(JSON.stringify(targetOfQuery, null, 2));
                console.log("-------------------------------");
                console.log("The following query: ");
                console.log(queryText);
                console.log("-------------------------------");
                console.log("Resulted in the following mutated query: ");
                console.log(JSON.stringify(exampleQuery, null, 2));
                console.log("-------------------------------");
                console.log("Returned the following results: ")
                console.log(JSON.stringify(users, null, 2));
                console.log("-------------------------------");
                process.exit(0);
            });
        });
    });
});