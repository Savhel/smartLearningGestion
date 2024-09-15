import { supabase } from '../../../lib/supabaseClient';

export async function load({params}){
    // console.log(params);
    const idP = params.parents
    let allClassData = []

    let { data: Class, errors } = await supabase
        .from('classes')
        .select('*')
        

        if (errors) {
            location.replace('/')
        } else {
            allClassData = Class
        }

    let { data: eleves, error } = await supabase
    .from('eleves')
    .select('*, parents(*)')
    .eq('parent_id', idP);

    if (error) {
        console.log(error);
        return
    } else {
        return {eleves, idP, allClassData}
    }
            
}