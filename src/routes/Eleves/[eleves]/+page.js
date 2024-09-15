import { supabase } from '../../../lib/supabaseClient';

    let allMatData = []
    let Matieres = []
    let AfficheMatieres = []
    
export async function load({params}){
    // console.log(params);
    const idE = params.eleves
    console.log('erreur')


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

