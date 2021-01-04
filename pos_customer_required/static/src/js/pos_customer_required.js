/*
    Copyright (C) 2004-Today Apertoso NV (<http://www.apertoso.be>)
    Copyright (C) 2016-Today La Louve (<http://www.lalouve.net/>)

    @author: Jos DE GRAEVE (<Jos.DeGraeve@apertoso.be>)
    @author: Sylvain LE GAL (https://twitter.com/legalsylvain)

    The licence is in the file __manifest__.py
*/


odoo.define('pos_customer_required.pos_customer_required', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var gui = require('point_of_sale.gui');
    var core = require('web.core');
    var _t = core._t;
    var pos_model = require('point_of_sale.models');

    pos_model.load_fields('pos.payment.method', ['require_customer']);


    screens.PaymentScreenWidget.include({
        validate_order: function(options) {
        var payment_lines = this.pos.get_order().get_paymentlines()
        var client = this.pos.get_client();
        for (var i=0; i<payment_lines.length;i++){
                if (payment_lines[i].payment_method.require_customer == true){
                    if (client == null){
                        this.gui.show_popup('error',{
                            'title': _t("Customer Must Set"),
                            'body':  _t("To use Cash Method customer must be selected on payment Method"),
                        });
                        return
                    }

                }
                }
            return this._super(options);
        }
    });

    /*
        Because of clientlist screen behaviour, it is not possible to simply
        use: set_default_screen('clientlist') + remove cancel button on
        customer screen.

        Instead of,
        - we overload the function : show_screen(screen_name,params,refresh),
        - and we replace the required screen by the 'clientlist' screen if the
        current PoS Order has no Customer.
    */

    var _show_screen_ = gui.Gui.prototype.show_screen;
    gui.Gui.prototype.show_screen = function(screen_name, params, refresh){
        if(this.pos.config.require_customer == 'order'
                && !this.pos.get_order().get_client()
                && screen_name != 'clientlist'){
            // We call first the original screen, to avoid to break the
            // 'previous screen' mecanism
            _show_screen_.call(this, screen_name, params, refresh);
            screen_name = 'clientlist';
        }
        _show_screen_.call(this, screen_name, params, refresh);
    };

});
