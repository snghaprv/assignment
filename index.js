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
    
    var is_array =key_name[1].trim().indexOf('[') == 0 && key_name[1].trim().indexOf(']') ==key_name[1].trim().length-1
      // Finding the correct data type from the string. Different handling if the string has '[' and ']' .
      var data_type = is_array ? key_name[1].split('[')[1].split('@unique')[0].split('!')[0].split(']')[0].trim().slice(0,key_name[1].split('@unique')[0].split('!')[0].split(']')[0].length) : key_name[1].split('@unique')[0].split('!')[0].trim();
    
      // If data type is from list of default data types. else checking from the object of custom data types sent.
      if(TYPE_MAP[data_type]){
        r_object[[key_name[0]]]['type'] =TYPE_MAP[data_type] ;
      } else if (custom_type[data_type]){
		      r_object[[key_name[0]]] = returnJSON(custom_type[data_type])
	      } else {
		      throw new Error("data type is not recognised");
	      }
	      // If the field is an array then converting into array.
      if(is_array){
	      r_object[[key_name[0]]] = [r_object[[key_name[0]]]]
      }
      // Checking for required constraint.
      if(key_name[1].indexOf('!')>-1){
        r_object[[key_name[0]]]['required'] = true;
      }
      // Checking for unique constraint.
      if(key_name[1].indexOf('@unique')>-1){
        r_object[[key_name[0]]]['index'] = {unique:true};
      }
      
    f_object[[key_name[0]]] = r_object[key_name[0]];
   
  }
  
  try{
	  JSON.stringify(f_object);
	  return f_object;
  } catch(e){
	  console.log(e);
	  throw new Error("Please check the typed string you have provided!!");
  }

}

module.exports = returnJSON;


