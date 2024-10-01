const express = require("express")
const fs = require("fs") // Import fs module to handle file operations
const app = express()
let members = require("./member.json") // Load members from the JSON file
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("hello world 456")
})

// Function to save members to member.json
function saveMembers() {
  fs.writeFileSync("./member.json", JSON.stringify(members, null, 2), "utf8")
}

app.get("/member", (req, res) => {
  res.json(members)
})

app.get("/member/:id", (req, res) => {
  const member = members.find((member) => member.id === req.params.id)
  if (!member) {
    return res.status(404).json({ error: "Member not found" })
  }
  res.json(member)
})

app.post("/member", (req, res) => {
  // Check if name and surename are provided
  if (!req.body.name || !req.body.surename) {
    return res.status(400).json({ error: "Name and surename are required" })
  }

  // Generate a new ID based on the current length of the members array
  const newMember = {
    id: (members.length + 1).toString(),
    name: req.body.name,
    surename: req.body.surename,
  }

  members.push(newMember)
  saveMembers() // Save updated members to file
  res.status(201).json(newMember) // Return the created member
})

app.put("/member/:id", (req, res) => {
  const updateIndex = members.findIndex((member) => member.id === req.params.id)
  if (updateIndex === -1) {
    return res.status(404).json({ error: "Member not found" })
  }

  // Update the member's data
  members[updateIndex] = { ...members[updateIndex], ...req.body }
  saveMembers() // Save updated members to file
  res.json(members[updateIndex])
})

app.delete("/member/:id", (req, res) => {
  const deleteIndex = members.findIndex((member) => member.id === req.params.id)
  if (deleteIndex === -1) {
    return res.status(404).json({ error: "Member not found" })
  }

  members.splice(deleteIndex, 1)
  saveMembers() // Save updated members to file
  res.status(204).send() // No content response
})

app.listen(4200, () => {
  console.log("Start server at port 4200")
})
