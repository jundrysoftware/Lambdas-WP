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

## Mongo Collections

    - users
    - payments 
    - banks 
    - datacreditos

### Mongo Documents (Examples):

## User

``` json
[
    {
        "_id": {
            "$oid": "XXXXXXXXX"
        },
        "name": "Andres Morelos",
        "emails": ["me@andresmorelos.dev"],
        "phones": ["+57300300300", "+57300300300"],
        "email": "me@andresmorelos.dev",
        "settings": {
            datacredito: {
                user: {}, // Encrypted data
                password: {},// Encrypted data
                secondpass: {}// Encrypted data
            }
        }
    },
     {
        "_id": {
            "$oid": "XXXXXXXXX"
        },
        "name": "Flavio Andres",
        "emails": ["me@flavioaandres.com"],
        "phones": ["+57300300300", "+57300300300"],
        "email": "me@flavioaandres.com",
        "settings": {
            datacredito: {
                user: {}, // Encrypted data
                password: {},// Encrypted data
                secondpass: {}// Encrypted data
            }
        }
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
            "type": "INCOME",
            "parser": "transferReception"
        }, {
            "phrase": "Bancolombia le informa Compra",
            "type": "EXPENSE",
            "parser": "shopping"
        }, {
            "phrase": "Bancolombia le informa Retiro",
            "type": "EXPENSE",
            "parser": "debitWithdrawal"
        }, {
            "phrase": "Bancolombia le informa Transferencia",
            "type": "EXPENSE"
            "parser": "transfer"
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

## Filters Types: 

  + Payments: "Bancolombia le informa Pago"
  + Shopping: "Bancolombia le informa Compra"
  + Transfer: "Bancolombia le informa Transferencia"
  + TransferReception: "Bancolombia le informa tecepción de Transferencia"
  + DebitWithdrawal: "Bancolombia le informa Retiro"


## Data Credito

```json

{
    "_id": {
        "$oid": "XXXXXXXXXXX"
    },
    "comportamiento": "volatil",
    "score": 727,
    "amountOfProducts": 4,
    "arrears30daysLastYear": null,
    "arrears60daysLastYear": null,
    "arrearsAmount": 0,
    "date": {
        "month": "11",
        "year": "2020"
    },
    "user": {
        "$oid": "XXXXXXXXXXXX"
    },
    "createdAt": {
        "$date": "2020-12-14T05:40:10.075Z"
    },
    "updatedAt": {
        "$date": "2020-12-14T06:06:21.336Z"
    },
    "__v": 0
}
```


# Data Credito Scraper DICLAIMER

``` 
THIS SCRAPER IS A RESEARCH BASED PROJECT, WE DON'T ENCOURAGE THE MISUSE OF THIS TOOL FOR BAD INTENTIONS.

WE ALSO RECOMMEND USERS TO ACQUIRE A PLAN AT www.midatacredito.com TO MAKE USE OF THIS TOOL.

THE DEVELOPERS ARE NOT RESPONSIBLE FOR ANY MISUSE OF THIS TOOL.
```
