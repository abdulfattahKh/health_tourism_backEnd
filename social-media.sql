

create table users (
id integer not null auto_increment primary key,
personalImage varchar(200) not null default "unknown",
firstName varchar(50) not null ,
lastName varchar(50) not null ,
email varchar(100) not null unique,
password text not null,
birthday date not null,
gender varchar(6) not null ,
dateOfRegestration timestamp default now()
);

create table posts (
postId integer not null auto_increment primary key ,
textContent text,
imageUrl varchar(300),
pdfUrl varchar(300),
dateOfPosting timestamp default now(),
userId integer not null,
foreign key(userId) references users(id)
);

create table likes (
id integer not null auto_increment primary key,
dateOfPosting timestamp default now(),
userId integer not null ,
postId integer not null ,
foreign key(userId) references users(id),
foreign key(postId) references posts(postId),
);


create table comments (
id integer not null auto_increment primary key,
textContent text,
imageUrl varchar(300),
pdfUrl varchar(300),
dateOfPosting timestamp default now(),
userId integer not null ,
postId integer not null ,
foreign key(userId) references users(id),
foreign key(postId) references posts(postId)
)

create table numbers (
postId integer not null ,
foreign key(postId) references posts(postId),
numberOfLikes integer default 0,
numberOfComments integer default 0
);





