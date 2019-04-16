let seedDataArr = [{
    email: "craig@craigsimmons.net",
    password: "Td0mhp2r",
}]

function createTestData() {
    let domain1 = '@gmail.com';
    let domain = '@greyspider.com';
    var uidbase = 'testacct';
    var email = '';
    let password = 'Td0mhp2r';
    var extraProp = '';
    var numInt = 100;

    for (let i = 0; i < numInt; i++) {
        objectId = i;
        email = (uidbase + i + domain);
        console.log(objectId + ' email: ' + email + ' password: ' + password);
        seedDataArr.push({
            "objectId": objectId,
            "email": email,
            "password": password,
            "extraProp": extraProp
        });
        console.log(seedDataArr[i]);
    }

}
createTestData()