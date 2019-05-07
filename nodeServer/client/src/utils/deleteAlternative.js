import immutable from 'object-path-immutable'
import objectPath from 'object-path'

var ids=[]

export function deleteAlternative(tree, index){
    ids = []
    recursiveSearch(tree)
    var newTree = tree
    ids.forEach(id => {
        var path = ''
        id.forEach(i => {
            path = path + "children."+String(i)+"."
        }); 
        const length = objectPath.get(newTree, path + "matrix."+String(index)).length
        for(var i=0; i<length; i++){
            newTree = immutable.del(newTree, path+'matrix.'+String(i)+'.'+String(index))
          }
          newTree = immutable.del(newTree, path + "matrix."+String(index))
    })
    newTree = immutable.del(newTree, "alternatives." + String(index))
    return newTree
}


function recursiveSearch(node){
    if (node.children.length === 0){
        ids.push(node.id)
        return node.id;
    }  
    var children = node.children; 
    var res = [];
    for (var x in children) {         
        if(x=== 'children' || x==='editMode' || x==='showChildren' ){ }
        else{
            res.push(recursiveSearch(children[x]))
        }
    }
    return res;
 }
