<script>
    import { currentUser } from '../../stores/currentUser';

    // Utiliser la fonction $ pour rendre le magasin réactif
    let userData = $currentUser;
    console.log(userData);

    // let etat = userData.etat
    if (userData == {}) {
        location.replace('/')
    }
    function deconnexion() {
        currentUser.set(null)
        location.replace('/')
    }
</script>

<div class="flex flex-col w-[80%]  h-[50%] rounded-lg">
    <h1 class="text-center font-bold text-3xl underline uppercase">smart learning</h1>

    <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-red-500 from-green-500 to-yellow-300 flex">
        <a href="/ListeEns" class="w-full h-full flex items-center justify-center">
            <div class="flex-1 items-center justify-center">Enseignants</div>
        </a> 
    </div>
    <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-green-500 from-red-500 to-yellow-300 flex">
        <a href="/ListeG" class="w-full h-full flex items-center justify-center">
            <div class="flex-1 items-center justify-center">Gérants</div>
        </a>
    </div>
    <div class="w-full mt-2 rounded-2xl h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-yellow-500 from-red-500 to-green-300 flex">
        <a href="/ListeE" class="w-full h-full flex items-center justify-center">
            <div class="flex-1 items-center justify-center">Elèves</div>
        </a>
    </div>
    <div class="w-full mt-2 rounded-2xl mb-2 h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-red-500 from-yellow-500 to-green-300 flex">
        <a href="/ListeP" class="w-full h-full flex items-center justify-center">
            <div class="flex-1 items-center justify-center">Parents</div>
        </a>
    </div>

    <div class="w-full mt-2 rounded-2xl mb-2 h-[24%] border-x-1 border-blue-700 items-center justify-center text-center bg-gradient-to-r via-blue-600 from-green-600 to-red-500 flex">
        <button on:click={deconnexion}  class="w-full h-full flex items-center justify-center">
            <div class="flex-1 items-center justify-center">Se deconnecter</div>
        </button>
    </div>

</div>