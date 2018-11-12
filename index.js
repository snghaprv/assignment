/*
* This function will take typed string as arg1
* and custom types as arg2 and return the JSON,
* which will be passed as param to mongoose.Schema() function.
* */
function returnJSON(string,custom_type = {}) {
/*
* Spliting the typed string on new-lines and
* parsing the tokens from 3rd element.
* */
  var str = string.split(`\n`);
  var remaining = str.slice(2,-2)
  
  const TYPE_MAP = {
    'String': String,
    'Int' : Number,
    'Date': Date,
    'Boolean': Boolean
  }
  
  /* final object will be returned and
   * will have all the properties of individual keys.
  * */
  var f_object = {}
  for(element in remaining){
    
    remaining[element] = remaining[element].trim(',');
    var key_name = remaining[element].split(':')
      /*
      * r_object is iterated to generate object for each key.
      * */
      
    var r_object = {[key_name[0]]: {}}
    
    
   if( key_name[1].trim().indexOf('[') == 0 && key_name[1].trim().indexOf(']') ==key_name[1].trim().length-1 ){
        
        var custom_key = key_name[1].slice(2,-1);
        if(custom_type[custom_key]){
	        r_object[[key_name[0]]] = [returnJSON(custom_type[custom_key])]
        } else{
	        throw new Error("Custom type is not recognised");
        }
   
   } else {
      var data_type = key_name[1].split('!')[0].trim();
    
      if(TYPE_MAP[data_type]){
        r_object[[key_name[0]]]['type'] =TYPE_MAP[data_type] ;
      } else {
	      throw new Error("Basic type is not recognised");
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
  
  try{
      console.log(f_object)
	  JSON.stringify(f_object);
	  return f_object;
  } catch(e){
	  console.log(e);
	  throw new Error("Please check the typed string you have provided!!");
  }

}

module.exports = returnJSON;


