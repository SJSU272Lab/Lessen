var Billing = require('../model/billing');
var User = require('../model/user');
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";
var mongo = require("./mongo");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var pdf = require('pdfkit');
var fs = require('fs');
var pdfMake = require('pdfmake');
var pdfMakePrinter = require('pdfmake/src/printer');
var Twitter = require('twitter');

/*var client = new Twitter({
 consumer_key: 	'sZiEb2IfPWojSOcdHTm1ziHyD',//sZiEb2IfPWojSOcdHTm1ziHyD,//process.env.TWITTER_CONSUMER_KEY,
 consumer_secret: 	'dXnAvqaOU1DJfyZRwBt89vrtowl6ktERRgZeGSguDeG32IDwsW',//process.env.TWITTER_CONSUMER_SECRET,
 bearer_token: '2353034054-vUPjlz1orl0UWDtogpii9ug1N7Z3k0ZsgObJKJ4'//process.env.TWITTER_BEARER_TOKEN
 });*/

var client = new Twitter({
    consumer_key: 	'sZiEb2IfPWojSOcdHTm1ziHyD',
    consumer_secret: 	'dXnAvqaOU1DJfyZRwBt89vrtowl6ktERRgZeGSguDeG32IDwsW',
    access_token_key: '2353034054-vUPjlz1orl0UWDtogpii9ug1N7Z3k0ZsgObJKJ4',
    access_token_secret: 'hUIfxiStQx6I5HVVjn4YVKu8FeNGOO2hxL8vRIWV1iF3K'
});



var transporter = nodemailer.createTransport(
    smtpTransport('smtps://lessenmaster911%40gmail.com:lessenmaster@smtp.gmail.com')
);

//Show top cities to schedule pickup for
exports.invoices = function (req, res, next) {
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var productColl = mongo.collection('product');
        productColl.aggregate([
            {
                $match: {"nameValuePairs.is_pickup_pending": true}
            },
            {
                $match: {"nameValuePairs.is_admin_approved": true}
            },
            {
                $group: {
                    _id: "$nameValuePairs.product_seller.user_city",
                    count: {
                        $sum: 1
                    }
                }
            },
            {$sort: {count: -1}},
        ], function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);
            res.send(result);
        });

    });

};

//Get product info, city wise
exports.getInvoice = function (req, res) {
    var cityID = req.param("_id");
    // var pdfdata = [];
    mongo.connect(mongoURL, function () {
        var productColl = mongo.collection('product');
        productColl.find({
            "nameValuePairs.product_seller.user_city": cityID,
            "nameValuePairs.is_admin_approved": true,
            "nameValuePairs.is_pickup_pending": true
        }).toArray(function (err, products) {
            if (err) {
                throw err;
            }
            console.log("Products waiting for notifying logistics: ", products);
            res.send(products);
        });
    });


};

exports.notifyLogistics = function (req, res) {
    var cityID = req.param("_id");
    // var pdfdata = [];
    mongo.connect(mongoURL, function () {
        var productColl = mongo.collection('product');
        var pickupColl = mongo.collection('pickup');
        productColl.find({
            "nameValuePairs.product_seller.user_city": cityID,
            "nameValuePairs.is_admin_approved": true,
            "nameValuePairs.is_pickup_pending": true
        }).toArray(function (err, products) {
            if (err) {
                throw err;
            }

            //Update is_pickup_pending flag, add is_pickup_completed flag, push product_id's into new collection
            console.log("Products length is: ", products.length);
/*            for (var j = 0; j < products.length; j++) {

                var product_id_object = require('mongodb').ObjectID(products[j]._id);
                var product_name = products[j].product_name;
                var product_seller = products[j].product_seller.user_firstName;
                var product_city = products[j].product_seller.user_city;

                console.log("Products are @outside: ", products[j].product_name);
                console.log("Product id of product being updated is: ", product_id_object, j);

                productColl.update({_id: product_id_object}, {$set: {is_pickup_pending: false}}, function (err, product) {

                    console.log("Products are @inside: ", products[i].product_name, i);
                    console.log("Value of J @inside: ",  j);
                    if (err) {
                        throw err;
                    } else {
                        console.log("Product ID here is: ", product_id_object);
                        pickupColl.insertOne({
                            product_id: product_id_object,
                            product_name: product_name,
                            product_seller: product_seller,
                            product_city: product_city,
                            is_pickup_completed: false
                        }, function (err, result) {

                            if (err) {
                                console.log("Error while inserting: ", err);
                                throw err;
                            } else {
                                console.log("Inserted into new collection succesfully");
                            }
                        });
                    }
                });
            }*/
            products.forEach(function(listItem, index){
                productColl.update({_id: require('mongodb').ObjectID(listItem._id)}, {$set: {"nameValuePairs.is_pickup_pending": false}}, function (err, product) {
                    console.log("Products are @inside: ", listItem.nameValuePairs.product_name, index);
                    if (err) {
                        throw err;
                    } else {
                     //   console.log("Product ID here is: ", product_id_object);
                        pickupColl.insertOne({
                            product_id: listItem._id,
                            product_name : listItem.nameValuePairs.product_name,
                            product_seller : listItem.nameValuePairs.product_seller.user_firstName,
                            product_city : listItem.nameValuePairs.product_seller.user_city,
                            is_pickup_completed: false
                        }, function (err, result) {

                            if (err) {
                                console.log("Error while inserting: ", err);
                                throw err;
                            } else {
                                console.log("Inserted into new collection succesfully");
                            }
                        });
                    }
                });

            });

    var value1= '';var value2= '';var value3= '';var value4= '';var value5= '';var value6= '';
            var value7= '';var value8= '';var value9= '';var value10= '';
            var value11= '';var value12= '';var value13= '';var value14= '';var value15= '';
            var value16= '';var value17= '';var value18= '';var value19= '';var value20= '';

            var value21= '';var value22= '';var value23= '';var value24= '';var value25= '';var value26= '';
            var value27= '';var value28= '';var value29= '';var value30= '';
            var value31= '';var value32= '';var value33= '';var value34= '';var value35= '';
            var value36= '';var value37= '';var value38= '';var value39= '';var value40= '';

            var i = 0;
            if (products[i] && products[i].nameValuePairs) {
             value1 = products[0].nameValuePairs.product_name;
             value2 = products[0].nameValuePairs.product_seller.user_firstName;
             value3 = products[0].nameValuePairs.product_seller.user_address+", "+products[0].nameValuePairs.product_seller.user_city+", "+products[0].nameValuePairs.product_seller.user_state;
             value4 = products[0].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value5 = products[1].nameValuePairs.product_name;
                value6 = products[1].nameValuePairs.product_seller.user_firstName;
                value7 = products[1].nameValuePairs.product_seller.user_address+", "+products[1].nameValuePairs.product_seller.user_city+", "+products[1].nameValuePairs.product_seller.user_state;
                value8 = products[1].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value9 = products[2].nameValuePairs.product_name;
                value10 = products[2].nameValuePairs.product_seller.user_firstName;
                value11 = products[2].nameValuePairs.product_seller.user_address+", "+products[2].nameValuePairs.product_seller.user_city+", "+products[2].nameValuePairs.product_seller.user_state;
                value12 = products[2].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value13 = products[3].nameValuePairs.product_name;
                value14 = products[3].nameValuePairs.product_seller.user_firstName;
                value15= products[3].nameValuePairs.product_seller.user_address+", "+products[3].nameValuePairs.product_seller.user_city+", "+products[3].nameValuePairs.product_seller.user_state;
                value16 = products[3].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value17 = products[4].nameValuePairs.product_name;
                value18 = products[4].nameValuePairs.product_seller.user_firstName;
                value19 = products[4].nameValuePairs.product_seller.user_address+", "+products[4].nameValuePairs.product_seller.user_city+", "+products[4].nameValuePairs.product_seller.user_state;
                value20 = products[4].nameValuePairs.product_seller.user_phone;
                i++;
            }


            if (products[i] && products[i].nameValuePairs) {
                value21 = products[5].nameValuePairs.product_name;
                value22 = products[5].nameValuePairs.product_seller.user_firstName;
                value23 = products[5].nameValuePairs.product_seller.user_address+", "+products[5].nameValuePairs.product_seller.user_city+", "+products[5].nameValuePairs.product_seller.user_state;
                value24 = products[5].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value25 = products[6].nameValuePairs.product_name;
                value26 = products[6].nameValuePairs.product_seller.user_firstName;
                value27 = products[6].nameValuePairs.product_seller.user_address+", "+products[6].nameValuePairs.product_seller.user_city+", "+products[6].nameValuePairs.product_seller.user_state;
                value28 = products[6].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value29 = products[7].nameValuePairs.product_name;
                value30 = products[7].nameValuePairs.product_seller.user_firstName;
                value31 = products[7].nameValuePairs.product_seller.user_address+", "+products[7].nameValuePairs.product_seller.user_city+", "+products[7].nameValuePairs.product_seller.user_state;
                value32 = products[7].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value33 = products[8].nameValuePairs.product_name;
                value34 = products[8].nameValuePairs.product_seller.user_firstName;
                value35= products[8].nameValuePairs.product_seller.user_address+", "+products[8].nameValuePairs.product_seller.user_city+", "+products[8].nameValuePairs.product_seller.user_state;
                value36 = products[8].nameValuePairs.product_seller.user_phone;
                i++;
            }
            if (products[i] && products[i].nameValuePairs) {
                value37 = products[9].nameValuePairs.product_name;
                value38 = products[9].nameValuePairs.product_seller.user_firstName;
                value39 = products[9].nameValuePairs.product_seller.user_address+", "+products[9].nameValuePairs.product_seller.user_city+", "+products[9].nameValuePairs.product_seller.user_state;
                value40 = products[9].nameValuePairs.product_seller.user_phone;
                i++;
            }


            //create PDF
            /* var myDoc = new pdf;
             // myDoc.pipe(fs.createWriteStream('./test.pdf'));
             myDoc.font('Times-Roman')
             .fontSize(12)
             .text(value, 100, 100);
             //myDoc.rect(myDoc.x, 0, 410, myDoc.y).stroke();
             myDoc.end();
             */
            var fonts = {
                Roboto: {
                    normal: '/Users/apoorvajagadeesh/Desktop/Fonts/raleway/Raleway-Regular.ttf',
                    bold: '/Users/apoorvajagadeesh/Desktop/Fonts/raleway/Raleway-Bold.ttf',
                    italics: '/Users/apoorvajagadeesh/Desktop/Fonts/raleway/Raleway-Light.ttf',
                    bolditalics: '/Users/apoorvajagadeesh/Desktop/Fonts/raleway/Raleway-Heavy.ttf',
                }
            };

            var PdfPrinter = require('pdfmake/src/printer');
            var printer = new PdfPrinter(fonts);

            var docDefinition = {
                content: [
                    { text: 'Lessen Pickup Schedule', style: 'header' },

                    {
                       /* table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,
                            widths: ['auto', 'auto', 'auto', 'auto'],

                            body: [
                                [{text: 'Product', bold: true},
                                    {text: 'Donor', bold: true},
                                    { text: 'Address', bold: true},
                                 {text: 'Phone', bold: true},
                                    [value1, value2, value3, value4]],
                                //[value1, value2, value3, value4],

                            ]
                        }*/
                        table: {
                            headerRows: 1,
                            body: [
                                [{ text: 'Product', style: 'tableHeader' }, { text: 'Donor', style: 'tableHeader'}, { text: 'Address', style: 'tableHeader' },{ text: 'Phone', style: 'tableHeader' }],
                                [ value1, value2, value3, value4 ],
                                [ value5, value6, value7, value8 ],
                                [ value9, value10, value11, value12 ],
                                [ value13, value14, value15, value16 ],
                                [ value17, value18, value19, value20 ],
                                [ value21, value22, value23, value24 ],
                                [ value25, value26, value27, value28 ],
                                [ value29, value30, value31, value32 ],
                                [ value33, value34, value35, value36 ],
                                [ value37, value38, value39, value40 ]
                            ]
                        },
                        layout: 'noBorders'
                    },

                    { text: 'Lessen- Be a noble donor', bold:true},
                    { text: 'Lessen Inc', bold:true},
                    { text: '1 Washington Square Inc', bold:true},
                    { text: 'Downtown San Jose', bold:true},
                    { text: '95192', bold:true}
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                }

            };

            var pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.end();

            //Send email
            transporter.sendMail({
                from: 'lessenmaster911@gmail.com',
                to: 'lessenlogistics@gmail.com',
                subject: 'Lessen Pickup Schedule',
                text: 'PFA document and kindly arrange for pickup.',
                attachments: {
                    // stream as an attachment
                    filename: 'lessen_pickup.pdf',
                    content: pdfDoc
                }
            }, function (error, response) {
                console.log('Trying to send email');
                if (error) {
                    console.log("Email send failed", error);
                } else {
                    console.log('Email sent');
                }
            });

            // console.log("Products are: ", products);
            res.send(products);
        });
    });

};

exports.createEvent = function (req, res) {

    var eventName = req.param("eventName");
    var eventMsg = req.param("eventMsg");
    var eventDate = req.param("doe");
    var location = req.param("location");
    console.log(eventName, eventMsg, eventDate, location);

    mongo.connect(mongoURL, function () {
        var eventColl = mongo.collection('events');
        eventColl.insertOne({
            eventName: eventName,
            eventMsg: eventMsg,
            eventDate: eventDate,
            location: location
        }, function (err, result) {

            if (err) {
                console.log("Error while inserting: ", err);
                throw err;
            } else {
                console.log("Inserted into new collection succesfully, tweeting");
                var status = eventName + '- ' + eventMsg + ' on ' + eventDate + ' at ' + location + ' #lessen' + ' #donate' + ' #donationDrive';
                client.post('statuses/update', {status: status},  function(error, tweet, response) {
                    if(error) {
                        console.log(error)
                    };
                    console.log("Tweeted: ", tweet);  // Tweet body.
                    //console.log(response);  // Raw response object.

                });
                res.send(200);
            }
        });
    });

};

exports.admin_eventManagement = function (req, res) {
    console.log("Trying to render event management page");
    res.render('admin_eventManagement');
};