print('===============JAVASCRIPT===============');
print('Count of rows in mongo_toboksitanggang_betest collection: ' + db.mongo_toboksitanggang_betest.count());

db.mongo_toboksitanggang_betest.insert({
    "userName": "superadmin",
    "accountNumber": 12345671,
    "emailAddress": "superadmin@gmail.com",
    "identityNumber": {
      "$numberLong": "1234567898765431"
    },
    "infoLogin": {
      "hash": "eaa8f67745bd6495d05b2917c0749054c09ec79b75b61c27d301d27b6b3de4baca28080e6db9c97c6a3f1436deb64beb1d8986095da5c85f9bf7209cc05591eb",
      "salt": "UdQIfqGovQ596H4jc72gdqViufdFviU7SBvKZlF9YOrPVvzcURpf59xy3DKIgY0dgRn4ctkttOdeDqCCoCiJy89ZNzDfJ7LuZhNmz5IIWLr5DInZG1uaJOWaARYHJQT9rcFneBCA3OBOOaOjlHcz2mYU60ikZDiE/7SnsQwXwgs=",
      "iterations": 10964
    },
    "createdAt": new Date(),
    "updatedAt":new Date()
  });

print('===============AFTER JS INSERT==========');
print('Count of rows in mongo_toboksitanggang_betest collection: ' + db.mongo_toboksitanggang_betest.count());

alltest = db.mongo_toboksitanggang_betest.find();
while (alltest.hasNext()) {
  printjson(alltest.next());
}
