document.getElementById("file-input").addEventListener("change", function(){
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", function() {
            document.getElementById("preview").setAttribute("src", this.result);
        });
        reader.readAsDataURL(file);
    }
});
