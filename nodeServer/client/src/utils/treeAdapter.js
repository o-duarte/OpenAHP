///this function adapts the model of database to the model of component treeview 
function addChildren(subcriteria){
    if(subcriteria.length == 0){
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
        children.showChildren = false;
        children.editMode = false;
        if(subcriteria[x].subCriteria.length>0){
            children.children = addChildren(subcriteria[x].subCriteria);
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
    tree.showChildren = true;
    tree.editMode =  false;
    tree.children = [];
    var criteria;
    for (criteria in problem.criteria){
        var children = {};
        children.name = problem.criteria[criteria].name;
        children.showChildren = false;
        children.editMode = false;
        children.children = addChildren(problem.criteria[criteria].subCriteria);
        /////
        tree.children.push(children)
    }


    return tree;
  };