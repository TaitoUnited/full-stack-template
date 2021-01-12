from django.db import models


class Posts(models.Model):

    # id = models.UUIDField(primary_key=True, default=uuid.uuid4(),
    #   editable=False)
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)
    id = models.UUIDField(primary_key=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    subject = models.TextField()
    content = models.TextField()
    author = models.TextField()

    class Meta:
        managed = False
        db_table = 'posts'


class PostsCreate(models.Model):
    subject = models.TextField()
    content = models.TextField()
    author = models.TextField()

    class Meta:
        managed = False
        db_table = 'posts'
