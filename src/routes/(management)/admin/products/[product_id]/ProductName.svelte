<script lang="ts">
	// @ts-ignore
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Product: {data.product?.name}</h1>
