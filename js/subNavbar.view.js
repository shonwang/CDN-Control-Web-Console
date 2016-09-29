define("subNavbar.view", ['require','exports', 'template'], function(require, exports, template) {

    var SubNavbarView = Backbone.View.extend({
        events: {
            //"click li":"open"
        },

        initialize: function(options) {
            this.options = options
            this.render();
        },

        select: function(id){
            var activeNode = this.$el.find('#' + id);
            if (activeNode.parent().css("display") == "none") {
                activeNode.parent().parent().click()
            }
            this.$el.find("#sub-jquery-accordion-menu").children("ul").find("li").removeClass("active");
            activeNode.addClass("active");
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
        },

        render: function() {
            this.$el = $(_.template(template['tpl/subSidebar.html'])({data: this.options.menuList, backHash: this.options.backHash}));
            this.$el.appendTo($('.ksc-content'));
            this.$el.find("#sub-jquery-accordion-menu").jqueryAccordionMenu();
        }

    });

    return SubNavbarView;
});