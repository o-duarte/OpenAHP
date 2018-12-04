import immutable from 'object-path-immutable'
import objectPath from 'object-path'

var ids=[]

export function addAlternative(tree, alternative){
    ids = []
    recursiveSearch(tree)
    var newTree = tree
    ids.forEach(id => {
        var path = ''
        id.forEach(i => {
            path = path + "children."+String(i)+"."
        }); 
        const length = objectPath.get(newTree, path + "matrix").length
        for(var i=0; i<length; i++){
            newTree = immutable.push(newTree, path+'matrix.'+String(i),1)
          }
          newTree = immutable.push(newTree, path + "matrix", Array(length+1).fill(1))
    })
    newTree = immutable.push(newTree, "alternatives", alternative)
    return newTree
}


function recursiveSearch(node){
    if (node.children.length == 0){
        ids.push(node.id)
        return node.id;
    }  
    var children = node.children; 
    var res = [];
    for (var x in children) {         
        if(x== 'children' || x=='editMode' || x=='showChildren' ){ }
        else{
            res.push(recursiveSearch(children[x]))
        }
    }
    return res;
 }
