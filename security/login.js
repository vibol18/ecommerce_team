const btn = document.getElementById("btn-sub");

btn.addEventListener("click", (e) => {
    e.preventDefault(); 

    const name = document.getElementById("user_name").value;
    const password = document.getElementById("pass").value;

    if (name === "" || password === "") {
        alert("Please input all fields!");
        return;
    }

    localStorage.setItem("user_email", name);
    localStorage.setItem("user_pass", password);


    document.getElementById("place_for_save_data").innerHTML = `Email: ${name} | Password: ${password}`;
    
    console.log(`Email: ${name} | Password: ${password}`);

    document.getElementById("user_name").value = "";
    document.getElementById("pass").value = "";
});


window.onload = function() {
    const Data_save_email = localStorage.getItem("user_email");
    const Data_save_pass = localStorage.getItem("user_pass");

    if (Data_save_email && Data_save_pass) {
        document.getElementById("place_for_save_data").innerHTML = `Email: ${Data_save_email} | Password: ${Data_save_pass}`;
        console.log(`Email: ${name} | Password: ${password}`)
    }
    else{
        console.log("None Data !");
    }
};