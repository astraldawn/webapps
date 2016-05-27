# Import the DB
mongo webapps --eval "db.pwneddatas.drop()"
mongoimport --db webapps --collection pwneddatas --file haveibeenpwned.json --jsonArray
mongo webapps --eval "printjson(db.pwneddatas.stats())"
