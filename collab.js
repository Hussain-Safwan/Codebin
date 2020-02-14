const router = require("express").Router;

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fs = require('fs')

const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

exports.openCollab = async(req, res) => {
    const path = "./data.txt";
    const sourceCode = req.body.sourceCollab
    await write_file(path, sourceCode)

    fs.readFile(path, "utf8", async(err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const id = "5e243df41d878d16693da671";
        res.render("index", {
            dbSource: data
        });
    });

    io.sockets.on("connection", socket => {
        //Connect
        connections.push(socket);
        console.log("connected: ", connections.length);

        //Disconnect
        socket.on("disconnect", data => {
            connections.splice(connections.indexOf(socket), 1);
            console.log("disconnected! left:  ", connections.length);
        });

        //Send Message
        socket.on("send message", data => {
            console.log(data)
            write_file(path, data);
        });

        const fs = require("fs");
        fs.watchFile(path, { interval: 3000 }, async(curr, prev) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                io.sockets.emit("new message", { msg: data });
            });
        });

    })
}

function write_file(path, data) {
    fs.writeFile(path, data, function(err) {
        if (err) throw err;
    });
}

//   //Change trigger
//   socket.on("trigger change", data => {
//     const id = "5e243df41d878d16693da671";
//     sourceCodeModule.updateOne(
//       { _id: id },
//       { $set: { trigger: data } },
//       (err, docs) => {}
//     );
//   });

//   //Watch cahnges
//   sourceCodeModule.watch().on("change", data => {
//     let codeString = data.updateDescription.updatedFields.codeBody;
//     let trigger = data.updateDescription.updatedFields.trigger;
//     if (codeString == null) {
//       io.sockets.emit("trigger change", { trig: trigger });
//     }
//   });

//   //Upload to database
//   function upload(codeBody) {
//     const updatedSource = new sourceCodeModule({
//       codeBody
//     });
//     updatedSource.save().then((err, post) => {
//       console.log("uploaded!");
//     });
//   }
// });

// const flushTime = 2000 * 60;
// setTimeout(() => {
//   const id = "5e243df41d878d16693da671";
//   fs.readFile(path, "utf8", (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     sourceCodeModule.updateOne(
//       { _id: id },
//       { $set: { codeBody: data } },
//       (err, docs) => {}
//     );
//   });
// }, flushTime);