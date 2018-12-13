var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "testpassword",
    database: "bamazon"
});


function connectDB(){
connection.connect(function (err) {

    if (err) throw err;



    displayInventory();



});
};

connectDB();


//Create start function that uses inquirer to ask for user input//

function start() {
   

    inquirer.prompt([
        {
            name: "idQuery",
            type: "input",
            message: "What is the ID of the item you'd like to buy?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"

        }
    ])
        .then(function (results) {
            checkQuantity(results.idQuery, results.quantity);



        })
};



function checkQuantity(idResult, quantityQuery) {
    connection.query("SELECT * FROM products WHERE ?",
        {
            item_id: parseInt(idResult),
        },
        function (err, res) {
            if (err) throw err;

            console.log(res[0].stock_quantity);

            if (res[0].stock_quantity < quantityQuery) {
                console.log("Insufficient Quantity!\n Select new item ID.\n")
                start();
                


            }
            else {
                console.log("......................\n" + "......................\n" + "......................\n" + "TRANSACTION COMPLETED! You're a smart shopper. Look at you!\n" + "......................\n" + "......................\n" + "......................\n"),

                    updateQuantity(res[0].stock_quantity, quantityQuery, idResult)
                    connection.end();
                    
            }
            
        }
       
    );
    
};

function updateQuantity(itemQuantity, quantityQuery, idResult) {
    connection.query("UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: itemQuantity - quantityQuery

        },
        {
            item_id: idResult
        }],
        function (err, res) {
            if (err) throw err;

            displayInventory();
            

        }
        

    )
    
};




function displayInventory() {
    var queryStr = 'SELECT * FROM products';

    connection.query(queryStr, function (err, products) {
        if (err) throw err;

        console.log('PRODUCT INVENTORY');
        console.log('_______________________\n');

        var strOut = '';

        for (var i = 0; i < products.length; i++) {
            strOut = '';

            strOut += 'Item ID: ' + products[i].item_id + ' | | ';
            strOut += 'Product Name: ' + products[i].product_name + ' | | ';
            strOut += 'Department Name: ' + products[i].department_name + ' | | ';
            strOut += 'Price: ' + products[i].price + ' | | ';
            strOut += 'Stock Quantity: ' + products[i].stock_quantity + ' | | ';
            console.log(strOut);
        }

        console.log("..........................\n");
        start();

      

    })
};

