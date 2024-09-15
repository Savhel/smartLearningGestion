<script>

    import { currentUser } from '../../../stores/currentUser';
    import { supabase } from '../../../lib/supabaseClient';
	import { onMount } from 'svelte';

    export let data

    // console.log(data.allClassData);
        // Utiliser la fonction $ pour rendre le magasin réactif
        let userData = $currentUser;
        console.log(userData);

        // let etat = userData.etat
        if (userData == {}) {
            location.replace('/')
        }
        let errorInsertEns = false
        let InsertEns = false
        let nomEns = "";
        let adresse = ""
        let password = ""
        let telephone = null
        let date = null
        let allEnsData = []
        let selected;
        let idP = data.idP

        async function allEns() {
            
            let { data: parents, error } = await supabase
            .from('eleves')
            .select('*')
            .eq('parent_id', data.idP)
            

            if (error) {
                location.replace('/')
            } else {
                allEnsData = parents
            }
                    
        }

        onMount(async () => {
            try {
                allEns()
                
                
            } catch (error) {
                console.error('Erreur lors de la récupération des enseignants:', error);
            }
        });

        async function RechercherEns(){
            if (!nomEns) {
                errorInsertEns = true
                InsertEns = false
                allEns()
                return;
            }
            
            
            let { data: enseignants, error } = await supabase
            .from('eleves')
            .select('*')
            .ilike('nom', '%'+nomEns+'%')
                    
            
            if (error) {
                errorInsertEns = true
                InsertEns = false
                console.log(error);
                return;
            }else{
                errorInsertEns = false
                allEnsData = enseignants
                return;
            }

        }

        async function AjouterEns(){
            if (!nomEns || !date || !selected) {
                errorInsertEns = true
                InsertEns = false
                return;
            }
            // console.log({ nom: nomEns, date_de_naissance: date, classe_id: selected.id, parent_id: idP});
            
            const { data, error } = await supabase
            .from('eleves')
            .insert([
                { nom: nomEns, date_de_naissance: date, classe_id: selected.id, parent_id: idP},
            ])
            .select()
            
            if (error) {
                errorInsertEns = true
                InsertEns = false
                console.log(error);
                return;
            }else{
                errorInsertEns = false
                InsertEns = true
                allEns()
                return;
            }

        }

    function retour() {
        location.replace('/DashboardAdmin')
    }

</script>

<div class="w-[80%] h-screen items-center justify-center">
    <h1 class="text-center font-bold text-3xl underline uppercase">smart learning</h1>
    <div class="flex">
        <button on:click={retour} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Retour</button>
    </div><h1 class="text-center font-bold underline">Mr/ M {data.eleves[0].parents.nom}</h1>
        <h2 class="text-center font-bold underline">{data.eleves[0].parents.telephone}</h2>
        <h4 class="text-center text-sm font-bold underline">{data.eleves[0].parents.adresse}</h4>
        <div class="h-[20%] flex-1 flex-col">
        <form class="g-8 flex flex-col w-[400px] max-w-full mt-0 m-auto items-center justify-center">
            {#if errorInsertEns}
                <p class="text-red-500 text-sm text-center">Informations incorrectes</p>
            {/if}
            {#if InsertEns}
                <p class="text-green-500 text-sm text-center">Un nouvel élève </p>
            {/if}
            <label class="position-relative border-2 border-blue-700 rounded-lg mt-1">
                <p class={nomEns ? "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.4rem] font-semibold bg-blue-700 border-blue-300" : "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.1rem] top-[50%] left-[6px] opacity-0"}>Nom</p>
                <input bind:value={nomEns} class="w-full rounded-md focus:outline-none text-center p-[0px] bg-transparent text-white" type="text" placeholder="Nom">
            </label>
            <label class="position-relative border-2 border-blue-700 rounded-lg mt-1 w-[80%]">
                <p class={date ? "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.4rem] font-semibold bg-blue-700 border-blue-300" : "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.1rem] top-[50%] left-[6px] opacity-0"}>date Naissance</p>
                <input bind:value={date} class="w-full rounded-md focus:outline-none text-center p-[0px] bg-transparent text-white" type="date" placeholder="mobilie">
            </label>
            <select bind:value={selected} class=" bg-transparent w-[80%] border-2 border-blue-700 rounded-lg mt-1">
                <option value=null>
                    choisir la classe
                </option>
                {#each data.allClassData as classe}
                    <option value={classe}>
                        {classe.nom}
                    </option>
                {/each}
            </select>

            <button on:click={RechercherEns} class="font-size-[1.5rem] bg-blue-700 text-white border-none mt-2 w-[50%] hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Rechercher</button>
            <button on:click={AjouterEns} class="font-size-[1.5rem] bg-blue-700 text-white border-none mt-2 w-[50%] hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Ajouter</button>
        </form>
        <div class=" flex-col border-blue-700 w-[80%] border-2 rounded-lg mx-auto mt-4">
            {#each allEnsData as ens}
                <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-red-500 from-green-500 to-yellow-300 flex">
                    <a href="/Eleves/{ens.id}" class="w-full h-full flex items-center justify-center"> 
                        <div class={ens.etat == 1 ? "flex-1 items-center justify-center font-bold uppercase" :"flex-1 items-center justify-center " }>{ens.nom}</div>
                    </a> 
                </div>
            {/each}
            
        
        </div>
    </div>
   

</div>
