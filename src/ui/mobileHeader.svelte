<script lang="ts">
	import LogoDark from "$crate/assets/logo-dark-mode.svg";
	import Logo from "$crate/assets/logo-white-mode.svg";
	import ThemeToggler from "$crate/ui/themeToggleButton.svelte";
	import Sidebar from "phosphor-svelte/lib/Sidebar";
	import * as Sheet from "$crate/components/ui/sheet";
	import MobileMenu from "./mobileMenu.svelte";

	let dialogOpen = false;
</script>

<div class="h-[120px] shrink-0 xs:hidden"></div>

<header
	class="
	h-[120px] flex gap-6 px-6 xs:hidden shrink-0 bg-backgrond/50 dark:bg-d-backgrond/80 backdrop-blur-md z-20
	fixed inset-x-0 top-0
	"
>
	<div class="flex-1 flex justify-start items-center max-sm:hidden">
		<img class="dark:hidden w-[170px]" src={Logo} alt="Kaio Felps" />
		<img class="hidden dark:inline-block w-[170px]" src={LogoDark} alt="Kaio Felps" />
	</div>
	<div class="flex-1 flex items-center justify-end gap-2">
		<ThemeToggler />

		<Sheet.Root bind:open={dialogOpen}>
			<Sheet.Trigger>
				<button
					class="
					rounded-full border-gray-300 dark:border-d-gray-300 border
					w-[46px] h-[46px] hover:scale-105 transition-all ease-in cursor-default
					flex items-center justify-center
					"
				>
					<Sidebar size={24} weight="bold" />
				</button>
			</Sheet.Trigger>
			<Sheet.Content
				side="left"
				class="bg-backgrond dark:bg-d-backgrond border-gray-300 dark:border-x-gray-800 p-0 w-full max-w-[380px]"
			>
				<MobileMenu close={() => (dialogOpen = false)} />
			</Sheet.Content>
		</Sheet.Root>
	</div>
</header>
