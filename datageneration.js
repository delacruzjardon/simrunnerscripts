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
          "name": "vin",
          "database": "stellantis",
          "collection": "vin",
          "template": {
            "_id": {"%binary": {"size": 32, "as": "hex"}}
          }
        }
      ],
      "workloads": [
        {
          "name": "Generate VINs",
          "template": "vin",
          "op": "insert",
          "batch": 100,
          "threads": 50,
          "stopAfter": 100
        }
      ]
    
}
