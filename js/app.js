
// AM SCIENTIFIC CALCULATOR
// Developed by Alex Meja

// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navigation = document.getElementById("navigation");

menuBtn.addEventListener("click", () => {
    navigation.classList.toggle("show");
});

// Close navigation after selecting a link
document.querySelectorAll(".navigation a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("show");
    });
});

// Question file upload
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

fileInput.addEventListener("change", () => {

    const files = Array.from(fileInput.files);

    if (files.length === 0) {
        fileName.textContent = "No files selected";
        return;
    }

    fileName.textContent = files
        .map(file => file.name)
        .join(", ");

});

// AI solver placeholder
const solveBtn = document.getElementById("solveBtn");
const questionInput = document.getElementById("questionInput");
const aiMessage = document.getElementById("aiMessage");

solveBtn.addEventListener("click", () => {

    const question = questionInput.value.trim();
    const files = fileInput.files;

    if (!question && files.length === 0) {
        aiMessage.textContent =
            "Please enter a question or upload a file.";

        return;
    }

    aiMessage.textContent =
        "Your question has been entered successfully. AI solving will be connected in a future development stage.";

});

// Welcome message
console.log(
    "AM Scientific Calculator initialized successfully."
);

console.log(
    "Developed by Alex Meja."
);
