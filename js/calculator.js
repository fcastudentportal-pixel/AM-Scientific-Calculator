
/* AM SCIENTIFIC CALCULATOR
   Developed by Alex Meja
*/

(() => {

    const display = document.getElementById("result");
    const expression = document.getElementById("expression");
    const message = document.getElementById("calcMessage");

    const buttons = document.querySelectorAll(".calc-keypad button");

    const angleButton = document.getElementById("angleMode");
    const historyButton = document.getElementById("historyBtn");
    const historyPanel = document.getElementById("historyPanel");
    const historyList = document.getElementById("historyList");

    let current = "";
    let answer = 0;
    let angleMode = "DEG";
    let justCalculated = false;

    const history = [];

    function show() {
        expression.textContent = current || "0";
    }

    function notify(text = "") {
        message.textContent = text;
    }

    function insert(value) {

        notify("");

        if (justCalculated) {
            const continuesAnswer = [
                "+", "-", "*", "/", "^", "!"
            ].includes(value);

            if (!continuesAnswer) {
                current = "";
            }

            justCalculated = false;
        }

        if (value === "^2") {
            current += "^2";
        } else {
            current += value;
        }

        show();
    }

    function clear() {
        current = "";
        display.textContent = "0";
        show();
        notify("");
        justCalculated = false;
    }

    function removeLast() {
        current = current.slice(0, -1);
        show();
        notify("");
        justCalculated = false;
    }

    function calculate() {

        if (!current.trim()) {
            notify("Enter a mathematical expression.");
            return;
        }

        try {

            const node = math.parse(current);

            const allowedFunctions = [
                "sin", "cos", "tan",
                "asin", "acos", "atan",
                "sqrt", "log", "ln",
                "abs", "factorial"
            ];

            node.traverse((child) => {

                if (child.isFunctionNode) {
                    const name = child.fn.name;

                    if (!allowedFunctions.includes(name)) {
                        throw new Error("Unsupported function.");
                    }
                }

                if (child.isSymbolNode) {
                    const name = child.name;

                    const allowedSymbols = [
                        "pi", "e", "ans"
                    ];

                    if (
                        !allowedSymbols.includes(name) &&
                        !allowedFunctions.includes(name)
                    ) {
                        throw new Error("Unsupported symbol: " + name);
                    }
                }

            });

            const scope = {
                ans: answer,

                sin: x => angleMode === "DEG"
                    ? Math.sin(x * Math.PI / 180)
                    : Math.sin(x),

                cos: x => angleMode === "DEG"
                    ? Math.cos(x * Math.PI / 180)
                    : Math.cos(x),

                tan: x => angleMode === "DEG"
                    ? Math.tan(x * Math.PI / 180)
                    : Math.tan(x),

                asin: x => angleMode === "DEG"
                    ? Math.asin(x) * 180 / Math.PI
                    : Math.asin(x),

                acos: x => angleMode === "DEG"
                    ? Math.acos(x) * 180 / Math.PI
                    : Math.acos(x),

                atan: x => angleMode === "DEG"
                    ? Math.atan(x) * 180 / Math.PI
                    : Math.atan(x),

                sqrt: Math.sqrt,
                log: Math.log10,
                ln: Math.log,
                abs: Math.abs,
                factorial: math.factorial
            };

            const value = node.evaluate(scope);

            if (typeof value !== "number" || !Number.isFinite(value)) {
                throw new Error("Result is undefined or not a finite number.");
            }

            const formatted = Number(
                value.toPrecision(12)
            ).toString();

            display.textContent = formatted;

            history.unshift({
                question: current,
                result: formatted
            });

            if (history.length > 50) {
                history.pop();
            }

            answer = value;
            expression.textContent = current + " =";
            current = formatted;
            justCalculated = true;

            updateHistory();
            notify("Calculation successful.");

        } catch (error) {

            notify("Invalid expression: " + error.message);

        }

    }

    function updateHistory() {

        historyList.innerHTML = "";

        history.forEach(item => {

            const div = document.createElement("div");

            div.className = "history-item";

            const question = document.createElement("div");
            question.textContent = item.question;

            const result = document.createElement("strong");
            result.textContent = "= " + item.result;

            div.append(question, result);
            historyList.appendChild(div);

        });

    }

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const value = button.dataset.value;
            const action = button.dataset.action;

            if (action === "clear") clear();
            else if (action === "delete") removeLast();
            else if (action === "calculate") calculate();
            else if (value !== undefined) insert(value);

        });

    });

    angleButton.addEventListener("click", () => {

        angleMode = angleMode === "DEG" ? "RAD" : "DEG";

        angleButton.textContent = angleMode;

        notify("Angle mode changed to " + angleMode);

    });

    historyButton.addEventListener("click", () => {

        historyPanel.hidden = !historyPanel.hidden;

    });

    document.getElementById("clearHistory")
        .addEventListener("click", () => {

            history.length = 0;
            updateHistory();

        });

    document.getElementById("copyResult")
        .addEventListener("click", async () => {

            try {

                await navigator.clipboard.writeText(display.textContent);
                notify("Result copied.");

            } catch {

                notify("Clipboard access unavailable in this preview.");

            }

        });

    document.addEventListener("keydown", event => {

        if (event.target.matches("input, textarea")) return;

        if (/^[0-9.]$/.test(event.key)) {
            insert(event.key);
        }

        else if (["+", "-", "*", "/", "^", "(", ")", "%", "!"].includes(event.key)) {
            insert(event.key);
        }

        else if (event.key === "Enter" || event.key === "=") {
            event.preventDefault();
            calculate();
        }

        else if (event.key === "Backspace") {
            removeLast();
        }

        else if (event.key === "Escape") {
            clear();
        }

    });

    show();

    console.log("AM Scientific Calculator engine ready.");

})();
