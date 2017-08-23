module.exports.register = function(Handlebars, options) {
  Handlebars.registerHelper('if_even', function(conditional, options) {
    if((conditional % 2) == 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  Handlebars.registerHelper('is', function(conditional, options) {
    if(conditional) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  Handlebars.registerHelper('file', function(conditional, options) {
    if(conditional) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  Handlebars.registerHelper('listItem', function (from, to, context, options) { 
    var ret = "";
    if(to){
      for (var i = from, j = to; i < j; i++) { 
        ret = ret + options.fn(context[i]); 
      }
    }else{
      for (var i = from, j = context.length; i < j; i++) { 
        ret = ret + options.fn(context[i]); 
      }
    }
    return ret; 
  });
  Handlebars.registerHelper('offsetItem', function (from, context, options) { 
    var ret = "";
    for (var i = from, j = context.length; i < j; i++) { 
      ret = ret + options.fn(context[i]); 
    }
    return ret; 
  });
  Handlebars.registerHelper('forevery', function(context, limit, options) {
    var ret = "";
    if (context.length > 0) {
        ret += "<div class='row'>";
        for(var i=0, j=context.length; i<j; i++) {
            ret = ret + options.fn(context[i]);
            if ( (i+1) % limit === 0 ) {
                ret += "</div><div class='row'>";
            }
        }
        ret += "</div>";
    }
    return ret;
  });

  var grunt  = require('grunt');
  var globFiles = function(src) {
    var content = grunt.file.expand(src).map(grunt.file.read).join(grunt.util.normalizelf(grunt.util.linefeed));
    return content;
  };
  Handlebars.registerHelper("js", function(src) {
    var content = globFiles(src);
    return new Handlebars.SafeString(content);
  });

};