// writting code for slider   

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthNum = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const genebtn = document.querySelector(".generate-btn");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//1)Default value when we relod the main site  
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// circle is in gray color  
setIndicator("#ccc");

//below method will only reflect passwordlength on UI   
function handleSlider(){
    // .value return value of textfiels
    inputSlider.value = passwordLength;
    
    //return text content on element  
    lengthNum.innerText = passwordLength;

    //below code will be used to fill color in slider  
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

// 2)set indicator  
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//3)getrandom integer  
function getRandomInteger(min,max){
   return Math.floor(Math.random() * (max-min)) + min;
}

function getRandomNumber(){
    return getRandomInteger(0,9);
}

function getRandmLowerCase() {
    //97 -> a ki value and 123 z ki (lowercase)

    //converting method to char
    return String.fromCharCode(getRandomInteger(97,123));
}


function getRandomUpperCase() {
    return String.fromCharCode(getRandomInteger(65,91)); 
}

function getSymbol() {
    const ramNum = getRandomInteger(0,symbol.length);
    return symbol.charAt(ramNum);
}

function calcStrength() {
  //default value of all radio button will be false  
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    //if checked the set valur as true
    if (upperCheck.checked) hasUpper = true;
    if (lowerCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;
  

    //following are the rules of password and displayed in form of color  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

function shufflePassword(array) {
  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;
}

async function copyContent() {
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  }
  catch(e){
    copyMsg.innerText = "Failed";
  }

  //to make copy vala span visiable  
  copyMsg.classList.add("active");

  //after few second msg will invisiable
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}


// below mthod is used to count how many checkboxes are checked  
function handleCheckBoxChange(){
  checkCount = 0;
  allcheckBox.forEach(function(checkbox){
    if(checkbox.checked)
      checkCount++;
  });

  //special case when password length is 1 and all the 
  //check boxes are checked so it's passwod length would be of length 4
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }
}

//jab be koye bhi checkbox ya toh select ya unchecked hai
//toh un me hum ne foreach loop laga diya hai 
//aur upar vali method call kardi hai  

allcheckBox.forEach(function(checkbox){
  checkbox.addEventListener('change',handleCheckBoxChange);
})


//'input' means slider ko left ya right move kar rahe ho  
inputSlider.addEventListener('input',function(e){
  //slider me eventlisteneer lagaye toh password ki length change horhahi hai
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',function(){
  //agar password vo display huaa hai vo nonempty hai 
  //toh copy execute kardo
  if(passwordDisplay.value)
    copyContent();
})

genebtn.addEventListener('click',function(){

  //none of the checkbox are selected  
  if(checkCount == 0){
    return;
  }

  console.log("Starting the Journey");
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }

  //finding new password  

  //remove old password to generate new one  
  password = "";

  //check box ke hisab se value dalo
  // if(upperCheck.checked){
  //   password += getRandomUpperCase();
  // }

  // if(lowerCheck.checked){
  //   password += getRandmLowerCase();
  // }

  // if(numberCheck.checked){
  //   password += getRandomNumber();
  // }

  // if(symbolCheck.checked){
  //   password += getSymbol();
  // }


  let arr = [];

  if(upperCheck.checked){
    arr.push(getRandomUpperCase);
  }

  if(lowerCheck.checked){
    arr.push(getRandmLowerCase);
  }

  if(numberCheck.checked){
    arr.push(getRandomNumber);
  }

  if(symbolCheck.checked){
    arr.push(getSymbol);
  }

  //function which are checked should be compulsory added 
  //means uppercase and number is checked so ek uppercase and ek number aana hi chaiye
  //baki sab remaining me jayega
  for (let i = 0; i < arr.length; i++) {
    password += arr[i]();
  }

  console.log("COmpulsory adddition done");
  //remaining addition  
  for (let i = 0; i < passwordLength-arr.length; i++) {
    let ranidx = getRandomInteger(0,arr.length);
    console.log("randIndex" + ranidx);
    password += arr[ranidx]();
  }
  console.log("Remaining adddition done");
//we can not get password straight forward there should be random elements
//shuffle password

password = shufflePassword(Array.from(password));
console.log("Shuffling done");
//display in UI
passwordDisplay.value = password;
console.log("UI adddition done");

//calculate strength of password  
calcStrength();
})