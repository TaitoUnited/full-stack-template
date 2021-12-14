delete from post;
delete from app_user;

insert into app_user (id, email, first_name, last_name, status, language, external_ids) values
('5f255c28-ff62-4faa-8ce8-b4c3c30deb0f', 'john.doe@mydomain.com', 'John', 'Doe', 'created', 'EN', '{ }'),
('8e146bfd-1d0b-4e98-87f5-89dd8ab550c9', 'jane.doe@mydomain.com', 'Jane', 'Doe', 'created', 'EN', '{ }');

insert into post (subject, author, content, moderator_id)
select
  'Example post ' || index,
  'Mike Author',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
  '5f255c28-ff62-4faa-8ce8-b4c3c30deb0f'
from generate_series(1,50) as index;
