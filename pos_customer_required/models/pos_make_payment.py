# Copyright (C) 2016-Today: La Louve (<http://www.lalouve.net/>)
# Copyright (C) 2019-Today: Druidoo (<https://www.druidoo.io>)
# @author: Sylvain LE GAL (https://twitter.com/legalsylvain)
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).


from odoo import models, api,fields ,_
from odoo.exceptions import UserError


class PosMakePayment(models.TransientModel):
    _inherit = 'pos.make.payment'



    def check(self):
        # Load current order
        order_obj = self.env['pos.order']
        order = order_obj.browse(self.env.context.get('active_id', False))

        # Check if control is required
        if not order.partner_id\
                and order.require_customer == True:
            raise UserError(_(
                "An anonymous order cannot be confirmed.\n"
                "Please select a customer for this order."))

        return super(PosMakePayment, self).check()

class PaymentMethod(models.Model):
    _inherit = 'pos.payment.method'

    require_customer = fields.Boolean(
        string=' Require Customer', )