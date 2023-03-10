
import { Order_States } from '$lib/misc/constants';
// import { getImageNameFromLink } from '$lib/misc/utils';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ locals, params }) => {



    return {
        order: await (await locals.supabaseClient.from('orders').select('*').eq('id', params.order_id).limit(1).single()).data,
        order_address: await (await locals.supabaseClient.from('order_address').select('*').eq('id', params.order_id).limit(1).single()).data,
        order_items: await (await locals.supabaseClient.from('order_items').select('*,products(*),product_variants(*)').eq('order_id', params.order_id)).data
    };
}) satisfies PageServerLoad;

export const actions: Actions = {

    default: async ({ locals, params, request }) => {

        const data = await request.formData()
        const next_status = Number(data.get('status'))
        if (isNaN(next_status)) return fail(404)

        if (next_status === Order_States['in progress']) {
            console.log('reduce supply related to the order items')

            const { data: order_items, error: err_order_items } = await locals.supabaseClient.from('order_items').select('*').eq('order_id', params.order_id)
            if (!order_items || order_items.length === 0 || err_order_items) {
                console.log(err_order_items)
                return fail(500, { error: JSON.stringify(err_order_items, null, 2) })
            }

            const order_items_supplies = (await Promise.all(order_items.map(async (order_item) => {
                const { data: order_item_supplies, error: err_order_item_supplies } = await locals.supabaseClient.from('variant_supply').select('*').eq('variant_id', order_item.variant_id)
                if (!order_item_supplies || order_item_supplies.length === 0 || err_order_item_supplies) {
                    console.log(err_order_item_supplies)
                    throw error(500, JSON.stringify(err_order_item_supplies, null, 2))
                }
                return order_item_supplies.map(item => ({ ...item, quantity: order_item.quantity }))
            }))).flat()

            const suppliesToReduce = new SuppliesToReduce();

            order_items_supplies.forEach(item => {
                suppliesToReduce.insert(item.supply_id, item.amount_use * item.quantity)
            })

            await Promise.all(suppliesToReduce.toArray().map(async (item) =>
                await locals.supabaseClient.rpc('adjust_supply_value', {
                    row_id: item.id
                    , amount: Math.abs(item.value) * -1
                })
            ))
        }

        // if (next_status === Order_States.completed) {
        //     const pay_on_delivery_id_url = data.get('pay_on_delivery_id_url')?.toString()
        //     if (!pay_on_delivery_id_url) throw error(400)

        //     const image_name = getImageNameFromLink(pay_on_delivery_id_url)

        //     const remove_image_error = (await locals.supabaseClient.storage.from('pay-on-delivery-ids').remove([image_name])).error
        //     if (remove_image_error) throw error(500, remove_image_error)

        //     const update_order_error = (await locals.supabaseClient.from('orders').update({ pay_on_delivery_id_url: null }).eq('id', params.order_id)).error
        //     if (update_order_error) throw error(500, update_order_error)

        // }

        const { error: err_order_update } = await locals.supabaseClient.from('orders').update({ status: next_status }).eq('id', params.order_id)
        if (err_order_update) {
            console.log(err_order_update)
            return fail(500, { error: JSON.stringify(err_order_update, null, 2) })
        }

        return { success: true }
    }
};

class SuppliesToReduce {
    data: { [key: number]: number };

    constructor() {
        this.data = {};
    }

    insert(id: number, value: number) {
        if (this.data[id]) {
            this.data[id] += value;
        } else {
            this.data[id] = value;
        }
    }

    toArray(): Array<{ id: number, value: number }> {
        return Object.entries(this.data).map(([id, value]) => ({ id: +id, value }));
    }
}