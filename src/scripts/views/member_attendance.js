var $ = require("jquery"),
  _ = require("underscore"),
  Backbone = require("backbone"),
  Template = require("../templates/member_attendance.html"),
  ItemTemplate = require("../templates/member_attendance_item.html");
var Marionette = require("backbone.marionette");

  
  var ItemView = Marionette.ItemView.extend({
      template: ItemTemplate,
      tagName: "tr"
  });

  module.exports = Marionette.CompositeView.extend({
      template: Template,
      itemView: ItemView,
      itemViewContainer: "#rows"
      /**
       * Necessary because our collection will finish fetching before this view is rendered,
       * so itemViewContainer doesn't exist. See https://github.com/marionettejs/backbone.marionette/issues/377
       */
      ,
      _initialEvents: function () {
          this.once("render", function () {
              if (this.collection) {
                  this.listenTo(this.collection, "add", this.addChildView, this);
                  this.listenTo(this.collection, "remove", this.removeItemView, this);
                  this.listenTo(this.collection, "reset", this._renderChildren, this);
              }
          }, this);
      },
      initialize: function (options) {
          _.bindAll(this, "onClickMore");
          options = options || {};
          this.percentages = options.perc;
      },
      events: {
          "click .more": "onClickMore"
      },
      onRender: function () {
          this.checkMoreButton();
      },
      onClickMore: function (e) {
          e.preventDefault();
          var self = this,
              button = $(e.currentTarget);
          button.button("loading");
          this.collection.nextPage().fetch({
              remove: false,
              success: function () {
                  button.button("reset");
                  self.checkMoreButton();
              },
              error: function () {
                  button.button("error");
              }
          });
      },
      checkMoreButton: function () {
          this.$(".more").toggle(this.collection.more);
      },
      serializeData: function () {
          this.percentages = this.percentages.at(0);
          return _.extend({
              perc30: parseInt(this.percentages.get('d30')),
              perc60: parseInt(this.percentages.get('d60')),
              perc90: parseInt(this.percentages.get('d90')),
              percAll: parseInt(this.percentages.get('all'))
          });
      }
  });
