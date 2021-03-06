(function($) {
  
  // Takes a URL (or fragment) and parses the querystring portion into an object.
  // Returns an empty object if there is no querystring.
  function parse(url) {
    var params = {},
        query = url.split('?')[1];

    if(!query) {
      return params;
    }
    
    $.each(query.split('&'), function(idx, pair) {
      params[pair.split('=')[0]] = decodeURIComponent(pair.split('=')[1] || '');
    });

    return params;
  };
  
  // Takes an object and converts it to a URL fragment suitable for use as a querystring.
  function serialize(params) {
    var pairs = [], currentKey, currentValue;
    
    for(key in params) {
      if(params.hasOwnProperty(key)) {
        currentKey = key;
        currentValue = params[key];
        
        if(typeof currentValue === 'object') {
          for(subKey in currentValue) {
            if(currentValue.hasOwnProperty(subKey)) {
              // If subKey is an integer, we have an array. In that case, use `person[]` instead of `person[0]`.
              pairs.push(currentKey + '[' + (isNaN(subKey, 10) ? subKey : '') + ']=' + encodeURIComponent(currentValue[subKey])); 
            }
          }
        } else {
          pairs.push(currentKey + '=' + encodeURIComponent(currentValue)); 
        }
      }
    }
    
    return pairs.join("&");
  };
  
  // Public interface.
  $.querystring = function(param) {
    if(typeof param === 'string') {
      return parse(param);
    } else {
      return serialize(param);
    }
  };
  
  // Adds a method to jQuery objects to get & querystring.
  //  $('#my_link').querystring(); // => {name: "Joe", job: "Plumber"}
  //  $('#my_link').querystring({name: 'Jack'}); // => Appends `?name=Jack` to href.
  $.fn.querystring = function() {
    var elm = $(this),
        existingData,
        newData = arguments[0] || {},
        clearExisting = arguments[1] || false;
    
    if(!elm.attr('href')) {
      return;
    }
    
    existingData = parse(elm.attr('href'));
    
    // Get the querystring & bail.
    if(arguments.length === 0) {
      return existingData;
    }
    
    // Set the querystring.
    if(clearExisting) {
      existingData = newData;
    } else {
      $.extend(existingData, newData); 
    }
    elm.attr('href', elm.attr('href').split("?")[0] + "?" + serialize(existingData));
    return elm;
    
  };
  
})(jQuery);