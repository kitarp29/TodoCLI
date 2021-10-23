var fs = require('fs');
const { report } = require('process');


//constants
var TASK_JSON_PATH = "./database.json";


function init(){
	//create file if it's present.
	if(!fs.existsSync(TASK_JSON_PATH)){
		console.log("Initialising storage.\n Creating `database.json` file");
		setData([]);	
	}
	
}

function getData(){
	//read file contents
	var contents = fs.readFileSync(TASK_JSON_PATH);
	//parse contents
	var data = JSON.parse(contents);
	return data;
}


function setData(data){
	//strigify JSON
	var dataString = JSON.stringify(data);
	//write to  file
	fs.writeFileSync(TASK_JSON_PATH,dataString);
}

//display usage
function usage() {
	console.log("Usage :-");
	console.log("$ todo add 'todo item'  # Add a new todo");
	console.log("$ todo ls               # Show remaining todos");
	console.log("$ todo del NUMBER       # Delete a todo");
	console.log("$ todo done NUMBER      # Complete a todo");
	console.log("$ todo help             # Show usage");
	console.log("$ todo report           # Statistics");
}

//add task
function add(task) {
	//get data
	var data = getData();
	//add item
	data.push({task:task,completed:false});
	//set data
	setData(data);
	//list
	console.log("Added todo : "+task );
}

//check task
function check(task) {
	//get data
	var data = getData();

	//modify the data (toggle)
	data[task].completed = !data[task].completed;

	//set data
	setData(data);
task++;
	//list
	console.log("Marked todo #"+task+" as done." );
}

//delete task
function del(task){
	//get data
	var data = getData();

	//delete item
	data.splice(task,task+1);

	//set data
	setData(data);
task++;
	//list
	console.log("Deleted todo #"+ task);
}

//list all tasks
function list() {
	
	//data
	var data = getData();
	
	if(data.length > 0){
		var i=1;
		//print the list. using ANSI colors and formating
		data.forEach(function (task,index){
			if(!task.completed)
			{
				console.log("["+i+"] "+ task.task);
				i++;
			}
			console.log(index+1+"."," ["+(task.completed ? "\x1b[92m✓\x1b[93m" : " ")+"] ",task.task);
		});
		
	}else{
		console.log("\x1b[91mNo tasks added!!");
	}

}
function rep() {
	
	//data
	var data = getData();
	var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;


	if(data.length > 0){
		var i=1;
		//print the list. using ANSI colors and formating
		data.forEach(function (task,index){
			if(task.completed)
			{
				i++;
			}		// console.log(index+1+"."," ["+(task.completed ? "\x1b[92m✓\x1b[93m" : " ")+"] ",task.task);
		});
		var p= data.length -i;
		console.log(today+" Pending : "+p+" Completed : "+ i);
	}else{
		console.log("\x1b[91mNo tasks added!!");
	}

}


var command = process.argv[2];
var argument = process.argv[3];

init();

switch(command){
	case "add":
		add(argument);
		break;
	case "done":
		check(argument-1);
		break;
	case "del":
		del(argument-1);
		break;
	case "help":
		usage();
		break;
	case "ls":
		list();
		break;
	case "report":
		rep();
		break;
	default:
		console.log("\x1b[91mTry todo help\x1b[0m");
		break;
}
