<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import type { PageData } from './$types';
	import ActionMenuDropdownLinks from '$lib/components/ActionMenuDropdownLinks.svelte';
	export let data: PageData;
</script>

<Table table_headers={['User ID', 'Email', 'Phone', 'First name', 'Last name', '']}>
	{#each data.users as user (user.id)}
		<tr class="hover">
			<td>{user.id}</td>
			<td>{user.email_address}</td>
			<td>{user.phone_number}</td>
			<td>{user.first_name}</td>
			<td>{user.last_name}</td>
			<td>
				<!-- <a class="btn btn-outline btn-sm" href={`/admin/accounts/${user.id}`}>Edit</a> -->
				<ActionMenuDropdownLinks
					links={[
						{
							name: 'View',
							path: `/admin/accounts/${user.id}`
						},
						{
							name: 'Assign Role',
							path: `/admin/accounts/${user.id}/assign-role`
						}
					]}
				/>
			</td>
		</tr>
	{/each}
</Table>
