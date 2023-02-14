import { fail, redirect, } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ params, locals }) => {

    return {
        variant_supply: await (await locals.supabaseClient.from('variant_supply').select('id,supplies(name)').eq("id", params.variant_supply_id).limit(1).single()).data
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ request, locals, params }) => {
        const body = Object.fromEntries(await request.formData())

        const variant_supply_id = body.variant_supply_id.toString()

        const { error: err } = await locals.supabaseClient.from('variant_supply').delete().eq("id", variant_supply_id)
        if (err) {
            return fail(Number(err.code), {
                error: err.message
            })
        }
        throw redirect(303, `/admin/products/${params.product_id}/variants/${params.variant_id}/supplies/`)
    }
};