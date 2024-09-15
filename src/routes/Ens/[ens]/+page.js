import { supabase } from '../../../lib/supabaseClient';

export async function load({params}){
    // console.log(params);
    const idEns = params.ens


    let { data: enseignants, error } = await supabase
    .from('enseignants')
    .select('*')
    .eq('id', idEns);

    if (error) {
        console.log(error);
        return
    } else {
        return {enseignants}
    }
            
}