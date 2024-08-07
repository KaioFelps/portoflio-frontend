<script lang="ts">
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import FloatingSelect from "$crate/components/floating-select";
	import Trash from "phosphor-svelte/lib/Trash";
	import type { AdminNewProjectPageServerData, PublishProjectResponse } from "./+page.server";
	import type { Selected } from "bits-ui";
	import { tick } from "svelte";

	export let form: PublishProjectResponse;
	export let data: AdminNewProjectPageServerData;
	let formIsLoading = false;
	let subFormElement: HTMLFormElement | undefined;
	let selectedTags: Selected<string>[] = [];
	let links: Array<{ title: string; value: string }> = [];

	$: tagsData = data.tags;

	async function handleResetForm() {
		await tick();
		if (form.success) {
			links = [];
			selectedTags = [];
			subFormElement?.reset();
		}
	}

	function handleAddLink(link: { title: string; value: string }) {
		links = [...links, link];
	}

	function handleRemoveLink(link: { title: string; value: string }) {
		links = links.filter((item) => item.value !== link.value);
	}

	function handleAddLinkFormSubmit(
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		},
	) {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget)) as {
			title: string;
			value: string;
		};

		if (!data.title || !data.value) return;

		const link = {
			title: data.title.trim(),
			value: data.value.trim(),
		};

		handleAddLink(link);

		e.currentTarget.reset();
	}
</script>

<h1 class="mb-12">Novo projeto</h1>

{#if form?.success}
	<span class="success alert mb-3 py-2">Projeto criado com sucesso! </span>
{:else if Array.isArray(form?.error)}
	{#each form.error as error}
		<span class="danger alert mb-3 py-2">{form.error}</span>
	{/each}
{:else if form?.error}
	<span class="danger alert mb-3 py-2">{form.error}</span>
{/if}

<form
	method="post"
	action="?/publish"
	use:enhance={({ formData }) => {
		formData.set("links", JSON.stringify(links));
		formData.set("tags", JSON.stringify(selectedTags.map((selected) => selected.value)));
		formIsLoading = true;

		return async ({ update }) => {
			formIsLoading = false;
			await update();
			await handleResetForm();
		};
	}}
>
	{#if form?.zod?.fieldErrors.title}
		{#each form.zod.fieldErrors.title as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}
	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="title" placeholder="Nome do projeto" type="text" />
		<FloatingLabel>Nome do projeto</FloatingLabel>
	</FloatingGroup>

	{#if form?.zod?.fieldErrors.topstory}
		{#each form.zod.fieldErrors.topstory as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}
	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="topstory" placeholder="i.imgur.com" type="text" />
		<FloatingLabel>Imagem de capa</FloatingLabel>
	</FloatingGroup>

	{#if tagsData.data && tagsData.data.tags.length > 0}
		{#if form?.zod?.fieldErrors.tags}
			{#each form.zod.fieldErrors.tags as error}
				<span class="alert danger mb-2 mt-4 sm">{error}</span>
			{/each}
		{/if}
		<FloatingSelect
			bind:values={selectedTags}
			multiple
			options={tagsData.data.tags.map(({ id, value }) => ({ value: id, label: value }))}
			placeholder="Tags"
		/>
	{:else if !data.tags.error}
		<span class="mx-auto warning alert text-center w-full mb-3 inline-block">
			Ainda não há tags registradas. Você precisará <a class="font-bold" href="/admin/tags/novo">
				criar uma tag
			</a> antes!
		</span>
	{:else}
		<span class="mx-auto warning alert text-center w-full mb-3 inline-block">
			{data.tags.error}
		</span>
	{/if}

	<form
		bind:this={subFormElement}
		class="p-6 rounded-xl bg-d-backgrond/25"
		on:submit={handleAddLinkFormSubmit}
	>
		<h3 class="text-xl font-bold mb-6">Links referente ao projeto</h3>

		{#if form?.zod?.fieldErrors.links}
			{#each form.zod.fieldErrors.links as error}
				<span class="alert danger mb-2 mt-4 sm">{error}</span>
			{/each}
		{/if}

		<FloatingGroup class="mb-3">
			<FloatingInput
				class="w-full"
				placeholder="https://www.kaiofelps.dev, ..."
				type="text"
				name="title"
			/>
			<FloatingLabel>Título do link</FloatingLabel>
		</FloatingGroup>

		<FloatingGroup class="mb-3">
			<FloatingInput class="w-full" name="value" placeholder="https://www.kaiofelps.dev, ..." />
			<FloatingLabel>URL do link</FloatingLabel>
		</FloatingGroup>

		<button class="btn ghost mb-3">Adicionar</button>

		{#if links.length > 0}
			<div class="flex flex-col gap-0.5">
				{#each links as link (link.value)}
					<div
						class="flex gap-3 justify-between w-full p-1.5 pl-3 rounded-xl bg-d-gray-300/10 hover:bg-d-gray-300/15"
					>
						<span class="font-medium">
							{link.title}: <a class="text-blue-500" href={link.value}>{link.value}</a>
						</span>
						<button
							type="button"
							on:click={() => handleRemoveLink(link)}
							class="text-white p-1 rounded-md cursor-default bg-white/5 hover:bg-white/10 active:bg-white/15"
						>
							<Trash size="16" weight="bold" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</form>

	<div class="flex gap-2 mt-4">
		<a href="/admin/projetos" class="btn ghost">Cancelar</a>
		<button
			type="submit"
			disabled={formIsLoading || !!tagsData.error || !(tagsData.data?.tags.length ?? 0 > 0)}
			class="btn default"
		>
			{formIsLoading ? "Publicando" : "Publicar"} projeto
		</button>
	</div>
</form>
