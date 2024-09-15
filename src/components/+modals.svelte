<!-- Modal.svelte -->
<script>
  export let isOpen = false;
  export let onClose = () => {};
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={onClose}>
    <div class="modal-content w-full" on:click|stopPropagation>
      <slot></slot>
      <button class="close-button" on:click={onClose}>Fermer</button>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
</style>