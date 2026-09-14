"""
Pakistan Cloth House - Python Flask Database Seeder
Seeds the database with authentic Pakistani luxury lawn, pret, and unstitched collections.
"""

from app import app, db
from models import User, Category, Product, FAQ, Review

def seed():
    with app.app_context():
        print("Checking database tables...")
        db.create_all()

        if Category.query.first():
            print("Database already contains records. Seeding skipped.")
            return

        print("Seeding Pakistan Cloth House database...")

        # 1. Categories
        cat1 = Category(
            id='cat-1',
            name='Unstitched Luxury Lawn',
            slug='unstitched-luxury-lawn',
            description='Premium 3-piece embroidered lawn collections with pure silk and chiffon dupattas.',
            image='https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
            status='active'
        )
        cat2 = Category(
            id='cat-2',
            name='Ready-to-Wear Pret',
            slug='ready-to-wear-pret',
            description='Artfully tailored kurtas, 2-piece and 3-piece stitched suits for effortless everyday grace.',
            image='https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
            status='active'
        )
        cat3 = Category(
            id='cat-3',
            name='Festive & Formal Silk',
            slug='festive-formal-silk',
            description='Intricate zardozi, tilla, and sequin hand-embellished ensembles on pure raw silk and organza.',
            image='https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
            status='active'
        )
        cat4 = Category(
            id='cat-4',
            name='Chiffon & Organza Dupattas',
            slug='chiffon-organza-dupattas',
            description='Handloom woven and digitally printed luxury dupattas with scaloped schiffli borders.',
            image='https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
            status='active'
        )

        db.session.add_all([cat1, cat2, cat3, cat4])
        db.session.commit()

        # 2. Users
        admin_user = User(
            id='user-admin-1',
            name='Admin PCH',
            email='admin@pch.pk',
            role='admin',
            phone='+92 300 0000000',
            status='active'
        )
        customer_user = User(
            id='user-cust-1',
            name='Muhammad Izaan',
            email='muhammadizaan201@gmail.com',
            role='customer',
            phone='+92 300 1234567',
            status='active'
        )
        db.session.add_all([admin_user, customer_user])
        db.session.commit()

        # 3. Products
        prod1 = Product(
            id='prod-1',
            name='Gul-e-Noor Embroidered Lawn 3-Piece',
            slug='gul-e-noor-embroidered-lawn-3-piece',
            description='A masterpiece of Pakistani craftsmanship featuring fine resham threadwork on soft supima lawn. Accompanied by a digital printed pure silk dupatta and dyed cambric trousers.',
            price=8450.00,
            original_price=9950.00,
            category_id='cat-1',
            sku='PCH-L26-001',
            stock=18,
            fabric='Swiss Lawn & Pure Silk Dupatta',
            season='Summer 2026',
            collection='Noor-e-Bahaar Festive',
            colors=['Ivory Emerald', 'Blush Rose', 'Midnight Indigo'],
            sizes=['Unstitched Fabric (8.5m Total)'],
            images=[
                'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
            ],
            tags=['Lawn', 'Embroidered', 'Summer 2026', 'Silk Dupatta'],
            is_featured=True,
            is_new_arrival=True,
            rating=4.9,
            review_count=32,
            status='active'
        )
        prod2 = Product(
            id='prod-2',
            name='Shahana Raw Silk Hand-Embellished Peshwas',
            slug='shahana-raw-silk-peshwas',
            description='Regal flared peshwas rendered in 80gm pure raw silk, adorned with dabka, gota kinari, and tilla embroidery along the flare and neckline.',
            price=24500.00,
            original_price=28000.00,
            category_id='cat-3',
            sku='PCH-F26-012',
            stock=6,
            fabric='80gm Pure Raw Silk & Organza',
            season='Wedding Festive 2026',
            collection='Shahana Bridal Trunk',
            colors=['Deep Ruby Crimson', 'Antique Rust Gold'],
            sizes=['Small', 'Medium', 'Large', 'Custom Stitching'],
            images=[
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
            ],
            tags=['Formal', 'Raw Silk', 'Wedding Wear', 'Bridal'],
            is_featured=True,
            is_new_arrival=True,
            rating=5.0,
            review_count=18,
            status='active'
        )

        db.session.add_all([prod1, prod2])
        db.session.commit()

        # 4. FAQs
        faq1 = FAQ(
            id='faq-1',
            question='What are your delivery charges across Pakistan?',
            answer='We offer Standard Shipping for PKR 250 across all cities in Pakistan. Orders over PKR 5,000 qualify for 100% Free Shipping.',
            category='shipping',
            sort_order=1
        )
        db.session.add(faq1)
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed()
