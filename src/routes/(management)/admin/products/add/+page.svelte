<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	let loading: boolean;

	let product_image: any;

	const enhance_function: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update();
		};
	};

	function on_product_image_file_input_change(e: any) {
		product_image = null;
		let image = e.target.files[0];
		console.log(image);
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			if (e.target) product_image = e.target.result;
		};
	}
</script>

<form method="post" use:enhance={enhance_function} class="grid">
	<div class="form-control">
		<label class="label" for="name">
			<span class="label-text">Product name</span>
		</label>
		<input
			type="text"
			name="name"
			placeholder={`Underdog 6\"`}
			class="input input-bordered "
			required
		/>
	</div>
	<div class="form-control">
		<label class="label" for="description">
			<span class="label-text">Product description</span>
		</label>
		<textarea
			cols="30"
			rows="5"
			name="description"
			placeholder="super duper very delicious"
			class="textarea textarea-bordered"
			required
		/>
	</div>
	<div class="form-control">
		<label class="label" for="product_image">
			<span class="label-text">Upload product image</span>
		</label>
		{#if product_image}
			<img src={product_image} alt="" class="m-0 w-full sm:max-w-lg" />
			<br />
		{/if}
		<input
			on:change={on_product_image_file_input_change}
			type="file"
			class="file-input file-input-bordered"
			accept="image/"
			name="product_image"
			required
		/>
	</div>

	<br />
	<button disabled={loading} class="btn btn-block" class:loading>add product</button>
</form>
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
