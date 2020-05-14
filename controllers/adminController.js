const express = require('express');
const router = express.Router();
const adminData = require('../data/admin.json');
const playerData = require('../data/player.json');
const coachData = require('../data/coach.json');
const sponsorData = require('../data/sponsor.json');
const nullFilter = require('./nullFilter');
const fs = require('fs');
let user = '';

const auth = (req, res, next) => {
    if (req.session && req.session.user === user && req.session.admin)
        return next();

    else
        return res.redirect('./login?err=010');
};

router.get('/index', auth, (req, res) => {
    res.render('admin', { user });
});

router.get('/login', (req, res) => {
    const err = req.query.err;
    let error;
    if (err === '010') {
        error = "Unauthorized - Please Login"
    }
    if (err === '020') {
        error = "Login Unsuccessfull, Please Enter Correct Username or Password"
    }
    res.render('login', { error });
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const index = adminData.index[email];
    const data = adminData.data[index];

    try {

        if (email === data.email && password !== data.password) {
            res.redirect('/admin/login');
        }
        else if (email === data.email && password === data.password) {
            user = data.username;
            req.session.user = user;
            req.session.admin = true;
            res.redirect('/admin/index');
        }
    }
    catch (err) {
        res.redirect('/admin/login?err=020')
    }

});

router.get('/playerList', auth, (req, res) => {
    res.render('players/playerList', { players: playerData.data })
});

router.get('/playerCreate', (req, res) => {
    res.render('players/playerCreate')
});
router.get('/playerDelete', auth, (req, res) => {
    const playerId = req.query.playerId;
    res.render('players/playerDelete', { playerId });
});
router.get('/playerEdit', auth, (req, res) => {
    const playerId = req.query.playerId;
    const index = playerData.index[playerId];
    const data = playerData.data[index];
    res.render('players/playerEdit', { players: data });
});

router.post('/playerInfo', auth, (req, res) => {
    const { playerId } = req.body;
    const index = playerData.index[playerId];
    const data = playerData.data[index];
    console.log(playerId, data);
    res.render('players/playerInfo', { players: data })
})

router.post('/playerCreate', (req, res) => {
    const { playerName, gender, height, weight, year, contact, usn, sports, role } = req.body;
    const id = 'py-' + (Object.keys(playerData.index).length + 1);
    const dataObject = {
        "playerName": playerName,
        "playerId": id,
        "gender": gender,
        "height": height,
        "weight": weight,
        "year": year,
        "contact": contact,
        "usn": usn,
        "sports": sports,
        "role": role
    };


    fs.readFile('data/player.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            playerData.index[(id)] = Object.keys(playerData.index).length
            //console.log(indexObject);
            playerData.data.push(dataObject);
            //playerData.index.push(indexObject);
            console.log(playerData);
            json = JSON.stringify(playerData); //convert it back to json
            fs.writeFile('data/player.json', json, 'utf8');
            // write it back 
            res.redirect('/?mes=1')
        }
    });
});

router.post('/playerDelete', auth, (req, res) => {

    const { playerId } = req.body;
    console.log(playerData)
    const index = playerData.index[playerId];
    playerData.data.splice(index, 1);
    //delete playerData.data[index];
    delete playerData.index[playerId];
    player = playerData.data.filter(function (x) { return x !== null });
    const obj = {
        index: playerData.index,
        data: player
    }
    const json = JSON.stringify(obj);
    fs.writeFile('data/player.json', json, 'utf8');
    res.redirect('/admin/playerList')


});

router.post('/playerEdit', auth, (req, res) => {
    const { playerName, gender, height, weight, year, contact, playerId, usn, sports, role } = req.body;
    const index = playerData.index[playerId];
    const data = playerData.data[index];
    console.log(data.playerName);
    data.playerName = playerName;
    data.gender = gender;
    data.height = height;
    data.weight = weight;
    data.year = year;
    data.contact = contact;
    data.usn = usn;
    data.sports = sports;
    data.role = role;
    fs.readFile('data/player.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {

            json = JSON.stringify(playerData); //convert it back to json
            fs.writeFile('data/player.json', json, 'utf8');
            // write it back 
            res.redirect('/admin/playerList')
        }
    });
});
//=============================================================================================================================

router.get('/coachList', auth, (req, res) => {
    res.render('coach/coachList', { coaches: coachData.data })
});

router.get('/coachCreate', (req, res) => {
    res.render('coach/coachCreate')
});
router.get('/coachDelete', auth, (req, res) => {
    const coachId = req.query.coachId;
    res.render('coach/coachDelete', { coachId });
});
router.get('/coachEdit', auth, (req, res) => {
    const coachId = req.query.coachId;
    const index = coachData.index[coachId];
    const data = coachData.data[index];
    res.render('coach/coachEdit', { coaches: data });
});

router.post('/coachInfo', auth, (req, res) => {
    const { coachId } = req.body;
    const index = coachData.index[coachId];
    const data = coachData.data[index];
    console.log(coachId, data);
    res.render('coach/coachInfo', { coaches: data })
})

router.post('/coachCreate', (req, res) => {
    const { coachName, experience, contact, ssn, sports } = req.body;
    const id = 'co-' + (Object.keys(coachData.index).length + 1);
    const dataObject = {
        "coachName": coachName,
        "coachId": id,
        "ssn": ssn,
        "sports": sports,
        "experience": experience,
        "contact": contact
    };


    fs.readFile('data/coach.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            coachData.index[(id)] = Object.keys(coachData.index).length
            //console.log(indexObject);
            coachData.data.push(dataObject);
            //coachData.index.push(indexObject);
            console.log(coachData);
            json = JSON.stringify(coachData); //convert it back to json
            fs.writeFile('data/coach.json', json, 'utf8');
            // write it back 
            res.redirect('/?mes=1')
        }
    });
});

router.post('/coachDelete', auth, (req, res) => {

    const { coachId } = req.body;
    console.log(coachData)
    const index = coachData.index[coachId];

    //delete coachData.data[index];
    coachData.data.splice(index, 1);
    delete coachData.index[coachId];
    coach = coachData.data.filter(function (x) { return x !== null });
    const obj = {
        index: coachData.index,
        data: coach
    }
    const json = JSON.stringify(obj);
    fs.writeFile('data/coach.json', json, 'utf8');
    res.redirect('/admin/coachList')


});

router.post('/coachEdit', auth, (req, res) => {
    const { coachName, coachId, experience, contact, ssn, sports } = req.body;
    const index = coachData.index[coachId];
    const data = coachData.data[index];
    console.log(data.coachName);
    data.coachName = coachName;
    data.experience = experience;
    data.contact = contact;
    data.ssn = ssn;
    data.sports = sports;
    fs.readFile('data/coach.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {

            json = JSON.stringify(coachData); //convert it back to json
            fs.writeFile('data/coach.json', json, 'utf8');
            // write it back 
            res.redirect('/admin/coachList')
        }
    });
});
//==============================================================================================================

router.get('/sponsorList', auth, (req, res) => {
    res.render('sponsor/sponsorList', { sponsors: sponsorData.data })
});

router.get('/sponsorCreate', (req, res) => {
    res.render('sponsor/sponsorCreate')
});
router.get('/sponsorDelete', auth, (req, res) => {
    const sponsorId = req.query.sponsorId;
    res.render('sponsor/sponsorDelete', { sponsorId });
});
router.get('/sponsorEdit', auth, (req, res) => {
    const sponsorId = req.query.sponsorId;
    const index = sponsorData.index[sponsorId];
    const data = sponsorData.data[index];
    res.render('sponsor/sponsorEdit', { sponsors: data });
});

router.post('/sponsorInfo', auth, (req, res) => {
    const { sponsorId } = req.body;
    const index = sponsorData.index[sponsorId];
    const data = sponsorData.data[index];
    console.log(sponsorId, data);
    res.render('sponsor/sponsorInfo', { sponsors: data })
})

router.post('/sponsorCreate', (req, res) => {
    const { sponsorName, contact, ssn, email, location } = req.body;
    const id = 'sp-' + (Object.keys(sponsorData.index).length + 1);
    const dataObject = {
        "sponsorName": sponsorName,
        "sponsorId": id,
        "ssn": ssn,
        "email": email,
        "contact": contact,
        "location": location
    };


    fs.readFile('data/sponsor.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            sponsorData.index[(id)] = Object.keys(sponsorData.index).length
            //console.log(indexObject);
            sponsorData.data.push(dataObject);
            //sponsorData.index.push(indexObject);
            console.log(sponsorData);
            json = JSON.stringify(sponsorData); //convert it back to json
            fs.writeFile('data/sponsor.json', json, 'utf8');
            // write it back 
            res.redirect('/?mes=1')
        }
    });
});

router.post('/sponsorDelete', auth, (req, res) => {

    const { sponsorId } = req.body;
    console.log(sponsorData)
    const index = sponsorData.index[sponsorId];

    //delete sponsorData.data[index];
    sponsorData.data.splice(index, 1);
    delete sponsorData.index[sponsorId];
    sponsor = sponsorData.data.filter(function (x) { return x !== null });
    const obj = {
        index: sponsorData.index,
        data: sponsor
    }
    const json = JSON.stringify(obj);
    fs.writeFile('data/sponsor.json', json, 'utf8');
    res.redirect('/admin/sponsorList')


});

router.post('/sponsorEdit', auth, (req, res) => {
    const { sponsorName, sponsorId, contact, ssn, email, location } = req.body;
    const index = sponsorData.index[sponsorId];
    const data = sponsorData.data[index];
    console.log(data.sponsorName);
    data.sponsorName = sponsorName;
    data.email = email;
    data.location = location;
    data.contact = contact;
    data.ssn = ssn;

    fs.readFile('data/sponsor.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {

            json = JSON.stringify(sponsorData); //convert it back to json
            fs.writeFile('data/sponsor.json', json, 'utf8');
            // write it back 
            res.redirect('/admin/sponsorList')
        }
    });
});

//======================================================================================================================================

router.get('/adminList', auth, (req, res) => {
    res.render('admin/adminList', { admins: adminData.data })
});

router.get('/adminCreate', (req, res) => {
    res.render('admin/adminCreate')
});
router.get('/adminDelete', auth, (req, res) => {
    const email = req.query.email;
    res.render('admin/adminDelete', { email });
});
router.get('/adminEdit', auth, (req, res) => {
    const data = require('../data/admin.json');
    const email = req.query.email;
    const index = data.index[email];
    const adData = data.data[index];
    res.render('admin/adminEdit', { admins: adData });
});

router.post('/adminInfo', auth, (req, res) => {
    const { email } = req.body;
    const index = adminData.index[email];
    const data = adminData.data[index];
    console.log(email, data);
    res.render('admin/adminInfo', { admins: data })
})

router.post('/adminCreate', auth, (req, res) => {
    // const adData = require('../data/admin.json');
    const { firstName, lastName, username, email, password } = req.body;

    const dataObject = {
        "firstName": firstName,
        "lastName": lastName,
        "username": username,
        "email": email,
        "password": password
    };


    fs.readFile('data/admin.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            adminData.index[(email)] = Object.keys(adminData.data).length
            adminData.data.push(dataObject);
            console.log(adminData);
            json = JSON.stringify(adminData);
            fs.writeFile('data/admin.json', json, 'utf8');
            // write it back 
            res.redirect('/admin/adminList')
        }
    });
});

router.post('/adminDelete', auth, (req, res) => {

    const { email } = req.body;
    console.log(adminData)
    const index = adminData.index[email];
    adminData.data.splice(index, 1);
    // delete adminData.data[index];
    delete adminData.index[email];
    admin = adminData.data.filter(function (x) { return x !== null });
    const obj = {
        index: adminData.index,
        data: admin
    }
    const json = JSON.stringify(obj);
    fs.writeFile('data/admin.json', json, 'utf8');
    res.redirect('/admin/adminList')


});

router.post('/adminEdit', auth, (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    const index = adminData.index[email];
    const data = adminData.data[index];
    data.firstName = firstName;
    data.lastName = lastName;
    data.username = username;
    data.password = password;

    fs.readFile('data/admin.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {

            json = JSON.stringify(adminData); //convert it back to json
            fs.writeFile('data/admin.json', json, 'utf8');
            // write it back 
            res.redirect('/admin/adminList')
        }
    });
});
//=====================================================================================================================
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

router.get('/gallery', (req, res) => {
    res.render('gallery');
});

router.get('/googleSignin', (req, res) => {
    res.render('google');
});



module.exports = router;
