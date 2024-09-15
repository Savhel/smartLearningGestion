<script>
import { supabase } from '../../../lib/supabaseClient';

import { currentUser } from '../../../stores/currentUser';

        // Utiliser la fonction $ pour rendre le magasin réactif
        let userData = $currentUser;
        console.log(userData);

        // let etat = userData.etat
        if (userData == {}) {
            location.replace('/')
        }

    export let data; 

    async function activation(id) {
        
        const { data, error } = await supabase
        .from('enseignants')
        .update({ etat: 1 })
        .eq('id', id)
        .select()
                
        if (error) {
            console.log('une erreur d\'activation');
        }else{
            location.reload()
        }
    }

    async function desactivation(id) {
        
        const { data, error } = await supabase
        .from('enseignants')
        .update({ etat: 0 })
        .eq('id', id)
        .select()
                
        if (error) {
            console.log('une erreur d\'activation');
        }else{
            location.reload()
        }
    }

    function retour() {
        location.replace('/ListeEns')
    }
    let total = 0;
    let presence = 0

    for (const key in data.enseignants[0].presence) {
        total = total + 1
        if (data.enseignants[0].presence[key] == 1) {
            presence = presence + 1
        }
    }
</script>

<div class="h-screen flex-1 flex-col">
    <h1 class="text-center font-bold text-3xl underline uppercase">smart learning</h1>

    <h1 class="text-center font-bold underline">{data.enseignants[0].nom}</h1>
    <h2 class="text-center font-semibold underline">Tel : {data.enseignants[0].telephone}</h2>
    <h3 class="text-center font-semibold underline">Présent {presence}/{total}</h3>
    <form class="g-8 flex flex-between w-[80%] max-w-full mt-0 m-auto items-center justify-center">
        <button on:click={retour} class="w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Retour</button>
        {#if data.enseignants[0].etat == 1}
            <button on:click={desactivation(data.enseignants[0].id)} class="w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Desactiver</button>
        {:else}
            <button on:click={activation(data.enseignants[0].id)} class="w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Activer</button>
        {/if}

    </form>
    <div class=" flex-col border-blue-700 w-[80%] border-2 rounded-lg mx-auto mt-4">
        {#if data.enseignants[0].presence != null}
            {#each Object.keys(data.enseignants[0].presence) as key}
                <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-red-500 from-green-500 to-yellow-300 flex">
                    <div>Le {key} {data.enseignants[0].presence[key] == 0 ? "Absent" : "Présent"}</div>
                </div>
            {/each}
        {/if}
    </div>
</div>