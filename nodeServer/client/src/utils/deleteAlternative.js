import immutable from 'object-path-immutable'
import objectPath from 'object-path'

export function deleteAlternative(tree, index){
    console.log(tree)
    console.log(recursiveSearch(tree))
}
function recursiveSearch(node){
    console.log(node)
    if (node.children == [])
        return [node.id];
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