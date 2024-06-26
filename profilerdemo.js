{
    "connectionString": "mongodb://localhost:27017",
    "http": {
        "enabled": true,
        "port": 3000,
        "host": "localhost"
    },
    "reportInterval": 10000,
    "templates": [
        {
          "name": "claims",
          "database": "insurance",
          "collection": "claims",
          "drop": true,
          "template": {
            "first": "%name.firstName",
            "last": "%name.lastName",
            "customerId": {"%abs":{"of": {"%gaussian":
                {"mean": 50000, "sd": 10000}}}},
            "claim": {
              "date": {"%date": {
                 "min": {"$date": "2000-01-01"},
                 "max": {"$date": "2022-01-01"}}},
              "type": "#claimType",
              "amount": {"%natural": {"max": 100000}},
              "currency": "#currency"
            },
            "suspectedFraud": "#isFraud"
          },
          "remember": ["customerId"],
          "indexes": [{"claim.date":1, "customerId":1}]
        }
      ],    
     "workloads": [
        {
          "name": "Initial insert",
          "template": "claims",
          "op": "insert",
          "batch": 100,
          "threads": 10,
          "stopAfter": 1000,
          "comment": "Start with 1,000,000 claims"
        },
        {
          "name": "Ongoing insert",
          "template": "claims",
          "op": "insert",
          "threads": 1,
          "pace": 100,
          "comment": "Insert a new claim every 100ms"
        },   
        {
            "name": "50 latest claims",
            "template": "claims",
            "op": "find",
            "params": {
              "filter": {},
              "sort": {"claim.date": -1},
              "limit": 50
            },
            "threads": 2,
            "pace": 50,
            "comment": "Simulate 2 users fetching the latest 50 claims 20 times per second"
          },
          {
            "name": "Latest claims per customer",
            "template": "claims",
            "op": "find",
            "params": {
              "filter": {"customerId": "#customerId"},
              "sort": {"claim.date": -1},
              "limit": 50
            },
            "threads": 1,
            "pace": 1000,
            "comment": "Simulate 1 user fetching the claims for a specific customer, once per second"
          }
          
      ]
}
