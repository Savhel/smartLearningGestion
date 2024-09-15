<script>
    import { supabase } from '../lib/supabaseClient';
    import { currentUser } from '../stores/currentUser';
    import { replaceState } from '$app/navigation';
    import { onDestroy } from 'svelte';

    let login = "";
    let loginParent = "";
    let password = "";
    let errorEns = false;
    let errorParent = false;
    let parent = false;
    let userData;

    // S'abonner aux changements du magasin currentUser
    const unsubscribe = currentUser.subscribe(value => {
        userData = value;
        console.log(userData);
    });

    // Se désabonner lorsque le composant est détruit
    onDestroy(() => {
        unsubscribe();
    });

    async function checkDataExistence(table) {
        if (table == 1) {
            const { data, error } = await supabase
                .from('enseignants')
                .select('*')
                .eq('nom', login)
                .eq('password', password)
                .eq('etat', 1);

            if (error) {
                errorEns = true;
                return;
            }

            if (data.length > 0) {
                // console.log('Data exists:', data);
                currentUser.set(data[0]);
                let userData = $currentUser
                console.log(userData);
                 // replaceState('/DashboardAdmin'); // Utiliser replaceState pour une navigation plus fluide
                 if (data[0].role == 0) {
                     location.replace('/DashboardAdmin');
                 } 
                 if (data[0].role == 1 && data[0].etat == 1) {
    
                        let nouvelleCle = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`
                        if (data[0].presence[nouvelleCle] == 1) {
                            
                            location.replace('/DashboardEns');
                        }

                    
                 }
                 if (data[0].role == 2 && data[0].etat == 1) {
                    location.replace('/DashboardRecep');
                    
                 }
            } else {
                errorEns = true;
                console.log('Data does not exist');
            }
        } else {
            const { data, error } = await supabase
                .from('parents')
                .select('*')
                .eq('telephone', loginParent);

            if (error) {
                console.error('Error fetching data:', error.message);
                return;
            }

            if (data.length > 0) {
                // console.log('Data exists:', data);
                currentUser.set(data[0]);
                location.replace('/DashboardParent/'+data[0].id)
            } else {
                console.log('Data does not exist');
            }
        }
    }

    function seConnecter() {
        errorEns = false;

        if (!login || !password || hasSpecialCharacters(login) || hasSpecialCharacters(password)) {
            errorEns = true;
            return;
        } else {
            checkDataExistence(1);
        }
    }

    function hasSpecialCharacters(input) {
        const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        return regex.test(input);
    }

    function seConnecterParent() {
        errorParent = false;
        if (!loginParent || hasSpecialCharacters(loginParent)) {
            errorParent = true;
            return;
        }else {
            checkDataExistence(0);
        }
    }

    function changeUserConnection() {
        parent = !parent;
        login = "";
        loginParent = "";
        password = "";
        errorEns = false;
        errorParent = false;
    }
</script>

<div class="flex flex-col items-center justify-center flex-1 p-[24px]">
    {#if parent}
        <form class="g-8 flex flex-col w-[400px] max-w-full mt-0 m-auto">
            <h1 class="text-center text-3xl font-bold uppercase">Smart learning</h1>
            <h1 class="text-center text-xl font-bold">Bienvenue cher parent</h1>
            {#if errorParent}
                <p class="text-red-500 text-sm text-center">Informations incorrectes</p>
            {/if}
            <label class="position-relative border-2 border-blue-700 rounded-lg mt-5">
                <p class={loginParent ? "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.8rem] font-semibold bg-blue-700 border-blue-300" : "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.8rem] top-[50%] left-[6px] opacity-0"}>Numéro de téléphone</p>
                <input bind:value={loginParent} class="w-[80%] mt-2 rounded-md focus:outline-none text-center p-[4px] bg-transparent text-white" type="text" placeholder="Numéro de téléphone">
            </label>
            <button on:click={seConnecterParent} class="font-size-[1.5rem] bg-blue-700 text-white border-none mt-3 hover:bg-transparent rounded-lg cursor-pointer p-3" type="button">Se connecter</button>
        </form>
    {:else}
        <form class="g-8 flex flex-col w-[400px] max-w-[80%] mt-0 m-auto">
            <h1 class="text-center text-3xl font-bold uppercase">Smart learning</h1>
            <h1 class="text-center text-xl font-bold">Enseignants</h1>
            {#if errorEns}
                <p class="text-red-500 text-sm text-center">Informations incorrectes</p>
            {/if}
            <label class="position-relative border-2 border-blue-700 rounded-lg mt-5">
                <p class={login ? "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.8rem] font-semibold bg-blue-700 border-blue-300" : "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.8rem] top-[50%] left-[6px] opacity-0"}>Login</p>
                <input bind:value={login} class="w-[80%] mt-2 rounded-md focus:outline-none text-center p-[4px] bg-transparent text-white" type="text" placeholder="Login">
            </label>
            <label class="position-relative border-2 border-blue-700 rounded-lg mt-5">
                <p class={password ? "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.8rem] font-semibold bg-blue-700 border-blue-300" : "position absolute translate-y-[-55%] pointer-events-none text-white rounded-lg p-2 text-[0.8rem] top-[50%] left-[6px] opacity-0"}>Mot de passe</p>
                <input bind:value={password} class="w-[80%] mt-2 rounded-md focus:outline-none text-center p-[4px] bg-transparent text-white" type="password" placeholder="Mot de passe">
            </label>
            <button on:click={seConnecter} class="font-size-[1.5rem] bg-blue-700 text-white border-none mt-3 hover:bg-transparent rounded-lg cursor-pointer p-3" type="button">Se connecter</button>
        </form>
    {/if}

    {#if !parent}
        <button type="button" on:click={changeUserConnection} class="font-size-[1.5rem] bg-yellow-700 text-white border-none mt-3 hover:bg-transparent rounded-lg cursor-pointer p-3">Parents ?</button>
    {:else}
        <button type="button" on:click={changeUserConnection} class="font-size-[1.5rem] bg-yellow-700 text-white border-none mt-3 hover:bg-transparent rounded-lg cursor-pointer p-3">Enseignants ?</button>
    {/if}
</div>