<script>

    import { currentUser } from '../../stores/currentUser';
    import { supabase } from '../../lib/supabaseClient';
	import { onMount } from 'svelte';
    import Modals from '../../components/+modals.svelte';
	import { stringify } from 'postcss';

        // Utiliser la fonction $ pour rendre le magasin réactif
        let userData = $currentUser;
        // console.log(userData);

        // let etat = userData.etat
        if (userData == {} || userData == null) {
            location.replace('/')
        }
        let errorInsertEns = false
        let date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        let allEnsData = []
        let id
        let idM
        let idH
        let nomM
        let nom
        let nomClasse
        let presence
        let note
        

        async function allEns() {

            // console.log("bonjour");

            const now = new Date();

            const hours = now.getHours(); // Heures (0-23)
            const minutes = now.getMinutes(); // Minutes (0-59)
            const seconds = now.getSeconds(); // Secondes (0-59)
            const milliseconds = now.getMilliseconds(); // Millisecondes (0-999)


            let { data: heures, errors} = await supabase
            .from('heures')
            .select('*')
            .lte('debut',`${hours}:${minutes}:${seconds}`)
            .gte('fin',`${hours}:${minutes}:${seconds}`)
            if (errors) {
                // console.log(errors);
            }else{
                // console.log(heures);
            }
            if (heures.length > 0) {
                idH = heures[0].id
                let jour = now.getDay() 
                if (now.getDay() == 0) {
                    jour = 7
                }
                let { data: enseignants, error } = await supabase
                .from('dispenser')
                .select('*,enseignants(*),classes(*), matieres(*)')
                .eq('heure_id', heures[0].id)
                .eq('enseignant_id', userData.id)
                .eq('jour_id', jour);
    
                if (error) {
                    location.replace('/')
                } else {
                    // console.log('heure_id', heures[0].id, 'enseignant_id', userData.id, 'jour_id', jour);
                    let { data: eleves, error } = await supabase
                    .from('eleves')
                    .select('*')
                    .eq('classe_id', enseignants[0].classe_id)
                    if (error) {
                        // console.log(error);
                        deconnexion()
                    }else{
                        // console.log(enseignants[0].classes.nom);
                        nomClasse = enseignants[0].classes.nom
                        nomM = enseignants[0].matieres.nom
                        idM = enseignants[0].matiere_id
                        allEnsData = eleves
                    }
          
                }
            }
            
                    
        }

        onMount(async () => {
            try {
                allEns()
                
            } catch (error) {
                console.error('Erreur lors de la récupération des enseignants:', error);
            }
        });

        async function changeId(idC) {
            id = idC
            let { data: enseignants, error } = await supabase
            .from('eleves')
            .select('*')
            .eq('id',idC);

            if (error) {
                location.replace('/')
            }else{
                nom = enseignants[0].nom
                presence = enseignants[0].presence
            }

            openModal()
        }
// console.log(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}` );

        async function noterE(){
            if (!note) {
                return
            }else{

                if (note <= 10 && note >= 0) {

                    const now = new Date();

                    const hours = now.getHours(); // Heures (0-23)
                    const minutes = now.getMinutes(); // Minutes (0-59)
                    const seconds = now.getSeconds(); // Secondes (0-59)
                    const milliseconds = now.getMilliseconds(); // Millisecondes (0-999)


                    let { data: heures, errors} = await supabase
                    .from('heures')
                    .select('*')
                    .lte('debut',`${hours}:${minutes}:${seconds}`)
                    .gte('fin',`${hours}:${minutes}:${seconds}`)
                    if (errors) {
                        console.log(errors);
                    }else{
                        // console.log(heures);
                    }
                    if (heures.length > 0) {
                        idH = heures[0].id
                        let jour = now.getDay()
                        if (now.getDay() == 0) {
                            jour = 7
                        }
                        let { data: enseignants, error } = await supabase
                        .from('dispenser')
                        .select('*,enseignants(*),classes(*), matieres(*)')
                        .eq('heure_id', heures[0].id)
                        .eq('enseignant_id', userData.id)
                        .eq('jour_id', jour);

                        if (error) {
                            location.replace('/')
                        } else {
                            
                            if (enseignants.length > 0 ) {
                                // let mois = new Date().getMonth()+1
                                // console.log(date);
                                presence[date] = note


                                const { data: eleve, errors } = await supabase
                                .from('eleves')
                                .update({ presence: presence })
                                .eq('id', id)
                                .select()
                                
                                if (errors) {
                                    console.log(errors);
                                } else {
                                    let jour = now.getDay() 
                                    if (now.getDay() == 0) {
                                        jour = 7
                                    }
                                    const { data, error } = await supabase
                                    .from('suivre')
                                    .insert([
                                        { eleve_id: id, matiere_id: idM, jour_id: jour, heure_id: idH, note: note, date: date },
                                    ])
                                    .select()
                    
                    
                                    if (error) {
                                        errorInsertEns = true
                                        // console.log(error);
                                        return;
                                    }else{
                                        errorInsertEns = false
                                        allEns()
                                        closeModal()
                                        note = null
                                        return;
                                    }
                                }

                                
                            }else{
                                deconnexion()
                            }

                        }
                    }
                    
                    
                }
            }
                

            

        }


  let isModalOpen = false;

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    errorInsertEns = false
    isModalOpen = false;
  }
  function deconnexion() {
        currentUser.set(null)
        location.replace('/')
    }

</script>

<div class="w-[80%] h-screen items-center justify-center">
    <h1 class="text-center font-bold text-3xl underline uppercase">smart learning</h1>
    <div class="flex">
        <button on:click={deconnexion} class=" w-[50%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Se déconnecter</button>
    </div>
    <h1 class="text-center font-bold underline">M / Me {userData.nom}</h1>
    
    <h1 class="text-center font-bold text-xs text-black">Liste des élèves de {nomClasse} sans note du jour ou absents</h1>
    <h2 class="text-center underline">{nomM}</h2>

    <div>
        <!-- Passe la variable isModalOpen en tant que prop isOpen -->
        <Modals isOpen={isModalOpen} on:close={closeModal}>
            <h1 class="text-center text-black font-bold">{nom}</h1>
            {#if errorInsertEns}
                <h4 class="text-center text-red-500 text-sm">Vous l'avez déjà noté</h4>
            {/if}
            <div class="justify-center items-center flex">

                <input class="text-black border-b-2 border-blue-700" placeholder="note sur 10" type="number" bind:value={note} id="">
            </div>
            <div class="flex justify-between">
                

                    <button on:click={closeModal} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Annuler</button>
        
                    <button on:click={noterE} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Noter</button>
                

            </div>
        </Modals>
    </div>
    <div class="h-[20%] flex-1 flex-col">
        <div class=" flex-col w-[80%]  rounded-lg mx-auto mt-4">
            {#if allEnsData.length > 0}
                    
                {#each allEnsData as ens}
                    {#if !ens.presence[date]}
                         <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-red-500 from-green-500 to-yellow-300 flex">
                            <button on:click={changeId(ens.id)} class="w-full h-full flex items-center justify-center"> 
                                <div class={ens.etat == 1 ? "flex-1 items-center justify-center font-bold uppercase" :"flex-1 items-center justify-center " }>{ens.nom}</div>
                            </button> 
                        </div>
                    {/if}
                       
                {/each}
            {:else}
                <p class="font-bold">Vous n'avez aucun cours prévu aujourd'hui à cette heure</p>
            {/if}
            
        
        </div>
    </div>
   

</div>
