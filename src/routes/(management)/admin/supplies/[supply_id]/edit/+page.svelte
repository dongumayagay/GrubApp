<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance, type SubmitFunction } from '$app/forms';
	import NotFound from '$lib/components/NotFound.svelte';

	export let data: PageData;
	export let form: ActionData;

	let loading: boolean;
	let supply = data.supply;

	const enhance_function: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update({ reset: false });
		};
	};
</script>

{#if supply}
	<form method="post" class="grid" use:enhance={enhance_function}>
		<div class="form-control">
			<label class="label" for="name">
				<span class="label-text">Supply name</span>
			</label>
			<input
				type="text"
				name="name"
				placeholder="Supply name"
				class="input input-bordered "
				required
				value={supply.name}
			/>
		</div>
		<div class="form-control">
			<label class="label" for="unit">
				<span class="label-text">Supply unit of measurement</span>
			</label>
			<input
				type="text"
				name="unit"
				placeholder="Supply unit of measurement"
				class="input input-bordered "
				required
				value={supply.unit}
			/>
		</div>
		<div class="form-control">
			<label class="label" for="threshold">
				<span class="label-text">Supply threshold value</span>
			</label>
			<input
				type="number"
				name="threshold"
				placeholder="Supply threshold value"
				class="input input-bordered "
				required
				value={supply.threshold}
			/>
		</div>
		<br />
		<button class="btn btn-block" class:loading disabled={loading}>update</button>
		<br />
		{#if form?.error}
			<br />
			<div class="alert alert-error shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>{form.error}</span>
				</div>
			</div>
		{/if}
		{#if form?.sucess}
			<div class="alert alert-success shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Updated</span>
				</div>
			</div>
		{/if}
	</form>
{:else}
	<NotFound />
{/if}
