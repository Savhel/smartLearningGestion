<script>

    import { currentUser } from '../../stores/currentUser';
    import { supabase } from '../../lib/supabaseClient';
	import { onMount } from 'svelte';
    import Modals from '../../components/+modals.svelte';

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
        let email = ""
        let password = ""
        let telephone = null
        let allEnsData = []
        let id
        let nom
        let presence
        

        async function allEns() {

            

            const now = new Date();

            const hours = now.getHours(); // Heures (0-23)
            const minutes = now.getMinutes(); // Minutes (0-59)
            const seconds = now.getSeconds(); // Secondes (0-59)
            const milliseconds = now.getMilliseconds(); // Millisecondes (0-999)

            // console.log("jour", now.getDay());

            let { data: heures, errors} = await supabase
            .from('heures')
            .select('*')
            .lte('debut',`${hours}:${minutes}:${seconds}`)
            .gte('fin',`${hours}:${minutes}:${seconds}`)
            if (errors) {
                console.log(errors);
            }else{
                console.log(heures);
            }
            if (heures.length > 0) {
                let { data: enseignants, error } = await supabase
                .from('dispenser')
                .select('*,enseignants(*)')
                .eq('heure_id', heures[0].id);
    
                if (error) {
                    location.replace('/')
                } else {
                     allEnsData = enseignants
                    // console.log(enseignants);
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
            .from('enseignants')
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

        async function PresentEns(){
            let nouvelleCle = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`

            presence[nouvelleCle] = 1;
            
            const { data, error } = await supabase
            .from('enseignants')
            .update({ presence: presence })
            .eq('id', id)
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
                closeModal()
                return;
            }

        }

        async function AbsentEns(){
            let nouvelleCle = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`

            presence[nouvelleCle] = 0;
            
            const { data, error } = await supabase
            .from('enseignants')
            .update({ presence: presence })
            .eq('id', id)
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
                closeModal()
                return;
            }

        }

    function retour() {
        location.replace('/DashboardAdmin')
    }

  let isModalOpen = false;

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
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
        <button on:click={deconnexion} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Se déconnecter</button>
    </div>
    <h1 class="text-center font-bold">Liste des enseignants du jour</h1>

    <div>
        <!-- Passe la variable isModalOpen en tant que prop isOpen -->
        <Modals isOpen={isModalOpen} on:close={closeModal}>
            <h1 class="text-center text-black font-bold">{nom}</h1>
            <div class="flex justify-between">
                <button on:click={AbsentEns} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Absent</button>
    
                <button on:click={PresentEns} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Présent</button>

            </div>
        </Modals>
    </div>
    <div class="h-[20%] flex-1 flex-col">
        <div class=" flex-col border-blue-700 w-[80%] border-2 rounded-lg mx-auto mt-4">
            {#if allEnsData.length > 0}
                    
                {#each allEnsData as ens}
                    <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-red-500 from-green-500 to-yellow-300 flex">
                        <button on:click={changeId(ens.enseignant_id)} class="w-full h-full flex items-center justify-center"> 
                            <div class={ens.etat == 1 ? "flex-1 items-center justify-center font-bold uppercase" :"flex-1 items-center justify-center " }>{ens.enseignants.nom}</div>
                        </button> 
                    </div>
                {/each}
            {:else}
                <p class="font-bold">Il y'a aucun cours prévu aujourd'hui à cette heure</p>
            {/if}
            
        
        </div>
    </div>
   

</div>
