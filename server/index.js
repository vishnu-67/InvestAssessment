const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const cors = require('cors');
const pool = require('./mysqlConfig');
const CHATGPT_API_KEY = 'sk-&&&&&&&&&&&&&&&&&&&&&';
const axios = require('axios');
const path =require('path');

// const { openai } = require('openai');

// const chatCompletion = new openai.ChatCompletion({
//   apiKey: CHATGPT_API_KEY,
// });
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(cors({origin: ['https://dartexonconsulting.in','https://dartexonconsulting.in','https://dartexonconsulting.in','http://localhost:4200'],

    credentials: true}))
// Serve the static files from the Angular app
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/writeFile', async (req, res) => {
    try {
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
    catch (err) {
        console.log('catch err', err)
        res.status(500).send('Error writing file');
    }

});

app.post('/register', async (req, res) => {
    try {
        if (!req.body.email) {
            return res.json({
                status: 400,
                message: 'User email id missing',
            })
        }
        let email = req.body.email.toLowerCase()
        let findEmail = await pool.query(`SELECT * from user where email=? and isActive=1`, [email]);
        console.log(findEmail);
        if (findEmail.length == 0) {
            let createUser = await pool.query(`insert into user(email,isActive) values(?,?)`, [email, 1]);
            console.log(createUser);
            findEmail = await pool.query(`SELECT * from user where email=? and isActive=1`, [email]);
            // let findEmailTe= await pool.query(`INSERT INTO user (email, isActive)
            // SELECT ?, 1
            // FROM DUAL
            // WHERE NOT EXISTS (
            //   SELECT *
            //   FROM user
            //   WHERE email = ?
            // )`,[email,email])
            //console.log(findEmailTe,'find')
        }

        res.json({
            status: 200,
            data: findEmail.length == 0 ? {} : findEmail[0]
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            message: 'Internal server error',
            error: err.message ? err.message : err
        })
    }

})

app.post('/get/master/data', async (req, res) => {
    try {
        let supplyChainMaster = [];
        let componentMaster = [];
        let industryMaster = [];
        let getMasterData = await pool.query(`CALL get_master_data()`);
        if (getMasterData.length > 0) {
            supplyChainMaster = getMasterData[0] ? getMasterData[0] : [];
            componentMaster = getMasterData[1] ? getMasterData[1] : [];
            industryMaster = getMasterData[2] ? getMasterData[2] : [];
        }
        res.json({
            status: 200,
            data: {
                supplyChainMaster,
                componentMaster,
                industryMaster
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            message: 'Internal server error',
            error: err.message ? err.message : err
        })
    }

})

app.post('/update/userdata', async (req, res) => {
    try {
        if (!req.body.email || !req.body.userId) {
            return res.json({
                status: 400,
                message: 'Missing input params',
            })
        }

        let updateData = [
            req.body.phoneno ? req.body.phoneno : null,
            req.body.org ? req.body.org : null,
            req.body.country ? req.body.org : null,
            req.body.jobTitle ? req.body.jobTitle : null,
            req.body.isComplete ? req.body.isComplete : 1,
            req.body.userId
        ]

        let updateUser = await pool.query(`update user set phoneno=?,orgName=?,country=?,jobTitle=?,isComplete=?,modifyAt = CURRENT_TIMESTAMP where id=?`, updateData);

        let chatGptRes = ''
        if (req.body.supplyChain && req.body.component) {
            let updateSearchKey = await pool.query(`insert into chat_search_history(supplychainkey,componentkey,userid) values(?,?,?)`, [req.body.supplyChain, req.body.component, req.body.userId])
            console.log(updateSearchKey,'updateSearchKey')
            const prompt = {
                messages: [
                    {
                        role: 'user', content: `When it comes to supply chain management, issues in ${req.body.supplyChain} can significantly impact the overall efficiency and effectiveness of a company's operations. 
              Let's address the specific problems you mentioned: ${req.body.component}.`
                    }
                ],
            };

            let getChatgpt = await generateChatResponse(prompt);
            if (getChatgpt.err) {
                return res.json({
                    status: 202,
                    messages: "Chatgpt error res",
                    error: getChatgpt
                })
            }
            chatGptRes = getChatgpt.chatres.length > 0 ? getChatgpt.chatres[0].message.content : ''
        }
        return res.json({
            status: 200,
            message: 'Successfully updated',
            data: {
                chatGptRes
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            message: 'Internal server error',
            error: err.message ? err.message : err
        })
    }

})

app.post('/user/register', async (req, res) => {
    try {
        if (!req.body.email) {
            return res.json({
                status: 400,
                message: 'User email id missing',
            })
        }
        let email = req.body.email.toLowerCase()
        let findEmail = await pool.query(`SELECT * from user where email=? and isActive=1`, [email]);
        console.log(findEmail);
        if (findEmail.length == 0) {
            let createUser = await pool.query(`insert into user(email,isActive) values(?,?)`, [email, 1]);
            console.log(createUser);
            findEmail = await pool.query(`SELECT * from user where email=? and isActive=1`, [email]);
            // let findEmailTe= await pool.query(`INSERT INTO user (email, isActive)
            // SELECT ?, 1
            // FROM DUAL
            // WHERE NOT EXISTS (
            //   SELECT *
            //   FROM user
            //   WHERE email = ?
            // )`,[email,email])
            //console.log(findEmailTe,'find')
        }

        res.json({
            status: 200,
            data: findEmail.length == 0 ? {} : findEmail[0]
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            message: 'Internal server error',
            error: err.message ? err.message : err
        })
    }

})

app.post('/user/update_details', async (req, res) => {
    try {
        if (!req.body.email || !req.body.userId) {
            return res.json({
                status: 400,
                message: 'Missing input params',
            })
        }

        let updateData = [
            req.body.phoneno ? req.body.phoneno : null,
            req.body.org ? req.body.org : null,
            req.body.country ? req.body.org : null,
            req.body.jobTitle ? req.body.jobTitle : null,
            req.body.isComplete ? req.body.isComplete : 1,
            req.body.userId
        ]

        let updateUser = await pool.query(`update user set phoneno=?,orgName=?,country=?,jobTitle=?,isComplete=?,modifyAt = CURRENT_TIMESTAMP where id=?`, updateData);
        let findUser = await pool.query(`SELECT * from user where id=? and isActive=1`, [req.body.userId]);

        return res.json({
            status: 200,
            message: 'Successfully updated',
            data: {
                user: findUser.length == 0 ? {} : findUser[0]
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            message: 'Internal server error',
            error: err.message ? err.message : err
        })
    }

})

app.post('/get_openai_service', async (req, res) => {
    try {
        if (!req.body.userId || !req.body.supplyChain || !req.body.component
            || !req.body.industry || !req.body.detailsIssue) {
            return res.json({
                status: 400,
                message: 'Missing input params',
            })
        }

        let updateQues = [
            req.body.supplyChain, 
            req.body.component, 
            req.body.userId,
            req.body.industry,
            req.body.detailsIssue
        ]
        let chatGptRes = ''
        let updateSearchKey = await pool.query(`insert into chat_search_history(supplychainkey,componentkey,userid,industry,details) values(?,?,?,?,?)`, updateQues)
            console.log(updateSearchKey,'updateSearchKey')
            const prompt = {
                messages: [
                    {
                        role: 'user', 
                        content: `I am currently employed in the “${req.body.industry}” sector. I have an inquiry about “supply chain ${req.body.supplyChain}”, particularly focused on “${req.body.component}”. 
                        “${req.body.detailsIssue}.”
                        Could you provide a solution to address this issue? 
                        Provide the solution in 3 sections: 1. Strategic advice with bullet points underneath, 2. Tactical Approach with bullet points underneath, and 3. specific steps by listing the steps underneath. At the end summarize it in each of these contexts - strategy, structure, systems, shared values, style, staff, and skills - with bullet points underneath.`
                    }
                ],
            };

            let getChatgpt = await generateChatResponse(prompt);
            if (getChatgpt.err) {
                return res.json({
                    status: 202,
                    messages: "Chatgpt error res",
                    error: getChatgpt
                })
            }
            chatGptRes = getChatgpt.chatres.length > 0 ? getChatgpt.chatres[0].message.content : ''
        
        return res.json({
            status: 200,
            message: 'Successfully updated',
            data: {
                chatGptRes
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            message: 'Internal server error',
            error: err.message ? err.message : err
        })
    }

})

app.post('/v1/user/register', async (req, res) => {
    try {
        if (!req.body.email) {
            return res.json({
                status: 400,
                message: 'User email id missing',
            })
        }
        
        let email = req.body.email.toLowerCase()
        let findEmail = await pool.query(`SELECT * from user where email=? and isActive=1`, [email]);
        console.log(findEmail);
        let isFirst =false;
        if (findEmail.length == 0) {
            let insertUser=[
                email,
                1
            ]
            let createUser = await pool.query(`insert into user(email,isActive) values(?,?)`, insertUser);
            console.log(createUser);
            isFirst=true;
            // let findEmailTe= await pool.query(`INSERT INTO user (email, isActive)
            // SELECT ?, 1
            // FROM DUAL
            // WHERE NOT EXISTS (
            //   SELECT *
            //   FROM user
            //   WHERE email = ?
            // )`,[email,email])
            //console.log(findEmailTe,'find')
        }
        else{
            let updateData = [
                req.body.phoneno ? req.body.phoneno : null,
                req.body.org ? req.body.org : null,
                req.body.country ? req.body.org : null,
                req.body.jobTitle ? req.body.jobTitle : null,
                1,
                req.body.userId
            ]
            let updateUser = await pool.query(`update user set phoneno=?,orgName=?,country=?,jobTitle=?,isComplete=?,modifyAt = CURRENT_TIMESTAMP where id=?`, updateData);
        }
        findEmail = await pool.query(`SELECT * from user where email=? and isActive=1`, [email]);
        res.json({
            status: 200,
            data: findEmail.length == 0 ? {} : findEmail[0],
            isFirst
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            message: 'Internal server error',
            error: err.message ? err.message : err
        })
    }

})

async function generateChatResponse(prompt) {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: prompt.messages,
        });
        //console.log(response.data.choices, 'Chatgpt res');

        if (response.data.choices) {
            const chatResponse = response.data.choices;
            return { chatres: chatResponse, err: null };
        }
        else {
            console.log(response.data,'error')
            return { chatres: response, err: 'Invalid response from ChatGPT' };
        }
    }
    catch (err) {
        if (err?.response && err?.response?.status === 429) {
            // Handle rate limit error
            return { chatres: err.message, err: 'Rate limit exceeded. Retry after some time.' };
        } else {
            // Handle other error
            return { chatres: err, err: 'Invalid response from ChatGPT' };
        }
    }
}

async function generateChatResponseAPI(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: prompt,
            max_tokens: 100,
            temperature: 0.7,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATGPT_API_KEY}`,
            },
        });
        if (response.choices && response.choices.length > 0) {
            const chatResponse = response.data.choices[0].text.trim();
            //response.choices[0].message;
            return { chatres: response, err: null };
        }

        return { chatres: response, err: 'Invalid response from ChatGPT' };
    } catch (error) {
        console.error('Error:', error);
        return { chatres: err.message, err: 'Invalid response from ChatGPT' };
    }
}

app.post('/chat_open_ai', async (req, res) => {
    try {
        // const prompt = {
        //     messages: [
        //         {
        //             role: 'user', content: `When it comes to supply chain management, issues in ${supplyChainText} can significantly impact the overall efficiency and effectiveness of a company's operations. 
        //       Let's address the specific problems you mentioned: ${componentText}.`
        //         }
        //     ],
        // };

        // const response = await generateChatResponse(prompt);
        // console.log(response, 'respose gent')
        // if (response.err) {
        //     return res.json({
        //         status: 202,
        //         messages: "Chatgpt error res",
        //         error: response
        //     })
        // }
        // else {
        //     return res.json({
        //         status: 200,
        //         messages: "Success",
        //         data: response
        //     })
        // }
        let data= await pool.query(`select * from chat_search_history`)
        res.json({
            status:200,
            data
        })
    }
    catch (err) {
        console.log(err)
        return res.json({
            status: 500,
            messages: "Chatgpt error catch",
            error: err
        })
    }
})

app.listen(8443, () => {
    console.log('Server started on port 3000');
});
