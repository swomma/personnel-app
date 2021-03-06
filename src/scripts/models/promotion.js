var $ = require("jquery"),
  _ = require("underscore"),
  Backbone = require("backbone"),
  config = require("../config");

  "use strict";

  module.exports = Backbone.Model.extend({
      url: function () {
          var url = config.apiHost + "/promotions";
          if(this.id) url += "/" + this.id;
          return url;
      },
      parse: function (response, options) {
          return response || {};
      },
      validation: {
          new_rank_id: 
            function(value, attr, computed) 
            {
              if(value == computed.old_rank_id) {
                return 'Old and new ranks can not be same!';
              }
              if (!value) {
                return "Pick a new rank!";
              }                
            }
          ,
          date: {
              required: true,
              msg: "Pick a date!",
          },
          topic_id: {
              required: true,
              pattern: "number",
              msg: "If there is no topic ID, enter 0"
           }
      }
  });
