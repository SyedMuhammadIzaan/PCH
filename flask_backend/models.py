"""
Pakistan Cloth House - Flask SQLAlchemy Database Models
Matches the Cloud SQL PostgreSQL schema
"""

from datetime import datetime
import json
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.String(32), default='customer') # 'admin' or 'customer'
    phone = db.Column(db.String(64), default='')
    avatar = db.Column(db.Text, default='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')
    status = db.Column(db.String(32), default='active') # 'active' or 'inactive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone or '',
            "avatar": self.avatar or '',
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, default='')
    image = db.Column(db.Text, default='')
    status = db.Column(db.String(32), default='active')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description or '',
            "image": self.image or '',
            "status": self.status
        }

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, default='')
    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)
    category_id = db.Column(db.String(64), db.ForeignKey('categories.id'), nullable=False)
    sku = db.Column(db.String(64), unique=True, nullable=False)
    stock = db.Column(db.Integer, default=10)
    fabric = db.Column(db.String(128), default='')
    season = db.Column(db.String(128), default='')
    collection = db.Column(db.String(128), default='')
    colors = db.Column(db.JSON, default=list)
    sizes = db.Column(db.JSON, default=list)
    images = db.Column(db.JSON, default=list)
    tags = db.Column(db.JSON, default=list)
    is_featured = db.Column(db.Boolean, default=False)
    is_new_arrival = db.Column(db.Boolean, default=False)
    rating = db.Column(db.Numeric(3, 2), default=5.0)
    review_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(32), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description or '',
            "price": float(self.price),
            "originalPrice": float(self.original_price) if self.original_price else None,
            "categoryId": self.category_id,
            "sku": self.sku,
            "stock": self.stock,
            "fabric": self.fabric or '',
            "season": self.season or '',
            "collection": self.collection or '',
            "colors": self.colors if isinstance(self.colors, list) else json.loads(self.colors or '[]'),
            "sizes": self.sizes if isinstance(self.sizes, list) else json.loads(self.sizes or '[]'),
            "images": self.images if isinstance(self.images, list) else json.loads(self.images or '[]'),
            "tags": self.tags if isinstance(self.tags, list) else json.loads(self.tags or '[]'),
            "isFeatured": bool(self.is_featured),
            "isNewArrival": bool(self.is_new_arrival),
            "rating": float(self.rating) if self.rating else 5.0,
            "reviewCount": self.review_count or 0,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.String(64), primary_key=True)
    order_number = db.Column(db.String(64), unique=True, nullable=False)
    user_id = db.Column(db.String(64), nullable=True)
    customer_name = db.Column(db.String(255), nullable=False)
    customer_email = db.Column(db.String(255), nullable=False)
    customer_phone = db.Column(db.String(64), nullable=False)
    shipping_address = db.Column(db.JSON, nullable=False)
    items = db.Column(db.JSON, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    discount_amount = db.Column(db.Numeric(10, 2), default=0.0)
    shipping_fee = db.Column(db.Numeric(10, 2), default=250.0)
    order_status = db.Column(db.String(32), default='pending')
    payment_status = db.Column(db.String(32), default='unpaid')
    payment_method = db.Column(db.String(64), default='cod')
    tracking_number = db.Column(db.String(128), default='')
    notes = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "orderNumber": self.order_number,
            "userId": self.user_id,
            "customerName": self.customer_name,
            "customerEmail": self.customer_email,
            "customerPhone": self.customer_phone,
            "shippingAddress": self.shipping_address if isinstance(self.shipping_address, dict) else json.loads(self.shipping_address or '{}'),
            "items": self.items if isinstance(self.items, list) else json.loads(self.items or '[]'),
            "totalAmount": float(self.total_amount),
            "discountAmount": float(self.discount_amount) if self.discount_amount else 0.0,
            "shippingFee": float(self.shipping_fee) if self.shipping_fee else 250.0,
            "orderStatus": self.order_status,
            "paymentStatus": self.payment_status,
            "paymentMethod": self.payment_method,
            "trackingNumber": self.tracking_number or '',
            "notes": self.notes or '',
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.String(64), primary_key=True)
    product_id = db.Column(db.String(64), db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.String(64), nullable=True)
    user_name = db.Column(db.String(255), nullable=False)
    user_email = db.Column(db.String(255), default='')
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), default='')
    comment = db.Column(db.Text, nullable=False)
    verified_purchase = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "productId": self.product_id,
            "userId": self.user_id,
            "userName": self.user_name,
            "userEmail": self.user_email or '',
            "rating": self.rating,
            "title": self.title or '',
            "comment": self.comment,
            "verifiedPurchase": bool(self.verified_purchase),
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class FAQ(db.Model):
    __tablename__ = 'faqs'

    id = db.Column(db.String(64), primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(64), default='general')
    sort_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "category": self.category,
            "sortOrder": self.sort_order
        }
