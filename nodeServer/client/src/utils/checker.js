///this function adapts the model of database to the model of component treeview 
function checkChildren(children){
    console.log(children)
    if(children.subCriteria.length === 0){
                    return true
                }
    const criteriaSet = new Set();
    var ret = true;
    children.subCriteria.forEach(criteria => {
                    criteriaSet.add(criteria.name)
                    ret = ret && checkChildren(criteria)
                });
    if(criteriaSet.size !== children.subCriteria.length){
                    ret = false
                }
    return ret
}
export function check(problem){
    const criteriaSet = new Set();
    const alternativeSet = new Set(problem.alternatives);
    if(alternativeSet.size !== problem.alternatives.length){
        return 1
    }

    var ret = true;
    JSON.parse(problem.rawCriteria).forEach(criteria => {
                    criteriaSet.add(criteria.name)
                    ret = ret && checkChildren(criteria)
                });
    if(criteriaSet.size !== JSON.parse(problem.rawCriteria).length){
                    ret = false
                }
    if(ret){
                    return 0
                }


    return 1;
  };