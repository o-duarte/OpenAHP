///this function adapts the model of database to the model of component treeview 
function addChildren(subcriteria, parent){
    if(subcriteria.length === 0){
        return []
    }
    var subtree = []
    subtree.showChildren = true;
    subtree.editMode =  false;
    subtree.children = [];
    var x;
    for (x in subcriteria){
        var children = {};
        children.name = subcriteria[x].name;
        children.weights = subcriteria[x].weigths
        children.rankReversal = subcriteria[x].rankReversal
        children.showChildren = true;
        children.editMode = false;
        children.id = parent.id.concat([Number(x)])
        if(subcriteria[x].subCriteria.length>0){
            children.children = addChildren(subcriteria[x].subCriteria, children);
        }
        else{
            children.children = []
        }
        subtree.push(children)
    }
    return subtree
}

export function problemToTree(problem){
    var tree = {};
    tree.name = problem.goal;
    tree.alternatives = problem.alternatives
    tree.showChildren = true;
    tree.editMode =  false;
    tree.children = [];
    tree.id = [];
    var criteria;
    for (criteria in problem.criteria){
        var children = {};
        children.name = problem.criteria[criteria].name;
        children.weights = problem.criteria[criteria].weigths 
        children.rankReversal = problem.criteria[criteria].rankReversal
        children.showChildren = true;
        children.editMode = false;
        children.id = tree.id.concat([Number(criteria)])
        children.children = addChildren(problem.criteria[criteria].subCriteria, children);
        /////
        tree.children.push(children)
    }


    return tree;
  };