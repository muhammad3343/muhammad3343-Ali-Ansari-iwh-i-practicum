const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

require('dotenv').config()
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.hubapi.com/crm/v3/objects/pets?properties=pet_name&properties=pet_color&properties=nickname&archived=false', {
            headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`
            }
        });
        const records = response.data.results;
        console.log(records);
        res.render('homepage', { records });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving records');
    }
});
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});
const objectTypeId = 'pets';

app.post('/update-cobj', async (req, res) => {
    const { pet_name, pet_color, nickname } = req.body;
    console.log('Received Data:', req.body);

    try {
        const response = await axios.post('https://api.hubapi.com/crm/v3/objects/pets', {
            properties: {
                pet_name: pet_name,
                pet_color: pet_color,
                nickname: nickname
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`
            }
        });

        console.log('Response from HubSpot:', response.data);
        res.redirect('/');
    } catch (error) {
        console.error('Error creating record:', error.response.data); // Log detailed error
        res.status(500).send('Error creating record');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
