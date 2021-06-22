_Développement en cours ..._
_Documentation en cours de rédaction ..._

# airbnb

## Users

Method|Endpont|Description
---|---|---
POST|***/user/signup***|Create a new user in database

##### Required parameters

```json
{
    "email": "emmanuel.sarpedon@gmail.com",
    "username":"manu",
    "name":"Emmmanuel",
    "description":"Emmanuel, 26 ans, développeur",
    "password":"best-mdp-ever"
}
```

##### Response

```json
{
    "_id": "60d189ccda4436001572abee",
    "token": "PbTEdv2Z9QoAP0Ow9bjEJixJKwJ1gkARDB4si0J22zJU7WaNe4c4rTEWF1iE0DwJ",
    "email": "emmanuel.sarpedon@gmail.com",
    "username": "manu",
    "description": "Emmanuel, 26 ans, développeur",
    "name": "Emmmanuel"
}
```

---

| Method | Endpont            | Description                           |
| ------ | ------------------ | ------------------------------------- |
| POST   | ***/user/log_in*** | Connect the user and return the token |

##### Required parameters

```json
{
    "email": "emmanuel.sarpedon@gmail.com",
    "password" :"best-mdp-ever"
}
```

##### Response

```json
{
    "_id": "60d189ccda4436001572abee",
    "token": "PbTEdv2Z9QoAP0Ow9bjEJixJKwJ1gkARDB4si0J22zJU7WaNe4c4rTEWF1iE0DwJ",
    "email": "emmanuel.sarpedon@gmail.com",
    "username": "manu",
    "description": "Emmanuel, 26 ans, développeur",
    "name": "Emmmanuel"
}
```

