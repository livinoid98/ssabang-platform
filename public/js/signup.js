const password = document.querySelector("input[name='password']");
const passwordCheck = document.querySelector("input[name='passwordCheck']");
const form = document.querySelector("form[action='/signup']");
const submit = document.querySelector("input[type='submit']");

submit.addEventListener("click", (e) => {
    e.preventDefault();

    if(password === passwordCheck){
        form.submit();
    }else{
        alert("비밀번호가 일치하지 않습니다.");
    }
});