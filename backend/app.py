from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 
        'postgresql://username:password@localhost/propex_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.properties import properties_bp
    from routes.prediction import prediction_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(properties_bp, url_prefix='/api/properties')
    app.register_blueprint(prediction_bp, url_prefix='/api/prediction')
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)