import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ locals }) => {
    if (!locals.session) throw error(401)
    console.log('cart load triggered')
    return {
        cart_items: await (await locals.supabaseClient.from('cart_items').select('*,products(*),product_variants(*)').eq('owner_id', locals.session.user.id)).data
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    remove_cart_item: async ({ request, locals }) => {
        const body = Object.fromEntries(await request.formData())
        await locals.supabaseClient.from('cart_items').delete().eq('id', Number(body.cart_item_id.toString()))
        return { success: true }
    }
};