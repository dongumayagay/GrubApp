import { i } from '$lib/payment/xendit.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ locals, params }) => {

    let { data: order, error: err_order } = await locals.supabaseClient.from('orders').select('*').eq('id', params.order_id).limit(1).single()
    if (!order || err_order) throw error(404, JSON.stringify(err_order, null, 2))
    if (order.status === 0 && order.invoice_id !== null) {
        const resp = await i.getInvoice({ invoiceID: order.invoice_id })

        // @ts-ignore
        if (resp.status === 'PAID' || resp.status === 'SETTLED') {
            let { data: updated_order, error: err_update_order_status } = await locals.supabaseClient.from('orders').update({ status: 1 }).eq('id', order.id).select('*').limit(1).single()
            order = updated_order
            console.log(err_update_order_status)
            throw error(500, JSON.stringify(err_update_order_status))
        }
    }

    const { data: order_items, error: err_order_items } = await locals.supabaseClient.from('order_items').select('*,products(*),product_variants(*)').eq('order_id', params.order_id)
    if (order_items === null || err_order_items) {
        console.log(err_order_items)
        throw error(500, JSON.stringify(err_order_items))
    }

    // console.log(order_items)
    return {
        order,
        order_items
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ locals, params }) => {
        const order = await (await locals.supabaseClient.from('orders').select('*').eq('id', params.order_id).limit(1).single()).data
        const order_items = await (await locals.supabaseClient.from('order_items').select('*,products(*),product_variants(*)').eq('order_id', params.order_id)).data
        // if (!order) throw error(400)
        // const resp = await i.createInvoice({
        //     amount: order.total,
        //     externalID: order.id.toString(),
        // })

    }
};