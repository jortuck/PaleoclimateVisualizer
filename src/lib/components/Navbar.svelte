<script>
    import {controller} from '$lib/ControllerState.svelte.ts';
</script>
<nav class="bg-base-300 py-4">
    <div class="items-center justify-between px-2 flex xl:px-0 mx-5">
        <div>
            <h1 class="text-2xl font-bold teext-primary hidden lg:block">Paleoclimate Visualizer</h1>
            <h1 class="text-2xl font-bold teext-primary lg:hidden">PV</h1>
        </div>
        <div class="lg:space-x-8">
            <button onclick="{()=>{controller.modal.showModal()}}" class="btn btn-sm lg:hidden">Settings</button>
            <a href="/" class="btn btn-sm btn-ghost">Visualizer</a>
            <a href="/about" class="btn btn-sm btn-ghost">About</a>
        </div>
    </div>
</nav>