import { supabase } from '../../../../lib/supabaseClient';

export async function load({params}){
    console.log(params);
    // const idEns = params.ens


    let { data: donnees, error } = await supabase
    .from('suivre')
    .select('*, eleves(*),matieres(*)')
    .eq('eleve_id', params.eleves)
    .eq('matiere_id', params.matieres);

    if (error) {
        console.log(error);
        return
    } else {
        console.log(donnees);
        return {donnees}
    }
            
}