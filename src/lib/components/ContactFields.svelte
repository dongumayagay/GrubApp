<script lang="ts">
	// @ts-ignore
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class=" grid sm:grid-cols-2 gap-4">
	<div class="form-control">
		<label class="label" for="first_name">
			<span class="label-text">First name*</span>
		</label>
		<input
			type="text"
			name="first_name"
			placeholder="First name"
			class="input input-bordered "
			required
			value={data.profile?.first_name ?? ''}
		/>
	</div>
	<div class="form-control">
		<label class="label" for="last_name">
			<span class="label-text">Last name*</span>
		</label>
		<input
			type="text"
			name="last_name"
			placeholder="Last name"
			class="input input-bordered "
			required
			value={data.profile?.last_name ?? ''}
		/>
	</div>
	<div class="form-control col-span-full">
		<label class="label" for="phone_number">
			<span class="label-text">Phone number*</span>
		</label>
		<input
			type="tel"
			name="phone_number"
			placeholder="Phone number"
			class="input input-bordered "
			required
			value={data.profile?.phone_number ?? ''}
			pattern={String.raw`^(09|\+639)\d{9}$`}
			title="enter proper phone number"
		/>
	</div>
	<div class="form-control col-span-full">
		<label class="label" for="street_line1">
			<span class="label-text">Street line 1*</span>
		</label>
		<input
			type="text"
			name="street_line1"
			placeholder="Blk 6 Lot 9, Mabini Street"
			class="input input-bordered "
			required
			value={data.address?.street_line1 ?? ''}
		/>
	</div>
	<div class="form-control col-span-full">
		<label class="label" for="street_line2">
			<span class="label-text">Street line 2</span>
		</label>
		<input
			type="text"
			name="street_line2"
			placeholder="Apartment 123"
			class="input input-bordered "
			value={data.address?.street_line2 ?? ''}
		/>
	</div>
	<div class="form-control col-span-full">
		<label for="" class="label">
			<span class="label-text">Select location*</span>
		</label>
		<select
			name=""
			class="select select-bordered"
			required
			on:change={(event) => {
				data.address = data.delivery_locations[event.currentTarget.value];
			}}
		>
			<option value="">Select location</option>
			{#each data.delivery_locations as loc, index (loc.id)}
				<option value={index} selected={loc.postal_code === data.address?.postal_code}>
					{loc.city},
					{loc.state},
					{loc.postal_code}
				</option>
			{/each}
		</select>
	</div>
	<div>
		<input type="hidden" name="city" value={data.address?.city} />
		<input type="hidden" name="state" value={data.address?.state} />
		<input type="hidden" name="postal_code" value={data.address?.postal_code} />
	</div>
</div>
