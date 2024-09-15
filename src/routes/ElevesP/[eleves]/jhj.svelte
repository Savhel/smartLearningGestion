<script>

    import { currentUser } from '../../../stores/currentUser';
    import { supabase } from '../../../lib/supabaseClient';
	import { onMount } from 'svelte';

    export let data


    let errorInsertEns = false
    let InsertEns = false
    let nomEns = "";
    let allEData = []
    let allMatData = []
    let Matieres = []
    let AfficheMatieres = []
    let idE = data.idE


    async function getAll(){
        let { data: eleves, error } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', idE);

        if (error) {
            console.log(error);
            return
        } else {
            let { data: matieres, errors } = await supabase
            .from('suivre')
            .select('matiere_id')
            .eq('eleve_id', idE)

            if (errors) {
                location.replace('/')
            } else {
                allMatData = matieres
                // console.log(allMatData[0].matieres.id);
                Matieres = []
                if (allMatData.length > 0) {
                    Matieres.push(matieres[0].matiere_id)
                    for (let index = 1; index < allMatData.length; index++) {
                        let test = false
                        for (let i = 0; i < Matieres.length; i++) {
                            if (matieres[index].matiere_id == Matieres[i]) {
                                test = true
                            }
                            
                        }
                        if (test == false) {
                            Matieres.push(matieres[index].matiere_id)
                            // Matieres = []
                        }
                    }
                    // console.log(Matieres);
                    AfficheMatieres = []
                    // console.log(Matieres);
                    if (Matieres.length > 0) {
                        for (let i = 0; i < Matieres.length; i++) {
                            let { data: matiere, error } = await supabase
                                .from('matieres')
                                .select('*')
                                .eq('id', Matieres[i]);
                            if (error) {
                                console.log('une erreur est survenue ici');
                            } else {

                                AfficheMatieres.push(matiere[0])
                            }
                            
                        }
                    }
                    
                }
            
                // console.log('toutes les matieres de eben',AfficheMatieres.length);
                // console.log(Matieres.length);
                // console.log(allMatData);
            }
            return {eleves , idE, AfficheMatieres}
        }
    }

    data = getAll()
    console.log(data);

    // console.log(data.idE);

        // Utiliser la fonction $ pour rendre le magasin réactif
        let userData = $currentUser;
        // console.log(userData);

        // let etat = userData.etat
        if (userData == {}) {
            location.replace('/')
        }
        
        

        async function allE() {
            
            let { data: matieres, error } = await supabase
            .from('matieres')
            .select('*')

            if (error) {
                location.replace('/')
            } else {
                allEData = matieres
            }
                    
        }

        onMount(async () => {
            try {
                // allE();

            } catch (error) {
                console.error('Erreur lors de la récupération des matieres:', error);
            }
        });

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
        {#if userData.role == 0}
            {#if data.eleves[0].etat == 1}
                <button on:click={desactivation(data.eleves[0].id)} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Desactiver</button>
            {:else}
                <button on:click={activation(data.eleves[0].id)} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Activer</button>
            {/if}
        {/if}
    </div>
        <h1 class="text-center font-bold">{data.eleves[0].nom}</h1>
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
