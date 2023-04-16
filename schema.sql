create database whereismyhome;

create table board(
	board_no int primary key not null auto_increment,
    title varchar(120) not null,
    content varchar(255) not null,
    hitCnt int default 0,
    created_at timestamp not null default now(),
    modified_at timestamp not null default now()
);

select * from board;

select * from board where board_no = 1;

insert into board(title, content) values("꿀잠맞이 프로젝트", "새로운 프로젝트가 진행되었습니다.");

create table user(
	user_no int primary key not null auto_increment,
    id varchar(45) not null,
    password varchar(45) not null,
    name varchar(100) not null,
    phone varchar(100) not null,
    email varchar(120) not null,
    created_at timestamp not null default now()
);

select * from user;