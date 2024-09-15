<script>
    import { currentUser } from '../../../stores/currentUser';
    import { supabase } from '../../../lib/supabaseClient';
	import { onMount } from 'svelte';

    let userData = $currentUser
    if (userData == {}) {
            location.replace('/')
    }
    export let data

    // console.log(userData);
    // console.log(data.idE);
    // console.log(data.AfficheMatieres);
    // console.log(data.eleves);


    async function activation(id) {
        
        const { data, error } = await supabase
        .from('eleves')
        .update({ etat: 1 })
        .eq('id', id)
        .select()
                
        if (error) {
            console.log('une erreur d\'activation');
        }else{
            retour()
        }
    }

    async function desactivation(id) {
        
        const { data, error } = await supabase
        .from('eleves')
        .update({ etat: 0 })
        .eq('id', id)
        .select()
                
        if (error) {
            console.log('une erreur d\'activation');
        }else{
            retour()
        }
    }

    function retour() {
        location.replace('/ListeE')
    }

</script>

<div class="w-[80%] h-screen items-center justify-center">
    <div class="flex justify-between">
        <button on:click={retour} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Retour</button>
         
            {#if data.eleves[0].etat == 1}
                <button on:click={desactivation(data.eleves[0].id)} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Desactiver</button>
            {:else}
                <button on:click={activation(data.eleves[0].id)} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Activer</button>
            {/if}
    </div>
        <h1 class="text-center font-bold underline">{data.eleves[0].nom}</h1>
    <div class="h-[20%] flex-1 flex-col">
        <div class=" flex-col border-blue-700 w-[80%] border-2 rounded-lg mx-auto mt-4">
            
            {#if data.AfficheMatieres.length > 0}
                {#each data.AfficheMatieres as ens}
                    <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-red-500 from-green-500 to-yellow-300 flex">
                    <a href="/Eleves/{data.idE}/{ens.id}" class="w-full h-full flex items-center justify-center"> 
                        <div class="flex-1 items-center justify-center font-bold uppercase">{ens.nom}</div>
                    </a> 
                    </div>
                {/each}
            {:else}
                <p>Aucune matière trouvée.</p>
            {/if}
            
        
        </div>
    </div>
   

</div>