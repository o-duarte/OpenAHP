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
        children.name = subcriteria[x].name +' ('+ subcriteria[x].weight.toFixed(3)+')' ;
        children.ranking = subcriteria[x].ranking.map(function(each_element){
            return Number(each_element.toFixed(3));
        });
        children.consistency = subcriteria[x].consistency
        children.error = subcriteria[x].error
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
    tree.ranking = problem.ranking.map(function(each_element){
        return Number(each_element.toFixed(3));
    });
    tree.error = problem.error
    tree.consistency = problem.consistency
    tree.editMode =  false;
    tree.children = [];
    tree.id = [];
    var criteria;
    for (criteria in problem.criteria){
        var children = {};
        children.name = problem.criteria[criteria].name +' ('+ problem.criteria[criteria].weight.toFixed(3)+')';
        children.ranking = problem.criteria[criteria].ranking.map(function(each_element){
            return Number(each_element.toFixed(3));
        });
        children.error = problem.criteria[criteria].error
        children.consistency = problem.criteria[criteria].consistency
        children.showChildren = true;
        children.editMode = false;
        children.id = tree.id.concat([Number(criteria)])
        children.children = addChildren(problem.criteria[criteria].subCriteria, children);
        /////
        tree.children.push(children)
    }


    return tree;
  };