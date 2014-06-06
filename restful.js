/*
PORT of Backbone.sync for Alloy 
BY JOHN WRIGHT (WRIGHTLABS)
https://github.com/wrightlabs/alloy.sync.restful

Override this function to change the manner in which Backbone persists models to the server. 
You will be passed the type of request, and the model in question. 
By default, makes a RESTful http request (using Titanium.Network.HTTPClient) to the model's url().


********* WARNING, THE FOLLOWING HAS NEVER BEEN TESTED IN ALLOY *************
Turn on Backbone.emulateHTTP in order to send PUT and DELETE requests as POST, 
with a _method parameter containing the true HTTP method, 
as well as all requests with the body as application/x-www-form-urlencoded 
instead of application/json with the model in a param named model. 
Useful when interfacing with server-side languages like PHP 
that make it difficult to read the body of PUT requests.
*/

module.exports.sync = function(method, model, options) {
  var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'delete': 'DELETE',
      'read':   'GET'
    };
  
  var type = methodMap[method];
  
  //Default options, unless specified.
  options || (options = {});
  
  //Default JSON-request options.
  var params = {type: type, dataType: 'json'};
  
  if(!options.timeout) {
      params.timeout = 7000;
  }
  
  //Ensure that we have a URL.
  if (!options.url) {
    params.url = getValue(model, 'url') || urlError();
  }
  
  //Ensure that we have the appropriate request data.
  if (!options.data && model && (method == 'create' || method == 'update')) {
    params.contentType = 'application/json';
    params.data = JSON.stringify(model.toJSON());
  }
  
  //For older servers, emulate JSON by encoding the request into an HTML-form.
  if (Alloy.Backbone.emulateJSON) {
    params.contentType = 'application/x-www-form-urlencoded';
    params.data = params.data ? {model: params.data} : {};
  }
  
  //For older servers, emulate HTTP by mimicking the HTTP method with _method And an X-HTTP-Method-Override header.
  if (Alloy.Backbone.emulateHTTP) {
    if (type === 'PUT' || type === 'DELETE') {
      if (Alloy.Backbone.emulateJSON) params.data._method = type;
      params.type = 'POST';
      params.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
      };
    }
  }
  
  //Don't process data on a non-GET request.
  if (params.type !== 'GET' && !Alloy.Backbone.emulateJSON) {
    params.processData = false;
  }
  
  //Make the HTTPClient
     
  var client = Ti.Network.createHTTPClient(_.extend(params, options));
       
  client.onload = function() {
      options.success(JSON.parse(this.responseText), this.status);
      Ti.API.debug('[alloy.sync.restful] model:' + model.url() +' response:' + this.responseText );
  };
       
  client.onerror = function(e){
      options.error(model, e.error);
      Ti.API.error('[alloy.sync.restful] ERROR model:' + model.url() +' message:' + e.error );
  };
   
  // Prepare the connection.
  client.open(params.type, params.url);
   
  // Make sure content type is set.
  if(params.contentType) {
      params.headers['Content-Type'] = params.contentType;
  }
  
  // Set request headers found in params
  for (var header in params.headers) {
         client.setRequestHeader(header, params.headers[header]);
  }
   
  // Send the request.
  client.send(params.data || null);
};
  
var getValue = function(object, prop) {
  if (!(object && object[prop])) return null;
  return _.isFunction(object[prop]) ? object[prop]() : object[prop];
};

//Throw an error when a URL is needed, and none is supplied.
var urlError = function() {
  Ti.API.error('[alloy.sync.restful] urlError: ' + this.responseText);
};
