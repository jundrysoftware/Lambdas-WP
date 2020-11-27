


## Conection to Mongo Database 

#### SRV Way

> Config File
```js
    {
        "MONGO_HOST": "mongodb+srv://USERNAME:PASSWORD@database.ixvju.mongodb.net/DATABASE?authSource=admin&replicaSet=atlas-f5kbsn-shard-0&w=majority&readPreference=primary&appname=APPNAME&retryWrites=true&ssl=true",
        "SRV_CONFIG": true // Note the SRV CONFIG flag on
    }
```

#### Default Way

> Config File
```js
    {
        "MONGO_HOST": "cluster0-shard-00-02-abc123.mongodb.net:27017",
        "MONGO_PORT": 27017,
        "MONGO_SECRET": "password",
        "MONGO_SET"	: "replicas_only",
        "MONGO_USER": "FlavioAandres",
        "SRV_CONFIG": false // Note the SRV CONFIG flag off
    }
```

## Deploy 

```bash
sls deploy --stage [DEV/TEST/PROD]
```