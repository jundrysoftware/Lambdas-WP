## Conection to Mongo Database 

#### SRV Way

> Config File

``` js
    {
        "MONGO_HOST": "mongodb+srv://USERNAME:PASSWORD@database.ixvju.mongodb.net/DATABASE?authSource=admin&replicaSet=atlas-f5kbsn-shard-0&w=majority&readPreference=primary&appname=APPNAME&retryWrites=true&ssl=true",
        "SRV_CONFIG": true // Note the SRV CONFIG flag on
    }
```

#### Default Way

> Config File

``` js
    {
        "MONGO_HOST": "cluster0-shard-00-02-abc123.mongodb.net:27017",
        "MONGO_PORT": 27017,
        "MONGO_SECRET": "password",
        "MONGO_SET": "replicas_only",
        "MONGO_USER": "FlavioAandres",
        "SRV_CONFIG": false // Note the SRV CONFIG flag off
    }
```

## Deploy 

``` bash
sls deploy --stage [DEV/TEST/PROD]
```

### Mongo Documents (Examples):

## User

``` json
[
    {
        "_id": {
            "$oid": "5fc43e5e607f370ee4f66308"
        },
        "name": "Andres Morelos",
        "emails": ["me@andresmorelos.dev"],
        "phones": ["+57300300300", "+57300300300"],
        "email": "me@andresmorelos.dev"
    },
     {
        "_id": {
            "$oid": "XXXXXXXXX"
        },
        "name": "Flavio Andres",
        "emails": ["me@flavioaandres.com"],
        "phones": ["+57300300300", "+57300300300"],
        "email": "me@flavioaandres.com"
    }
]

```

### Bank

#### Bancolombia

``` js
[
    // Bancolombia
    {
        "_id": {
            "$oid": "5fc002bfe604fe349ea1257c"
        },
        "filters": [{
            "phrase": "Bancolombia te informa recepción transferencia",
            "type": "INCOME"
        }, {
            "phrase": "Bancolombia le informa Compra",
            "type": "EXPENSE"
        }, {
            "phrase": "Bancolombia le informa Retiro",
            "type": "EXPENSE"
        }, {
            "phrase": "Bancolombia le informa Transferencia",
            "type": "EXPENSE"
        }],
        "name": "BANCOLOMBIA",
        "subject": "Servicio de Alertas y Notificaciones Bancolombia",
        "folder": "Cosas Personales/Bancolombia",
        "createdAt": {
            "$date": "2020-11-26T19:32:15.925Z"
        },
        "updatedAt": {
            "$date": "2020-11-26T19:32:15.925Z"
        },
        "__v": 0,
        "ignore_phrase": "Bancolombia le informa que su factura inscrita",
        "index_value": {
            "$numberLong": "0"
        },
        "user": {
            "$oid": "5fc43e5e607f370ee4f66308"
        }
    }
    // PSE
    {
        "_id": {
            "$oid": "5fc10af82af06f08b5c49b22"
        },
        "filters": [{
            "phrase": "Empresa:",
            "type": "EXPENSE"
        }],
        "name": "PSE",
        "subject": "Confirmación Transacción PSE",
        "folder": "Cosas Personales/PSE",
        "ignore_phrase": "Estado de la transacción: Rechazada",
        "index_value": {
            "$numberLong": "0"
        },
        "user": {
            "$oid": "5fc43e5e607f370ee4f66308"
        }
    }
]
```
