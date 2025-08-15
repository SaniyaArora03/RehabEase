//current date
const dateToday=document.getElementById("current-date");
const today=new Date();
dateToday.textContent=today.toDateString();

//mark button as completed
const buttons=document.querySelectorAll(".done-btn")
let completed=0; //stores total completed
const totalExercises = buttons.length; //to store total number of exercises

//when completed
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if(!button.classList.contains("completed")){  //if not marked as completed
            button.classList.add("completed");
            completed++; //increment completed exercises
            button.textContent="Completed ✅";
            button.style.color="green";
            updateProgress(); //call func to update progress bar
        }else{
            //if mistakenly marked as completed
            button.classList.remove("completed");
            button.textContent="Mark as Done";
            button.style.color="black";
            completed--;
            updateProgress();
        }
    })});

//update progress bar
function updateProgress(){
    const percentage=Math.round((completed/totalExercises)*100);
     document.getElementById("progress-fill").style.width = percentage + "%";
    document.getElementById("progress-text").textContent = `${percentage}% completed`;
}