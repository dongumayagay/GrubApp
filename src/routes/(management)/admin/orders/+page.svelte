<script lang="ts">
	import Controls from '$lib/components/Controls.svelte';
	import Table from '$lib/components/Table.svelte';
	import { Order_States, states } from '$lib/misc/constants';
	import { currency_formatter, datetime_formatter, display_property } from '$lib/misc/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	let order_status_filter: HTMLButtonElement;
</script>

<Controls>
	<form method="get">
		<select
			class="select select-bordered select-sm text-sm	py-0 capitalize"
			name="status"
			on:change={() => {
				order_status_filter.click();
			}}
		>
			<option value=""> All Orders </option>
			{#each states as state, index}
				<option value={index}>{state}</option>
			{/each}
		</select>
		<button bind:this={order_status_filter} class="hidden" />
	</form>
</Controls>
<Table
	table_headers={['order id', 'status', 'date ordered', 'total', 'owner email', 'payment type', '']}
>
	{#each data.orders as order (order.id)}
		<tr class="hover">
			<td>{order.id}</td>
			<td> <span class="badge badge-lg uppercase"> {Order_States[order.status]} </span> </td>
			<td>{datetime_formatter(order.created_at)}</td>
			<td>{currency_formatter(order.total)}</td>
			<td>{display_property(order.profiles, 'email_address')}</td>
			<td>{order?.payment_type ?? '-'}</td>
			<td
				><a href={`/admin/orders/${order.id}`} class="btn btn-outline btn-sm">
					View order details
				</a></td
			>
		</tr>
	{:else}
		<tr class="hover">
			<td colspan="6" class="text-center font-bold"> No result found </td>
		</tr>
	{/each}
</Table>
