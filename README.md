alloy.sync.restful
==================

This Appcelerator Titanium Alloy sync adapter is a straight port of the default Backbone.js (restful) sync adapter. (Meaning the restful sync method that comes with Backbone.js out-of-the-box but for Alloy). The code for the adapter is taken and modified directly from http://docs.appcelerator.com/backbone/0.9.2/docs/backbone.html#section-162.

###Usage 
Add `restful.js` to `PROJECT_FOLDER/app/assets/alloy/sync/`. Create the folders if they dont exist. 

Create your model file in the models folder. For example ...
`PROJECT_FOLDER/app/models/users.js`.

```javascript
exports.definition = {  
    config: {
        "adapter": {
            "type": "restful"
        },
    },      
    extendModel: function(Model) {      
        _.extend(Model.prototype, {
              urlRoot: 'http://example.com/api/users'
            });
        return Model;
    }, 
    extendCollection: function(Collection) {        
        _.extend(Collection.prototype, {
              url: 'http://example.com/api/users'
        });
        return Collection;
    }       
};
```

From here you can extend your model as necessary, like a normal Backbone.js model.

###Credits

Thanks to @viezel for his work on https://github.com/viezel/napp.alloy.adapter.restapi (and other great code for Alloy). From his restapi code I found working code examples for using Titanium.Network.HTTPClient (http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Network.HTTPClient).

Thanks to @jashkenas for Backbone.js and the original Backbone.sync method code (http://docs.appcelerator.com/backbone/0.9.2/docs/backbone.html#section-162)

Thanks to @appcelerator for all there work on Titanium and Alloy
