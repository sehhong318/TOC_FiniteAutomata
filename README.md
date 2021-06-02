# TOC_FiniteAutomata

### Introduction 

This application with the function of transforming a given NFA as an input to a DFA. The application includes step by step transformation functions and a function to test the given input string. The supported functions include: 

1. Convert ε-NFA into an NFA without ε-transitions. 
2. Convert NFAs into DFAs. 
3. Minimizes DFAs.
4. Testing strings (up to 5 strings at once) and statements to inform the user whether each string is accepted or rejected by the Machine.

To build this application which implements the above function efficiently, we chose to develop this WebApp mainly based on html and bootstrap for the display and javascript for implementing the functions and algorithms. The application includes a main html file (index.html) which will allow the use to enter into the main page of the application, where it shows the information regarding the group members. Then, users will be able to proceed to another html file (fa.html) which functions to take user input and output the minimization of DFA. Finally, the functions and algorithms are stored in the only javascript file (index.js).


### To use the webapp:

1. Enter the alphabets, variable(states), start states and final states. To enter Epsilon, enter <Epsilon> (Don't need <>). It's case sensitive.Then, click on the "proceed" to save it.

Note: Only up to 3 alphabets + E, and only up to 4 variables. Also, always put Epsilon as the last alphabet.

2. Go to the bottom table to fill in the transition. If you want to fill in more than one alphabet in a box. Eg: For state A, when 0, it is {B,C}. Just type in B,C (Don't need {}). To enter 'empty', enter </> without <>.

Note: The state name in the transition much match the state name previously set in the previous table.

Click onto the "proceed" button to save it.

You can view the tables and the side. Just click on the buttons.
The transitions will be saved in the variables object. View more in the index.js file.
