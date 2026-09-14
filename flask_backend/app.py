"""
Pakistan Cloth House - Python Flask REST API & Database Server
Provides full REST endpoints for products, categories, orders, reviews, and authentication.
"""

import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Category, Product, Order, Review, FAQ
from database import get_database_uri

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = get_database_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# --- Health Check ---
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "Python Flask Database API",
        "time": datetime.utcnow().isoformat()
    })

# --- Authentication Routes ---
@app.route('/api/auth/google', methods=['POST'])
def auth_google():
    data = request.get_json() or {}
    email = (data.get('email') or '').lower().strip()
    name = data.get('name') or email.split('@')[0]
    avatar = data.get('avatar') or 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            id=f"user-{uuid.uuid4().hex[:12]}",
            name=name,
            email=email,
            role='customer',
            status='active',
            phone='+92 300 1234567',
            avatar=avatar
        )
        db.session.add(user)
        db.session.commit()

    token = f"token-{user.id}-{int(datetime.utcnow().timestamp())}"
    return jsonify({
        "user": user.to_dict(),
        "token": token,
        "message": "Google Sign-In successful"
    })

@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    data = request.get_json() or {}
    email = (data.get('email') or '').lower().strip()
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        role = 'admin' if 'admin' in email else 'customer'
        user = User(
            id=f"user-{uuid.uuid4().hex[:12]}",
            name="Admin PCH" if role == 'admin' else email.split('@')[0],
            email=email,
            role=role,
            status='active',
            phone='+92 300 0000000' if role == 'admin' else '+92 300 1111111'
        )
        db.session.add(user)
        db.session.commit()

    if user.status == 'inactive':
        return jsonify({"error": "This account is inactive"}), 403

    token = f"token-{user.id}-{int(datetime.utcnow().timestamp())}"
    return jsonify({
        "user": user.to_dict(),
        "token": token,
        "message": "Login successful"
    })

@app.route('/api/auth/register', methods=['POST'])
def auth_register():
    data = request.get_json() or {}
    name = data.get('name')
    email = (data.get('email') or '').lower().strip()
    phone = data.get('phone', '')

    if not name or not email:
        return jsonify({"error": "Name and Email are required"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "An account with this email already exists"}), 400

    user = User(
        id=f"user-{uuid.uuid4().hex[:12]}",
        name=name,
        email=email,
        phone=phone,
        role='customer',
        status='active'
    )
    db.session.add(user)
    db.session.commit()

    token = f"token-{user.id}-{int(datetime.utcnow().timestamp())}"
    return jsonify({
        "user": user.to_dict(),
        "token": token,
        "message": "Account created successfully"
    }), 201

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '') if auth_header else ''

    user = None
    if token.startswith('token-'):
        parts = token.split('-')
        user_id = '-'.join(parts[1:-1])
        if user_id:
            user = User.query.get(user_id)

    if not user:
        user = User.query.first()

    if not user:
        return jsonify({"error": "Not authenticated"}), 401

    return jsonify({"user": user.to_dict()})

# --- Categories Routes ---
@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.filter_by(status='active').all()
    return jsonify([c.to_dict() for c in categories])

@app.route('/api/categories/<slug_or_id>', methods=['GET'])
def get_category(slug_or_id):
    cat = Category.query.filter((Category.slug == slug_or_id) | (Category.id == slug_or_id)).first()
    if not cat:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(cat.to_dict())

# --- Products Routes ---
@app.route('/api/products', methods=['GET'])
def get_products():
    query = Product.query.filter(Product.status == 'active')

    category_id = request.args.get('categoryId')
    category_slug = request.args.get('categorySlug')
    search = request.args.get('search')
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)
    featured = request.args.get('featured')
    new_arrival = request.args.get('newArrival')
    fabric = request.args.get('fabric')
    season = request.args.get('season')
    collection = request.args.get('collection')
    sort = request.args.get('sort', 'featured')
    limit = request.args.get('limit', default=12, type=int)
    page = request.args.get('page', default=1, type=int)

    if category_slug and not category_id:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            category_id = cat.id

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if search:
        term = f"%{search}%"
        query = query.filter(Product.name.ilike(term) | Product.description.ilike(term))

    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if featured == 'true':
        query = query.filter(Product.is_featured == True)
    if new_arrival == 'true':
        query = query.filter(Product.is_new_arrival == True)

    if fabric:
        query = query.filter(Product.fabric.ilike(f"%{fabric}%"))
    if season:
        query = query.filter(Product.season.ilike(f"%{season}%"))
    if collection:
        query = query.filter(Product.collection.ilike(f"%{collection}%"))

    # Sorting
    if sort == 'price-asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price-desc':
        query = query.order_by(Product.price.desc())
    elif sort == 'newest':
        query = query.order_by(Product.created_at.desc())
    elif sort == 'rating':
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.is_featured.desc(), Product.created_at.desc())

    total = query.count()
    total_pages = max(1, (total + limit - 1) // limit)
    products = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        "products": [p.to_dict() for p in products],
        "total": total,
        "page": page,
        "totalPages": total_pages
    })

@app.route('/api/products/<slug_or_id>', methods=['GET'])
def get_product(slug_or_id):
    prod = Product.query.filter((Product.slug == slug_or_id) | (Product.id == slug_or_id)).first()
    if not prod:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(prod.to_dict())

# --- Orders Routes ---
@app.route('/api/orders', methods=['GET', 'POST'])
def handle_orders():
    if request.method == 'POST':
        data = request.get_json() or {}
        order_num = f"PCH-{datetime.utcnow().year}-{str(uuid.uuid4().int)[:4]}"
        order = Order(
            id=f"ord-{uuid.uuid4().hex[:12]}",
            order_number=order_num,
            user_id=data.get('userId'),
            customer_name=data.get('customerName', 'Customer'),
            customer_email=data.get('customerEmail', ''),
            customer_phone=data.get('customerPhone', ''),
            shipping_address=data.get('shippingAddress', {}),
            items=data.get('items', []),
            total_amount=data.get('totalAmount', 0.0),
            discount_amount=data.get('discountAmount', 0.0),
            shipping_fee=data.get('shippingFee', 250.0),
            order_status='pending',
            payment_status='unpaid',
            payment_method=data.get('paymentMethod', 'cod'),
            notes=data.get('notes', '')
        )
        db.session.add(order)
        db.session.commit()
        return jsonify(order.to_dict()), 201

    # GET orders
    user_id = request.args.get('userId')
    if user_id:
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders])

# --- Reviews Routes ---
@app.route('/api/reviews', methods=['GET', 'POST'])
def handle_reviews():
    if request.method == 'POST':
        data = request.get_json() or {}
        review = Review(
            id=f"rev-{uuid.uuid4().hex[:12]}",
            product_id=data.get('productId'),
            user_id=data.get('userId'),
            user_name=data.get('userName', 'Verified Shopper'),
            user_email=data.get('userEmail', ''),
            rating=data.get('rating', 5),
            title=data.get('title', ''),
            comment=data.get('comment', ''),
            verified_purchase=True
        )
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict()), 201

    product_id = request.args.get('productId')
    if product_id:
        reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    else:
        reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])

# --- FAQs Routes ---
@app.route('/api/faqs', methods=['GET'])
def get_faqs():
    faqs = FAQ.query.order_by(FAQ.sort_order.asc()).all()
    return jsonify([f.to_dict() for f in faqs])

# --- Admin Stats ---
@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    total_products = Product.query.count()
    total_categories = Category.query.count()
    total_orders = Order.query.count()
    total_users = User.query.count()
    orders = Order.query.all()
    revenue = sum([float(o.total_amount) for o in orders])

    return jsonify({
        "totalProducts": total_products,
        "totalCategories": total_categories,
        "totalOrders": total_orders,
        "totalCustomers": total_users,
        "totalRevenue": revenue,
        "pendingOrders": Order.query.filter_by(order_status='pending').count(),
        "deliveredOrders": Order.query.filter_by(order_status='delivered').count()
    })

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
