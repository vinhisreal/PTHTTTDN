"""Add more GitHub user info

Revision ID: 3415e122889f
Revises: 
Create Date: 2025-04-05 07:32:24.348319

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3415e122889f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('avatar_url', sa.String(length=512), nullable=True))
        batch_op.add_column(sa.Column('email', sa.String(length=256), nullable=True))
        batch_op.add_column(sa.Column('location', sa.String(length=256), nullable=True))
        batch_op.add_column(sa.Column('bio', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('public_repos', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('public_repos')
        batch_op.drop_column('bio')
        batch_op.drop_column('location')
        batch_op.drop_column('email')
        batch_op.drop_column('avatar_url')

    # ### end Alembic commands ###
