# Filename: models.py
from app import db, login_manager
from flask_login import UserMixin
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(256), unique=True)
    
    # Thêm các cột mới
    avatar_url = db.Column(db.String(512))
    email = db.Column(db.String(256))
    location = db.Column(db.String(256))
    bio = db.Column(db.Text)
    public_repos = db.Column(db.Integer)

class OAuth(OAuthConsumerMixin, db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    user = db.relationship(User)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)
