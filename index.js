/** Global Variables */
var fa = ['alphabets','variables','start','final'];
var alphabets = []; 
var variables = []; 
var start = []; // contains the variable names of start state 
var final = []; // contains the variable names of final state 
var variableNodeList = []; //contains variable objects
var transitions = []; // transitions with Epsilon
var non_e_transitions = []; //transitions without Epsilon
var columns = [];//transitions of dfa
var dfa_variables = [];
var relabel_dfa_variables = [];
var reachable_state_nodes = [];
var reachable_state = [];
var all_state = [];
var groupingNodes = [];
var group_count = 1;
var group_list = [[],[]];
var group_nodes = [];
var final_grouped_dfa_nodes = [];

/** Classes */
/*A general class to hold the properties of a variable*/
class variableNode{
  

  constructor(name, stateType){
    this.name = name; //name of the variable
    this.stateType = stateType; // to state whether start, final or both
    this.alphabetLinkList = []; // array of objects of transition alphabets and the destination of the transition
  }

  addAlphabetLink(alphabetLink){
    //adding links of alphabets and its destination to the variable object
    this.alphabetLinkList.push(alphabetLink);
  }

  resetAlphabetLink(){
    this.alphabetLinkList = [];
  }

}

/**A general class that defines an alphabet transition for a variable 
 * and the destination of the variable with a particular alphabet */
class alphabetLink{
  //an array of destination nodes
  constructor(symbol,destinationNodes){
    this.symbol = symbol;
    this.destinationNodes = destinationNodes;
  }

}

/**A class that acts like a container that holds variables.
 * It can be known as 'group' when proceeding to minimization of DFA
 */
class groupNodes{
  constructor(name, nodeList = []){
    this.name = name;
    this.nodeList = nodeList;
  }


  addNodes(nodes){
    this.nodeList.push(nodes);
  }

}

/** Functions */
/** Function to check if two arrays are equal */
function arraysEqual(a,b) {
  /*
      Array-aware equality checker:
      Returns whether arguments a and b are == to each other;
      however if they are equal-lengthed arrays, returns whether their 
      elements are pairwise == to each other recursively under this
      definition.
  */
  if (a instanceof Array && b instanceof Array) {
      if (a.length!=b.length)  // assert same length
          return false;
      for(var i=0; i<a.length; i++)  // assert each element equal
          if (!arraysEqual(a[i],b[i]))
              return false;
      return true;
  } else {
      return a==b;  // if not both arrays, should be the same
  }
}

/** Display function: format user input and save into e-nfa transition table ***/
function format_input_transition_table(){
  var fa_table = document.getElementById("fa-table");
  var transition_table = document.getElementById("transition-table");
  var i;
  var j;
  var k = 0;

  /*** taking from fa-table and put into transition-table ***/
  for(i = 0; i<fa_table.rows.length; i++){
    if(i == 0){
      for(j=1; j<fa_table.rows[i].cells.length; j++){
        
        if(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value == ''){
          break;
        }
        else{
          alphabets.push(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value);
        }
      }
    }
    else if(i == 1){
      for(j=1; j<fa_table.rows[i].cells.length; j++){
        
        if(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value == ''){
          break;
        }
        else{
          variables.push(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value);
        }
      }
    }
    else if(i == 2){
      for(j=1; j<fa_table.rows[i].cells.length; j++){
        
        if(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value == ''){
          break;
        }
        else{
          start.push(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value);
        }
      }
    }
    else{
      for(j=1; j<fa_table.rows[i].cells.length; j++){
       
        if(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value == ''){
          break;
        }
        else{
          final.push(fa_table.rows[i].cells[j].getElementsByTagName('input')[0].value);
        }
      }
    }
  }

  //adding the > and * to whether start states or finals states
  //to display them in the transition table
  for(i = 0; i<transition_table.rows.length; i++){
    var variable_string;
    var start_symbol = '&#129058;';
    var final_symbol = '*';
    if(i == 0){
      for(j=0; j<transition_table.rows[i].cells.length; j++){
        if(alphabets[j] == null){
          break;
        }
        if(alphabets[j] == 'Epsilon'){
          transition_table.rows[i].cells[j+1].innerHTML = '&epsilon;';
        }
        else{
          transition_table.rows[i].cells[j+1].innerHTML = alphabets[j];
        }
        
        console.log(alphabets[j])
        console.log(transition_table.rows[i].cells[j]);
      }
    }
    
    if(i == 0){
      continue;
    }

    if(variables[k] == null){

      break;

    }else{
      if(start.includes(variables[k]) && final.includes(variables[k])){

        variable_string = final_symbol.concat(variables[k]);
        var temp = variable_string;
        variable_string = start_symbol.concat(temp);

      }else if(start.includes(variables[k])){

        variable_string = start_symbol.concat(variables[k]);

      }else if(final.includes(variables[k])){

        variable_string = final_symbol.concat(variables[k]);

      }
      else{
        variable_string = variables[k];
      }

      transition_table.rows[i].cells[0].innerHTML = variable_string;
      variable_string = " ";
      k++;
    }
  }
}

/*** From the user input, initialise all the variables(state) objects ***/
function initialise_variable_nodes(){

  //intialising and creating the variable nodes
  for(var i = 0; i<variables.length; i++){
    if (start.includes(variables[i]) && final.includes(variables[i])){
      variableNodeList.push(new variableNode(variables[i],["start","final"]));
    }
    else if (start.includes(variables[i]) && (!final.includes(variables[i]))){
      variableNodeList.push(new variableNode(variables[i],["start"]));
    }
    else if (!start.includes(variables[i]) && (final.includes(variables[i]))){
      variableNodeList.push(new variableNode(variables[i],["final"]));
    }
    else {
      variableNodeList.push(new variableNode(variables[i],["null"]))
    }
    
  }   

}

/*** From the user input, save all the transition with Epsilon in a dynamic array ***/
function get_transitions(){
  
  var transition_table = document.getElementById("transition-table");
  
  //extacting the transitions of the variables
  for(var i = 1; i<transition_table.rows.length; i++){

    //create a new dynamic array
    transitions.push([]);

    for(var j= 1 ; j<transition_table.rows[i].cells.length; j++){
      var str = transition_table.rows[i].cells[j].getElementsByTagName('input')[0].value;

      //if input is null set (no destination)
      if(str == "/"){
        transitions[i-1].push(["null"]);
        continue;
      }

      //if the index is at empty or out of the size of transition table
      if(str == " "){
        break;
      }

      //by str.split(","), it will form into an array
      // a,b -> ["a","b"]
      transitions[i-1].push(str.split(","));
      
    }
  }
}

/** Implementation of the Conversion Theory: 
 * If Start state can reach Final State with Epsilon, then start state is also a Final State */
function check_start_state_for_epsilon(){
  //if start state already in final state then pass
  var start_state_name = start[0];
  var start_state_index;

  if(final.includes(start_state_name)){
    return 0;
  }

  //if not, check for epsilon of start state
  for(var i = 0; i < variableNodeList.length; i++){
    if(variableNodeList[i].name == start_state_name){
      start_state_index = i;
      break;
    }
  }

  //get the destinations of Epsilon for the start state
  var start_state_epsilon_destination = variableNodeList[start_state_index].alphabetLinkList[alphabets.indexOf("Epsilon")].destinationNodes;

  //check if the destination is a final state
  for(var i = 0; i < start_state_epsilon_destination; i++){
    if(final.includes(start_state_epsilon_destination[i])){
      variableNodeList[start_state_index].stateType.push("final");
      final.push( variableNodeList[start_state_index].name);
      final.sort();
      break;
    }
  }
}

/*** From the transition table, we associate an array of destinations to the variable states
 * In which, for a variable, with an alphabet, it can reach some destinations ***/
function initialise_original_destination(){
  for(var i = 0; i < variables.length; i++){
    for(var j = 0; j < alphabets.length; j++){
      variableNodeList[i].addAlphabetLink(new alphabetLink(alphabets[j],transitions[i][j]));
    }
  }
}

/*** Display function: Output the table where user input transitions into a fix drop-down table ***/
function display_transitions(){

  var variable_string;
  var start_symbol = '&#129058;';
  var final_symbol = '*';
  var transition_table = document.getElementById("transition-table");
  var original_transition_table = document.getElementById("original-transition-table");

  for(var i = 0; i<transition_table.rows.length; i++){
    for(var j= 0 ; j<transition_table.rows[i].cells.length; j++){
      //header of the table is innerHTML
      if(i==0){
        original_transition_table.rows[i].cells[j].innerHTML = transition_table.rows[i].cells[j].innerHTML;
        console.log(transition_table.rows[i].cells[j].innerHTML);
        continue;
      }

      //first column of the table is innerHTML
      if(j==0)
      {
        if(i<=variables.length){
          if(arraysEqual(variableNodeList[i-1].stateType,["start","final"])){

            variable_string = final_symbol.concat(variableNodeList[i-1].name);
            var temp = variable_string;
            variable_string = start_symbol.concat(temp);
      
          }else if(arraysEqual(variableNodeList[i-1].stateType,["start"])){
      
            variable_string = start_symbol.concat(variableNodeList[i-1].name);
      
          }else if(arraysEqual(variableNodeList[i-1].stateType,["final"])){
      
            variable_string = final_symbol.concat(variableNodeList[i-1].name);
      
          }
          else{
            variable_string = variableNodeList[i-1].name;
          }
      
          original_transition_table.rows[i].cells[j].innerHTML = variable_string;
          variable_string = " ";
        }
        else{
          original_transition_table.rows[i].cells[j].innerHTML = transition_table.rows[i].cells[j].innerHTML;
        }

        continue;
      }

      //display the empty sign
      if(transition_table.rows[i].cells[j].getElementsByTagName('input')[0].value == "/")
      {
        original_transition_table.rows[i].cells[j].innerHTML = "&empty;"

        continue;
      }

      original_transition_table.rows[i].cells[j].innerHTML = transition_table.rows[i].cells[j].getElementsByTagName('input')[0].value;

    }
  }
}

/*** e-closure helps to get all the possible destinations if the alphabet is Epsilon
 returns an array of possible destinations ***/
function e_closure(i){
  var output_transition = [];
  var original_variable = [];

  original_variable.push(variableNodeList[i].name); // Add itself into the array
  output_transition = output_transition.concat(variableNodeList[i].alphabetLinkList[alphabets.indexOf("Epsilon")].destinationNodes);
  output_transition = output_transition.concat(original_variable); //add all the available transitions into an array
  output_transition.sort(); // sort them numerically or alphabetically

  return output_transition;
} 

/*** Turns e-nfa transitions to nfa transitions, also deleting Epsilon from the alphabets
 * Returns non_e_transitions dynamic array
*/
function remove_epsilon(){
  for(var i=0; i < variables.length; i++){ // loop for all the variables
    non_e_transitions.push([]);

    for(var j =0; j < alphabets.length-1; j++){ // loop for all the alphabets available
      var first_closure = []; //first step
      var to_variable = []; //second step
      var final_transition = []; //third step
      first_closure = e_closure(i);
      first_closure = [...new Set(first_closure)] //filter out and get only the unique variables
      
      for(var k = 0; k < first_closure.length; k++){ //get all the destinations that the variable can go with the alphabet
        if(first_closure[k] == "null"){
          continue;
        }
        to_variable = to_variable.concat(variableNodeList[variables.indexOf(first_closure[k])].alphabetLinkList[j].destinationNodes);
      }

      to_variable = to_variable.filter(function(item) { //remove null (null means empty)
      return item !== "null";
      });
      
      for(var k = 0; k < to_variable.length; k++){

        var x = e_closure(variables.indexOf(to_variable[k]),alphabets.indexOf('Epsilon')); // for every variable in to_variable, perform another e-closure
        final_transition = final_transition.concat(x);
        
      }
      
      final_transition = [...new Set(final_transition)] // take only the unique

      final_transition = final_transition.filter(function(item) { // remove the null
      return item !== "null";
      });

      final_transition.sort();

      non_e_transitions[i].push(final_transition); //add them into a new transition array
    }
  }
  alphabets = alphabets.filter(function(item) { // remove the epsilon of the alphabet
    return item !== "Epsilon";
    })
}

/* Display function: Output e-nfa transitions to a drop-down table */
function display_non_e_transitions(){
  var non_e_transition_table = document.getElementById("non-e-transition-table");
  var variable_string;
  var start_symbol = '&#129058;';
  var final_symbol = '*';
  

  //initialise header and side column
  for(var i = 0; i<variables.length; i++){
    if(i == 0){
      for(var j= 0 ; j<alphabets.length; j++){
        //header first
        non_e_transition_table.rows[i].cells[j+1].innerHTML = alphabets[j];
      }
    }

    if(start.includes(variables[i]) && final.includes(variables[i])){

      variable_string = final_symbol.concat(variables[i]);
      var temp = variable_string;
      variable_string = start_symbol.concat(temp);

    }else if(start.includes(variables[i])){

      variable_string = start_symbol.concat(variables[i]);

    }else if(final.includes(variables[i])){

      variable_string = final_symbol.concat(variables[i]);

    }
    else{
      variable_string = variables[i];
    }

    non_e_transition_table.rows[i+1].cells[0].innerHTML = variable_string;
    variable_string = " ";

    for(var j = 0; j < alphabets.length; j++){
      if(non_e_transitions[i][j].length == 0){
        non_e_transition_table.rows[i+1].cells[j+1].innerHTML = "&empty;"
      }
      else{
        non_e_transition_table.rows[i+1].cells[j+1].innerHTML = non_e_transitions[i][j];
      }
    }
  }
}

/* Reset the alphabet links for the original variables */
function reset_destinations(){
  for(var i = 0; i < variableNodeList.length; i++){
    variableNodeList[i].resetAlphabetLink();
  }
}

/*** From the non-e-transition table, we associate a new array of destinations to the variable states ***/
function initialise_non_e_destination(){
  var empty = ["&empty;"];
  for(var i = 0; i < variables.length; i++){
    for(var j = 0; j < alphabets.length; j++){
      if(non_e_transitions[i][j].length == 0){
        variableNodeList[i].addAlphabetLink(new alphabetLink(alphabets[j],empty));
      }
      else{
        variableNodeList[i].addAlphabetLink(new alphabetLink(alphabets[j],non_e_transitions[i][j]));
      }
    }
  }
}

/**Display Function: To display message after the second proceed button */
function save_sucessful_alert(){
  var save_successful = document.getElementById("save-successful");
  save_successful.innerHTML = "<div class=\"alert alert-primary\" role=\"alert\">Transitions successfully generated.<br>Clicked on the buttons to view.</div>";
}

/*** This function returns an array containing all the unique combinations of the variables ***/
function getCombinations(variable_set) {
  var result = [];
  var f = function(prefix, variable_set) {
    for (var i = 0; i < variable_set.length; i++) {
      result.push(prefix + variable_set[i]);
      f(prefix + variable_set[i], variable_set.slice(i + 1));
    }
  }
  f('', variable_set);
  console.log(result)

  return result;
}

/*** This function performs union operation on two destination states and return an array containing the resulting states ***/
function concat_destinations(variable1, variable2)
{
  var result = [... new Set(variable1.concat(variable2))]
  if(result.some(v=> variables.indexOf(v) !== -1)){
    result = result.filter(function(item) {
      return item !== "&empty;";
    });
  }

  result.sort();
  return result;
}

/*** This function check if the new combiantion of variable is a final state and returns "final" if true ***/
function get_state(combination_name)
{
  for(var i = 0; i<final.length; i++){
    if(combination_name.includes(final[i])){
      return ["final"];
    }
    else{
      if(i == final.length-1){
        return ["null"];
      }
    }
  }

}

/*** Function to convert NFA to DFA ***/
function create_dfa_variables()
{
  //remove epsilon from alphabets list
  var index = alphabets.indexOf("Epsilon");

  if (index > -1) {
    alphabets.splice(index, 1);
  }

  //add new variable "Z"
  dfa_variables.push(new variableNode("&empty;", ["null"]));
  dfa_variables[0].addAlphabetLink(new alphabetLink("0",["&empty;"]));
  dfa_variables[0].addAlphabetLink(new alphabetLink("1",["&empty;"]));

  //find all combinations of variables
  var combinations = getCombinations(variables);
  //combinations = combinations.filter(val => !variables.includes(val));
  combinations = combinations.filter(function(val) {
    return variables.indexOf(val) == -1;
  });

  //add in existing variables
  for(i=1; i<variableNodeList.length+1; i++)
  {
    dfa_variables.push(new variableNode(variableNodeList[i-1].name,variableNodeList[i-1].stateType));
    for(j=0; j<variableNodeList[i-1].alphabetLinkList.length;j++)
    {
      dfa_variables[i].addAlphabetLink(new alphabetLink(variableNodeList[i-1].alphabetLinkList[j].symbol, variableNodeList[i-1].alphabetLinkList[j].destinationNodes));
    }
  }

  //create and add combinations of variables
  for(i=variables.length+1; i<variables.length+combinations.length+1; i++)
  {
    console.log("combinations array");
    console.log(combinations[i-(variables.length+1)]);
    var state = get_state(combinations[i-(variables.length+1)]);
    dfa_variables.push(new variableNode(combinations[i-(variables.length+1)], state));//statetype still pending
  }

  var variableNodeList_names = [];
  for(i=0; i<variableNodeList.length; i++)
  {
    variableNodeList_names.push(variableNodeList[i].name);
  }

  //add alphabet links for each variables
  for(k=0; k<alphabets.length; k++)
  {
    for(i=variables.length+1; i<dfa_variables.length; i++)
    {
      if(dfa_variables[i].name.length == 2)
      {
        var c =0;
        var char1 = dfa_variables[i].name.charAt(0);
        var char2 = dfa_variables[i].name.charAt(1);

        if(variableNodeList_names.includes(char1))
        {
          var des = variableNodeList[(variableNodeList_names.indexOf(char1))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(variableNodeList_names.includes(char2))
        {
          var des2 = variableNodeList[(variableNodeList_names.indexOf(char2))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(c==2){dfa_variables[i].addAlphabetLink(new alphabetLink(k.toString(), concat_destinations(des, des2)));}
      }
      else if(dfa_variables[i].name.length == 3)
      {
        var c =0;
        var char1 = dfa_variables[i].name.charAt(0);
        var char2 = dfa_variables[i].name.charAt(1);
        var char3 = dfa_variables[i].name.charAt(2);
        if(variableNodeList_names.includes(char1))
        {
          var des = variableNodeList[(variableNodeList_names.indexOf(char1))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(variableNodeList_names.includes(char2))
        {
          var des2 = variableNodeList[(variableNodeList_names.indexOf(char2))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(variableNodeList_names.includes(char3))
        {
          var des3 = variableNodeList[(variableNodeList_names.indexOf(char3))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(c==3){dfa_variables[i].addAlphabetLink(new alphabetLink(k.toString(), concat_destinations(concat_destinations(des, des2),des3)));}
      }
      else if(dfa_variables[i].name.length == 4)
      {
        var c =0;
        var char1 = dfa_variables[i].name.charAt(0);
        var char2 = dfa_variables[i].name.charAt(1);
        var char3 = dfa_variables[i].name.charAt(2);
        var char4 = dfa_variables[i].name.charAt(3);
        if(variableNodeList_names.includes(char1))
        {
          var des = variableNodeList[(variableNodeList_names.indexOf(char1))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(variableNodeList_names.includes(char2))
        {
          var des2 = variableNodeList[(variableNodeList_names.indexOf(char2))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(variableNodeList_names.includes(char3))
        {
          var des3 = variableNodeList[(variableNodeList_names.indexOf(char3))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(variableNodeList_names.includes(char4))
        {
          var des4 = variableNodeList[(variableNodeList_names.indexOf(char4))].alphabetLinkList[k].destinationNodes;
          c++;
        }
        if(c==4){dfa_variables[i].addAlphabetLink(new alphabetLink(k.toString(), concat_destinations(concat_destinations(des4,des3), concat_destinations(des, des2))));}
      }
    }
  }
}

/*** Function to relabel the variables and states of DFA generated ***/
function relabel_variable()
{
  //remove epsilon from alphabets list
  var index = alphabets.indexOf("Epsilon");
  if (index > -1) {
    alphabets.splice(index, 1);
  }

  //copy the dfa variables to new array
  for(var i = 0; i<dfa_variables.length; i++){
    relabel_dfa_variables.push(new variableNode(dfa_variables[i].name,dfa_variables[i].stateType));
    for(var j = 0; j<dfa_variables[i].alphabetLinkList.length; j++){
      relabel_dfa_variables[i].addAlphabetLink(new alphabetLink(dfa_variables[i].alphabetLinkList[j].symbol,dfa_variables[i].alphabetLinkList[j].destinationNodes))
    }
  }

  const labels = ["Z","A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];

  //remove comma for all destinations variable
  for(m=0; m<relabel_dfa_variables.length; m++)
  {
    for(n=0; n<alphabets.length; n++)
    {
      var temp = relabel_dfa_variables[m].alphabetLinkList[n].destinationNodes.toString().replace(/\,/g,"");
      relabel_dfa_variables[m].alphabetLinkList[n].destinationNodes[0] = temp;
      relabel_dfa_variables[m].alphabetLinkList[n].destinationNodes.length = 1;
    }
  }
  //relabel all variables
  for(i=0; i<relabel_dfa_variables.length; i++)
  {
    var char = relabel_dfa_variables[i].name;
    relabel_dfa_variables[i].name = labels[i];
    for(j=0; j<alphabets.length; j++)
    {
      if(relabel_dfa_variables[i].alphabetLinkList[j].destinationNodes.includes(char))
      {
        relabel_dfa_variables[i].alphabetLinkList[j].destinationNodes[(relabel_dfa_variables[i].alphabetLinkList[j].destinationNodes.indexOf(char))] = labels[i];
      }
      else
      {
        continue;
      }
    }
    for(k=0; k<relabel_dfa_variables.length; k++)
    {
      for(l=0; l<alphabets.length; l++)
      {
        if(relabel_dfa_variables[k].alphabetLinkList[l].destinationNodes.includes(char))
        {
          relabel_dfa_variables[k].alphabetLinkList[l].destinationNodes[(relabel_dfa_variables[k].alphabetLinkList[l].destinationNodes.indexOf(char))] = labels[i];
        }
        else
        {
          continue;
        }
      }
    }
  }
}

/*** This function read and write the DFA table into a 2D array for displaying ***/
function output_dfa_transition()
{
  var rows = [];
  //first row
  for(i=0; i<alphabets.length; i++)
  {
    if(i==0)
    {
      rows.push(" ");
    }
  
    rows.push(alphabets[i]);
    console.log(rows)
    
  }
  columns.push(rows);
  console.log(columns);
  //clear rows
  rows = [];
  //other rows
  for(i=0; i<dfa_variables.length; i++)
  {
    rows.push(dfa_variables[i].name);
    for(j=0; j<dfa_variables[i].alphabetLinkList.length; j++)
    {
      rows.push(dfa_variables[i].alphabetLinkList[j].destinationNodes.toString());
    }
    columns.push(rows);
    rows = [];
  } 
}

/** Display Function: Display the DFA in the table */
function display_dfa(){
  var dfa_table = document.getElementById("dfa-table");
  var variable_string;
  var start_symbol = '&#129058;';
  var final_symbol = '*';

  for(var i=0; i<columns.length; i++){
    var row = dfa_table.insertRow(i);
    for(var j=0; j<columns[0].length; j++){
      if(j == 0 && i > 0){
        if(arraysEqual(dfa_variables[i-1].stateType,["start","final"])){

          variable_string = final_symbol.concat(columns[i][j]);
          var temp = variable_string;
          variable_string = start_symbol.concat(temp);
    
        }else if(arraysEqual(dfa_variables[i-1].stateType,["start"])){
    
          variable_string = start_symbol.concat(columns[i][j]);
    
        }else if(arraysEqual(dfa_variables[i-1].stateType,["final"])){
    
          variable_string = final_symbol.concat(columns[i][j]);
    
        }
        else{
          variable_string = columns[i][j];
        }
    
        var cell = row.insertCell(j);
        cell.innerHTML = variable_string;
        variable_string = " ";

        continue;
      }
      var cell = row.insertCell(j);
      cell.innerHTML = columns[i][j];
      
    }
  }
}

/** Display Function: Display the relabelled DFA in the table */
function display_relabelled_dfa(){
  var relabelled_dfa_table = document.getElementById("relabelled-dfa-table");
  var variable_string;
  var start_symbol = '&#129058;';
  var final_symbol = '*';


  var row = relabelled_dfa_table.insertRow(0);
  var cell = row.insertCell(0);
  for (var i = 0; i < alphabets.length ;i++){
    cell = row.insertCell(i+1);
    cell.innerHTML = alphabets[i];
  }

  for(var i=0; i<relabel_dfa_variables.length; i++){
    var row = relabelled_dfa_table.insertRow(i+1);
    var cell = row.insertCell(0);

    
    if(arraysEqual(relabel_dfa_variables[i].stateType,["start","final"])){

      variable_string = final_symbol.concat(relabel_dfa_variables[i].name);
      var temp = variable_string;
      variable_string = start_symbol.concat(temp);

    }else if(arraysEqual(relabel_dfa_variables[i].stateType,["start"])){

      variable_string = start_symbol.concat(relabel_dfa_variables[i].name);

    }else if(arraysEqual(relabel_dfa_variables[i].stateType,["final"])){

      variable_string = final_symbol.concat(relabel_dfa_variables[i].name);

    }
    else{
      variable_string = relabel_dfa_variables[i].name;
    }

    cell.innerHTML = variable_string;
    variable_string = " ";

    for(var j=0; j<relabel_dfa_variables[0].alphabetLinkList.length; j++){
      var cell = row.insertCell(j+1);
      cell.innerHTML = relabel_dfa_variables[i].alphabetLinkList[j].destinationNodes[0];
    }
  }
}

/** Remove unreachable state after relabelling the nely formed DFA before minimization */
function remove_unreachable_state(){
  
  
  reachable_state_nodes = relabel_dfa_variables;

  for(var i = 0; i < reachable_state_nodes.length; i++){
    for(var j = 0; j < alphabets.length; j++){
      reachable_state_nodes[i].alphabetLinkList[j].symbol = alphabets[j];
    }
  }

  for(var i =0; i < reachable_state_nodes.length; i++){
    all_state[i] = reachable_state_nodes[i].name;
  }

 // check all the state to filter out reachable state
  for(var i = 0; i < 16; i++){
    for(var j = 0; j < reachable_state_nodes.length; j++){
      for(var k = 0; k < reachable_state_nodes[j].alphabetLinkList.length; k++){
        for (var l = 0; l <all_state.length; l++){
          if(all_state[l] == reachable_state_nodes[j].alphabetLinkList[k].destinationNodes[0] && reachable_state.includes(reachable_state_nodes[j].alphabetLinkList[k].destinationNodes[0]) != true && all_state[l] != reachable_state_nodes[j].name){
            reachable_state.push(all_state[l]);
          }
        }
      }
      // will include initial state as well because we cannot remove initial state in this process although it is unreachable
      if(arraysEqual(reachable_state_nodes[j].stateType[0],["start"]) && reachable_state.includes(reachable_state_nodes[j].name) != true){
        reachable_state.push(reachable_state_nodes[j].name);
      }
    }
    all_state = reachable_state;
    reachable_state = [];
    if(all_state.length == 0){
      break;
    }
    // Remove all the unreachable states
    for(var m = 0; m < reachable_state_nodes.length; m++){
      if(all_state.includes(reachable_state_nodes[m].name) == false){
        reachable_state_nodes.splice(m,1);
      } 
    }
  }

}

/** Display Function: Display only the relabelled DFA in the table that are reachable (unreachable removed) */
function display_reachable_dfa(){
  var reachable_dfa_table = document.getElementById("reachable-dfa-table");
  var variable_string;
  var start_symbol = '&#129058;';
  var final_symbol = '*';


  var row = reachable_dfa_table.insertRow(0);
  var cell = row.insertCell(0);
  for (var i = 0; i < alphabets.length ;i++){
    cell = row.insertCell(i+1);
    cell.innerHTML = alphabets[i];
  }

  for(var i=0; i<reachable_state_nodes.length; i++){
    var row = reachable_dfa_table.insertRow(i+1);
    var cell = row.insertCell(0);

    if(arraysEqual(reachable_state_nodes[i].stateType,["start","final"])){

      variable_string = final_symbol.concat(relabel_dfa_variables[i].name);
      var temp = variable_string;
      variable_string = start_symbol.concat(temp);

    }else if(arraysEqual(reachable_state_nodes[i].stateType,["start"])){

      variable_string = start_symbol.concat(relabel_dfa_variables[i].name);

    }else if(arraysEqual(reachable_state_nodes[i].stateType,["final"])){

      variable_string = final_symbol.concat(relabel_dfa_variables[i].name);

    }
    else{
      variable_string = reachable_state_nodes[i].name;
    }

    cell.innerHTML = variable_string;
    variable_string = " ";

    for(var j=0; j<reachable_state_nodes[0].alphabetLinkList.length; j++){
      var cell = row.insertCell(j+1);
      cell.innerHTML = reachable_state_nodes[i].alphabetLinkList[j].destinationNodes[0];
    }
  }
}

/** Function for user to test 5 strings for the DFA in a go */
function string_test(){
  for(var count = 1; count <= 5; count++){
    var test_count = "test" + count;
    var result_count = "result" + count;
    var text = document.getElementById(test_count).value;
    var invalidCharacter = false;
    console.log(test_count);

    //Assign initial state to current_state
    for(var i = 0; i < reachable_state_nodes.length; i++){
      if(reachable_state_nodes[i].stateType[0] == "start"){
        current_state = reachable_state_nodes[i];
      }
    }

    //If user input empty string then the program will check the initial is accepted state or not.
    if(text == '/'){
      if(current_state.stateType.includes("final")){
        document.getElementById(result_count).innerHTML = "Accepted";
      }
      else{
        document.getElementById(result_count).innerHTML = "Rejected";
      }
      continue;
    }
    
    // To check if user input invalid string
    for(var t = 0; t<text.length; t++){
      if (alphabets.includes(text[t]) == false){
        document.getElementById(result_count).innerHTML = "Invalid characters!";
        invalidCharacter = true;
      }
    }

    if(invalidCharacter == true){
      continue;
    }
    
    // Loop t times to check all the character in the string and is it the final state is a accepted state or not.
    for(var t = 0; t < text.length; t++){
      for(var i = 0; i < current_state.alphabetLinkList.length; i++){
        if(text[t] == current_state.alphabetLinkList[i].symbol){
          var current_state_name = current_state.alphabetLinkList[i].destinationNodes;
          for(var j = 0; j < reachable_state_nodes.length; j++){
            if(current_state_name == reachable_state_nodes[j].name){
              current_state = reachable_state_nodes[j];
            }
          }
        }
        if(t == text.length - 1){
          if(current_state.stateType.includes("final")){
            document.getElementById(result_count).innerHTML = "Accepted";
          }
          else{
            document.getElementById(result_count).innerHTML = "Rejected";
          }
        }
      }
    }
  }
}


/** Minimization of the DFA */
function grouping_dfa(){
  var no_change;
  
  //get final and none final into 2 groups
  for(var i = 0; i < reachable_state_nodes.length; i++){
    if(reachable_state_nodes[i].stateType.includes("final")){
      group_list[0].push(reachable_state_nodes[i].name);
    }
    else{
      group_list[1].push(reachable_state_nodes[i].name);
    }
  }

  // initialising 2 group( final and non-final)
  for(var i = 0; i < group_list.length; i++){
    if(group_list[i].length == 1){ // if the group only have one variable, then it should be named as the variable instead of a group name
      group_nodes.push(new groupNodes(group_list[i][0] ,group_list[i]));
    }
    else{
      group_nodes.push(new groupNodes("g" + group_count ,group_list[i]));
      group_count++;
    }
  }
  
  //loop and checking all of the states and creating new states
  while(true){ // exit only if there's no change
    
    no_change = true;
    for(var i = 0; i < group_nodes.length; i++){ //loop for all the groups

      for(var j = 0; j <group_nodes[i].nodeList.length-1; j++){
        var current = []; // destination of the current variable of the group 
        var latter = []; // destination of the next variable of the group 
        
        for(var k = 0; k<reachable_state_nodes.length; k++){ // we take the first variable in the group to compare
          if(reachable_state_nodes[k].name == group_nodes[i].nodeList[j]){
            for( var l = 0; l < reachable_state_nodes[k].alphabetLinkList.length; l++){
              for(var m = 0; m < group_nodes.length; m++){
                if(group_nodes[m].nodeList.includes(reachable_state_nodes[k].alphabetLinkList[l].destinationNodes[0])){
                  current.push(group_nodes[m].name);
                }
              }
            }
          }

          if(reachable_state_nodes[k].name == group_nodes[i].nodeList[j+1]){ // we take the second variable in the group to compare
            for( var l = 0; l < reachable_state_nodes[k].alphabetLinkList.length; l++){
              for(var m = 0; m < group_nodes.length; m++){
                if(group_nodes[m].nodeList.includes(reachable_state_nodes[k].alphabetLinkList[l].destinationNodes[0])){
                  latter.push(group_nodes[m].name);
                }
              }
            }
          }
        }

        /** compare the next states of the variables in the same group 
         * If false, then we will seperate the current group into two different groups
        */
        if(arraysEqual(current,latter) == false){ 
          var array1 = group_nodes[i].nodeList.splice(0,j+1);
          var array2 = group_nodes[i].nodeList;
          
          
          if(array1.length == 1){
            group_nodes[i].name = array1[0];
            group_nodes[i].nodeList = array1;
          }
          else{
            group_nodes[i].nodeList = array1;
          }
          
          if(array2.length == 1){
            group_nodes.push(new groupNodes(array2[0],array2))
          }
          else{
            group_nodes.push(new groupNodes("g" + group_count, array2));
            group_count ++
          }
          
          no_change = false;
          break;
        
        }
        if(no_change == false){
          break;
        }
      }

      if(no_change == false){
          break;
        }
    }

    if(no_change == true){
      break;
    }
    
  }
  
  // implement the catogorized states into objects and map them to groups
  
  for(var i = 0; i < group_nodes.length; i++){
    var state_combo = [];
    var destination_combo = [];
    
      for(var k = 0; k < reachable_state_nodes.length; k++){
        if(group_nodes[i].nodeList[0] == reachable_state_nodes[k].name){
          state_combo = state_combo.concat(reachable_state_nodes[k].stateType);
          for( var l = 0; l < reachable_state_nodes[k].alphabetLinkList.length; l++){
            destination_combo.push([]);
            destination_combo[l].push(reachable_state_nodes[k].alphabetLinkList[l].symbol);
              for(var m = 0; m < group_nodes.length; m++){
                if(group_nodes[m].nodeList.includes(reachable_state_nodes[k].alphabetLinkList[l].destinationNodes[0])){
                  destination_combo[l].push(group_nodes[m].name);
                  break;
                }
              }
            }
          
        }
      }
    
    
    state_combo = [...new Set(state_combo)];
    state_combo.sort();
    state_combo.reverse();
    
    
    final_grouped_dfa_nodes.push(new variableNode(group_nodes[i].name, state_combo));
    console.log(destination_combo);
    
    for(var j = 0; j < destination_combo.length; j++){ //adding the minimized dfa transitions into new objects
      final_grouped_dfa_nodes[i].addAlphabetLink(new alphabetLink(destination_combo[j][0],destination_combo[j][1]));
    }
      
  }
}

/**Display function: Display the minimized DFA */
function display_minimized_dfa(){
  var minimized_dfa_table = document.getElementById("minimized-dfa-table");
  var variable_string;
  var start_symbol = '&#129058;';
  var final_symbol = '*';


  var row = minimized_dfa_table.insertRow(0);
  var cell = row.insertCell(0);
  for (var i = 0; i < alphabets.length ;i++){
    cell = row.insertCell(i+1);
    cell.innerHTML = alphabets[i];
  }

  for(var i=0; i<final_grouped_dfa_nodes.length; i++){
    var row = minimized_dfa_table.insertRow(i+1);
    var cell = row.insertCell(0);

    if(arraysEqual(final_grouped_dfa_nodes[i].stateType,["start","final"])){

      variable_string = final_symbol.concat(final_grouped_dfa_nodes[i].name);
      var temp = variable_string;
      variable_string = start_symbol.concat(temp);

    }else if(arraysEqual(final_grouped_dfa_nodes[i].stateType,["start"])){

      variable_string = start_symbol.concat(final_grouped_dfa_nodes[i].name);

    }else if(arraysEqual(final_grouped_dfa_nodes[i].stateType,["final"])){

      variable_string = final_symbol.concat(final_grouped_dfa_nodes[i].name);

    }
    else{
      variable_string = final_grouped_dfa_nodes[i].name;
    }

    cell.innerHTML = variable_string;
    variable_string = " ";

    for(var j=0; j<final_grouped_dfa_nodes[0].alphabetLinkList.length; j++){
      var cell = row.insertCell(j+1);
      cell.innerHTML = final_grouped_dfa_nodes[i].alphabetLinkList[j].destinationNodes;
    }
  }
}



