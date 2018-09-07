# signafire-tht

#### An API server that uses Elasticsearch to query documents in Elasticsearch indices

## Getting started
- This project assumes that you have an elasticsearch node running locally or else you can point to another location by using the environment variable ELASTICSEARCH_HOST. It also assumes there will be an index named `foo_index`, `bar_index`, or `bazz_index` with documents containing the following properties:
```
{
    _id : 1,
    _index: "foo_index",
    _type: "docs"
    _source: {
        "first_name" : "fred"
        "last_name" : "flinstone"
        "location" : "bedrock"
    }
}
```


- Run `npm install` or `yarn install` to install dependencies

- Run `npm start` or `yarn start` to start the API server. This will connect to the elasticsearch node and seed a sqlite3 database with 3 users, a list of indices, and permissions.

- The log output from running the server will show you what routes are available with a description of each. You should see:

```
  GET    /users/{name}                  Lists all elasticsearch indices the user has access to
  GET    /users/{name}/search           Returns elasticsearch results for all users whose first name matches the querystring parameter q
```

### Sample cURL Commands

- Fetching indexes available to a user (user `foo` in this example:)
```
curl -X GET http://localhost:80/users/foo 
```

- Searching all documents by first_name in elasticsearch indices available to given user
```
curl -X GET http://localhost:80/users/foo/search?q=fred
```

## TO DO
- Create a frontend with server-side rendered views with a search form that will display results when the form is submitted