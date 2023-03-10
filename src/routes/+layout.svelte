<script lang="ts">
	import { supabaseClient } from '$lib/db/client';
	import { invalidateAll, invalidate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import TopNavigationBar from '$lib/components/navbar/TopNavigationBar.svelte';
	import { page } from '$app/stores';
	import SideDrawer from '$lib/components/SideDrawer.svelte';
	import { afterNavigate } from '$app/navigation';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { Toaster } from 'svelte-french-toast';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange((event) => {
			if (event === 'PASSWORD_RECOVERY') {
				goto('/change-password');
			}
			invalidate('supabase:auth');
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	let show_side_drawer: boolean;
	let side_drawer_name = 'side-drawer';
	$: should_have_drawer =
		$page.url.pathname.startsWith('/account') || $page.url.pathname.startsWith('/admin');

	let top: HTMLElement;
	afterNavigate(() => {
		if (top) top.scrollIntoView();
	});

	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>El Ambrosia</title>
	<meta name="description" content="El Ambrosia Authentic Shawarma" />
	<meta name="author" content="Don Gumayagay" />
</svelte:head>

<div class="drawer" class:drawer-mobile={should_have_drawer}>
	<input
		id={side_drawer_name}
		type="checkbox"
		class="drawer-toggle"
		aria-label="drawer toggle"
		bind:checked={show_side_drawer}
	/>
	<div class="drawer-content flex flex-col " class:bg-base-200={should_have_drawer}>
		<!-- Page content here -->
		<div id="top" bind:this={top} />
		<TopNavigationBar>
			<svelte:fragment slot="navbar-start">
				<label
					class="btn btn-square btn-ghost lg:hidden"
					class:hidden={!should_have_drawer}
					for={side_drawer_name}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class=" w-6 h-6 fill-brand-tan"
					>
						<path
							fill-rule="evenodd"
							d="M3 9a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9zm0 6.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
							clip-rule="evenodd"
						/>
					</svg>
				</label>
			</svelte:fragment>
		</TopNavigationBar>
		<main
			class={`flex flex-col flex-1
			${should_have_drawer ? 'gap-3 px-4 py-3' : ''}`}
		>
			<slot />
		</main>
	</div>
	<div class="drawer-side">
		<label for={side_drawer_name} class="drawer-overlay" />
		<SideDrawer
			on:close_drawer={() => {
				show_side_drawer = false;
			}}
		/>
	</div>
</div>
<Toaster />
