<script>
    import {controller} from '$lib/ControllerState.svelte.ts';
    import { page } from '$app/stores';
</script>
<nav class="bg-base-300 py-4">
    <div class="items-center justify-between flex mx-4">
        <div>
            <h1 class="text-2xl font-bold teext-primary hidden lg:block">Paleoclimate Visualizer</h1>
            <h1 class="text-2xl font-bold teext-primary lg:hidden">PV</h1>
        </div>
        <div class="lg:space-x-4 space-x-2">
            <button title="Settings" onclick="{()=>{controller.modal.showModal()}}" class="btn btn-sm btn-outline btn-primary lg:hidden" class:hidden={$page.route.id!=='/'}>
                <i class="fa-solid fa-cog fa-lg"></i>
                <span class="hidden md:inline">Settings</span>
            </button>
            <a title="Visualizer" href="/" class="btn btn-sm btn-ghost btn-outline" class:btn-active={$page.route.id==='/'}>
                <i class="fa-solid fa-magnifying-glass-chart fa-lg"></i>
                <span class="hidden md:inline">Visualizer</span>
            </a>
            <a title="About" href="/about" class="btn btn-sm btn-outline btn-ghost" class:btn-active={$page.route.id==='/about'}>
                <i class="fa-solid fa-info-circle fa-lg"></i>
                <span class="hidden md:inline">About</span>
            </a>
        </div>
    </div>
</nav>