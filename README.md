# SKOP API

The SKOP API is a javascript API for one-to-one video calls between a patient and a doctor, using a medical device : the Skop made by [WeMed](https://en.wemed.fr/nos-produits).

[Demo here](https://bengregory23.github.io/SKOP-API/demo/)

## Import
```html
<script src="SkopAPI.js"></script>

```

Simply add a *script* into your html file. 

## Usage

### Creating an instance of the Skop

**Needed to connect the users together**: 
- an API_KEY :
- a TOKEN  :
- a SESSION_ID : 

**Depending on the user you can either set its ROLE as :**
- "doctor" : He will be the one listening to the patient's heart through the Skop.
- "patient" : He will be the one using the Skop device.


```javascript
// SkopAPI is the name of the library.
let skop = new SkopAPI.Skop(apiKey, token, sessionId, role);

```

### Listening the heart

the "doctor" has to choose a heart zone : 
- Aortic
- Mitral
- Tricuspid
- Pulmonary

Then call *Skop(**chosen heart zone**)*

``` javascript

skop.skop("Aortic");

```

### Talking normally
To stop using the heart listening mode, you call the *Skop* method without any arguments. It will reset the patient's audio input and they will be able to communicate normally.

``` javascript

skop.skop();

```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License

NOT YET