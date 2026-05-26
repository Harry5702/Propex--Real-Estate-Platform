from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Property, PropertyImage
from app import db

properties_bp = Blueprint('properties', __name__)

@properties_bp.route('/', methods=['GET'])
def get_properties():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        property_type = request.args.get('type')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        location = request.args.get('location')
        
        query = Property.query
        
        # Apply filters
        if property_type:
            query = query.filter(Property.property_type == property_type)
        if min_price:
            query = query.filter(Property.price >= min_price)
        if max_price:
            query = query.filter(Property.price <= max_price)
        if location:
            query = query.filter(Property.location.contains(location))
            
        properties = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'properties': [prop.to_dict() for prop in properties.items],
            'pagination': {
                'page': page,
                'pages': properties.pages,
                'per_page': per_page,
                'total': properties.total,
                'has_next': properties.has_next,
                'has_prev': properties.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/featured', methods=['GET'])
def get_featured_properties():
    try:
        properties = Property.query.filter_by(is_featured=True).limit(6).all()
        return jsonify({
            'properties': [prop.to_dict() for prop in properties]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/<int:property_id>', methods=['GET'])
def get_property(property_id):
    try:
        property = Property.query.get_or_404(property_id)
        return jsonify({'property': property.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@properties_bp.route('/', methods=['POST'])
@jwt_required()
def create_property():
    try:
        data = request.get_json()
        
        property = Property(
            title=data['title'],
            description=data.get('description'),
            price=data['price'],
            location=data['location'],
            property_type=data['property_type'],
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            area=data.get('area'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            is_featured=data.get('is_featured', False)
        )
        
        db.session.add(property)
        db.session.commit()
        
        return jsonify({
            'message': 'Property created successfully',
            'property': property.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500