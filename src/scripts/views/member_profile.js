var $ = require("jquery"),
  _ = require("underscore"),
  Backbone = require("backbone"),
  Template = require("../templates/member_profile.html"),
  config = require("../config");
var Marionette = require("backbone.marionette");

  
  module.exports = Marionette.ItemView.extend({
      template: Template,
      initialize: function(options) {
          options = options || {};
          this.finances = options.finances || false;
          this.permissions = options.permissions || {};
          //this.permissions.on("reset", this.render, this);
      },
      serializeData: function () {
          var permissions = this.permissions.length ? this.permissions.pluck("abbr") : [];
          var fin_sum = _.reduce(this.finances.pluck("amount_received"), function(m, x) { return +m + +x; }, 0);
          
          return _.extend({
              forum: config.forum,
              fin_sum: fin_sum,
              is_admin: permissions.indexOf("admin"),
              short_name_url: this.model.get("short_name").replace("/", "")
          }, this.model.toJSON());
      }
  });
