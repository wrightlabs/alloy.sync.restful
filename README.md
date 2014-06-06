alloy.sync.restful
==================

This Appcelerator Titanium Alloy sync adapter is a straight port of the default Backbone.js (restful) sync adapter. (Meaning the restful adapter that comes with Backbone.js out-of-the-box but for Alloy). The code for the adapter is taken and modified directly from http://docs.appcelerator.com/backbone/0.9.2/docs/backbone.html#section-162).

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
