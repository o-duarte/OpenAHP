///this function adapts the model of tree to the model of database 
function addChildren(children){
    if(children.length == 0){
        return []
    }
    var subtree = []
    subtree.subcriteria = [];
    delete children.editMode
    delete children.showChildren
    var x;
    for (x in children){
        if(x=='children'){

        }
        else{
            var subcriteria = {};
            subcriteria.name = children[x].name;
            subcriteria.matrix = children[x].matrix
            if(children[x].children.length>0){
                subcriteria.subCriteria = addChildren(children[x].children);
            }
            else{
                subcriteria.subCriteria = []
            }
            subtree.push(subcriteria)
        }    
    }
    return subtree
}

export function treeToProblem(tree){
    var problem = {};
    problem.goal = tree.name;
    problem.alternatives = tree.alternatives
    problem.rootMatrix = tree.rootMatrix
    problem.criteria = [];
    var x;
    for (x in tree.children){
        var criteria = {};
        criteria.name = tree.children[x].name;
        criteria.matrix = tree.children[x].matrix
        criteria.subCriteria = addChildren(tree.children[x].children);
        /////
        problem.criteria.push(criteria)
    }


    return problem;
  };