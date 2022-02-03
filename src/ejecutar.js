const spawn = require("child_process").spawn

const pythonProcess = spawn("python", ["src/config/IA.py"])

let pythonResponde = ""

pythonProcess.stdout.on("data", function(data) {
    pythonResponde += data.toString()
})

pythonProcess.stdout.on("end", function() {
    console.log(pythonResponde)
})
pythonProcess.stdin.write("backendi")

pythonProcess.stdin.end()