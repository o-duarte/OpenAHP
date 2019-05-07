var Rows = [] ;
var cols = 0 ; 

function subrows(subcriteria,alternatives, parentRow, actualIndex){
        if(actualIndex>cols){
            cols = actualIndex;
        }
        for (var i = 0; i < alternatives.length; i++){
            var row = Object.create(parentRow)
            row[(actualIndex+1).toString()]= subcriteria.name
            row.alternative = alternatives[i]
            row.rank = subcriteria.ranking[i].toFixed(4);
            Rows.push(row)
        }
        for( var j = 0; j < subcriteria.subCriteria.length; j++){
                 subrows(subcriteria.subCriteria[j],alternatives, row, actualIndex+1)
        }
}


export function resultToRows(data){
    Rows = [];
    for (var i = 0; i< data.alternatives.length; i++){
        var row  = {}
        row["1"] = data.goal
        row.alternative = data.alternatives[i]
        row.rank = data.ranking[i].toFixed(4);
        Rows.push(row)
    }
    for (var x in data.criteria){
        for (i = 0; i< data.alternatives.length; i++){
            row  = {}
            row["1"] = data.criteria[x].name
            row.alternative = data.alternatives[i]
            row.rank = data.criteria[x].ranking[i].toFixed(4);
            Rows.push(row)
        }
        for( var j = 0; j < data.criteria[x].subCriteria.length; j++){
            subrows(data.criteria[x].subCriteria[j],data.alternatives, row, 1)
        }
    }
    return {Rows, cols};
}