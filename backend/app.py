from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import os
import requests
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
from models import db, User, Product, Category, Order

load_dotenv()

app = Flask(__name__)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "tarim_pazari.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Upload configuration
UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Mail configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@tarim-pazari.com')

db.init_app(app)
mail = Mail(app)

# CORS configuration - allow Vercel frontend
CORS(app, origins=[
    "https://tarim-pazar.vercel.app",
    "https://*.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
], supports_credentials=True)

# Environment variables
DEBUG = os.getenv('DEBUG', 'True') == 'True'
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 5000))
RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY', '')

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Tarım Pazarı API', 'version': '1.0'})

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

# ===== USER ENDPOINTS =====
@app.route('/api/users/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not all(k in data for k in ['username', 'email', 'password', 'full_name', 'role']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        full_name=data['full_name'],
        role=data['role'],  # 'farmer' or 'producer'
        location=data.get('location', ''),
        phone=data.get('phone', '')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role
    }), 201

@app.route('/api/users/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not all(k in data for k in ['username', 'password']):
        return jsonify({'error': 'Missing username or password'}), 400
    
    # Verify reCAPTCHA token (temporarily disabled for testing)
    # recaptcha_token = data.get('recaptcha_token')
    # if RECAPTCHA_SECRET_KEY and recaptcha_token:
    #     try:
    #         recaptcha_response = requests.post(
    #             'https://www.google.com/recaptcha/api/siteverify',
    #             data={
    #                 'secret': RECAPTCHA_SECRET_KEY,
    #                 'response': recaptcha_token
    #             },
    #             timeout=5
    #         )
    #         recaptcha_data = recaptcha_response.json()
    #         
    #         if not recaptcha_data.get('success'):
    #             return jsonify({'error': 'reCAPTCHA verification failed'}), 400
    #     except Exception as e:
    #         print(f"reCAPTCHA verification error: {str(e)}")
    
    # Login with username or email
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        user = User.query.filter_by(email=data['username']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid username/email or password'}), 401
    
    # Send security notification email
    try:
        msg = Message(
            subject='Güvenlik Bildirimi - Hesabınız Açıldı',
            recipients=[user.email],
            html=f"""
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #8B4FC2; text-align: center;">🔒 Güvenlik Bildirimi</h2>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Merhaba <strong>{user.full_name}</strong>,
                    </p>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Tarım Pazarı hesabınız az önce açıldı.
                    </p>
                    
                    <div style="background-color: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #856404; margin: 0;"><strong>⚠️ Eğer siz bu girişi yapmadıysanız:</strong></p>
                        <p style="color: #856404; margin: 10px 0 0 0;">Lütfen hemen şifrenizi değiştirin veya destek ekibine başvurun.</p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                        <strong>Giriş Bilgileri:</strong><br>
                        Tarih: {datetime.now().strftime('%d.%m.%Y %H:%M')}<br>
                        Kullanıcı: {user.username}
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 14px; text-align: center;">
                        Sorunuz varsa: <strong>support@tarim-pazari.com</strong>
                    </p>
                </div>
            </div>
            """
        )
        mail.send(msg)
    except Exception as e:
        # E-posta gönderme başarısız olursa, login yine de devam eder
        print(f"Güvenlik e-postası gönderme hatası: {str(e)}")
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role,
        'location': user.location,
        'phone': user.phone
    }), 200

@app.route('/api/users/google-login', methods=['POST'])
def google_login():
    data = request.get_json()
    
    if not data or not all(k in data for k in ['google_id', 'email', 'full_name']):
        return jsonify({'error': 'Missing required Google OAuth data'}), 400
    
    # Check if user exists
    user = User.query.filter_by(google_id=data['google_id']).first()
    
    if user:
        # Existing Google user - just return user data
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'location': user.location,
            'phone': user.phone
        }), 200
    
    # Check if email already exists
    user = User.query.filter_by(email=data['email']).first()
    if user:
        # Update user with Google ID if not already set
        if not user.google_id:
            user.google_id = data['google_id']
            db.session.commit()
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'location': user.location,
            'phone': user.phone
        }), 200
    
    # New user - create account
    username = data['email'].split('@')[0]
    
    # Make sure username is unique
    counter = 1
    original_username = username
    while User.query.filter_by(username=username).first():
        username = f"{original_username}{counter}"
        counter += 1
    
    user = User(
        username=username,
        email=data['email'],
        password=None,  # No password for Google OAuth users
        full_name=data['full_name'],
        google_id=data['google_id'],
        role=data.get('role', 'farmer')  # Default to farmer
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Send welcome email
    try:
        msg = Message(
            subject='Google ile Tarım Pazarı\'na Hoş Geldiniz',
            recipients=[user.email],
            html=f"""
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #8B4FC2; text-align: center;">🌾 Tarım Pazarı'na Hoş Geldiniz!</h2>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Merhaba <strong>{user.full_name}</strong>,
                    </p>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Google hesabınız ile Tarım Pazarı'na başarıyla kaydolunuz.
                    </p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #8B4FC2; margin: 20px 0;">
                        <p style="color: #555; margin: 10px 0;"><strong>Kullanıcı Adı:</strong> {user.username}</p>
                        <p style="color: #555; margin: 10px 0;"><strong>E-posta:</strong> {user.email}</p>
                        <p style="color: #555; margin: 10px 0;"><strong>Kayıt Tarihi:</strong> {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
                    </div>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Sorularınız veya önerileriniz varsa bize <strong>support@tarim-pazari.com</strong> adresinden ulaşabilirsiniz.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
                    <p style="color: #999; font-size: 14px; text-align: center;">
                        Tarım Pazarı Ekibi
                    </p>
                </div>
            </div>
            """
        )
        mail.send(msg)
    except Exception as e:
        print(f"Hoşgeldiniz e-postası gönderme hatası: {str(e)}")
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role,
        'location': user.location,
        'phone': user.phone,
        'message': 'Google ile kaydınız başarılı!'
    }), 201

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role,
        'location': user.location,
        'phone': user.phone,
        'description': user.description
    })

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update fields if provided
    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'email' in data:
        user.email = data['email']
    if 'location' in data:
        user.location = data['location']
    if 'phone' in data:
        user.phone = data['phone']
    if 'description' in data:
        user.description = data['description']
    
    db.session.commit()
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role,
        'location': user.location,
        'phone': user.phone,
        'description': user.description
    }), 200

# ===== CATEGORY ENDPOINTS =====
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description
    } for c in categories])

@app.route('/api/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({'error': 'Missing name'}), 400
    
    category = Category(
        name=data['name'],
        description=data.get('description', '')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify({
        'id': category.id,
        'name': category.name,
        'description': category.description
    }), 201

# ===== PRODUCT ENDPOINTS =====
@app.route('/api/products', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id')
    seller_id = request.args.get('seller_id')
    search = request.args.get('search')
    
    query = Product.query.filter_by(is_active=True)
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    if seller_id:
        query = query.filter_by(seller_id=seller_id)
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    
    products = query.all()
    
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'quantity': p.quantity,
        'unit': p.unit,
        'seller_id': p.seller_id,
        'seller_name': p.seller.full_name,
        'category_id': p.category_id,
        'category_name': p.category.name,
        'image_url': p.image_url,
        'harvest_date': p.harvest_date.isoformat() if p.harvest_date else None,
        'location': p.location,
        'created_at': p.created_at.isoformat()
    } for p in products])

@app.route('/api/products', methods=['POST'])
def create_product():
    # Get form data
    if 'name' not in request.form or 'price' not in request.form or 'quantity' not in request.form:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Handle file upload
    image_url = ''
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(f"{int(datetime.now().timestamp())}_{file.filename}")
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_url = f'/api/uploads/{filename}'
    
    product = Product(
        name=request.form.get('name'),
        description=request.form.get('description', ''),
        price=float(request.form.get('price')),
        quantity=int(request.form.get('quantity')),
        unit=request.form.get('unit', 'kg'),
        seller_id=int(request.form.get('seller_id')),
        category_id=int(request.form.get('category_id')),
        image_url=image_url,
        location=request.form.get('location', '')
    )
    
    if request.form.get('harvest_date'):
        product.harvest_date = datetime.fromisoformat(request.form.get('harvest_date'))
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'quantity': product.quantity,
        'image_url': product.image_url
    }), 201

# Serve uploaded files
@app.route('/api/uploads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], secure_filename(filename))

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'quantity': product.quantity,
        'unit': product.unit,
        'seller_id': product.seller_id,
        'seller_name': product.seller.full_name,
        'seller_location': product.seller.location,
        'seller_phone': product.seller.phone,
        'category_id': product.category_id,
        'category_name': product.category.name,
        'image_url': product.image_url,
        'harvest_date': product.harvest_date.isoformat() if product.harvest_date else None,
        'location': product.location,
        'created_at': product.created_at.isoformat()
    })

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'quantity' in data:
        product.quantity = data['quantity']
    if 'unit' in data:
        product.unit = data['unit']
    if 'location' in data:
        product.location = data['location']
    
    product.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Product updated successfully'})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    product.is_active = False
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'})

# ===== ORDER ENDPOINTS =====
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    
    required_fields = ['product_id', 'seller_id', 'buyer_id', 'quantity']
    if not data or not all(k in data for k in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    product = Product.query.get(data['product_id'])
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    if product.quantity < data['quantity']:
        return jsonify({'error': 'Insufficient quantity'}), 400
    
    unit_price = product.price
    total_price = unit_price * data['quantity']
    
    order = Order(
        product_id=data['product_id'],
        seller_id=data['seller_id'],
        buyer_id=data['buyer_id'],
        quantity=data['quantity'],
        unit_price=unit_price,
        total_price=total_price,
        notes=data.get('notes', '')
    )
    
    # Reduce product quantity
    product.quantity -= data['quantity']
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify({
        'id': order.id,
        'product_id': order.product_id,
        'quantity': order.quantity,
        'unit_price': order.unit_price,
        'total_price': order.total_price,
        'status': order.status
    }), 201

@app.route('/api/orders', methods=['GET'])
def get_orders():
    buyer_id = request.args.get('buyer_id')
    seller_id = request.args.get('seller_id')
    status = request.args.get('status')
    
    query = Order.query
    
    if buyer_id:
        query = query.filter_by(buyer_id=buyer_id)
    if seller_id:
        query = query.filter_by(seller_id=seller_id)
    if status:
        query = query.filter_by(status=status)
    
    orders = query.all()
    
    return jsonify([{
        'id': o.id,
        'product_id': o.product_id,
        'product_name': o.product.name,
        'seller_id': o.seller_id,
        'seller_name': o.seller_user.full_name,
        'buyer_id': o.buyer_id,
        'buyer_name': o.buyer_user.full_name,
        'quantity': o.quantity,
        'unit_price': o.unit_price,
        'total_price': o.total_price,
        'status': o.status,
        'created_at': o.created_at.isoformat(),
        'notes': o.notes
    } for o in orders])

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.get_json()
    
    if 'status' in data:
        order.status = data['status']
    if 'delivery_date' in data:
        order.delivery_date = datetime.fromisoformat(data['delivery_date'])
    if 'notes' in data:
        order.notes = data['notes']
    
    order.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Order updated successfully', 'status': order.status})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create initial categories
        if Category.query.count() == 0:
            categories = [
                Category(name='Tahıl', description='Buğday, arpa, çavdar'),
                Category(name='Sebze', description='Domates, biber, salatalık'),
                Category(name='Meyve', description='Elma, armut, üzüm'),
                Category(name='Hayvansal Ürünler', description='Süt, yumurta, et'),
                Category(name='Yağlı Tohumlar', description='Ayçiçeği, kanola'),
                Category(name='Diğer', description='Diğer tarım ürünleri')
            ]
            db.session.add_all(categories)
            db.session.commit()
    
    # Use PORT environment variable for Railway
    port = int(os.getenv('PORT', 5000))
    
    # Initialize database on startup
    with app.app_context():
        db.create_all()
        print("Database initialized")
