 from flask import Flask, render_template, request, redirect, url_for, flash, session,jsonify,json
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_required, UserMixin, login_user, current_user, logout_user
from sqlalchemy import DateTime, desc, func
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import relationship, sessionmaker


app = Flask(__name__)

login_manager = LoginManager(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:2345@localhost:5432/advanced-sale-system"
db = SQLAlchemy(app)
app.secret_key = b'eric'


class Products(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    uom_id = db.Column(db.Integer, db.ForeignKey("uom.uom_id"))
    price_per_unit = db.Column(db.Numeric(precision=14, scale=2))
    order_details = db.relationship("OrderDetails", back_populates="product")
    uom = db.relationship("Uom", back_populates="products")



class Uom(db.Model):
    __tablename__ = 'uom'
    uom_id = db.Column(db.Integer, primary_key=True)
    uom_name = db.Column(db.String(20))
    products = db.relationship("Products", back_populates="uom")



class Orders(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100))
    total = db.Column(db.Numeric(scale=2))
    datetime = db.Column(db.DateTime, default=db.func.current_timestamp())
    order_details = db.relationship("OrderDetails", back_populates="order")

class OrderDetails(db.Model):
    __tablename__ = 'order_details'
    order_detail_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.order_id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"))
    quantity = db.Column(db.Numeric(precision=15, scale=2))
    total_price = db.Column(db.Numeric(precision=15, scale=2))
    product = db.relationship('Products', back_populates='order_details')
    order = db.relationship('Orders', back_populates='order_details')


class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))


@app.route("/")
def index():
    return render_template("landing.html")




@app.route("/home")
def home():
    return render_template("home.html")



@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == 'POST':
        password = request.form['password']
        email = request.form['email']
        hashed_pass = generate_password_hash(password)
        # Email Validation
        user = Users.query.filter_by(email=email).first()
        if user:
            flash("Email is already in use")
        elif not password or not email:
            flash("Please fill all the inputs")
        else:
            new_user = Users(email=email,
                             password=hashed_pass)
            db.session.add(new_user)
            db.session.commit()
            flash("You have registered successfully!")
            return redirect(url_for("login"))

    return render_template("register.html")



@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = Users.query.filter_by(email=email).first()
        print("User to be verify:", user)
        remember = True if request.form.get(
            'remember-me') else False  # ternary cond-exp
        if remember:
            print("remember checked")

        if user:
            if check_password_hash(user.password, password):
                # Successfully logged in, store user info in the session
                print("User authenticated:", user)
                login_user(user)
                flash("Logged in successfully!")
                print("Logged in successfully!")
                return redirect(url_for("dashboard"))
            else:
                flash("Invalid email or password")
                print("Invalid email or password")
        else:
            flash("User doesnt exist..! please register")
            print("User doesnt exist..! please register")
        
    return render_template("login.html")



# get products
@app.route("/products", methods=["GET", "POST"])
@login_required
def products():
    products = Products.query.all()
    uoms = Uom.query.all()
    prods = [product for product in products]
    print(prods)
    uom_s = [uom for uom in uoms]
    print(uom_s)
    return render_template("products.html", products=prods, uoms=uom_s)



# list products to be used in the select tag whle making sales
@app.route("/list-products", methods=["GET"])
def list_products():
    # Use the query method to retrieve all records from the products table
    products = Products.query.all()

    # Convert the SQLAlchemy model objects to dictionaries
    product_data = [{'product_id': product.product_id, 'name': product.name, 'price_per_unit':product.price_per_unit} for product in products]

    # jsonify the list of dictionaries
    response = jsonify(product_data)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response



@app.route("/add-product", methods=["POST"])
def add_product():
    name = request.form["p_name"]
    uom = int(request.form["uom"])
    price = float(request.form["price"])

    # Create a new product instance with the form data
    new_product = Products(name=name,uom_id=uom,price_per_unit=price)

    # Add the new product to the database session
    db.session.add(new_product)

    # Commit the changes to the database
    db.session.commit()
    flash("Succesfull added")

    return redirect(url_for("products"))



@app.route('/edit-product',methods=['POST'])
def edit_product():

    id = request.form['p_id']
    row = Products.query.filter_by(product_id = id).one()
    row.name = request.form['n_name']
    row.uom_id = request.form['n_uom']
    row.price_per_unit = request.form['n_price']

    db.session.merge(row)
    db.session.commit()

    return redirect(url_for('products'))



@app.route("/delete-product", methods=['POST'])
def delete_product():
    id = request.form['p_id']

    
    product = Products.query.get(id)

    db.session.delete(product) 
    db.session.commit()
    return redirect(url_for('products')) 


# get sales
@app.route("/sales", methods=["GET"])
@login_required
def sales():
    orders = Orders.query.all()
    data = [order for order in orders]
    print(data)
    return render_template("sales.html", orders=data)



@app.route('/add-sale')
def add_sale():
    return render_template('add-sale.html')


@app.route('/insertOrder', methods=['POST'])
def insert_order():
    request_payload = request.get_json()  
    customer_name = request_payload['customer_name']
    total = request_payload['grand_total']
    order_details = request_payload['order_details']

    # Create a new order using SQLAlchemy
    new_order = Orders(customer_name=customer_name, total=total)
    db.session.add(new_order)
    db.session.flush()  
    new_order_id = new_order.order_id
    # Create order details associated with the order
    for detail in order_details:
        product_id = detail['product_id']
        quantity = detail['quantity']
        total_price = detail['total_price']

        new_order_detail = OrderDetails(order_id=new_order_id, product_id=product_id, quantity=quantity, total_price=total_price)
        db.session.add(new_order_detail)

    db.session.commit()
    flash("Sale added succecfully")  

    return jsonify({'order_id': new_order.order_id})
 

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# Define a custom error handler for 404 Not Found
@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


@app.route("/logout")
def logout():
    logout_user()
    flash("Logged out successfully")
    return redirect(url_for("index"))


if __name__ == '__main__':
    app.run(debug=True)
