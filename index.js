
function returnJSON(string) {

  var str = string.split(`\n`);
  var remaining = str.slice(2,-2)
  const TYPE_MAP = {
    'String': String,
    'Int' : Number,
    'Date': Date,
    'Boolean': Boolean
  }
  
  var f_object = {}
  for(element in remaining){
    
    remaining[element] = remaining[element].trim(',');
    var key_name = remaining[element].split(':')
    
    var r_object = {[key_name[0]]: {}}
    
   if( key_name[1].trim().indexOf('[') == 0 && key_name[1].trim().indexOf(']') ==key_name[1].trim().length-1 ){
     //r_object[[key_name[0]]] = key_name[1]
   
   } else {
      var data_type = key_name[1].split('!')[0].trim();
    
      if(TYPE_MAP[data_type]){
        r_object[[key_name[0]]]['type'] =TYPE_MAP[data_type] ;
      }
    
      if(key_name[1].indexOf('!')>-1){
        r_object[[key_name[0]]]['required'] = true;
      }
      if(key_name[1].indexOf('@unique')>-1){
        r_object[[key_name[0]]]['index'] = {unique:true};
      }
    
    }
    
    f_object[[key_name[0]]] = r_object[key_name[0]];
   
  }
  return f_object;
}

module.exports = returnJSON;


