from django.db import modelsz

class Posts(models.Model):
    id = models.TextField()
    license = models.TextField()
    license = models.TextField()
    license = models.TextField()
    license = models.TextField()
    license = models.TextField()
    license = models.TextField()
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
    updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
    subject text NOT NULL,
    content text NOT NULL,
    author text NOT NULL