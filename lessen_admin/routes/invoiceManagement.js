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
                $match: {is_pickup_pending: true}
            },
            {
                $match: {is_admin_approved: true}
            },
            {
                $group: {
                    _id: "$product_seller.user_city",
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
            "product_seller.user_city": cityID,
            is_admin_approved: true,
            is_pickup_pending: true
        }).toArray(function (err, products) {
            if (err) {
                throw err;
            }
            console.log("Products are: ", products);
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
            "product_seller.user_city": cityID,
            is_admin_approved: true,
            is_pickup_pending: true
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
                productColl.update({_id: require('mongodb').ObjectID(listItem._id)}, {$set: {is_pickup_pending: false}}, function (err, product) {
                    console.log("Products are @inside: ", listItem.product_name, index);
                    if (err) {
                        throw err;
                    } else {
                     //   console.log("Product ID here is: ", product_id_object);
                        pickupColl.insertOne({
                            product_id: listItem._id,
                            product_name : listItem.product_name,
                            product_seller : listItem.product_seller.user_firstName,
                            product_city : listItem.product_seller.user_city,
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


            var value1 = products[0].product_name;
            var value2 = products[0].product_seller.user_firstName;
            var value3 = products[0].product_seller.user_address;
            var value4 = products[0].product_seller.user_phone;
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

            var i = 0;
            var docDefinition = {
                content: [
                    'Lessen Pickup Schedule',
                    '',
                    {
                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,
                            widths: ['auto', 'auto', 'auto', 'auto'],

                            body: [
                                [{text: 'Product', bold: true}, {text: 'Donor', bold: true}, {
                                    text: 'Address',
                                    bold: true
                                }, {text: 'Phone', bold: true}],
                                //[value1, value2, value3, value4],
                                [products[i].product_name, value2, value3, value4],
                            ]
                        }
                    }
                ]
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


exports.admin_eventManagement = function (req, res) {
    res.render('admin_eventManagement');
};