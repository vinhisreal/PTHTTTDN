# Filename: oauth.py
import os
from flask_login import current_user, login_user
from flask_dance.consumer import oauth_authorized
from flask_dance.contrib.github import github, make_github_blueprint
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
# sqlalchemy < 1.4: from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import NoResultFound
from app import db
from models import OAuth, User


github_blueprint = make_github_blueprint(
    client_id=os.getenv('GITHUB_CLIENT_ID'),
    client_secret=os.getenv('GITHUB_CLIENT_SECRET'),
    storage=SQLAlchemyStorage(OAuth, db.session, user=current_user, user_required=False)
)



@oauth_authorized.connect_via(github_blueprint)
def github_logged_in(blueprint, token):
    info = github.get("/user")
    if info.ok:
        account_info = info.json()
        import pprint
        pprint.pprint(account_info)  # <-- in toàn bộ thông tin trả về để kiểm tra

        username = account_info["login"]

        query = User.query.filter_by(username=username)
        try:
            user = query.one()

            # Cập nhật các field mỗi lần login
            user.avatar_url = account_info.get('avatar_url')
            user.email = account_info.get('email')
            user.location = account_info.get('location')
            user.bio = account_info.get('bio')
            user.public_repos = account_info.get('public_repos')
            db.session.commit()

        except NoResultFound:
            user = User(
                username=username,

                avatar_url=account_info.get('avatar_url'),
                
                email=account_info.get('email'),
                location=account_info.get('location'),
                bio=account_info.get('bio'),
                public_repos=account_info.get('public_repos')
            )
            db.session.add(user)
            db.session.commit()
        login_user(user)

