# Import the DB
mongo webapps --eval "db.pwneddatas.drop()"
mongo webapps --eval "db.chronodatas.drop()"
mongoimport --db webapps --collection chronodatas --file haveibeenpwned.json --jsonArray
mongo webapps --eval "printjson(db.chronodatas.stats())"
