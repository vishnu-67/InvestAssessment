const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors())

app.post('/writeFile', async (req, res) => {
    try{
        //check if file exist
if (!fs.existsSync('./assessmentReport/answer.json')) {
    //create new file if not exist
    await fs.closeSync(fs.openSync('./assessmentReport/answer.json', 'w'));
}

// read file
const file = await fs.readFileSync('./assessmentReport/answer.json')

const jsonData = req.body;

//check if file is empty
if (file.length == 0) {
    //add data to json file
   await fs.writeFileSync("./assessmentReport/answer.json", JSON.stringify([jsonData]))
} else {
    //append data to jso file
    const json = JSON.parse(file.toString())
    //add json element to json object
    json.push(jsonData);
    await fs.writeFileSync("./assessmentReport/answer.json", JSON.stringify(json))
}
     
        // console.log('Start')
        // fs.writeFile('./assessmentReport/answer.json', jsonData, (err) => {
        //   if (err) {
        //     res.status(500).send('Error writing file');
        //   } else {
        //     res.status(200).send('File written successfully');
        //   }
        // });
        res.status(200).send('File written successfully')
    }
    catch(err){
        console.log('catch err', err)
        res.status(500).send('Error writing file');
    }
  
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
