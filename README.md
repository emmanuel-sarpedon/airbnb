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

---

| Method | Endpont                                                      | Description                                    |
| ------ | ------------------------------------------------------------ | ---------------------------------------------- |
| PUT    | ***/user/upload_picture/<span style="color: red; background-color: white"> {id} </span>*** | Upload user's avatar and save it to Cloudinary |

##### Authorization required for middleware

_Bearer Token :_ PbTEdv2Z9QoAP0Ow9bjEJixJKwJ1gkARDB4si0J22zJU7WaNe4c4rTEWF1iE0DwJ

##### Required parameters

***<span style="color: red; background-color: white">{id}</span>*** : User id in database - MongoDB

##### Picture's path

With Postman, you have to send a ```form-data``` :

| KEY     | VALUE              |
| ------- | ------------------ |
| picture | ```Select Files``` |

##### Response

```json
{
    "account": {
        "username": "manu",
        "name": "Emmmanuel",
        "description": "Emmanuel, 26 ans, développeur",
        "avatar": {
            "url": "http://res.cloudinary.com/manu-sarp/image/upload/v1624347415/airbnb/users/60d189ccda4436001572abee/60d189ccda4436001572abee.jpg"
        }
    },
    "rooms": [],
    "_id": "60d189ccda4436001572abee",
    "email": "emmanuel.sarpedon@gmail.com"
}
```

---

